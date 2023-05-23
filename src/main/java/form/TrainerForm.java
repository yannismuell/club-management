package form;

public class TrainerForm {

    private String name;

    private String description;

    private String websafeTrainerKey;

    private float restTime;

    private TrainerForm() {}

    /**
     * Public constructor is solely for Unit Test.
     * @param name
     * @param description
     * @param websafeTrainerKey
     */

    public TrainerForm(String name, String description, String websafeTrainerKey, float restTime) {
        this.name = name;
        this.description = description;
        this.websafeTrainerKey = websafeTrainerKey;
        this.restTime = restTime;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getWebsafeTrainerKey() { return websafeTrainerKey; }

    public float getRestTime() { return restTime; }
}
