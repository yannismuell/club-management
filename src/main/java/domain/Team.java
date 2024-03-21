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
import spi.ClubManagementAPI;
import java.util.logging.Logger;

@Entity
@Cache
public class Team {
    @Id
    private Long id;

    private String name;

    private String players;

    private String coach;

    private static final Logger LOG = Logger.getLogger(ClubManagementAPI.class.getName());
    private Team() {}
    public Team(final long id, final TeamForm teamForm) {
        LOG.info("Home: ." + teamForm.getName());
        Preconditions.checkNotNull(teamForm.getName(), "The name is required");
        this.id = id;
        updateWithTeamForm(teamForm);
    }

    public long getId() {
        return id;
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

    public String getWebsafeTeamKey() {
        return Key.create(Team.class, id).toLegacyUrlSafe();
    }

    public void updateWithTeamForm(TeamForm teamForm) {
        this.name = teamForm.getName();
        this.players = teamForm.getPlayers();
        this.coach = teamForm.getCoach();
    }

    /* public void update(String name, String players, String coach) {
        this.name = name;
        this.players = players;
        this.coach = coach;
    } */

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder("Id: " + id + "\n").append("Name: ").append(name).append("\n");

        return stringBuilder.toString();
    }
}
