package de.holisticon.bpm.sbr.dmn.leistung;

import java.util.HashMap;
import java.util.Map;

import org.camunda.bpm.dmn.engine.DmnDecisionResult;
import org.camunda.bpm.dmn.engine.test.DecisionResource;
import org.camunda.bpm.dmn.engine.test.DmnEngineTestRule;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;

import de.holisticon.bpm.sbr.dmn.leistung.VariableHolder.RequiredSkills;
import static org.camunda.bpm.dmn.engine.test.asserts.DmnAssertions.assertThat;

/**
 * This class demonstrates the possible usage of DMN Engine API
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
public class RequiredCandidateUserMapRuleTest {

  private static final String RECHNUNSART = "rechnunsart";
  private static final String TASK_DEFINITION_KEY = "taskDefinitionKey";

  private static final String ERGOTHERAPIE = "Ergotherapie";
  private static final String BASIS_SCHUTZ = "Basis-Schutz";
  private static final String CANDIDATE_USERS = "candidateUsers";

  @Rule
  public DmnEngineTestRule rule = new DmnEngineTestRule();

  @Ignore // Ignoring the map test
  @Test
  @DecisionResource(resource = "leistungsabrechnung-map.dmn", decisionKey = "candidateUsers")
  public void candidateUsersMap() {

    // setup
    final Map<String, String> task = new HashMap<String, String>();
    task.put(TASK_DEFINITION_KEY, Tasks.task_erstattungsbetrag_berechnen.name());

    final Map<String, Object> variables = new HashMap<String, Object>();
    variables.put(RECHNUNSART, ERGOTHERAPIE);

    final Map<String, Object> context = new HashMap<String, Object>();
    context.put("variables", variables);
    context.put("task", task);

    rule.prettyPrint(context);
    DmnDecisionResult evaluate = rule.getDmnEngine().evaluate(rule.getDecision(), context);
    rule.prettyPrint(evaluate);
    
    
    assertThat(rule.getDmnEngine()).evaluates(rule.getDecision(), context).hasResult().hasSingleOutput()
        .hasEntry(CANDIDATE_USERS, "Tom");

  }

}
