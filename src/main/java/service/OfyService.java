package service;

import com.google.cloud.datastore.DatastoreOptions;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;
import domain.*;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/**
 * Custom Objectify Service that this application should use.
*/
public class OfyService implements ServletContextListener {

    public void contextInitialized(ServletContextEvent event) {

        // Use for GAE deploymnet
        //ObjectifyService.init();

        // Use for local development
        ObjectifyService.init(new ObjectifyFactory(
                DatastoreOptions.newBuilder()
                        .setHost("http://localhost:8081")
                        .setProjectId("clubmanagement-382206")
                        .build()
                        .getService()
        ));

        ObjectifyService.register(Account.class);
        ObjectifyService.register(Match.class);
        ObjectifyService.register(Clubmember.class);
        ObjectifyService.register(Team.class);
    }

    public void contextDestroyed(ServletContextEvent event) {
    }

    /**
     * Use this static method for getting the Objectify service object in order to make sure the
     * above static block is executed before using Objectify.
     *
     * @return Objectify service object.
     */
    public static Objectify ofy() {
        return ObjectifyService.ofy();
    }

    /**
     * Use this static method for getting the Objectify service factory.
     *
     * @return ObjectifyFactory.
     */
    public static ObjectifyFactory factory() {
        return ObjectifyService.factory();
    }
}