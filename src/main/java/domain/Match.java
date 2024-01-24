package domain;

import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.ApiResourceProperty;
import com.google.common.base.Preconditions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Parent;
import form.MatchForm;
import spi.ClubManagementAPI;
import java.util.logging.Logger;

@Entity
@Cache
public class Match {

    @Id
    private Long id;
    private String matchDate;
    private String matchTime;

    private String matchTeam;
    private String opponent;

    private int homeGoals;
    private int guestGoals;

    @Parent
    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
    private Key<Account> accountKey;

    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
    private String accountID;

    private float restTime = 11;

    private static final Logger LOG = Logger.getLogger(ClubManagementAPI.class.getName());
    private Match() {}

    public Match(final long id, final MatchForm matchForm) {
        LOG.info("Home: ." + matchForm.getHome());
        Preconditions.checkNotNull(matchForm.getHome(), "The home is required");
        this.id = id;
        updateWithMatchForm(matchForm);
    }

    public long getId() {
        return id;
    }

    public String getAccountId() { return accountID; }

    public String getMatchDate() {
        return matchDate;
    }

    public String getMatchTime() {
        return matchTime;
    }

    public String getMatchTeam() {
        return matchTeam;
    }

    public String getOpponent(){return opponent;}

    public int getHomeGoals() {
        return homeGoals;
    }

    public int getGuestGoals() {
        return guestGoals;
    }

    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
    public Key<Account> getAccountKey() {
        return accountKey;
    }

    public String getWebsafeAccountKey() {
        return Key.create(accountKey, Match.class, id).toLegacyUrlSafe();
    }

    public String getWebsafeMatchKey() {
        return Key.create(accountKey, Match.class, id).toLegacyUrlSafe();
    }


    public void updateWithMatchForm(MatchForm matchForm) {
        this.matchDate = matchForm.getMatchDate();
        this.matchTime = matchForm.getMatchTime();
        this.matchTeam = matchForm.getMatchTeam();
        this.opponent = matchForm.getOpponent();
        this.homeGoals = matchForm.getHomeGoals();
        this.guestGoals = matchForm.getGuestGoals();

    }

    public void update(String matchDate, String matchTime, String matchTeam, String opponent, int homeGoals, int guestGoals) {
        this.matchDate = getMatchDate();
        this.matchTime = getMatchTime();
        this.matchTeam = getMatchTeam();
        this.opponent = getOpponent();
        this.homeGoals = getHomeGoals();
        this.guestGoals = getGuestGoals();
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder("Id: " + id + "\n").append("Home: ").append(home).append("\n");

        return stringBuilder.toString();
    }
}
