package form;

public class MatchForm {

    private String matchDate;
    private String matchTime;
    private String matchTeam;
    private String opponent;
    private int homeGoals;
    private int guestGoals;
    private String websafeMatchKey;


    private MatchForm(){}
    /**
     * Public constructor is solely for Unit Test.
     * @param matchTeam
     * @param opponent
     * @param websafeMatchKey
     */
    public MatchForm(String matchDate, String matchTime, String matchTeam, String opponent, int homeGoals, int guestGoals, String websafeMatchKey) {
        this.matchDate = matchDate;
        this.matchTime = matchTime;
        this.matchTeam = matchTeam;
        this.opponent = opponent;
        this.homeGoals = homeGoals;
        this.guestGoals = guestGoals;
        this.websafeMatchKey = websafeMatchKey;

    }

    public String getWebsafeMatchKey() { return websafeMatchKey; }

    public String getMatchDate() {
        return matchDate;
    }

    public String getMatchTime() {
        return matchTime;
    }

    public String getMatchTeam() {
        return matchTeam;
    }

    public String getOpponent() {
        return opponent;
    }

    public int getHomeGoals() {
        return homeGoals;
    }

    public int getGuestGoals() {
        return guestGoals;
    }
}

