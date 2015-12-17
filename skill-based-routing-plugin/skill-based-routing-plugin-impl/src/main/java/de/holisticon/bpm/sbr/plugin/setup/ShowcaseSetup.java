package de.holisticon.bpm.sbr.plugin.setup;


import com.google.common.base.Throwables;
import org.flywaydb.core.Flyway;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

public class ShowcaseSetup implements Runnable {

  private final Flyway flyway = new Flyway();

  public ShowcaseSetup() {
    this(lookupDataSource());
  }

  public ShowcaseSetup(final DataSource dataSource) {
    flyway.setDataSource(dataSource);
  }

  @Override
  public void run() {
    flyway.setClassLoader(Flyway.class.getClassLoader());
    flyway.clean();
    flyway.migrate();
  }

  private static DataSource lookupDataSource() {
    try {
      String jndi = "java:jboss/datasources/ProcessEngine";
      return (DataSource) new InitialContext().lookup(jndi);
    } catch (NamingException e) {
      throw Throwables.propagate(e);
    }
  }
}
