package de.holisticon.bpm.sbr;

import com.google.common.collect.FluentIterable;
import org.camunda.bpm.dmn.engine.DmnDecisionTableResult;
import org.camunda.bpm.engine.DecisionService;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.history.HistoricDecisionInstance;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.camunda.bpm.engine.impl.cfg.StandaloneInMemProcessEngineConfiguration;
import org.camunda.bpm.engine.impl.history.HistoryLevel;
import org.camunda.bpm.engine.repository.Deployment;
import org.camunda.bpm.engine.test.ProcessEngineRule;
import org.camunda.bpm.engine.test.mock.MockExpressionManager;
import org.camunda.bpm.engine.variable.Variables;
import org.junit.After;
import org.junit.Rule;
import org.junit.Test;
import org.slf4j.Logger;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.slf4j.LoggerFactory.getLogger;

public class RedeployAndEvaluateDecisionTest{

  public static final String SILVER_1000 = "dmn/camunda-example_silver1000.dmn";
  public static final String SILVER_2000 = "dmn/camunda-example_silver2000.dmn";

  private final Logger logger = getLogger(this.getClass());

  private final ProcessEngineConfigurationImpl configuration = new StandaloneInMemProcessEngineConfiguration() {{
    databaseSchemaUpdate = DB_SCHEMA_UPDATE_DROP_CREATE;
    expressionManager = new MockExpressionManager();
    jobExecutorActivate = false;
    historyLevel = HistoryLevel.HISTORY_LEVEL_FULL;
  }};

  @Rule
  public final ProcessEngineRule processEngineRule = new ProcessEngineRule(configuration.buildProcessEngine());

  @Test
  public void redeploy_rules_so_silver1500_is_ok() {

    // original rule: silver is only ok up to 1000
    deployDecisionTable(SILVER_1000);

    assertThat(evaluateDecisionTable(1500d)).isFalse();

    // new rule: silver is ok up to 2000
    deployDecisionTable(SILVER_2000);

    assertThat(evaluateDecisionTable(1500d)).isTrue();

    final List<HistoricDecisionInstance> decisions = processEngineRule.getHistoryService().createHistoricDecisionInstanceQuery().decisionDefinitionKey("decision").list();

    for (HistoricDecisionInstance i : decisions) {
      logger.info("{}", i);
    }
  }

  private boolean evaluateDecisionTable(double sum) {
    final DecisionService decisionService = processEngineRule.getDecisionService();
    final DmnDecisionTableResult results = decisionService.evaluateDecisionTableByKey("decision", Variables.createVariables().putValue("status", "silver").putValue("sum", 1500.0d));

    final String result = FluentIterable.from(results).first().get().getEntry("result");

    return "ok".equals(result);
  }

  private void deployDecisionTable(String dmnResource) {
    RepositoryService repositoryService = processEngineRule.getRepositoryService();

    repositoryService.createDeployment().name("checkRules").addClasspathResource(dmnResource).deploy();
  }

  @After
  public void undeploy() {
    RepositoryService repositoryService = processEngineRule.getProcessEngine().getRepositoryService();
    for (Deployment deployment : repositoryService.createDeploymentQuery().list()) {
      repositoryService.deleteDeployment(deployment.getId(), true);
    }
    assertThat(repositoryService.createDeploymentQuery().list()).isEmpty();
  }
}
