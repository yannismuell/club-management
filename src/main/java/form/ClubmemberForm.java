package form;

public class ClubmemberForm {

    private String name;

    private String description;

    private String websafeClubmemberKey;

    private float alter;

    private ClubmemberForm() {}

    /**
     * Public constructor is solely for Unit Test.
     * @param name
     * @param description
     * @param websafeClubmemberKey
     */

    public ClubmemberForm(String name, String description, String websafeClubmemberKey, float alter) {
        this.name = name;
        this.description = description;
        this.websafeClubmemberKey = websafeClubmemberKey;
        this.alter = alter;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getWebsafeClubmemberKey() { return websafeClubmemberKey; }

    public float getAlter() { return alter; }
}

