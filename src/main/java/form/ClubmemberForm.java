package form;

public class ClubmemberForm {

    private long id;
    private String name;
    private String surname;
    private int age;
    private String telephoneNumber;
    private String address;
    private String role;
    private String websafeClubmemberKey;


    private ClubmemberForm() {}

    /**
     * Public constructor is solely for Unit Test.
     * @param name
     * @param age
     * @param websafeClubmemberKey
     */

    public ClubmemberForm(String name, String surname, int age, String telephoneNumber, String address, String role, String websafeClubmemberKey) {
        this.name = name;
        this.surname = surname;
        this.age = age;
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

    public int getAge() {
        return age;
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

