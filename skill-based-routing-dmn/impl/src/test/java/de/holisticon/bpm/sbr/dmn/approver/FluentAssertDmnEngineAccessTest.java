package de.holisticon.bpm.sbr.dmn.approver;

import java.util.HashMap;
import java.util.Map;

import javax.script.ScriptEngine;

import org.camunda.bpm.dmn.engine.test.DecisionResource;
import org.camunda.bpm.dmn.engine.test.DmnEngineTestRule;
import org.junit.Rule;
import org.junit.Test;

import static org.junit.Assert.assertTrue;

import de.holisticon.bpm.sbr.api.CustomerStatus;
import de.holisticon.bpm.sbr.dmn.ApprovalSheet;
import static org.camunda.bpm.dmn.engine.test.asserts.DmnAssertions.assertThat;

/**
 * This class demonstrates the possible usage of DMN Engine API
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
public class FluentAssertDmnEngineAccessTest {

  @Rule
  public DmnEngineTestRule rule = new DmnEngineTestRule();

  /**
   * these engine are there by default -> can be used in DMN.
   */
  @Test()
  public void checkEngines() {
    final ScriptEngine juelEngine = rule.getDmnEngine().getConfiguration().getScriptEngineResolver().getScriptEngineForLanguage("juel");
    final ScriptEngine groovyEngine = rule.getDmnEngine().getConfiguration().getScriptEngineResolver().getScriptEngineForLanguage("groovy");
    final ScriptEngine javascriptEngine = rule.getDmnEngine().getConfiguration().getScriptEngineResolver().getScriptEngineForLanguage("javascript");
    assertTrue(juelEngine != null);
    assertTrue(groovyEngine != null);
    assertTrue(javascriptEngine != null);
  }

  
  @Test
  @DecisionResource(resource = "findApprover.dmn", decisionKey = "FindApprover")
  public void bronzeCustomerService() {

    // setup
    final ApprovalSheet approvalSheet = new ApprovalSheet("4711", 5000d, CustomerStatus.BRONZE);
    Map<String, Object> context = new HashMap<String, Object>();
    context.put("sheet", approvalSheet);

    assertThat(rule.getDmnEngine()).evaluates(rule.getDecision(), context).hasResult().hasSingleOutput().hasSingleEntry("group", "customerService");
  }
}
