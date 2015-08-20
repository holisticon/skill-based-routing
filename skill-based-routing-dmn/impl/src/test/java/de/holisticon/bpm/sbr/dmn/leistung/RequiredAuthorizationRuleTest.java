package de.holisticon.bpm.sbr.dmn.leistung;

import java.util.HashMap;
import java.util.Map;

import org.camunda.bpm.dmn.engine.test.DecisionResource;
import org.camunda.bpm.dmn.engine.test.DmnEngineTestRule;
import org.junit.Rule;
import org.junit.Test;

import de.holisticon.bpm.sbr.dmn.api.TaskHolder;
import de.holisticon.bpm.sbr.dmn.leistung.VariableHolder;
import de.holisticon.bpm.sbr.dmn.leistung.VariableHolder.RequiredAuthorizations;
import static org.camunda.bpm.dmn.engine.test.asserts.DmnAssertions.assertThat;

/**
 * Tests for authorizations.I
 * 
 * @author Simon Zambrovski (Holisticon AG)
 */
public class RequiredAuthorizationRuleTest {

  private static final String VIP = "VIP";
  private static final String ERGOTHERAPIE = "Ergotherapie";
  private static final String BASIS_SCHUTZ = "Basis-Schutz";
  private static final String REQUIRED_AUTHORIZATION = "requiredAuthorizations";

  @Rule
  public DmnEngineTestRule rule = new DmnEngineTestRule();

  @DecisionResource(resource = "leistungsabrechnung.dmn", decisionKey = "requiredAuthorizations")
  @Test
  public void requiredAuthorization() {

    // setup
    VariableHolder variablesHolder = new VariableHolder();
    variablesHolder.setRechnungsart(ERGOTHERAPIE);
    variablesHolder.setProdukt(BASIS_SCHUTZ);
    variablesHolder.setKundenstatus(VIP);

    TaskHolder taskHolder = new TaskHolder();
    taskHolder.setTaskDefinitionKey(Tasks.task_erstattungsbetrag_berechnen.name());

    final Map<String, Object> context = new HashMap<String, Object>();
    context.put(VariableHolder.VARIABLES, variablesHolder);
    context.put(TaskHolder.TASK, taskHolder);

    assertThat(rule.getDmnEngine()).evaluates(rule.getDecision(), context).hasResult().hasSingleOutput()
        .hasSingleEntry(REQUIRED_AUTHORIZATION, RequiredAuthorizations.KULANZ.name());

  }

}
