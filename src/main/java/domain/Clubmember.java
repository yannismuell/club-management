package domain;

import com.google.common.base.Preconditions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import form.ClubmemberForm;
import spi.ClubManagementAPI;
import java.util.logging.Logger;
@Entity
@Cache
public class Clubmember {

    @Id
    private Long id;

    private String name;

    private String surname;

    private String birthDate;

    private String email;

    private String address;

    private boolean isCoach;

    private boolean isAdmin;

    private static final Logger LOG = Logger.getLogger(ClubManagementAPI.class.getName());
    private Clubmember() {}
    public Clubmember(final long id, final ClubmemberForm clubmemberForm) {
        LOG.info("Name: ." + clubmemberForm.getName());
        Preconditions.checkNotNull(clubmemberForm.getName(), "The name is required");
        this.id = id;
        updateWithClubmemberForm(clubmemberForm);
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

    public boolean getIsAdmin() {return isAdmin; }

    public String getWebsafeClubmemberKey() {
        return Key.create(Clubmember.class, id).toLegacyUrlSafe();
    }

    public void updateWithClubmemberForm(ClubmemberForm clubmemberForm) {
        this.name = clubmemberForm.getName();
        this.surname = clubmemberForm.getSurname();
        this.birthDate = clubmemberForm.getBirthDate();
        this.email = clubmemberForm.getEmail();
        this.address = clubmemberForm.getAddress();
        this.isCoach = clubmemberForm.getIsCoach();
        this.isAdmin = clubmemberForm.getIsAdmin();
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder("Id: " + id + "\n").append("Name: ").append(name).append("\n");

        return stringBuilder.toString();
    }
}
