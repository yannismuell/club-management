package domain;

import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.ApiResourceProperty;
import com.google.common.base.Preconditions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Parent;
import form.TrainerForm;

@Entity
@Cache
public class Trainer {

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

    private Trainer() {}

    public Trainer(final long id, final String accountID, final TrainerForm trainerForm, final String email) {
        Preconditions.checkNotNull(trainerForm.getName(), "The name is required");
        this.id = id;
        this.accountKey = Key.create(Account.class, accountID);
        this.accountID = accountID;

        updateWithTrainerForm(trainerForm);
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
        return Key.create(accountKey, Trainer.class, id).toLegacyUrlSafe();
    }

    public String getWebsafeTrainerKey() {
        return Key.create(accountKey, Trainer.class, id).toLegacyUrlSafe();
    }


    public void updateWithTrainerForm(TrainerForm trainerForm) {
        this.name = trainerForm.getName();
        this.description = trainerForm.getDescription();
        this.restTime = trainerForm.getRestTime();
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
