package form;

/**
 * Pojo representing an account form on the client side.
 */
public class AccountForm {
    /**
     * Any string user wants us to display him/her on this system.
     */
    private String firstName;

    private String surName;

    private String companyName;

    private String mainEmail;

    private AccountForm() {}

    /**
     * Constructor for AccountForm, solely for unit test.
     * @param firstName A String for displaying the user's first name.
     * @param surName A String for displaying the user's surname.
     * @param companyName A String for displaying the user's first name.
     */
    public AccountForm(String firstName, String surName, String companyName, String mainEmail) {
        this.firstName = firstName;
        this.surName = surName;
        this.companyName = companyName;
        this.mainEmail = mainEmail;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public String getSurName() {
        return this.surName;
    }

    public String getCompanyName() {
        return this.companyName;
    }

    public String getMainEmail() {
        return this.mainEmail;
    }
}

