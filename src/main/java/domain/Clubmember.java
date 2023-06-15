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

    private String description;

    private int age;

    @Parent
    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
    private Key<Account> accountKey;

    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE)
    private String accountID;

    private float alter = 11;

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

    public String getDescription() {
        return description;
    }

    public int getAge() {
        return age;
    }


    public float getAlter() {
        return alter;
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
        this.description = clubmemberForm.getDescription();
        this.age = clubmemberForm.getAge();
        this.alter = clubmemberForm.getAlter();
    }

    public void update(String name, String description, float alter, int age) {
        this.name = name;
        this.description = description;
        this.alter = alter;
        this.age = age;
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder("Id: " + id + "\n").append("Name: ").append(name).append("\n");

        return stringBuilder.toString();
    }
}
