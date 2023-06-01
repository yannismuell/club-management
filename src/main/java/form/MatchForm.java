package form;

public class MatchForm {

    private String name;

    private String gegner;

    private String websafeMatchKey;

    private float restTime;

    private MatchForm() {}

    /**
     * Public constructor is solely for Unit Test.
     * @param name
     * @param gegner
     * @param websafeMatchKey
     */

    public MatchForm(String name, String gegner, String websafeMatchKey, float restTime) {
        this.name = name;
        this.gegner = gegner;
        this.websafeMatchKey = websafeMatchKey;
        this.restTime = restTime;
    }

    public String getName() {
        return name;
    }

    public String getGegner() {
        return gegner;
    }

    public String getWebsafeMatchKey() { return websafeMatchKey; }

    public float getRestTime() { return restTime; }
}
