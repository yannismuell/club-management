package form;

public class ClubmemberForm {

    private long id;
    private String name;
    private String surname;
    private String birthDate;
    private String email;
    private String address;
    private boolean isCoach;
    private boolean isAdmin;
    private String websafeClubmemberKey;


    private ClubmemberForm() {}

    /**
     * Public constructor is solely for Unit Test.
     * @param name
     * @param surname
     * @param websafeClubmemberKey
     */

    public ClubmemberForm(String name, String surname, String birthDate, String email, String address, boolean isCoach, boolean isAdmin, String websafeClubmemberKey) {
        this.name = name;
        this.surname = surname;
        this.birthDate = birthDate;
        this.email = email;
        this.address = address;
        this.isCoach = isCoach;
        this.isAdmin = isAdmin;
        this.websafeClubmemberKey = websafeClubmemberKey;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public String getEmail() {
        return email;
    }

    public String getAddress() {
        return address;
    }

    public boolean getIsCoach() {
        return isCoach;
    }

    public boolean getIsAdmin() {
        return isAdmin;
    }

    public String getWebsafeClubmemberKey() { return websafeClubmemberKey; }

}

