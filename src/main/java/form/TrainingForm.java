package form;

public class TrainingForm {

    private String name;

    private String description;

    private String websafeTrainingKey;

    private float restTime;

    private TrainingForm() {}

    /**
     * Public constructor is solely for Unit Test.
     * @param name
     * @param description
     * @param websafeTrainingKey
     */

    public TrainingForm(String name, String description, String websafeTrainingKey, float restTime) {
        this.name = name;
        this.description = description;
        this.websafeTrainingKey = websafeTrainingKey;
        this.restTime = restTime;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getWebsafeTrainingKey() { return websafeTrainingKey; }

    public float getRestTime() { return restTime; }
}
