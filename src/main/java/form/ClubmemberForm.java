package form;

public class ClubmemberForm {

    private String name;

    private String description;

    private String websafeClubmemberKey;

    private float restTime;

    private ClubmemberForm() {}

    /**
     * Public constructor is solely for Unit Test.
     * @param name
     * @param description
     * @param websafeClubmemberKey
     */

    public ClubmemberForm(String name, String description, String websafeClubmemberKey, float restTime) {
        this.name = name;
        this.description = description;
        this.websafeClubmemberKey = websafeClubmemberKey;
        this.restTime = restTime;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getWebsafeClubmemberKey() { return websafeClubmemberKey; }

    public float getRestTime() { return restTime; }
}

