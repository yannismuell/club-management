package service;

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

        ObjectifyService.init();

        ObjectifyService.register(Account.class);
        ObjectifyService.register(Department.class);
    }

    public  void contextDestroyed (ServletContextEvent event) {
    }

    /**
     * Use this static method for getting the Objectify service object in order to make sure the
     * above static block is executed before using Objectify.
     * @return Objectify service object.
     */
    public static Objectify ofy() {
        return ObjectifyService.ofy();
    }

    /**
     * Use this static method for getting the Objectify service factory.
     * @return ObjectifyFactory.
     */
    public static ObjectifyFactory factory() {
        return ObjectifyService.factory();
    }
}
