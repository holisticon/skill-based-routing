package de.holisticon.bpm.sbr.dmn;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import de.holisticon.bpm.sbr.api.CustomerStatus;
import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnDecisionResult;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.camunda.bpm.dmn.engine.impl.DmnEngineConfigurationImpl;
import org.camunda.bpm.engine.delegate.DelegateTask;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class NativeApiDMNEngineAccessTest {

  private DmnEngine dmnEngine;
  private InputStream dmnResource;
  private DmnDecision decision;

  @Before
  public void setup() {
    dmnEngine = new DmnEngineConfigurationImpl().buildEngine();
    dmnResource = this.getClass().getResourceAsStream("/findApprover.dmn");
    decision = dmnEngine.parseDecision(dmnResource);
  }

  @Test
  public void bronzeCustomerService() {

    DelegateTask task = CreateDelegateTask.delegateTask(null, null, CustomerStatus.BRONZE);

    Map<String, Object> context = new HashMap<String, Object>();
    context.put("sheet", new CreateApprovalSheet().apply(task));
    dmnEngine.evaluate(decision, context);

    // action
    final DmnDecisionResult result = dmnEngine.evaluate(decision, context);

    // assert
    assertEquals(1, result.size());
    assertEquals("customerService", result.iterator().next().getValue());
  }
}
