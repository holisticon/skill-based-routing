package de.holisticon.bpm.sbr.plugin.showcase;

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

import com.google.common.collect.FluentIterable;

import de.holisticon.bpm.sbr.plugin.api.TaskHolder;

import static org.junit.Assert.assertEquals;

/**
 * Tests for showcase skill table.
 * @author Simon Zambrovski (Holisticon AG)
 *
 */
public class SkillsRuleTests {

  private static final String SKILL_DMN_RESOURCE = "showcase/leistungsabrechnung_requiredSkills.dmn";
  private static final String TASK_ERSTATTUNGSBETRAG_BERECHNEN = "task_erstattungsbetrag_berechnen";
  private static final String DECISION_KEY = "leistungsabrechnung_requiredSkills";
  private static final String PRODUKT = "produkt";
  private static final String ZAHNARZT = "Zahnarzt";
  private static final String RECHNUNGSART = "rechnungsart";
  private static final String REQUIRED_SKILLS = "requiredSkills";

  private final ProcessEngineConfigurationImpl configuration = new StandaloneInMemProcessEngineConfiguration() {
    {
      databaseSchemaUpdate = DB_SCHEMA_UPDATE_DROP_CREATE;
      expressionManager = new MockExpressionManager();
      jobExecutorActivate = false;
      historyLevel = HistoryLevel.HISTORY_LEVEL_FULL;
    }
  };

  @Rule
  public final ProcessEngineRule processEngineRule = new ProcessEngineRule(configuration.buildProcessEngine());

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateSkillsPremium() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey(TASK_ERSTATTUNGSBETRAG_BERECHNEN);

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, ZAHNARZT).putValue(PRODUKT, "Premium Komplett"));

    assertEquals(2, results.getResultList().size());
    assertEquals("TAR_AB", results.get(0).get(REQUIRED_SKILLS));
    assertEquals("TAR_EZ", results.get(1).get(REQUIRED_SKILLS));
  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateSkillsBasis() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey(TASK_ERSTATTUNGSBETRAG_BERECHNEN);

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, ZAHNARZT).putValue(PRODUKT, "Basis-Schutz"));
    assertEquals(1, FluentIterable.from(results).size());
    assertEquals("TAR_AB", FluentIterable.from(results).first().get().get(REQUIRED_SKILLS));
  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateSkillsZahn() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey(TASK_ERSTATTUNGSBETRAG_BERECHNEN);

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, ZAHNARZT).putValue(PRODUKT, "Zahnzusatz"));
    assertEquals(1, FluentIterable.from(results).size());
    assertEquals("TAR_EZ", FluentIterable.from(results).first().get().get(REQUIRED_SKILLS));
  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateSkillsBrille() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey(TASK_ERSTATTUNGSBETRAG_BERECHNEN);

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, ZAHNARZT).putValue(PRODUKT, "Brille 2000"));
    assertEquals(1, FluentIterable.from(results).size());
    assertEquals("TAR_ES", FluentIterable.from(results).first().get().get(REQUIRED_SKILLS));
  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateSkillsArzt() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey("task_gebuehrenrechtlich_pruefen");

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "Arzt").putValue(PRODUKT, "Egal"));
    assertEquals(1, FluentIterable.from(results).size());
    assertEquals("GOÄ", FluentIterable.from(results).first().get().get(REQUIRED_SKILLS));
  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateSkillsZahnarzt() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey("task_gebuehrenrechtlich_pruefen");

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "Zahnarzt").putValue(PRODUKT, "Egal"));
    assertEquals(1, FluentIterable.from(results).size());
    assertEquals("GOZ", FluentIterable.from(results).first().get().get(REQUIRED_SKILLS));
  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateSkillsAugenarzt() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey("task_gebuehrenrechtlich_pruefen");

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "Augenarzt").putValue(PRODUKT, "Egal"));
    assertEquals(1, FluentIterable.from(results).size());
    assertEquals("GOÄ", FluentIterable.from(results).first().get().get(REQUIRED_SKILLS));
  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateSkillsOptiker() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey("task_gebuehrenrechtlich_pruefen");

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "Optiker").putValue(PRODUKT, "Egal"));
    assertEquals(1, FluentIterable.from(results).size());
    assertEquals("SH", FluentIterable.from(results).first().get().get(REQUIRED_SKILLS));
  }


  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateSkillsArznei() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey("task_gebuehrenrechtlich_pruefen");

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "Arzneimittel").putValue(PRODUKT, "Egal"));
    assertEquals(1, FluentIterable.from(results).size());
    assertEquals("AMNOG", FluentIterable.from(results).first().get().get(REQUIRED_SKILLS));
  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateSkillsPhysio() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey("task_gebuehrenrechtlich_pruefen");

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "Physiotherapie").putValue(PRODUKT, "Egal"));
    assertEquals(1, FluentIterable.from(results).size());
    assertEquals("HeilM-RL", FluentIterable.from(results).first().get().get(REQUIRED_SKILLS));
  }
  
  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateSkillsErgo() throws Exception {

    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey("task_gebuehrenrechtlich_pruefen");

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(TaskHolder.TASK, task).putValue(RECHNUNGSART, "Ergotherapie").putValue(PRODUKT, "Egal"));
    assertEquals(1, FluentIterable.from(results).size());
    assertEquals("HeilM-RL", FluentIterable.from(results).first().get().get(REQUIRED_SKILLS));
  }

}
