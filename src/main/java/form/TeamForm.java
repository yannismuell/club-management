package form;

public class TeamForm {

    private String name;

    private String players;

    private String coach;

    private String websafeTeamKey;

    private TeamForm() {}

    /**
     * Public constructor is solely for Unit Test.
     * @param name
     * @param players
     * @param coach
     * @param websafeTeamKey
     */

    public TeamForm(String name, String players, String coach, String websafeTeamKey) {
        this.name = name;
        this.players = players;
        this.coach = coach;
        this.websafeTeamKey = websafeTeamKey;
    }

    public String getName() {
        return name;
    }

    public String getPlayers() {
        return players;
    }

    public String getCoach() {
        return coach;
    }

    public String getWebsafeTeamKey() { return websafeTeamKey; }
}
