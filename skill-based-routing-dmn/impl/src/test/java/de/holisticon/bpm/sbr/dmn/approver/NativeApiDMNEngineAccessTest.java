package de.holisticon.bpm.sbr.dmn.approver;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnDecisionOutput;
import org.camunda.bpm.dmn.engine.DmnDecisionResult;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.camunda.bpm.dmn.engine.impl.DmnEngineConfigurationImpl;
import org.camunda.bpm.engine.delegate.DelegateTask;
import org.junit.Before;
import org.junit.Test;

import de.holisticon.bpm.sbr.api.CustomerStatus;
import de.holisticon.bpm.sbr.dmn.ApprovalSheet;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Tests the evaluation of two separate decisions from the same file.
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
public class NativeApiDMNEngineAccessTest {

  private DmnEngine dmnEngine;
  private InputStream dmnResource;
  private DmnDecision decision;

  @Before
  public void setup() {
    dmnEngine = new DmnEngineConfigurationImpl().buildEngine();
    dmnResource = this.getClass().getResourceAsStream("/findApprover.dmn");
  }

  @Test
  public void bronzeCustomerService() {

    decision = dmnEngine.parseDecision(dmnResource, "FindApprover");

    DelegateTask task = mock(DelegateTask.class);
    when(task.getProcessDefinitionId()).thenReturn("FindApprover:1");

    Map<String, Object> context = new HashMap<String, Object>();
    context.put("sheet", new ApprovalSheet("foo", 1.0, CustomerStatus.BRONZE));
    dmnEngine.evaluate(decision, context);

    // action
    final DmnDecisionResult result = dmnEngine.evaluate(decision, context);

    // assert
    assertEquals(1, result.size());
    DmnDecisionOutput output = result.get(0);

    assertTrue(output.containsKey("group"));
    assertEquals("customerService", output.get("group"));

  }

  @Test
  public void orderStatus() {

    decision = dmnEngine.parseDecision(dmnResource, "OrderStatus");

    DelegateTask task = mock(DelegateTask.class);
    when(task.getProcessDefinitionId()).thenReturn("FindApprover:1");

    Map<String, Object> context = new HashMap<String, Object>();
    context.put("sheet", new ApprovalSheet("foo", 1.0, CustomerStatus.BRONZE));
    dmnEngine.evaluate(decision, context);

    // action
    final DmnDecisionResult result = dmnEngine.evaluate(decision, context);

    // assert
    assertEquals(1, result.size());
    assertEquals("LOW", result.iterator().next().getValue());
  }

}
