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
    private String home;
    private String away;
    private int homegoals;
    private int awaygoals;

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

    public String getHome() {
        return home;
    }

    public String getAway() {
        return away;
    }

    public int getHomegoals() {
        return homegoals;
    }

    public int getAwaygoals() {
        return awaygoals;
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
        this.home = matchForm.getHome();
        this.away = matchForm.getAway();
        this.homegoals = matchForm.getHomegoals();
        this.awaygoals = matchForm.getAwaygoals();
    }

    public void update(String home, String away, int homegoals, int awaygoals) {
        this.home = home;
        this.away = away;
        this.homegoals = homegoals;
        this.awaygoals = awaygoals;
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder("Id: " + id + "\n").append("Home: ").append(home).append("\n");

        return stringBuilder.toString();
    }
}
