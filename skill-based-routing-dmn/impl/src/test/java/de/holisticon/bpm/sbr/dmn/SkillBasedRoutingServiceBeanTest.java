package de.holisticon.bpm.sbr.dmn;


import de.holisticon.bpm.sbr.api.CustomerStatus;
import de.holisticon.bpm.sbr.dmn.api.CandidateResult;
import org.assertj.core.api.Assertions;
import org.junit.Test;

public class SkillBasedRoutingServiceBeanTest {


  private final SkillBasedRoutingServiceBean bean = new SkillBasedRoutingServiceBean();
  {
    bean.loadDecision();
  }

  @Test
  public void evaluate() {
    ApprovalSheet approvalSheet = new ApprovalSheet();
    approvalSheet.setCustomerStatus(CustomerStatus.BRONZE);

    final CandidateResult result = bean.evaluate(approvalSheet);

    Assertions.assertThat(result.getCandidateGroups()).hasSize(1);

    Assertions.assertThat(result.getCandidateGroups().get(0)).isEqualTo("customerService");

  }
}