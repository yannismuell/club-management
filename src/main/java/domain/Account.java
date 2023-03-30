package domain;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Index;

@Entity
@Cache
public class Account {

    @Id
    private String userId;

    private String firstName;

    @Index
    private String surName;

    private String companyName;

    private String mainEmail;

    private Account() {}

    /**
     * Public constructor for Profile.
     * @param userId The datastore key.
     * @param firstName Any string user wants us to display him/her on this system.
     * @param surName
     * @param companyName
     */
    public Account(String userId, String firstName, String surName, String companyName, String email) {
        this.userId = userId;
        this.firstName = firstName;
        this.surName = surName;
        this.companyName = companyName;
        this.mainEmail = email;
    }

    public void setMainEmail(String email) { this.mainEmail = email; }

    public String getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getSurName() {
        return surName;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getMainEmail() {
        return mainEmail;
    }

    /**
     * Update the Profile with the given userId, first, second and company name, respectively, and main email
     * @param userId
     * @param firstName
     * @param surName
     * @param companyName
     */
    public void update(String userId, String firstName, String surName, String companyName, String email) {
        if (userId != null) {
            this.userId = userId;
        }
        if (firstName != null) {
            this.firstName = firstName;
        }
        if (surName != null) {
            this.surName = surName;
        }
        if (companyName != null) {
            this.companyName = companyName;
        }
        if (email != null) {
            this.mainEmail = email;
        }
    }
}

