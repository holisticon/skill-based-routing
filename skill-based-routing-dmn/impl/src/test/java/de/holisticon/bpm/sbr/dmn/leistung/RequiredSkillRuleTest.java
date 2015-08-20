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
import de.holisticon.bpm.sbr.dmn.leistung.Variables.RequiredSkills;
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

  @Rule
  public DmnEngineTestRule rule = new DmnEngineTestRule();

  @Test
  @DecisionResource(resource = "leistungsabrechnung.dmn", decisionKey = SkillBasedRoutingService.DECISION_REQUIRED_SKILLS)
  public void requiredSkill() {

    // setup
    final Map<String, Object> variables = new HashMap<String, Object>();
    variables.put(Variables.RECHNUNSART, ERGOTHERAPIE);
    variables.put(Variables.PRODUKT, BASIS_SCHUTZ);
    final TaskHolder taskHolder = new TaskHolder();
    taskHolder.setTaskDefinitionKey(Tasks.task_erstattungsbetrag_berechnen.name());

    // prepare context
    final Map<String, Object> context = new HashMap<String, Object>();
    SkillBasedRoutingServiceBean.prepareEvaluationProcessContext(context, taskHolder, variables);
    
    assertThat(rule.getDmnEngine()).evaluates(rule.getDecision(), context).hasResult().hasSingleOutput()
        .hasSingleEntry(SkillBasedRoutingService.OUTPUT_REQUIRED_SKILLS, RequiredSkills.TAR_AB.name());
  }

}
