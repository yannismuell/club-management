package form;

public class MatchForm {

    private String home;

    private String away;

    private String websafeMatchKey;

    private int homegoals;

    private int awaygoals;

    private MatchForm(){}
    /**
     * Public constructor is solely for Unit Test.
     * @param home
     * @param away
     * @param websafeMatchKey
     */
    public MatchForm(String home, String away, String websafeMatchKey, int homegoals, int awaygoals) {
        this.home = home;
        this.away = away;
        this.websafeMatchKey = websafeMatchKey;
        this.homegoals = homegoals;
        this.awaygoals = awaygoals;
    }

    public String getHome() {
        return home;
    }

    public String getAway() {
        return away;
    }

    public String getWebsafeMatchKey() { return websafeMatchKey; }

    public int getHomegoals() { return homegoals; }
    public int getAwaygoals() { return awaygoals; }
}
