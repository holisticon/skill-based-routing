package de.holisticon.bpm.sbr.plugin.showcase;

import de.holisticon.bpm.sbr.plugin.api.TaskHolder;
import de.holisticon.bpm.sbr.plugin.test.FluentProcessEngineConfiguration;
import org.camunda.bpm.dmn.engine.DmnDecisionTableResult;
import org.camunda.bpm.engine.test.Deployment;
import org.camunda.bpm.engine.test.ProcessEngineRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameter;
import org.junit.runners.Parameterized.Parameters;

import java.util.Arrays;
import java.util.List;

import static de.holisticon.bpm.sbr.plugin.test.DmnDecisionTableResultAssert.assertThat;
import static org.camunda.bpm.engine.variable.Variables.createVariables;

/**
 * Tests for showcase skill table.
 */
@RunWith(Parameterized.class)
public class SkillsRuleTest {

  static final String SKILL_DMN_RESOURCE = "showcase/leistungsabrechnung_requiredSkills.dmn";
  private static final String TASK_ERSTATTUNGSBETRAG_BERECHNEN = "task_erstattungsbetrag_berechnen";
  private static final String DECISION_KEY = "leistungsabrechnung_requiredSkills";
  private static final String PRODUKT = "produkt";
  private static final String RECHNUNGSART = "rechnungsart";
  private static final String REQUIRED_SKILLS = "requiredSkills";
  private static final String TASK_GEBUEHRENRECHTLICH_PRUEFEN = "task_gebuehrenrechtlich_pruefen";

  @Parameters(name = "{index} {0} {1} {2} expected={3}")
  public static List<Object[]> parameters() {
    return Arrays.asList(new Object[][]{
      {TASK_ERSTATTUNGSBETRAG_BERECHNEN, "Zahnarzt", "Premium Komplett", "TAR_AB,TAR_EZ"},
      {TASK_ERSTATTUNGSBETRAG_BERECHNEN, "Zahnarzt", "Basis-Schutz", "TAR_AB"},
      {TASK_ERSTATTUNGSBETRAG_BERECHNEN, "Zahnarzt", "Zahnzusatz", "TAR_EZ"},
      {TASK_ERSTATTUNGSBETRAG_BERECHNEN, "Zahnarzt", "Brille 2000", "TAR_ES"},
      {TASK_GEBUEHRENRECHTLICH_PRUEFEN, "Arzt", "Egal", "GOÄ"},
      {TASK_GEBUEHRENRECHTLICH_PRUEFEN, "Zahnarzt", "Egal", "GOZ"},
      {TASK_GEBUEHRENRECHTLICH_PRUEFEN, "Augenarzt", "Egal", "GOÄ"},
      {TASK_GEBUEHRENRECHTLICH_PRUEFEN, "Optiker", "Egal", "SH"},
      {TASK_GEBUEHRENRECHTLICH_PRUEFEN, "Arzneimittel", "Egal", "AMNOG"},
      {TASK_GEBUEHRENRECHTLICH_PRUEFEN, "Physiotherapie", "Egal", "HeilM-RL"},
      {TASK_GEBUEHRENRECHTLICH_PRUEFEN, "Ergotherapie", "Egal", "HeilM-RL"},
    });
  }

  @Rule
  public final ProcessEngineRule processEngineRule = FluentProcessEngineConfiguration.processEngineRule();

  @Parameter(0)
  public String taskDefinitionKey;
  @Parameter(1)
  public String rechnungsart;
  @Parameter(2)
  public String produkt;
  @Parameter(3)
  public String expected;


  @Test
  @Deployment(resources = SkillsRuleTest.SKILL_DMN_RESOURCE)
  public void evaluateRequiredSkills() throws Exception {
    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey(taskDefinitionKey);

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
      createVariables() //
        .putValue(TaskHolder.TASK, task) //
        .putValue(RECHNUNGSART, rechnungsart) //
        .putValue(PRODUKT, produkt));

    assertThat(results, REQUIRED_SKILLS).containsOnly(expected.split(","));
  }

}
