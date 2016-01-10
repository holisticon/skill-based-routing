package de.holisticon.bpm.sbr.plugin.setup;


import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Throwables;
import org.flywaydb.core.Flyway;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

public class ShowcaseSetup implements Runnable {

  private static final String LICENSE_PACKAGE = "de/holisticon/bpm/camunda/license";
  private static final String LICENSE_LOCATION = "classpath:" + LICENSE_PACKAGE.replaceAll("/", ".");
  private static final ClassLoader CLASS_LOADER = Flyway.class.getClassLoader();

  @VisibleForTesting
  static final boolean IS_LICENSE_PRESENT = CLASS_LOADER.getResource(LICENSE_PACKAGE) != null;

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

    if (IS_LICENSE_PRESENT) {
      flyway.setLocations(flyway.getLocations()[0], LICENSE_LOCATION);
    }

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
