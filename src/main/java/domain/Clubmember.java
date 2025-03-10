package domain;

import clubmanagement.Constants;
import com.google.common.base.Preconditions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import form.ClubmemberForm;
import spi.ClubManagementAPI;

import java.util.Arrays;
import java.util.logging.Logger;
import java.util.Date;
import static service.OfyService.ofy;
@Entity
@Cache
public class Clubmember {

    @Id
    private Long id;
    private String name;
    private String surname;
    private String birthDate;
    @Index
    private String email;
    private String address;
    private boolean isCoach;
    private boolean isAdmin;
    @Index
    private String team;
    private String websafeMembersinTeamKey;
    private static final Logger LOG = Logger.getLogger(ClubManagementAPI.class.getName());
    private Clubmember() {}
    public Clubmember(Long id, ClubmemberForm clubmemberForm) {
        LOG.info("Name: ." + clubmemberForm.getName());
        Preconditions.checkNotNull(clubmemberForm.getName(), "The name is required");
        this.id = id;
        this.name = clubmemberForm.getName();
        this.surname = clubmemberForm.getSurname();
        this.birthDate = clubmemberForm.getBirthDate();
        this.email = clubmemberForm.getEmail();
        this.address = clubmemberForm.getAddress();
        this.isCoach = clubmemberForm.getIsCoach();
        this.isAdmin = clubmemberForm.getIsAdmin();
        this.team = clubmemberForm.getTeam();
        updateWithClubmemberForm(clubmemberForm);
    }

    public Clubmember(String name, String surname, String email, String team) {
        this.id = (long)999999999;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.isAdmin = true;
        this.team = team;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public String getEmail() {
        return email;
    }

    public String getAddress() {
        return address;
    }

    public boolean getIsCoach() {
        return isCoach;
    }

    public boolean getIsAdmin() {
        if (Arrays.asList(Constants.CLUBMEMBER_EMAILS).contains(email)) return true;
        return isAdmin;
    }

    public String getWebsafeClubmemberKey() {
        return Key.create(Clubmember.class, id).toLegacyUrlSafe();
    }
    public String getTeam() {return team; }

    public String getWebsafeMembersinTeamKey() {
        return websafeMembersinTeamKey;
    }

    public void updateWithClubmemberForm(ClubmemberForm clubmemberForm) {
        this.name = clubmemberForm.getName();
        this.surname = clubmemberForm.getSurname();
        this.birthDate = clubmemberForm.getBirthDate();
        this.email = clubmemberForm.getEmail();
        this.address = clubmemberForm.getAddress();
        this.isCoach = clubmemberForm.getIsCoach();
        this.isAdmin = clubmemberForm.getIsAdmin();
        this.team = clubmemberForm.getTeam();
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder("Id: " + id + "\n").append("Name: ").append(name).append("\n");

        return stringBuilder.toString();
    }
}
