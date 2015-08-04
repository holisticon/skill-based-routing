package de.holisticon.bpm.sbr.dmn;


import org.assertj.core.api.Assertions;
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

    final CandidateResult result = bean.evaluate(approvalSheet);

    Assertions.assertThat(result.getCandidateGroups()).hasSize(1);

    Assertions.assertThat(result.getCandidateGroups().get(0)).isEqualTo("customerService");

  }
}