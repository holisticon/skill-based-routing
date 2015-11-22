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

import com.google.common.collect.FluentIterable;
import com.google.common.collect.Lists;

import static org.junit.Assert.assertEquals;

/**
 * Tests for showcase routing table.
 *
 * @author Simon Zambrovski (Holisticon AG)
 *
 */
public class RoutingRuleTest {

  private static final String SKILL_DMN_RESOURCE = "showcase/leistungsabrechnung_candidateUsersRouting.dmn";
  private static final String DECISION_KEY = "leistungsabrechnung_candidateUsersRouting";
  private static final String CANDIDATE_USERS = "candidateUsers";
  private static final String REQUIRED_SKILLS = "requiredSkills";
  private static final String REQUIRED_AUTH = "requiredAuthorizations";

  @Rule
  public final ProcessEngineRule processEngineRule = FluentProcessEngineConfiguration.processEngineRule();

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateInterna() throws Exception {

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(
        DECISION_KEY,
        Variables.createVariables().putValue(REQUIRED_SKILLS, Lists.<String> newArrayList("Does not matter"))
            .putValue(REQUIRED_AUTH, Lists.<String> newArrayList("INTERNA")));

    assertEquals(1, FluentIterable.from(results).size());
    assertEquals("Ines", FluentIterable.from(results).first().get().get(CANDIDATE_USERS));
  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateInternaHeilM() throws Exception {

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(
        DECISION_KEY,
        Variables.createVariables().putValue(REQUIRED_SKILLS, Lists.<String> newArrayList("HeilM-RL"))
            .putValue(REQUIRED_AUTH, Lists.<String> newArrayList("INTERNA")));

    assertEquals(2, FluentIterable.from(results).size());
    assertEquals("Ines", FluentIterable.from(results).get(0).get(CANDIDATE_USERS));
    assertEquals("Herbert", FluentIterable.from(results).get(1).get(CANDIDATE_USERS));
  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateKulanzExkassoL() throws Exception {

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(
        DECISION_KEY,
        Variables.createVariables().putValue(REQUIRED_SKILLS, Lists.<String> newArrayList("Does not matter"))
            .putValue(REQUIRED_AUTH, Lists.<String> newArrayList("KULANZ", "EXKASSO_L")));

    assertEquals(1, FluentIterable.from(results).size());
    assertEquals("Herbert", FluentIterable.from(results).get(0).get(CANDIDATE_USERS));
  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateAerzteArzneiTarifAB() throws Exception {

    DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(
        DECISION_KEY,
        Variables.createVariables().putValue(REQUIRED_SKILLS, Lists.<String> newArrayList("GOÄ", "AMNOG", "TAR_AB"))
            .putValue(REQUIRED_AUTH, Lists.<String> newArrayList()));

    assertEquals(3, FluentIterable.from(results).size());
    assertEquals("Herbert", FluentIterable.from(results).get(0).get(CANDIDATE_USERS));
    assertEquals("Andreas", FluentIterable.from(results).get(1).get(CANDIDATE_USERS));
    assertEquals("Sonja", FluentIterable.from(results).get(2).get(CANDIDATE_USERS));

    results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(REQUIRED_SKILLS, Lists.<String> newArrayList("GOZ")).putValue(REQUIRED_AUTH, Lists.<String> newArrayList("Not permitted")));

    assertEquals(0, FluentIterable.from(results).size());

  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateAerzteArzneiExkassoMS() throws Exception {

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(
        DECISION_KEY,
        Variables.createVariables().putValue(REQUIRED_SKILLS, Lists.<String> newArrayList("GOÄ", "AMNOG"))
            .putValue(REQUIRED_AUTH, Lists.<String> newArrayList("EXKASSO_M")));

    assertEquals(1, FluentIterable.from(results).size());
    assertEquals("Emma", FluentIterable.from(results).get(0).get(CANDIDATE_USERS));
  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateZahnarztExkassoS() throws Exception {

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(
        DECISION_KEY,
        Variables.createVariables().putValue(REQUIRED_SKILLS, Lists.<String> newArrayList("GOZ"))
            .putValue(REQUIRED_AUTH, Lists.<String> newArrayList("EXKASSO_S")));

    assertEquals(1, FluentIterable.from(results).size());
    assertEquals("Sonja", FluentIterable.from(results).get(0).get(CANDIDATE_USERS));
  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateZahnarzt() throws Exception {

    DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(REQUIRED_SKILLS, Lists.<String> newArrayList("GOZ")).putValue(REQUIRED_AUTH, Lists.<String> newArrayList()));

    assertEquals(3, FluentIterable.from(results).size());
    assertEquals("Herbert", FluentIterable.from(results).get(0).get(CANDIDATE_USERS));
    assertEquals("Sonja", FluentIterable.from(results).get(1).get(CANDIDATE_USERS));
    assertEquals("Xaver", FluentIterable.from(results).get(2).get(CANDIDATE_USERS));

    results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(REQUIRED_SKILLS, Lists.<String> newArrayList("GOZ")).putValue(REQUIRED_AUTH, Lists.<String> newArrayList("Not permitted")));

    assertEquals(0, FluentIterable.from(results).size());

  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateHeilmittel() throws Exception {

    DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(REQUIRED_SKILLS, Lists.<String> newArrayList("HeilM-RL")).putValue(REQUIRED_AUTH, Lists.<String> newArrayList()));

    assertEquals(3, FluentIterable.from(results).size());
    assertEquals("Herbert", FluentIterable.from(results).get(0).get(CANDIDATE_USERS));
    assertEquals("Sonja", FluentIterable.from(results).get(1).get(CANDIDATE_USERS));
    assertEquals("Hanna", FluentIterable.from(results).get(2).get(CANDIDATE_USERS));

    results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
        Variables.createVariables().putValue(REQUIRED_SKILLS, Lists.<String> newArrayList("GOZ")).putValue(REQUIRED_AUTH, Lists.<String> newArrayList("Not permitted")));

    assertEquals(0, FluentIterable.from(results).size());

  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateOptiker() throws Exception {

    final DmnDecisionTableResult results = processEngineRule.getDecisionService()
        .evaluateDecisionTableByKey(
            DECISION_KEY,
            Variables.createVariables().putValue(REQUIRED_SKILLS, Lists.<String> newArrayList("SH"))
                .putValue(REQUIRED_AUTH, Lists.<String> newArrayList("KULANZ")));

    assertEquals(2, FluentIterable.from(results).size());
    assertEquals("Herbert", FluentIterable.from(results).get(0).get(CANDIDATE_USERS));
    assertEquals("Bernd", FluentIterable.from(results).get(1).get(CANDIDATE_USERS));
  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateTarifEZ() throws Exception {

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(
        DECISION_KEY,
        Variables.createVariables().putValue(REQUIRED_SKILLS, Lists.<String> newArrayList("TAR_EZ"))
            .putValue(REQUIRED_AUTH, Lists.<String> newArrayList("EXKASSO_M")));

    assertEquals(1, FluentIterable.from(results).size());
    assertEquals("Tom", FluentIterable.from(results).get(0).get(CANDIDATE_USERS));
  }

}
