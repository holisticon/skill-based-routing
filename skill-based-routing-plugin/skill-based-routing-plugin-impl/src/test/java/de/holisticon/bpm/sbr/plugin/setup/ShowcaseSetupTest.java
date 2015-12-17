package de.holisticon.bpm.sbr.plugin.setup;

import com.google.common.base.Optional;
import org.assertj.core.api.Assertions;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.ProcessEngineConfiguration;
import org.camunda.bpm.engine.ProcessEngines;
import org.camunda.bpm.engine.impl.cfg.StandaloneInMemProcessEngineConfiguration;
import org.camunda.bpm.engine.impl.history.HistoryLevel;
import org.camunda.bpm.engine.test.mock.MockExpressionManager;
import org.flywaydb.core.internal.util.jdbc.DriverDataSource;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import javax.sql.DataSource;
import java.sql.SQLException;

import static org.assertj.core.api.Assertions.assertThat;


public class ShowcaseSetupTest {

  private ShowcaseSetup showcaseSetup;

  private ProcessEngineConfiguration processEngineConfiguration;

  @Before
  public void setUp() {
    processEngineConfiguration = new StandaloneInMemProcessEngineConfiguration() {{
      historyLevel = HistoryLevel.HISTORY_LEVEL_NONE;
      jobExecutorActivate = false;
      databaseSchemaUpdate = DB_SCHEMA_UPDATE_FALSE;
      expressionManager = new MockExpressionManager();

    }};
    final DataSource h2 = new DriverDataSource(this.getClass().getClassLoader(), null, "jdbc:h2:mem:process-engine;DB_CLOSE_DELAY=-1", "sa", "sa");
    processEngineConfiguration.setDataSource(h2);

    showcaseSetup = new ShowcaseSetup(h2);
  }

  @After
  public void cleanUp() {
    ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
    if (processEngine != null) {
      processEngine.close();
    }
  }

  @Test
  public void setUpDatabase() throws InterruptedException, SQLException {
    showcaseSetup.run();

    ProcessEngine processEngine = processEngineConfiguration.buildProcessEngine();

    assertThat(processEngine.getIdentityService().createUserQuery().userFirstName("Jan").singleResult().getLastName()).isEqualTo("G.");
  }
}
