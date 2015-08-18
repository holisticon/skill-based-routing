package de.holisticon.bpm.sbr.dmn;

import java.util.HashMap;
import java.util.Map;

import org.camunda.bpm.dmn.engine.DmnDecisionResult;
import org.camunda.bpm.dmn.engine.test.DecisionResource;
import org.camunda.bpm.dmn.engine.test.DmnEngineTestRule;
import org.junit.Rule;
import org.junit.Test;

import com.google.common.collect.Sets;

import de.holisticon.bpm.sbr.dmn.api.VariableHolder;
import de.holisticon.bpm.sbr.dmn.api.VariableHolder.RequiredAuthorizations;
import de.holisticon.bpm.sbr.dmn.api.VariableHolder.RequiredSkills;
import static org.camunda.bpm.dmn.engine.test.asserts.DmnAssertions.assertThat;

import static org.junit.Assert.assertEquals;

/**
 * This class demonstrates the possible usage of DMN Engine API
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
public class RoutingRuleTest {

  private static final Object BERND = "Bernd";
  private static final Object HERBERT = "Herbert";
  private static final String CANDIDATE_USER = "candidateUser";
  @Rule
  public DmnEngineTestRule rule = new DmnEngineTestRule();

  @Test
  @DecisionResource(resource = "leistungsabrechnung.dmn", decisionKey = "candidateUsers")
  public void candidateUser() {

    rule.getLogger().info("Running candidateUsers test.");
    // setup
    final VariableHolder variablesHolder = new VariableHolder();
    variablesHolder.setRequiredAuthorizations(Sets.newHashSet(RequiredAuthorizations.KULANZ.name()));
    variablesHolder.setRequiredSkills(Sets.newHashSet(RequiredSkills.SH.name(), RequiredSkills.TAR_ES.name()));

    // do
    final Map<String, Object> context = new HashMap<String, Object>();
    context.put(VariableHolder.VARIABLES, variablesHolder);

    final DmnDecisionResult result = rule.getDmnEngine().evaluate(rule.getDecision(), context);

    // check
    rule.prettyPrint(result);

    assertThat(rule.getDmnEngine()).evaluates(rule.getDecision(), context).hasResult().hasSize(2);
    assertEquals(HERBERT, result.get(0).getValue(CANDIDATE_USER));
    assertEquals(BERND, result.get(1).getValue(CANDIDATE_USER));
  }

}
