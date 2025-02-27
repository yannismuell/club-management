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

import com.googlecode.objectify.cmd.Query;
import domain.*;
// import domain.Class;
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
        name = "clubmanagement",
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

    private static void checkUserOk(User user) throws Exception {

        /*if (user == null) {
            throw new UnauthorizedException("Authorization required");
        }

        EmailValidator validator = new EmailValidator();
        if (!validator.valid(user.getEmail())) {
            throw new Exception("Invalid Email format");
        }*/
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
     * <p>
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
     * Returns a list of Matches
     * In order to receive the websafeMatchKey via the JSON params, uses a POST method.
     *
     * @param user An user who invokes this method, null when the user is not signed in.
     * @return a list of Matches that the user created.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(
            name = "getMatches",
            path = "match/all",
            httpMethod = HttpMethod.POST
    )
    public List<Match> getMatches(final User user) throws Exception {
        checkUserOk(user);
        List<Match> matches = ofy().load().type(Match.class).list();
        return matches;
    }

    /**
     * Returns a list of Matches
     * In order to receive the websafeMatchKey via the JSON params, uses a POST method.
     *
     * @return a list of Matches that the user created.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(
            name = "getMatchesGuest",
            path = "match/guest",
            httpMethod = HttpMethod.POST
    )
    public List<Match> getMatchesGuest(final User user) throws Exception {
        List<Match> matches = ofy().load().type(Match.class).list();
        return matches;
    }

    /**
     * Returns a Match object with the given matchID.
     *
     * @param websafeMatchKey The String representation of the Match Key.
     * @return a Match object with the given matchID.
     * @throws NotFoundException when there is no Match with the given matchID.
     */
    @ApiMethod(
            name = "getMatch",
            path = "match/{websafeMatchKey}",
            httpMethod = HttpMethod.GET
    )
    public Match getMatch(final User user, @Named("websafeMatchKey") final String websafeMatchKey)
            throws Exception {
        checkUserOk(user);
        Key<Match> matchKey = Key.create(websafeMatchKey);
        Match match = ofy().load().key(matchKey).now();
        if (match == null) {
            throw new NotFoundException("No match found with key: " + websafeMatchKey);
        }
        return match;
    }

    /**
     * Creates a new Match object and stores it to the datastore.
     *
     * @param user A user who invokes this method, null when the user is not signed in.
     * @param matchForm A MatchForm object representing user's inputs.
     * @return A newly created Match Object.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(name = "createMatch",
            path = "match/create",
            httpMethod = HttpMethod.POST)
    public Match createMatch(final User user, final MatchForm matchForm) throws Exception {
        checkUserOk(user);
        final Key<Match> matchKey = factory().allocateId(Match.class);
        final long matchId = matchKey.getId();
        Match match = new Match(matchId, matchForm);
        ofy().save().entities(match).now();
        return match;
    }
    /**
     * Saves a Match object and stores it to the datastore.
     *
     * @param user A user who invokes this method, null when the user is not signed in.
     * @param matchForm The match matchDate
     * @param matchForm The matchDate
     * @return An updated match object.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(name = "saveMatch",
            path = "match/save/{matchKey}",
            httpMethod = HttpMethod.POST)
    public Match saveMatch(final User user, final MatchForm matchForm) throws Exception {
        checkUserOk(user);
        String websafeMatchKey = matchForm.getWebsafeMatchKey();
        Match match = ofy().transact(new Work<Match>() {
            @Override
            public Match run() {
                Key<Match> matchKey = Key.create(websafeMatchKey);
                Match match = ofy().load().key(matchKey).now();
                match.updateWithMatchForm(matchForm);
                ofy().save().entity(match).now();
                return match;
            }
        });
        return (match);
    }

    /**
     * Deletes a Match object and removes it from the datastore.
     *
     * @param user             A user who invokes this method, null when the user is not signed in.
     * @param websafeMatchKey A Match object representing user's inputs.
     * @return A newly created Match Object.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(name = "deleteMatch",
            path = "match/delete/{websafeMatchKey}",
            httpMethod = HttpMethod.DELETE)
    public WrappedBoolean deleteMatch(final User user, @Named("websafeMatchKey") final String websafeMatchKey) throws Exception {
        checkUserOk(user);
        Key<Match> matchKey = Key.create(websafeMatchKey);
        Match match = ofy().load().key(matchKey).now();
        TxResult<Boolean> result = ofy().transact(new Work<TxResult<Boolean>>() {
            @Override
            public TxResult<Boolean> run() {
                ofy().delete().key(matchKey).now();
                return new TxResult<>(true);
            }
        });
        return new WrappedBoolean(result.getResult());
    }

    /**
     * Returns a WrappedBoolean object indicating if the given user is already stored in Datastore
     *
     * @param user A User object injected by the cloud endpoints.
     * @return WrappedBoolean object.
     * @throws UnauthorizedException when the User object is null.
     */

    //@ApiMethod(name = "accountExists", path = "account", httpMethod = HttpMethod.GET)
    @ApiMethod(name = "clubmemberExists", path = "clubmember",
            httpMethod = HttpMethod.GET)
    public Clubmember clubmemberExists(final User user, @Named("clubmemberEmail") final String clubmemberEmail) throws Exception {
        checkUserOk(user);

        // Caution! This will delete all Clubmember entities
        //Iterable<Key<Clubmember>> allKeys = ofy().load().type(Clubmember.class).keys();
        //ofy().delete().keys(allKeys);
        // TODO: Check if list contains more than one entries!!

        Query<Clubmember> clubmembers = ofy().load().type(Clubmember.class).filter("email =", clubmemberEmail);
        if (clubmembers.stream().count() > 1) {
            LOG.info("More than one account with email " + clubmemberEmail + " exitsts. Returning null");
            return null;
        }

        Clubmember clubmember = ofy().load().type(Clubmember.class).filter("email =", clubmemberEmail).first().now();

        if (clubmember != null) return clubmember;

        if (Arrays.asList(clubmanagement.Constants.CLUBMEMBER_EMAILS).contains(clubmemberEmail)) {
            clubmember = new Clubmember("Clubmember", "Admin", "admin@devicesharing.ey.r.appspot.com");
        }

        return clubmember;
    }
    /**
     * Returns all Clubmember objects
     *
     * @param user A User object injected by the cloud endpoints.
     * @return Clubmember object.
     * @throws UnauthorizedException when the User object is null.
     */
    @ApiMethod(name = "getClubmembers", path = "clubmembers", httpMethod = HttpMethod.GET)
    public List<Clubmember> getClubmembers(final User user) throws Exception {
        checkUserOk(user);

        // Caution! This will delete all Account entities
        // Iterable<Key<Account>> allKeys = ofy().load().type(Account.class).keys();
        // ofy().delete().keys(allKeys);

        List<Clubmember> clubmembers = ofy().load().type(Clubmember.class).list();
        return clubmembers;
    }

    /**
     * Returns a Clubmember object with the given clubmemberID.
     *
     * @param websafeClubmemberKey The String representation of the Clubmember Key.
     * @return a Clubmember object with the given clubmemberID.
     * @throws NotFoundException when there is no Clubmember with the given clubmemberID.
     */
    @ApiMethod(
            name = "getClubmember",
            path = "clubmember/{websafeClubmemberKey}",
            httpMethod = HttpMethod.GET
    )
    public Clubmember getClubmember(final User user, @Named("websafeClubmemberKey") final String websafeClubmemberKey)
            throws Exception {
        checkUserOk(user);
        Key<Clubmember> clubmemberKey = Key.create(websafeClubmemberKey);
        Clubmember clubmember = ofy().load().key(clubmemberKey).now();
        if (clubmember == null) {
            throw new NotFoundException("No clubmember found with key: " + websafeClubmemberKey);
        }
        return clubmember;
    }

    /**
     * Returns a list of Clubmembers
     * In order to receive the websafeClubmemberKey via the JSON params, uses a POST method.
     *
     * @return a list of Clubmembers that the user created.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(
            name = "getClubmembersName",
            path = "clubmember/name",
            httpMethod = HttpMethod.POST
    )
    public List<Clubmember> getClubmembersName(final User user) throws Exception {
        List<Clubmember> clubmembers = ofy().load().type(Clubmember.class).list();
        return clubmembers;
    }

    /**
     * Creates a new Clubmember object and stores it to the datastore.
     *
     * @param user A user who invokes this method, null when the user is not signed in.
     * @param clubmemberForm A ClubmemberForm object representing user's inputs.
     * @return A newly created Clubmember Object.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(name = "createClubmember",
            path = "clubmember/create",
            httpMethod = HttpMethod.POST)
    public Clubmember createClubmember(final User user, final ClubmemberForm clubmemberForm) throws Exception {
        checkUserOk(user);
        // Caution! This will delete all Clubmember entities
        //Iterable<Key<Clubmember>> allKeys = ofy().load().type(Clubmember.class).keys();
        //ofy().delete().keys(allKeys);

        final Key<Clubmember> clubmemberKey = factory().allocateId(Clubmember.class);
        final long clubmemberId = clubmemberKey.getId();
        Clubmember clubmember = new Clubmember(clubmemberId, clubmemberForm);
        ofy().save().entities(clubmember).now();
        return clubmember;
    }
    /**
     * Saves a Clubmember object and stores it to the datastore.
     *
     * @param user A user who invokes this method, null when the user is not signed in.
     * @param clubmemberForm The clubmember name
     * @return An updated clubmember object.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(name = "saveClubmember",
            path = "clubmember/save/{clubmemberKey}",
            httpMethod = HttpMethod.POST)
    public Clubmember saveClubmember(final User user, final ClubmemberForm clubmemberForm) throws Exception  {
        checkUserOk(user);
        String websafeClubmemberKey = clubmemberForm.getWebsafeClubmemberKey();
        Clubmember clubmember = ofy().transact(new Work<Clubmember>() {
            @Override
            public Clubmember run() {
                Key<Clubmember> clubmemberKey = Key.create(websafeClubmemberKey);
                Clubmember clubmember = ofy().load().key(clubmemberKey).now();
                clubmember.updateWithClubmemberForm(clubmemberForm);
                ofy().save().entity(clubmember).now();
                return clubmember;
            }
        });
        return clubmember;
    }

    /**
     * Deletes a Clubmember object and removes it from the datastore.
     *
     * @param user             A user who invokes this method, null when the user is not signed in.
     * @param websafeClubmemberKey A Clubmember object representing user's inputs.
     * @return A newly created Clubmember Object.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(name = "deleteClubmember",
            path = "clubmember/delete/{websafeClubmemberKey}",
            httpMethod = HttpMethod.DELETE)
    public WrappedBoolean deleteClubmember(final User user, @Named("websafeClubmemberKey") final String websafeClubmemberKey) throws Exception {
        checkUserOk(user);

        // This will delete all clubmemer entities
        // Iterable<Key<Clubmember>> allKeys = ofy().load().type(Clubmember.class).keys();
        // ofy().delete().keys(allKeys);

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
     * Returns a list of Teams
     * In order to receive the websafeTeamKey via the JSON params, uses a POST method.
     *
     * @param user An user who invokes this method, null when the user is not signed in.
     * @return a list of Teams that the user created.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(
            name = "getTeams",
            path = "team/all",
            httpMethod = HttpMethod.POST
    )
    public List<Team> getTeams(final User user) throws Exception {
        checkUserOk(user);
        List<Team> teams = ofy().load().type(Team.class).list();
        return teams;
    }

    /**
     * Returns a list of Teams
     * In order to receive the websafeTeamKey via the JSON params, uses a POST method.
     *
     * @param user An user who invokes this method, null when the user is not signed in.
     * @return a list of Teams that the user created.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(
            name = "getMatchTeam",
            path = "match/team",
            httpMethod = HttpMethod.POST
    )
    public List<Team> getMatchTeam(final User user) throws Exception {
        checkUserOk(user);
        List<Team> teams = ofy().load().type(Team.class).list();
        return teams;
    }

    /**
     * Returns a list of Teams
     * In order to receive the websafeTeamKey via the JSON params, uses a POST method.
     *
     * @return a list of Teams that the user created.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(
            name = "getTeamsName",
            path = "team/name",
            httpMethod = HttpMethod.POST
    )
    public List<Team> getTeamsName(final User user) throws Exception {
        List<Team> teams = ofy().load().type(Team.class).list();
        return teams;
    }


    /**
     * Returns a Team object with the given teamID.
     *
     * @param websafeTeamKey The String representation of the Team Key.
     * @return a Team object with the given teamID.
     * @throws NotFoundException when there is no Team with the given teamID.
     */
    @ApiMethod(
            name = "getTeam", //eigentlich nicht in der Mehrzahl also Team
            path = "team/{websafeTeamKey}",
            httpMethod = HttpMethod.GET
    )
    public Team getTeam(final User user, @Named("websafeTeamKey") final String websafeTeamKey)
            throws Exception {
        checkUserOk(user);
        Key<Team> teamKey = Key.create(websafeTeamKey);
        Team team = ofy().load().key(teamKey).now();
        if (team == null) {
            throw new NotFoundException("No team found with key: " + websafeTeamKey);
        }
        return team;
    }

    /**
     * Creates a new Team object and stores it to the datastore.
     *
     * @param user A user who invokes this method, null when the user is not signed in.
     * @param teamForm A TeamForm object representing user's inputs.
     * @return A newly created Team Object.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(name = "createTeam",
            path = "team/create",
            httpMethod = HttpMethod.POST)
    public Team createTeam(final User user, final TeamForm teamForm) throws Exception {
        checkUserOk(user);
        final Key<Team> teamKey = factory().allocateId(Team.class);
        final long teamId = teamKey.getId();
        Team team = new Team(teamId, teamForm);
        ofy().save().entities(team).now();
        return team;
    }
    /**
     * Saves a Team object and stores it to the datastore.
     *
     * @param teamForm The team name
     * @return An updated team object.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(name = "saveTeam",
            path = "team/save/{teamKey}",
            httpMethod = HttpMethod.POST)
    public Team saveTeam(final User user, final TeamForm teamForm)
            throws Exception  {
        checkUserOk(user);
        String websafeTeamKey = teamForm.getWebsafeTeamKey();
        Team team = ofy().transact(new Work<Team>() {
            @Override
            public Team run() {
                Key<Team> teamKey = Key.create(websafeTeamKey);
                Team team = ofy().load().key(teamKey).now();
                team.updateWithTeamForm(teamForm);
                ofy().save().entity(team).now();
                return team;
            }
        });
        return (team);
    }

    /**
     * Deletes a Team object and removes it from the datastore.
     *
     * @param user             A user who invokes this method, null when the user is not signed in.
     * @param websafeTeamKey A Team object representing user's inputs.
     * @return A newly created Team Object.
     * @throws UnauthorizedException when the user is not signed in.
     */
    @ApiMethod(name = "deleteTeam",
            path = "team/delete/{websafeTeamKey}",
            httpMethod = HttpMethod.DELETE)
    public WrappedBoolean deleteTeam(final User user, @Named("websafeTeamKey") final String websafeTeamKey) throws Exception {
        checkUserOk(user);
        Key<Team> teamKey = Key.create(websafeTeamKey);
        Team team = ofy().load().key(teamKey).now();
        TxResult<Boolean> result = ofy().transact(new Work<TxResult<Boolean>>() {
            @Override
            public TxResult<Boolean> run() {
                ofy().delete().key(teamKey).now();
                return new TxResult<>(true);
            }
        });
        return new WrappedBoolean(result.getResult());
    }
}

