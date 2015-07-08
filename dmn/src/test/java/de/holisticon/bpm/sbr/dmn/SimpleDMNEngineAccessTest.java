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

import static org.junit.Assert.*;

public class SimpleDMNEngineAccessTest {

  DmnEngine dmnEngine;
  InputStream dmnResource;
  ApprovalSheet approvalSheet;

  @Before
  public void setup() {
    dmnEngine = new DmnEngineConfigurationImpl().buildEngine();
    dmnResource = this.getClass().getResourceAsStream("/findApprover.dmn");
  }

  @Test
  public void shouldEvaluate() {

    final DmnDecision decision = dmnEngine.parseDecision(dmnResource);

    DmnDecisionContext decisionContext = new DmnContextFactoryImpl().createDecisionContext();
    decisionContext.getVariableContext().setVariable("sheet", approvalSheet);

    DmnDecisionResult result = decisionContext.evaluate(decision);
    assertEquals(1, result.getOutputs().size());
  }
}
