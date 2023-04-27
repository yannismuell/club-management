package form;

public class DepartmentForm {

    private String name;

    private String description;

    private String websafeDepartmentKey;

    private float restTime;

    private DepartmentForm() {}

    /**
     * Public constructor is solely for Unit Test.
     * @param name
     * @param description
     * @param websafeDepartmentKey
     */

    public DepartmentForm(String name, String description, String websafeDepartmentKey, float restTime) {
        this.name = name;
        this.description = description;
        this.websafeDepartmentKey = websafeDepartmentKey;
        this.restTime = restTime;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getWebsafeDepartmentKey() { return websafeDepartmentKey; }

    public float getRestTime() { return restTime; }
}
