package de.holisticon.bpm.sbr.dmn.leistung;

import java.util.HashMap;
import java.util.Map;

import org.camunda.bpm.dmn.engine.test.DecisionResource;
import org.camunda.bpm.dmn.engine.test.DmnEngineTestRule;
import org.junit.Rule;
import org.junit.Test;

import de.holisticon.bpm.sbr.dmn.api.TaskHolder;
import de.holisticon.bpm.sbr.dmn.leistung.VariableHolder;
import de.holisticon.bpm.sbr.dmn.leistung.VariableHolder.RequiredSkills;
import static org.camunda.bpm.dmn.engine.test.asserts.DmnAssertions.assertThat;

/**
 * This class demonstrates the possible usage of DMN Engine API
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
public class RequiredSkillRuleTest {

  private static final String ERGOTHERAPIE = "Ergotherapie";
  private static final String BASIS_SCHUTZ = "Basis-Schutz";
  private static final String REQUIRED_SKILL = "requiredSkills";

  @Rule
  public DmnEngineTestRule rule = new DmnEngineTestRule();

  @Test
  @DecisionResource(resource = "leistungsabrechnung.dmn", decisionKey = "requiredSkills")
  public void requiredSkill() {

    // setup
    VariableHolder variablesHolder = new VariableHolder();
    variablesHolder.setRechnungsart(ERGOTHERAPIE);
    variablesHolder.setProdukt(BASIS_SCHUTZ);
    TaskHolder taskHolder = new TaskHolder();
    taskHolder.setTaskDefinitionKey(Tasks.task_erstattungsbetrag_berechnen.name());

    final Map<String, Object> context = new HashMap<String, Object>();
    context.put(VariableHolder.VARIABLES, variablesHolder);
    context.put(TaskHolder.TASK, taskHolder);

    assertThat(rule.getDmnEngine()).evaluates(rule.getDecision(), context).hasResult().hasSingleOutput()
        .hasSingleEntry(REQUIRED_SKILL, RequiredSkills.TAR_AB.name());
  }

}
