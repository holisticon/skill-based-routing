package de.holisticon.bpm.sbr.dmn;

import java.util.HashMap;
import java.util.Map;

import org.camunda.bpm.dmn.engine.test.DecisionResource;
import org.camunda.bpm.dmn.engine.test.DmnEngineTestRule;


import static org.camunda.bpm.dmn.engine.test.asserts.DmnAssertions.assertThat;

import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;

/**
 * This class demonstrates the possible usage of DMN Engine API
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
@Ignore
public class LeistungsabrechnungRuleTest {

  private static final String CANDIDATE_USER = "candidateUser";
  private static final String TOM = "Tom";
  private static final String RECHNUNSART = "rechnunsart";
  private static final String TASK_DEFINITION_KEY = "taskDefinitionKey";
  private static final String TASK = "task";
  private static final String VARIABLES = "variables";
  private static final String ERGOTHERAPIE = "Ergotherapie";
  private static final String TASK_ERSTATTUNGSBETRAG_BERECHNEN = "task_erstattungsbetrag_berechnen";
  @Rule
  public DmnEngineTestRule rule = new DmnEngineTestRule();

  @Test
  @DecisionResource(resource = "leistungsabrechnung.dmn")
  public void simpleUSerAssignemntObject() {

    // setup
    VariableHodler variablesHolder = new VariableHodler();
    variablesHolder.setRechnungsart(ERGOTHERAPIE);
    TaskHolder taskHolder = new TaskHolder();
    taskHolder.setTaskDefinitionKey(TASK_ERSTATTUNGSBETRAG_BERECHNEN);

    final Map<String, Object> context = new HashMap<String, Object>();
    context.put(VARIABLES, variablesHolder);
    context.put(TASK, taskHolder);

    assertThat(rule.getDmnEngine()).evaluates(rule.getDecision(), context).hasResult().hasSingleOutput().hasEntry(CANDIDATE_USER, TOM);

  }

  @Ignore
  @Test
  @DecisionResource(resource = "leistungsabrechnung-map.dmn")
  public void simpleUSerAssignemntMap() {

    // setup
    final Map<String, String> task = new HashMap<String, String>();
    task.put(TASK_DEFINITION_KEY, TASK_ERSTATTUNGSBETRAG_BERECHNEN);

    final Map<String, Object> variables = new HashMap<String, Object>();
    variables.put(RECHNUNSART, ERGOTHERAPIE);

    final Map<String, Object> context = new HashMap<String, Object>();
    context.put(VARIABLES, variables);
    context.put(TASK, task);

    assertThat(rule.getDmnEngine()).evaluates(rule.getDecision(), context).hasResult().hasSingleOutput().hasEntry(CANDIDATE_USER, TOM);

  }

  public final static class VariableHodler {
    String rechnungsart;

    public String getRechnungsart() {
      return rechnungsart;
    }

    public void setRechnungsart(String rechnunsart) {
      this.rechnungsart = rechnunsart;
    }
  }

  public final static class TaskHolder {
    String taskDefinitionKey;

    public String getTaskDefinitionKey() {
      return taskDefinitionKey;
    }

    public void setTaskDefinitionKey(String taskDefinitionKey) {
      this.taskDefinitionKey = taskDefinitionKey;
    }
  }

}
