package domain;

import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.ApiResourceProperty;
import com.google.common.base.Preconditions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Parent;
import form.TeamForm;

@Entity
@Cache
public class Team {

    @Id
    private Long id;

    private String name;

    private String players;

    private String coach;

    @Parent
    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
    private Key<Account> accountKey;

    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
    private String accountID;

    private float restTime = 11;

    public Team(long teamId, TeamForm teamForm) {}

    public Team(final long id, final String accountID,final TeamForm teamForm, final String email) {
        Preconditions.checkNotNull(teamForm.getName(), "The name is required");
        this.id = id;
        this.accountKey = Key.create(Account.class, accountID);
        this.accountID = accountID;

        updateWithTeamForm(teamForm);
    }

    public long getId() {
        return id;
    }

    public String getAccountId() { return accountID; }

    public String getName() {
        return name;
    }

    public String getPlayers() {
        return players;
    }

    public String getCoach() {
        return coach;
    }

    public float getRestTime() {
        return restTime;
    }

    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
    public Key<Account> getAccountKey() {
        return accountKey;
    }

    public String getWebsafeAccountKey() {
        return Key.create(accountKey, Team.class, id).toLegacyUrlSafe();
    }

    public String getWebsafeTeamKey() {
        return Key.create(accountKey, Team.class, id).toLegacyUrlSafe();
    }


    public void updateWithTeamForm(TeamForm teamForm) {
        this.name = teamForm.getName();
        this.players = teamForm.getPlayers();
        this.coach = teamForm.getCoach();
        this.restTime = teamForm.getRestTime();
    }

    public void update(String name, String players, String coach, float restTime) {
        this.name = name;
        this.players = players;
        this.coach = coach;
        this.restTime = restTime;
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder("Id: " + id + "\n").append("Name: ").append(name).append("\n");

        return stringBuilder.toString();
    }
}
