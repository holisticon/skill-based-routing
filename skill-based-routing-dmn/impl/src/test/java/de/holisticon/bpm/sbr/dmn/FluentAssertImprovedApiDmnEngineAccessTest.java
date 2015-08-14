package de.holisticon.bpm.sbr.dmn;

import java.util.HashMap;
import java.util.Map;

import org.camunda.bpm.dmn.engine.test.DecisionResource;
import org.camunda.bpm.dmn.engine.test.DmnEngineTestRule;
import static org.camunda.bpm.dmn.engine.test.asserts.DmnAssertions.*;
import org.junit.Rule;
import org.junit.Test;

import de.holisticon.bpm.sbr.api.CustomerStatus;

/**
 * This class demonstrates the possible usage of DMN Engine API
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
public class FluentAssertImprovedApiDmnEngineAccessTest {

  @Rule
  public DmnEngineTestRule rule = new DmnEngineTestRule();

  @Test
  @DecisionResource(resource = "findApprover.dmn")
  public void bronzeCustomerService() {

    // setup
    final ApprovalSheet approvalSheet = new ApprovalSheet("4711", 5000d, CustomerStatus.BRONZE);
    Map<String, Object> context = new HashMap<String, Object>();
    context.put("sheet", approvalSheet);

    assertThat(rule.getDmnEngine()).evaluates(rule.getDecision(), context).hasResult().hasSingleOutput()
        .hasSingleEntry("group", "customerService");
  }
}
