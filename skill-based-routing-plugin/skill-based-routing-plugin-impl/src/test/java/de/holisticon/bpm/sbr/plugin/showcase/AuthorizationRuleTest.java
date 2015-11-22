package de.holisticon.bpm.sbr.plugin.showcase;

import de.holisticon.bpm.sbr.plugin.test.FluentProcessEngineConfiguration;
import org.camunda.bpm.dmn.engine.DmnDecisionTableResult;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.camunda.bpm.engine.impl.cfg.StandaloneInMemProcessEngineConfiguration;
import org.camunda.bpm.engine.impl.history.HistoryLevel;
import org.camunda.bpm.engine.test.Deployment;
import org.camunda.bpm.engine.test.ProcessEngineRule;
import org.camunda.bpm.engine.test.mock.MockExpressionManager;
import org.camunda.bpm.engine.variable.Variables;
import org.junit.Rule;
import org.junit.Test;

import de.holisticon.bpm.sbr.plugin.api.TaskHolder;

import static org.junit.Assert.assertEquals;

/**
 * Tests for showcase authorizations table.
 *
 * @author Simon Zambrovski (Holisticon AG)
 *
 */
public class AuthorizationRuleTest {

  private static final String TASK_ERSTATTUNGSBETRAG_BERECHNEN = "task_erstattungsbetrag_berechnen";
  private static final String TASK_ZAHLUNG_FREIGEBEN = "task_zahlung_freigeben";
  private static final String TASK_GEBUEHRENRECHTLICH_PRUEFEN = "task_gebuehrenrechtlich_pruefen";
  private static final String KS_VIP = "VIP";
  private static final String KS_MITARBEITER = "Mitarbeiter";
  private static final String KS_STANDARD = "Standard";
  private static final String AUTH_DMN_RESOURCE = "showcase/leistungsabrechnung_requiredAuthorizations.dmn";

  private static final String DECISION_KEY = "leistungsabrechnung_requiredAuthorizations";
  private static final String KUNDENSTATUS = "kundenstatus";
  private static final String ERSTATTUNG = "erstattungGesamt";
  private static final String RECHNUNGSART = "rechnungsart";
  private static final String REQUIRED_AUTH = "requiredAuthorizations";


  @Rule
  public final ProcessEngineRule processEngineRule = FluentProcessEngineConfiguration.processEngineRule();

  @Test
  @Deployment(resources = AUTH_DMN_RESOURCE)
  public void evaluateAuthMitarbeiterPremium() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey(TASK_GEBUEHRENRECHTLICH_PRUEFEN);

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "").putValue(ERSTATTUNG, 0).putValue(KUNDENSTATUS, KS_MITARBEITER));

    assertEquals(1, results.getResultList().size());
    assertEquals("INTERNA", results.get(0).get(REQUIRED_AUTH));
  }

  @Test
  @Deployment(resources = AUTH_DMN_RESOURCE)
  public void evaluateAuthKullanzSonstiges() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey(TASK_GEBUEHRENRECHTLICH_PRUEFEN);

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "Sonstiges").putValue(ERSTATTUNG, 0).putValue(KUNDENSTATUS, KS_STANDARD));

    assertEquals(1, results.getResultList().size());
    assertEquals("KULANZ", results.get(0).get(REQUIRED_AUTH));
  }

  @Test
  @Deployment(resources = AUTH_DMN_RESOURCE)
  public void evaluateAuthKullanzVIP() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey(TASK_ERSTATTUNGSBETRAG_BERECHNEN);

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "").putValue(ERSTATTUNG, 0).putValue(KUNDENSTATUS, KS_VIP));

    assertEquals(1, results.getResultList().size());
    assertEquals("KULANZ", results.get(0).get(REQUIRED_AUTH));
  }


  @Test
  @Deployment(resources = AUTH_DMN_RESOURCE)
  public void evaluateAuthExkassoSVIP() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey(TASK_ZAHLUNG_FREIGEBEN);

    DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "").putValue(ERSTATTUNG, 0).putValue(KUNDENSTATUS, KS_VIP));

    assertEquals(1, results.getResultList().size());
    assertEquals("EXKASSO_S", results.get(0).get(REQUIRED_AUTH));

    results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "").putValue(ERSTATTUNG, 199).putValue(KUNDENSTATUS, KS_VIP));

    assertEquals(1, results.getResultList().size());
    assertEquals("EXKASSO_S", results.get(0).get(REQUIRED_AUTH));

    results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "").putValue(ERSTATTUNG, 500).putValue(KUNDENSTATUS, KS_VIP));

    assertEquals(1, results.getResultList().size());
    assertEquals("EXKASSO_S", results.get(0).get(REQUIRED_AUTH));

  }

  @Test
  @Deployment(resources = AUTH_DMN_RESOURCE)
  public void evaluateAuthExkassoSStandard() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey(TASK_ZAHLUNG_FREIGEBEN);

    DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "").putValue(ERSTATTUNG, 0).putValue(KUNDENSTATUS, KS_STANDARD));

    assertEquals(1, results.getResultList().size());
    assertEquals("EXKASSO_S", results.get(0).get(REQUIRED_AUTH));

    results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "").putValue(ERSTATTUNG, 78).putValue(KUNDENSTATUS, KS_STANDARD));

    assertEquals(1, results.getResultList().size());
    assertEquals("EXKASSO_S", results.get(0).get(REQUIRED_AUTH));

    results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "").putValue(ERSTATTUNG, 99).putValue(KUNDENSTATUS, KS_STANDARD));

    assertEquals(1, results.getResultList().size());
    assertEquals("EXKASSO_S", results.get(0).get(REQUIRED_AUTH));

  }

  @Test
  @Deployment(resources = AUTH_DMN_RESOURCE)
  public void evaluateAuthExkassoMStandard() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey(TASK_ZAHLUNG_FREIGEBEN);

    DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "").putValue(ERSTATTUNG, 100).putValue(KUNDENSTATUS, KS_STANDARD));

    assertEquals(1, results.getResultList().size());
    assertEquals("EXKASSO_M", results.get(0).get(REQUIRED_AUTH));

    results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "").putValue(ERSTATTUNG, 213).putValue(KUNDENSTATUS, KS_STANDARD));

    assertEquals(1, results.getResultList().size());
    assertEquals("EXKASSO_M", results.get(0).get(REQUIRED_AUTH));

    results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "").putValue(ERSTATTUNG, 500).putValue(KUNDENSTATUS, KS_STANDARD));

    assertEquals(1, results.getResultList().size());
    assertEquals("EXKASSO_M", results.get(0).get(REQUIRED_AUTH));

  }

  @Test
  @Deployment(resources = AUTH_DMN_RESOURCE)
  public void evaluateAuthExkassoL() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey(TASK_ZAHLUNG_FREIGEBEN);

    DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "").putValue(ERSTATTUNG, 501).putValue(KUNDENSTATUS, KS_STANDARD));

    assertEquals(1, results.getResultList().size());
    assertEquals("EXKASSO_L", results.get(0).get(REQUIRED_AUTH));
  }

}
