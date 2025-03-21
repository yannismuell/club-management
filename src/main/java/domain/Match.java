package domain;

import clubmanagement.Constants;
import com.google.common.base.Preconditions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import form.MatchForm;
import spi.ClubManagementAPI;

import java.util.Arrays;
import java.util.logging.Logger;

@Entity
@Cache
public class Match {

    @Id
    private Long id;
    private String matchDate;
    private String matchTime;

    private String team;

    private String websafeTeamsInMatchKey;
    private String guest;

    private int homeGoals;
    private int guestGoals;

    private static final Logger LOG = Logger.getLogger(ClubManagementAPI.class.getName());

    private Match() {}
    public Match(Long id, MatchForm matchForm) {
        LOG.info("Date: ." + matchForm.getMatchDate());
        Preconditions.checkNotNull(matchForm.getMatchDate(), "The date is required");
        this.id = id;
        this.matchDate = matchForm.getMatchDate();
        this.matchTime = matchForm.getMatchTime();
        this.team = matchForm.getTeam();
        this.guest = matchForm.getGuest();
        this.homeGoals = matchForm.getHomeGoals();
        this.guestGoals = matchForm.getGuestGoals();
        updateWithMatchForm(matchForm);
    }

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

    public String getWebsafeTeamsInMatchKey() {return websafeTeamsInMatchKey; }

    public String getGuest(){return guest;}

    public int getHomeGoals() {
        return homeGoals;
    }

    public int getGuestGoals() {
        return guestGoals;
    }

    public String getWebsafeMatchKey() {
        return Key.create(Match.class, id).toLegacyUrlSafe();
    }

    public void updateWithMatchForm(MatchForm matchForm) {
        this.matchDate = matchForm.getMatchDate();
        this.matchTime = matchForm.getMatchTime();
        this.team = matchForm.getTeam();
        this.guest = matchForm.getGuest();
        this.homeGoals = matchForm.getHomeGoals();
        this.guestGoals = matchForm.getGuestGoals();

    }

/*    public void update(String matchDate, String matchTime, String matchTeam, String guest, int homeGoals, int guestGoals) {
        this.matchDate = getMatchDate();
        this.matchTime = getMatchTime();
        this.matchTeam = getMatchTeam();
        this.guest = getGuest();
        this.homeGoals = getHomeGoals();
        this.guestGoals = getGuestGoals();
    }*/

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder("Id: " + id + "\n").append("Date: ").append(matchDate).append("\n");

        return stringBuilder.toString();
    }


}
