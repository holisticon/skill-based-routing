package de.holisticon.bpm.sbr.dmn.leistung;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.camunda.bpm.dmn.engine.DmnDecisionResult;
import org.camunda.bpm.dmn.engine.test.DecisionResource;
import org.camunda.bpm.dmn.engine.test.DmnEngineTestRule;
import org.junit.Rule;
import org.junit.Test;

import com.google.common.collect.Lists;

import de.holisticon.bpm.sbr.dmn.SkillBasedRoutingServiceBean;
import de.holisticon.bpm.sbr.dmn.api.SkillBasedRoutingService;
import de.holisticon.bpm.sbr.dmn.leistung.Variables.RequiredAuthorizations;
import de.holisticon.bpm.sbr.dmn.leistung.Variables.RequiredSkills;
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

  @Rule
  public DmnEngineTestRule rule = new DmnEngineTestRule();

  @Test
  @DecisionResource(resource = "leistungsabrechnung.dmn", decisionKey = SkillBasedRoutingService.DECISION_CANDIDATE_USERS_ROUTING)
  public void candidateUser() {

    rule.getLogger().info("Running candidateUsers test.");

    // setup
    final Map<String, Object> context = new HashMap<String, Object>();
    SkillBasedRoutingServiceBean.prepareEvaluationRoutingContext(context, Lists.newArrayList(RequiredSkills.SH.name(), RequiredSkills.TAR_ES.name()),
        Lists.newArrayList(RequiredAuthorizations.KULANZ.name()));

    // do
    final DmnDecisionResult result = rule.getDmnEngine().evaluate(rule.getDecision(), context);

    // check
    rule.prettyPrint(result);

    assertThat(rule.getDmnEngine()).evaluates(rule.getDecision(), context).hasResult().hasSize(2);
    assertEquals(HERBERT, result.get(0).getValue(SkillBasedRoutingService.OUTPUT_CANDIDATE_USERS));
    assertEquals(BERND, result.get(1).getValue(SkillBasedRoutingService.OUTPUT_CANDIDATE_USERS));
  }

  @Test
  @DecisionResource(resource = "leistungsabrechnung.dmn", decisionKey = SkillBasedRoutingService.DECISION_CANDIDATE_USERS_ROUTING)
  public void candidateUserNoRequired() {

    rule.getLogger().info("Running candidateUsers test.");

    // setup
    final Map<String, Object> context = new HashMap<String, Object>();
    SkillBasedRoutingServiceBean.prepareEvaluationRoutingContext(context, new ArrayList<String>(), new ArrayList<String>());

    // do
    final DmnDecisionResult result = rule.getDmnEngine().evaluate(rule.getDecision(), context);

    // check
    rule.prettyPrint(result);

    assertThat(rule.getDmnEngine()).evaluates(rule.getDecision(), context).hasResult();
  }

}
