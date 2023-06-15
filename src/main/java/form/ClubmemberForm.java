package form;

public class ClubmemberForm {

    private String name;

    private String description;

    private int age;

    private String websafeClubmemberKey;

    private float alter;

    private ClubmemberForm() {}

    /**
     * Public constructor is solely for Unit Test.
     * @param name
     * @param description
     * @param age
     * @param websafeClubmemberKey
     */

    public ClubmemberForm(String name, String description, int age, String websafeClubmemberKey, float alter) {
        this.name = name;
        this.description = description;
        this.age = age;
        this.websafeClubmemberKey = websafeClubmemberKey;
        this.alter = alter;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public int getAge() {
        return age;
    }

    public String getWebsafeClubmemberKey() { return websafeClubmemberKey; }

    public float getAlter() { return alter; }
}

