package de.holisticon.bpm.sbr.plugin.showcase;

import com.google.common.base.Splitter;
import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import de.holisticon.bpm.sbr.plugin.test.DmnDecisionTableResultAssert;
import de.holisticon.bpm.sbr.plugin.test.FluentProcessEngineConfiguration;
import org.camunda.bpm.dmn.engine.DmnDecisionTableResult;
import org.camunda.bpm.engine.test.Deployment;
import org.camunda.bpm.engine.test.ProcessEngineRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import java.util.Arrays;
import java.util.List;

import static de.holisticon.bpm.sbr.plugin.test.DmnDecisionTableResultAssert.assertThat;
import static org.camunda.bpm.engine.variable.Variables.createVariables;

@RunWith(Parameterized.class)
public class RoutingRuleTest {

  private static final String SKILL_DMN_RESOURCE = "showcase/leistungsabrechnung_candidateUsersRouting.dmn";
  private static final String DECISION_KEY = "leistungsabrechnung_candidateUsersRouting";
  private static final String CANDIDATE_USERS = "candidateUsers";
  private static final String REQUIRED_SKILLS = "requiredSkills";
  private static final String REQUIRED_AUTH = "requiredAuthorizations";

  @Parameterized.Parameters(name = "{index} skills={0} auth={1} expected={2}")
  public static List<Object[]> parameters() {
    return Arrays.asList(new Object[][]{
      {"Does not matter", "INTERNA", "Ines"},
      {"HeilM-RL", "INTERNA", "Ines,Herbert"},
      {"Does not matter", "KULANZ,EXKASSO_L", "Herbert"},
      {"GOÄ,AMNOG,TAR_AB", null, "Herbert,Andreas,Sonja"},
      {"GOZ", "Not permitted", null},
      {"GOÄ,AMNOG", "EXKASSO_M", "Emma"},
      {"GOZ", "EXKASSO_S", "Sonja"},
      {"GOZ", null, "Herbert,Sonja,Xaver"},
      {"GOZ", "Not permitted", null},
      {"HeilM-RL", null, "Herbert,Sonja,Hanna"},
      {"GOZ", "Not permitted", null},
      {"SH", "KULANZ", "Herbert,Bernd"},
      {"TAR_EZ", "EXKASSO_M", "Tom"},
    });
  }

  @Rule
  public final ProcessEngineRule processEngineRule = FluentProcessEngineConfiguration.processEngineRule();

  @Parameterized.Parameter(0)
  public String requiredSkills;
  @Parameterized.Parameter(1)
  public String requiredAuth;
  @Parameterized.Parameter(2)
  public String expected;

  private List<String> split(String input) {
    return Lists.newArrayList(Splitter.on(",").omitEmptyStrings().trimResults().split(Strings.nullToEmpty(input)));
  }

  @Test
  @Deployment(resources = SKILL_DMN_RESOURCE)
  public void evaluateCandidateUsers() throws Exception {

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(
      DECISION_KEY,
      createVariables() //
        .putValue(REQUIRED_SKILLS, split(requiredSkills)) //
        .putValue(REQUIRED_AUTH, split(requiredAuth)));

    if (expected != null ) {
      assertThat(results, CANDIDATE_USERS).containsOnly(expected.split(","));
    } else {
      assertThat(results, CANDIDATE_USERS).isEmpty();
    }
  }


}
