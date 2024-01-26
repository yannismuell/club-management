package domain;

import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.ApiResourceProperty;
import com.google.common.base.Preconditions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Parent;
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

    @Parent
    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
    private Key<Account> accountKey;

    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
    private String accountID;


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

    public String getAccountId() { return accountID; }

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


    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
    public Key<Account> getAccountKey() {
        return accountKey;
    }

    public String getWebsafeAccountKey() {
        return Key.create(accountKey, Clubmember.class, id).toLegacyUrlSafe();
    }

    public String getWebsafeClubmemberKey() {
        return Key.create(accountKey, Clubmember.class, id).toLegacyUrlSafe();
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
