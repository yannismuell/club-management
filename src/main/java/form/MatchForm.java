package form;

public class MatchForm {

    private String name;

    private String description;

    private String websafeMatchKey;

    private float restTime;

    private MatchForm() {}

    /**
     * Public constructor is solely for Unit Test.
     * @param name
     * @param description
     * @param websafeMatchKey
     */

    public MatchForm(String name, String description, String websafeMatchKey, float restTime) {
        this.name = name;
        this.description = description;
        this.websafeMatchKey = websafeMatchKey;
        this.restTime = restTime;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getWebsafeMatchKey() { return websafeMatchKey; }

    public float getRestTime() { return restTime; }
}
