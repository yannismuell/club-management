package form;

public class SquadForm {

    private String name;

    private String description;

    private String websafeSquadKey;

    private float restTime;

    private SquadForm() {}

    /**
     * Public constructor is solely for Unit Test.
     * @param name
     * @param description
     * @param websafeSquadKey
     */

    public SquadForm(String name, String description, String websafeSquadKey, float restTime) {
        this.name = name;
        this.description = description;
        this.websafeSquadKey = websafeSquadKey;
        this.restTime = restTime;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getWebsafeSquadKey() { return websafeSquadKey; }

    public float getRestTime() { return restTime; }
}
