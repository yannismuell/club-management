package form;

public class ClubmemberForm {

    private long id;
    private String name;
    private String surname;
    private String birthDate;
    private String telephoneNumber;
    private String address;
    private String role;
    private String websafeClubmemberKey;


    private ClubmemberForm() {}

    /**
     * Public constructor is solely for Unit Test.
     * @param name
     * @param surname
     * @param websafeClubmemberKey
     */

    public ClubmemberForm(String name, String surname, String birthDate, String telephoneNumber, String address, String role, String websafeClubmemberKey) {
        this.name = name;
        this.surname = surname;
        this.birthDate = birthDate;
        this.telephoneNumber = telephoneNumber;
        this.address = address;
        this.role = role;
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

    public String getTelephoneNumber() {
        return telephoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public String getRole() {
        return role;
    }

    public String getWebsafeClubmemberKey() { return websafeClubmemberKey; }

}

