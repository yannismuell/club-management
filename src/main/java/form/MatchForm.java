package form;

public class MatchForm {

    private String name;

    private String gegner;

    private String websafeMatchKey;

    private float restTime;

    private MatchForm(){}
    /**
     * Public constructor is solely for Unit Test.
     * @param name
     * @param gegner
     * @param websafeMatchKey
     */
<<<<<<< HEAD
    public MatchForm(String name, String description, String websafeMatchKey, float restTime) {
=======

    public MatchForm(String name, String gegner, String websafeMatchKey, float restTime) {
>>>>>>> ded3511ac42afef67f9093c94a7cde88f895f1a6
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
