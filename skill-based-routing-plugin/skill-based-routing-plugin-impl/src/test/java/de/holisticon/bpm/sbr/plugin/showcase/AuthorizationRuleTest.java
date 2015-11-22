package de.holisticon.bpm.sbr.plugin.showcase;

import com.google.common.base.Splitter;
import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import de.holisticon.bpm.sbr.plugin.api.TaskHolder;
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
public class AuthorizationRuleTest {

  private static final String TASK_ERSTATTUNGSBETRAG_BERECHNEN = "task_erstattungsbetrag_berechnen";
  private static final String TASK_ZAHLUNG_FREIGEBEN = "task_zahlung_freigeben";
  private static final String TASK_GEBUEHRENRECHTLICH_PRUEFEN = "task_gebuehrenrechtlich_pruefen";
  private static final String KS_VIP = "VIP";
  private static final String KS_STANDARD = "Standard";
  private static final String AUTH_DMN_RESOURCE = "showcase/leistungsabrechnung_requiredAuthorizations.dmn";

  private static final String DECISION_KEY = "leistungsabrechnung_requiredAuthorizations";
  private static final String KUNDENSTATUS = "kundenstatus";
  private static final String ERSTATTUNG = "erstattungGesamt";
  private static final String RECHNUNGSART = "rechnungsart";
  private static final String REQUIRED_AUTH = "requiredAuthorizations";

  @Parameterized.Parameters(name = "{index} {0}:{1}:{2}:{3} expected={4}")
  public static List<Object[]> parameters() {
    return Arrays.asList(new Object[][]{
      {TASK_GEBUEHRENRECHTLICH_PRUEFEN, "", 0, "Mitarbeiter", "INTERNA"},
      {TASK_GEBUEHRENRECHTLICH_PRUEFEN, "Sonstiges", 0, KS_STANDARD, "KULANZ"},
      {TASK_ERSTATTUNGSBETRAG_BERECHNEN, "", 0, KS_VIP, "KULANZ"},
      {TASK_ZAHLUNG_FREIGEBEN, "", 0, KS_VIP, "EXKASSO_S"},
      {TASK_ZAHLUNG_FREIGEBEN, "", 199, KS_VIP, "EXKASSO_S"},
      {TASK_ZAHLUNG_FREIGEBEN, "", 500, KS_VIP, "EXKASSO_S"},
      {TASK_ZAHLUNG_FREIGEBEN, "", 0, KS_STANDARD, "EXKASSO_S"},
      {TASK_ZAHLUNG_FREIGEBEN, "", 78, KS_STANDARD, "EXKASSO_S"},
      {TASK_ZAHLUNG_FREIGEBEN, "", 99, KS_STANDARD, "EXKASSO_S"},
      {TASK_ZAHLUNG_FREIGEBEN, "", 100, KS_STANDARD, "EXKASSO_M"},
      {TASK_ZAHLUNG_FREIGEBEN, "", 213, KS_STANDARD, "EXKASSO_M"},
      {TASK_ZAHLUNG_FREIGEBEN, "", 500, KS_STANDARD, "EXKASSO_M"},
      {TASK_ZAHLUNG_FREIGEBEN, "", 501, KS_STANDARD, "EXKASSO_L"},
    });
  }

  @Rule
  public final ProcessEngineRule processEngineRule = FluentProcessEngineConfiguration.processEngineRule();

  @Parameterized.Parameter(0)
  public String taskDefinitionKey;
  @Parameterized.Parameter(1)
  public String rechnungsart;
  @Parameterized.Parameter(2)
  public Integer erstattung;
  @Parameterized.Parameter(3)
  public String kundenstatus;
  @Parameterized.Parameter(4)
  public String expected;

  private List<String> split(String input) {
    return Lists.newArrayList(Splitter.on(",").omitEmptyStrings().trimResults().split(Strings.nullToEmpty(input)));
  }


  @Test
  @Deployment(resources = AUTH_DMN_RESOURCE)
  public void evaluateAuthMitarbeiterPremium() throws Exception {
    final TaskHolder task = new TaskHolder();
    task.setTaskDefinitionKey(taskDefinitionKey);

    final DmnDecisionTableResult results = processEngineRule.getDecisionService().evaluateDecisionTableByKey(DECISION_KEY,
      createVariables() //
        .putValue(TaskHolder.TASK, task) //
        .putValue(RECHNUNGSART, rechnungsart) //
        .putValue(ERSTATTUNG, erstattung) //
        .putValue(KUNDENSTATUS, kundenstatus));

    assertThat(results, REQUIRED_AUTH).containsOnly(expected.split(","));
  }

}
