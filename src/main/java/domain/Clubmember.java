package domain;

import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.ApiResourceProperty;
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

    private String telephoneNumber;

    private String address;

    private String role;

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

    public String getTelephoneNumber() {
        return telephoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public String getRole() {
        return role;
    }

    public String getWebsafeClubmemberKey() {
        return Key.create(Clubmember.class, id).toLegacyUrlSafe();
    }

    public void updateWithClubmemberForm(ClubmemberForm clubmemberForm) {
        this.name = clubmemberForm.getName();
        this.surname = clubmemberForm.getSurname();
        this.birthDate = clubmemberForm.getBirthDate();
        this.telephoneNumber = clubmemberForm.getTelephoneNumber();
        this.address = clubmemberForm.getAddress();
        this.role = clubmemberForm.getRole();
    }

    public void update(String name, String surname, String birthDate, String telephoneNumber, String address, String role) {
        this.name = getName();
        this.surname = getSurname();
        this.birthDate = getBirthDate();
        this.telephoneNumber = getTelephoneNumber();
        this.address = getAddress();
        this.role = getRole();
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder("Id: " + id + "\n").append("Name: ").append(name).append("\n");

        return stringBuilder.toString();
    }
}
