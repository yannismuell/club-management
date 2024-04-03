package form;

public class TeamForm {

    private String name;

    private String clubmember;

    private String websafeTeamKey;

    private TeamForm() {}

    /**
     * Public constructor is solely for Unit Test.
     * @param name
     * @param clubmember
     * @param websafeTeamKey
     */

    public TeamForm(String name, String clubmember, String websafeTeamKey) {
        this.name = name;
        this.clubmember = clubmember;
        this.websafeTeamKey = websafeTeamKey;
    }

    public String getName() {
        return name;
    }

    public String getClubmember() {
        return clubmember;
    }

    public String getWebsafeTeamKey() { return websafeTeamKey; }
}
