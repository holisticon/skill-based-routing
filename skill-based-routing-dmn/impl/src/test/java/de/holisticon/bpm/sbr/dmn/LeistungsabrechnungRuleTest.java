package de.holisticon.bpm.sbr.dmn;

import java.util.HashMap;
import java.util.Map;

import de.holisticon.bpm.sbr.api.CustomerStatus;
import de.holisticon.bpm.sbr.dmn.test.assertions.DmnDecisionResultAssert;
import de.holisticon.bpm.sbr.dmn.test.rule.DecisionDeployment;
import de.holisticon.bpm.sbr.dmn.test.rule.DmnEngineTestRule;
import de.holisticon.bpm.sbr.dmn.test.rule.DmnEngineTestRuleBuilder;

import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;

import static de.holisticon.bpm.sbr.dmn.test.assertions.DmnEngineAssertions.decision;

/**
 * This class demonstrates the possible usage of DMN Engine API
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
@Ignore
public class LeistungsabrechnungRuleTest {

  @Rule
  public DmnEngineTestRule rule = new DmnEngineTestRuleBuilder(this).withAssertions().build();

  @Test
  @DecisionDeployment(resource = "leistungsabrechnung.dmn")
  public void bronzeCustomerService() {

    // setup
    final Map<String, String> task = new HashMap<String, String>();
    task.put("taskDefinitionKey", "task_erstattungsbetrag_berechnen");
    task.put("processDefinitionId", "foo");
    
    final Map<String, Object> variables = new HashMap<String, Object>();
    variables.put("rechnunsart", "Ergotherapie");
    
    
    DmnDecisionResultAssert evaluate = decision().evaluate("task", task, "variables", variables);
    
    // evaluate
    decision().evaluate("task", task, "variables", variables)
    // assert result count
        .hasSingleResult()
        // assert value match
        .hasValue("user");

  }

}
