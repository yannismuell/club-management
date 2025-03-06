package form;

public class MatchForm {

    private long id;
    private String matchDate;
    private String matchTime;
    private String team;
    private String websafeTeamsInMatchKey;
    private String guest;
    private int homeGoals;
    private int guestGoals;
    private String websafeMatchKey;

    private MatchForm() {}

    /**
     * Public constructor is solely for Unit Test.
     * @param matchDate
     * @param matchTime
     * @param websafeMatchKey
     */
    public MatchForm(String matchDate, String matchTime, String team, String websafeTeamsInMatchKey, String guest, int homeGoals, int guestGoals, String websafeMatchKey) {
        this.matchDate = matchDate;
        this.matchTime = matchTime;
        this.team = team;
        this.websafeTeamsInMatchKey = websafeTeamsInMatchKey;
        this.guest = guest;
        this.homeGoals = homeGoals;
        this.guestGoals = guestGoals;
        this.websafeMatchKey = websafeMatchKey;

    }

    public String getWebsafeMatchKey() { return websafeMatchKey; }
    public long getId() {
        return id;
    }
    public String getMatchDate() {
        return matchDate;
    }

    public String getMatchTime() {
        return matchTime;
    }

    public String getTeam() {
        return team;
    }

    public String getWebsafeTeamsInMatchKey() {return websafeTeamsInMatchKey;}

    public String getGuest() {
        return guest;
    }

    public int getHomeGoals() {
        return homeGoals;
    }

    public int getGuestGoals() {
        return guestGoals;
    }
}

