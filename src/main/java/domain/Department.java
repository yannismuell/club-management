package domain;

import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.ApiResourceProperty;
import com.google.common.base.Preconditions;
import com.google.common.collect.ImmutableList;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Parent;
import domain.Constants;
import form.DepartmentForm;
import com.googlecode.objectify.annotation.Load;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import static service.OfyService.ofy;

@Entity
@Cache
public class Department {

    @Id
    private Long id;

    private String name;

    private String description;

    @Load
    private List<String> employees;

    @Parent
    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
    private Key<Account> accountKey;

    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
    private String accountID;

    private float restTime = 11;

    private Department() {}

    private List<String> confirmationEmailRecipients;

    public Department(final long id, final String accountID, final DepartmentForm departmentForm, final String email) {
        Preconditions.checkNotNull(departmentForm.getName(), "The name is required");
        this.id = id;
        this.accountKey = Key.create(Account.class, accountID);
        this.accountID = accountID;

        //Key<Department> departmentKey = Key.create(Department.class, id);

        updateWithDepartmentForm(departmentForm);
        employees = new ArrayList<>(0);
        confirmationEmailRecipients = new ArrayList<>();
        confirmationEmailRecipients.add(email);
    }

    public long getId() {
        return id;
    }

    public String getAccountId() { return accountID; }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
    public Key<Account> getAccountKey() {
        return accountKey;
    }

    public String getWebsafeAccountKey() {
        return Key.create(accountKey, Department.class, id).toLegacyUrlSafe();
    }

    public String getWebsafeDepartmentKey() {
        return Key.create(accountKey, Department.class, id).toLegacyUrlSafe();
    }


    public void updateWithDepartmentForm(DepartmentForm departmentForm) {
        this.name = departmentForm.getName();
        this.description = departmentForm.getDescription();
        this.restTime = departmentForm.getRestTime();
    }

    public void update(String name, String description, float restTime) {
        this.name = name;
        this.description = description;
        this.restTime = restTime;
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder("Id: " + id + "\n").append("Name: ").append(name).append("\n");

        return stringBuilder.toString();
    }
}
