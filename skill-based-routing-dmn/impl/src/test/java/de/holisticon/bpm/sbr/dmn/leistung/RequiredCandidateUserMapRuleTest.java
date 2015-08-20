package de.holisticon.bpm.sbr.dmn.leistung;

import java.util.HashMap;
import java.util.Map;

import org.camunda.bpm.dmn.engine.DmnDecisionResult;
import org.camunda.bpm.dmn.engine.test.DecisionResource;
import org.camunda.bpm.dmn.engine.test.DmnEngineTestRule;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;

import de.holisticon.bpm.sbr.dmn.api.SkillBasedRoutingService;
import de.holisticon.bpm.sbr.dmn.api.TaskHolder;
import static org.camunda.bpm.dmn.engine.test.asserts.DmnAssertions.assertThat;

/**
 * This class demonstrates the possible usage of DMN Engine API by revaluating
 * MAPS
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
public class RequiredCandidateUserMapRuleTest {

  private static final String ERGOTHERAPIE = "Ergotherapie";
  private static final String BASIS_SCHUTZ = "Basis-Schutz";

  @Rule
  public DmnEngineTestRule rule = new DmnEngineTestRule();

  @Ignore
  // Ignoring the map test
  @Test
  @DecisionResource(resource = "leistungsabrechnung-map.dmn", decisionKey = "candidateUsers")
  public void candidateUsersMap() {

    // setup
    TaskHolder taskHolder = new TaskHolder();
    taskHolder.setTaskDefinitionKey(Tasks.task_erstattungsbetrag_berechnen.name());

    final Map<String, Object> variables = new HashMap<String, Object>();
    variables.put(Variables.RECHNUNSART, ERGOTHERAPIE);

    final Map<String, Object> context = new HashMap<String, Object>();
    context.put("variables", variables);
    context.put("task", taskHolder);

    rule.prettyPrint(context);
    DmnDecisionResult evaluate = rule.getDmnEngine().evaluate(rule.getDecision(), context);
    rule.prettyPrint(evaluate);

    assertThat(rule.getDmnEngine()).evaluates(rule.getDecision(), context).hasResult().hasSingleOutput()
        .hasEntry(SkillBasedRoutingService.OUTPUT_CANDIDATE_USERS, "Tom");

  }

}
