package de.holisticon.bpm.sbr.dmn;

import test.rule.DecisionDeployment;
import test.rule.DmnEngineTestRule;
import test.rule.DmnEngineTestRuleBuilder;
import org.junit.Rule;
import org.junit.Test;

import static test.assertions.DmnEngineAssertions.decision;

/**
 * This class demonstrates the possible usage of DMN Engine API
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
public class FluentAssertImprovedApiDmnEngineAccessTest {

  @Rule
  public DmnEngineTestRule rule = new DmnEngineTestRuleBuilder(this).withAssertions().build();

  @Test
  @DecisionDeployment(resource = "findApprover.dmn")
  public void bronzeCustomerService() {

    // setup
    final ApprovalSheet approvalSheet = new ApprovalSheet("4711", 5000d, CustomerStatus.BRONZE);

    // evaluate
    decision().evaluate("sheet", approvalSheet)
    // assert result count
        .hasSingleResult()
        // assert value match
        .hasValue("customerService");

  }

}
