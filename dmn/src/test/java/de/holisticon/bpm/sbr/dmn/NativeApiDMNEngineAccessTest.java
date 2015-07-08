package de.holisticon.bpm.sbr.dmn;

import java.io.InputStream;

import org.camunda.dmn.engine.DmnDecision;
import org.camunda.dmn.engine.DmnDecisionResult;
import org.camunda.dmn.engine.DmnEngine;
import org.camunda.dmn.engine.context.DmnDecisionContext;
import org.camunda.dmn.engine.impl.DmnEngineConfigurationImpl;
import org.camunda.dmn.engine.impl.context.DmnContextFactoryImpl;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class NativeApiDMNEngineAccessTest {

  DmnEngine dmnEngine;
  InputStream dmnResource;
  DmnDecision decision;
  ApprovalSheet approvalSheet;

  @Before
  public void setup() {
    dmnEngine = new DmnEngineConfigurationImpl().buildEngine();
    dmnResource = this.getClass().getResourceAsStream("/findApprover.dmn");
    decision = dmnEngine.parseDecision(dmnResource);
  }

  @Test
  public void bronzeCustomerService() {

    // setup
    approvalSheet = new ApprovalSheet();
    approvalSheet.setCustomerStatus(CustomerStatus.BRONZE);

    final DmnDecisionContext decisionContext = new DmnContextFactoryImpl().createDecisionContext();
    decisionContext.getVariableContext().setVariable("sheet", approvalSheet);

    // action
    final DmnDecisionResult result = decisionContext.evaluate(decision);

    // assert
    assertEquals(1, result.getOutputs().size());
    assertEquals("customerService", result.getOutputs().iterator().next().getValue());
  }
}
