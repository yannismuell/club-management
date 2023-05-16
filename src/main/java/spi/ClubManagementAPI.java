package spi;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.response.NotFoundException;
import com.google.appengine.api.users.User;

import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.response.ConflictException;
import com.google.api.server.spi.response.ForbiddenException;
import com.google.api.server.spi.response.UnauthorizedException;

import static service.OfyService.ofy;
import static service.OfyService.factory;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Work;

import domain.*;
import form.*;
import utility.*;

import java.util.*;
import java.util.logging.Logger;
import javax.inject.Named;

import clubmanagement.Constants;

/**
 * Defines v1 of a scheduler app API, which provides simple methods.
 */
@Api(
        name = "clubmanagemegnt",
        version = "v1",
        // You can add additional SCOPES as a comma separated list of values
        scopes = {Constants.EMAIL_SCOPE},
        clientIds = {Constants.WEB_CLIENT_ID},
        audiences = {Constants.WEB_CLIENT_ID},
        description = "ClubManagement backend API"
)
public class ClubManagementAPI {

    private static final Logger LOG = Logger.getLogger(ClubManagementAPI.class.getName());

    private static String extractDefaultDisplayNameFromEmail(String email) {
        return email == null ? null : email.substring(0, email.indexOf("@"));
    }

    private static Account getAccountFromUser(User user, String userId) {
        // First fetch it from the datastore.
        Account account = ofy().load().key(Key.create(Account.class, userId)).now();
        if (account == null) {
            // Create a new Account if not exist.
            String email = user.getEmail();
            float restTime = 11;
            account = new Account(userId, extractDefaultDisplayNameFromEmail(email), "", "", email, restTime);
        }
        return account;
    }

    /**
     * This is an ugly workaround for null userId for Android clients.
     *
     * @param user A User object injected by the cloud endpoints.
     * @return the App Engine userId for the user.
     */
    private static String getUserId(User user) {
        String userId = user.getUserId();
        if (userId == null) {
            LOG.info("userId is null, so trying to obtain it from the datastore.");
            AppEngineUser appEngineUser = new AppEngineUser(user);
            ofy().save().entity(appEngineUser).now();
            // Begin new session for not using session cache.
            AppEngineUser savedUser = ofy().load().key(appEngineUser.getKey()).now();
            userId = savedUser.getUser().getUserId();
        }
        return userId;
    }

    /**
     * Just a wrapper for Boolean.
     */
    public static class WrappedBoolean {

        private final Boolean result;

        public WrappedBoolean(Boolean result) {
            this.result = result;
        }

        public Boolean getResult() {
            return result;
        }
    }

    /**
     * A wrapper class that can embrace a generic result or some kind of exception.
     *
     * Use this wrapper class for the return type of objectify transaction.
     *
     * @param <ResultType> The type of the actual return object.
     */
    private static class TxResult<ResultType> {

        private ResultType result;

        private Throwable exception;

        private TxResult(ResultType result) {
            this.result = result;
        }

        private TxResult(Throwable exception) {
            if (exception instanceof NotFoundException ||
                    exception instanceof ForbiddenException ||
                    exception instanceof ConflictException) {
                this.exception = exception;
            } else {
                throw new IllegalArgumentException("Exception not supported.");
            }
        }

        private ResultType getResult() throws NotFoundException, ForbiddenException, ConflictException {
            if (exception instanceof NotFoundException) {
                throw (NotFoundException) exception;
            }
            if (exception instanceof ForbiddenException) {
                throw (ForbiddenException) exception;
            }
            if (exception instanceof ConflictException) {
                throw (ConflictException) exception;
            }
            return result;
        }
    }



    /**
     * Returns an Account object associated with the given user object. The cloud endpoints system
     * automatically inject the User object.
     *
     * @param user A User object injected by the cloud endpoints.
     * @return Account object.
     * @throws UnauthorizedException when the User object is null.
     */
    @ApiMethod(name = "getAccount", path = "account", httpMethod = HttpMethod.GET)
    public Account getAccount(final User user) throws UnauthorizedException {
        if (user == null) {
            throw new UnauthorizedException("Authorization required");
        }
        return ofy().load().key(Key.create(Account.class, getUserId(user))).now();
    }

    /**
     * Creates or updates an Account object associated with the given user object.
     *
     * @param user A User object injected by the cloud endpoints.
     * @param accountForm An AccountForm object sent from the client form.
     * @return Account object just created.
     * @throws UnauthorizedException when the User object is null.
     */
    @ApiMethod(name = "saveAccount", path = "account", httpMethod = HttpMethod.POST)
    public Account saveAccount(final User user, final AccountForm accountForm) throws Exception {
        if (user == null) {
            throw new UnauthorizedException("Authorization required");
        }
        String firstName = accountForm.getFirstName();
        String surName = accountForm.getSurName();
        String companyName = accountForm.getCompanyName();
        String mainEmail = accountForm.getMainEmail();
        float restTime = accountForm.getRestTime();

        EmailValidator validator = new EmailValidator();
        if (!validator.valid(mainEmail)) throw new Exception("Invalid Email format");

        Account account = ofy().transact(new Work<Account>() {
            @Override
            public Account run() {
                // Fetch user's Profile.
                Account account = ofy().load().key(Key.create(Account.class, getUserId(user))).now();
                if (account == null) {
                    String email = user.getEmail();
                    account = new Account(getUserId(user), firstName, surName, companyName, email, restTime);
                } else {
                    account.update(getUserId(user), firstName, surName, companyName, mainEmail, restTime);
                }

                ofy().save().entity(account).now();

                return account;
            }
        });
        return account;
    }

    /**
     * Returns a list of Departments that the user created.
     * In order to receive the websafeDepartmentKey via the JSON params, uses a POST method.
     *
     * @param user An user who invokes this method, null when the user is not signed in.
     * @return a list of Departments that the user created.
     * @throws UnauthorizedException when the user is not signed in.
     */


    @ApiMethod(
            name = "getDepartmentsCreated",
            path = "department/created",
            httpMethod = HttpMethod.POST
    )
    public List<Department> getDepartmentsCreated(final User user) throws UnauthorizedException {
        // If not signed in, throw a 401 error.
        if (user == null) {
            throw new UnauthorizedException("Authorization required");
        }

        Key<Account>ownerKey = Key.create(Account.class, user.getUserId());
        List<Department> departments = ofy().load().type(Department.class).ancestor(ownerKey).list();
        return departments;
    }

    /**
     * Creates a new Department object and stores it to the datastore.
     *
     * @param user A user who invokes this method, null when the user is not signed in.
     * @param departmentForm A DepartmentForm object representing user's inputs.
     * @return A newly created Department Object.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(name = "createDepartment",
            path = "department/create",
            httpMethod = HttpMethod.POST)
    public Department createDepartment(final User user, final DepartmentForm departmentForm) throws UnauthorizedException {
        if (user == null) {
            throw new UnauthorizedException("Authorization required");
        }

        Key<Account> accountKey = Key.create(Account.class, getUserId(user));
        String websafeAccountKey = accountKey.toLegacyUrlSafe();

        final Key<Department> departmentKey = factory().allocateId(accountKey, Department.class);
        final long departmentID = departmentKey.getId();
        final String userId = getUserId(user);
        Account account = getAccountFromUser(user, userId);
        String email = account.getMainEmail();

        Department department = ofy().transact(new Work<Department>() {
            @Override
            public Department run() {
                Department department = new Department(departmentID, userId, departmentForm, email);
                ofy().save().entities(department, account).now();
                return department;
            }
        });

        return department;
    }


    /**
     * Saves a Department object and stores it to the datastore.
     *
     * @param user A user who invokes this method, null when the user is not signed in.
     * @param name The department name
     * @param description The department description
     * @param restTime The minimum rest time required between consecutive shifts
     * @return An updated department object.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(name = "saveDepartment",
            path = "department/save/{departmentKey}",
            httpMethod = HttpMethod.POST)
    public Department saveDepartment(final User user,
                                     @Named ("name") final String name,
                                     @Named ("description") final String description,
                                     @Named ("restTime") final float restTime,
                                     @Named ("departmentKey") final String websafeDepartmentKey)
            throws UnauthorizedException  {
        if (user == null) {
            throw new UnauthorizedException("Authorization required");
        }

        Department department = ofy().transact(new Work<Department>() {
            @Override
            public Department run() {
                Key<Department> departmentKey = Key.create(websafeDepartmentKey);
                Department department = ofy().load().key(departmentKey).now();
                department.update(name, description, restTime);
                ofy().save().entity(department).now();
                return department;
            }
        });

        return (department);
    }

    /**
     * Deletes a Department object and removes it from the datastore.
     *
     * @param user A user who invokes this method, null when the user is not signed in.
     * @param websafeDepartmentKey A DepartmentForm object representing user's inputs.
     * @return A newly created Department Object.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(name = "deleteDepartment",
            path = "department/delete/{websafeDepartmentKey}",
            httpMethod = HttpMethod.DELETE)
    public WrappedBoolean deleteDepartment(final User user, @Named ("websafeDepartmentKey") final String websafeDepartmentKey)
            throws UnauthorizedException, ConflictException, NotFoundException, ForbiddenException  {
        if (user == null) {
            throw new UnauthorizedException("Authorization required");
        }

        Key<Department> departmentKey = Key.create(websafeDepartmentKey);
        Department department = ofy().load().key(departmentKey).now();

        TxResult<Boolean> result = ofy().transact(new Work<TxResult<Boolean>>() {
            @Override
            public TxResult<Boolean> run() {

                ofy().delete().key(departmentKey).now();
                return new TxResult<>(true);
            }
        });

        return new WrappedBoolean(result.getResult());
    }

    /**
     * Returns a Department object with the given departmentID.
     *
     * @param websafeDepartmentKey The String representation of the Department Key.
     * @return a Department object with the given departmentID.
     * @throws NotFoundException when there is no Department with the given departmentID.
     */

    @ApiMethod(
            name = "getDepartment",
            path = "department/{websafeDepartmentKey}",
            httpMethod = HttpMethod.GET
    )
    public Department getDepartment(final User user, @Named("websafeDepartmentKey") final String websafeDepartmentKey)
            throws UnauthorizedException, NotFoundException {

        if (user == null) {
            throw new UnauthorizedException("Authorization required");
        }

        Key<Department> departmentKey = Key.create(websafeDepartmentKey);
        Department department = ofy().load().key(departmentKey).now();

        if (department == null) {
            throw new NotFoundException("No Department found with key: " + websafeDepartmentKey);
        }

        if (!department.getAccountKey().toString().equals(Key.create(Account.class, user.getUserId()).toString())) {
            throw new UnauthorizedException("Security Violation: User not owner of department?");
        }

        return department;
    }
    /**
     * Returns a list of Clubmembers that the user created.
     * In order to receive the websafeDepartmentKey via the JSON params, uses a POST method.
     *
     * @param user An user who invokes this method, null when the user is not signed in.
     * @return a list of Departments that the user created.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(
            name = "getClubmembersCreated",
            path = "clubmember/created",
            httpMethod = HttpMethod.POST
    )
    public List<Clubmember> getClubmembersCreated(final User user) throws UnauthorizedException {
        // If not signed in, throw a 401 error.
        if (user == null) {
            throw new UnauthorizedException("Authorization required");
        }

        Key<Account>ownerKey = Key.create(Account.class, user.getUserId());
        List<Clubmember> clubmembers = ofy().load().type(Clubmember.class).ancestor(ownerKey).list();
        return clubmembers;
    }
    /**
     * Creates a new Clubmember object and stores it to the datastore.
     *
     * @param user A user who invokes this method, null when the user is not signed in.
     * @param clubmemberForm A ClubmemberForm object representing user's inputs.
     * @return A newly created Department Object.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(name = "createClubmember",
            path = "clubmember/create",
            httpMethod = HttpMethod.POST)
    public Clubmember createClubmember(final User user, final ClubmemberForm clubmemberForm) throws UnauthorizedException {
        if (user == null) {
            throw new UnauthorizedException("Authorization required");
        }

        Key<Account> accountKey = Key.create(Account.class, getUserId(user));
        String websafeAccountKey = accountKey.toLegacyUrlSafe();

        final Key<Clubmember> clubmemberKey = factory().allocateId(accountKey, Clubmember.class);
        final long clubmemberID = clubmemberKey.getId();
        final String userId = getUserId(user);
        Account account = getAccountFromUser(user, userId);
        String email = account.getMainEmail();

        Clubmember clubmember = ofy().transact(new Work<Clubmember>() {
            @Override
            public Clubmember run() {
                Clubmember clubmember = new Clubmember(clubmemberID, userId, clubmemberForm, email);
                ofy().save().entities(clubmember, account).now();
                return clubmember;
            }
        });

        return clubmember;
    }
    /**
     * Saves a Clubmember object and stores it to the datastore.
     *
     * @param user        A user who invokes this method, null when the user is not signed in.
     * @param name        The department name
     * @param description The Clubmember description
     * @param restTime    The minimum rest time required between consecutive shifts
     * @return An updated clubmember object.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(name = "saveClubmember",
            path = "clubmember/save/{clubmemberKey}",
            httpMethod = HttpMethod.POST)
    public Clubmember saveClubmember(final User user,
                                     @Named ("name") final String name,
                                     @Named ("description") final String description,
                                     @Named ("restTime") final float restTime,
                                     @Named ("clubmemberKey") final String websafeClubmemberKey)
            throws UnauthorizedException  {
        if (user == null) {
            throw new UnauthorizedException("Authorization required");
        }

        Clubmember clubmember = ofy().transact(new Work<Clubmember>() {
            @Override
            public Clubmember run() {
                Key<Clubmember> clubmemberKey = Key.create(websafeClubmemberKey);
                Clubmember clubmember = ofy().load().key(clubmemberKey).now();
                clubmember.update(name, description, restTime);
                ofy().save().entity(clubmember).now();
                return clubmember;
            }
        });

        return (clubmember);
    }

    /**
     * Deletes a Clubmember object and removes it from the datastore.
     *
     * @param user A user who invokes this method, null when the user is not signed in.
     * @param websafeClubmemberKey A ClubmemberForm object representing user's inputs.
     * @return A newly created Clubmember Object.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(name = "deleteClubmember",
            path = "clubmember/delete/{websafeDepartmentKey}",
            httpMethod = HttpMethod.DELETE)
    public WrappedBoolean deleteClubmember(final User user, @Named ("websafeClubmemberKey") final String websafeClubmemberKey)
            throws UnauthorizedException, ConflictException, NotFoundException, ForbiddenException  {
        if (user == null) {
            throw new UnauthorizedException("Authorization required");
        }

        Key<Clubmember> clubmemberKey = Key.create(websafeClubmemberKey);
        Clubmember clubmember = ofy().load().key(clubmemberKey).now();

        TxResult<Boolean> result = ofy().transact(new Work<TxResult<Boolean>>() {
            @Override
            public TxResult<Boolean> run() {

                ofy().delete().key(clubmemberKey).now();
                return new TxResult<>(true);
            }
        });

        return new WrappedBoolean(result.getResult());
    }

    /**
     * Returns a Clubmember object with the given clubmemberID.
     *
     * @param websafeClubmemberKey The String representation of the Clubmember Key.
     * @return a Clubmember object with the given departmentID.
     * @throws NotFoundException when there is no Department with the given departmentID.
     */

    @ApiMethod(
            name = "getClubmember",
            path = "clubmember/{websafeClubmemberKey}",
            httpMethod = HttpMethod.GET
    )
    public Clubmember getClubmember(final User user, @Named("websafeClubmemberKey") final String websafeClubmemberKey)
            throws UnauthorizedException, NotFoundException {

        if (user == null) {
            throw new UnauthorizedException("Authorization required");
        }

        Key<Clubmember> clubmemberKey = Key.create(websafeClubmemberKey);
        Clubmember clubmember = ofy().load().key(clubmemberKey).now();

        if (clubmember == null) {
            throw new NotFoundException("No Clubmember found with key: " + websafeClubmemberKey);
        }

        if (!clubmember.getAccountKey().toString().equals(Key.create(Account.class, user.getUserId()).toString())) {
            throw new UnauthorizedException("Security Violation: User not owner of clubmember?");
        }

        return clubmember;
    }
}
