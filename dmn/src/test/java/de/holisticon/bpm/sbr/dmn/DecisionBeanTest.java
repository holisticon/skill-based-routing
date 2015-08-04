package de.holisticon.bpm.sbr.dmn;


import org.assertj.core.api.Assertions;
import org.camunda.dmn.engine.DmnDecisionOutput;
import org.camunda.dmn.engine.DmnDecisionResult;
import org.junit.Test;

public class DecisionBeanTest {


  private final DecisionBean bean = new DecisionBean();

  {
    bean.loadDecision();
  }

  @Test
  public void _() {
    ApprovalSheet approvalSheet = new ApprovalSheet();
    approvalSheet.setCustomerStatus(CustomerStatus.BRONZE);

    final DmnDecisionResult result = bean.evaluate(approvalSheet);

    Assertions.assertThat(result.getOutputs()).hasSize(1);

    DmnDecisionOutput output = result.getOutputs().iterator().next();
    Assertions.assertThat(output.getValue()).isEqualTo("customerService");
  }
}