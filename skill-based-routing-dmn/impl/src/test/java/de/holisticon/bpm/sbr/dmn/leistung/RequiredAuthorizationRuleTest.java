package de.holisticon.bpm.sbr.dmn.leistung;

import java.util.HashMap;
import java.util.Map;

import org.camunda.bpm.dmn.engine.test.DecisionResource;
import org.camunda.bpm.dmn.engine.test.DmnEngineTestRule;
import org.junit.Rule;
import org.junit.Test;

import de.holisticon.bpm.sbr.dmn.SkillBasedRoutingServiceBean;
import de.holisticon.bpm.sbr.dmn.api.SkillBasedRoutingService;
import de.holisticon.bpm.sbr.dmn.api.TaskHolder;
import de.holisticon.bpm.sbr.dmn.leistung.Variables.RequiredAuthorizations;
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

  @Rule
  public DmnEngineTestRule rule = new DmnEngineTestRule();

  @DecisionResource(resource = "leistungsabrechnung.dmn", decisionKey = SkillBasedRoutingService.DECISION_REQUIRED_AUTHORIZATIONS)
  @Test
  public void requiredAuthorization() {

    // setup
    Map<String, Object> variables = new HashMap<String, Object>();
    variables.put(Variables.RECHNUNSART, ERGOTHERAPIE);
    variables.put(Variables.PRODUKT, BASIS_SCHUTZ);
    variables.put(Variables.KUNDENSTATUS, VIP);
    variables.put(Variables.ERSTATTUNG_GESAMT, 100);

    TaskHolder taskHolder = new TaskHolder();
    taskHolder.setTaskDefinitionKey(Tasks.task_erstattungsbetrag_berechnen.name());

    final Map<String, Object> context = new HashMap<String, Object>();
    SkillBasedRoutingServiceBean.prepareEvaluationProcessContext(context, taskHolder, variables);

    assertThat(rule.getDmnEngine()).evaluates(rule.getDecision(), context).hasResult().hasSingleOutput()
        .hasSingleEntry(SkillBasedRoutingService.OUTPUT_REQUIRED_AUTHORIZATIONS, RequiredAuthorizations.KULANZ.name());

  }

}
