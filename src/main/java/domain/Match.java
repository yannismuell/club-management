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

    private String name;

    private String description;

    @Parent
    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
    private Key<Account> accountKey;

    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
    private String accountID;

    private float restTime = 11;

    private static final Logger LOG = Logger.getLogger(ClubManagementAPI.class.getName());
    private Match() {}

    public Match(final long id, final MatchForm matchForm) {
        LOG.info("Name: ." + matchForm.getName());
        Preconditions.checkNotNull(matchForm.getName(), "The name is required");
        this.id = id;
        /*this.accountKey = Key.create(Account.class, accountID);
        this.accountID = accountID;*/

        updateWithMatchForm(matchForm);
    }

    public long getId() {
        return id;
    }

    public String getAccountId() { return accountID; }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public float getRestTime() {
        return restTime;
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
        this.name = matchForm.getName();
        this.description = matchForm.getDescription();
        this.restTime = matchForm.getRestTime();
    }

    public void update(String name, String description, float restTime) {
        this.name = name;
        this.description = description;
        this.restTime = restTime;
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder("Id: " + id + "\n").append("Name: ").append(name).append("\n");

        return stringBuilder.toString();
    }
}
