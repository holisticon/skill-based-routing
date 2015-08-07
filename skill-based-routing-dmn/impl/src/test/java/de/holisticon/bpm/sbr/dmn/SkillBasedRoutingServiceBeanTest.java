package de.holisticon.bpm.sbr.dmn;

import de.holisticon.bpm.sbr.api.CustomerStatus;
import de.holisticon.bpm.sbr.dmn.api.CandidateResult;

import org.assertj.core.api.Assertions;
import org.camunda.bpm.engine.delegate.DelegateTask;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.needle4j.annotation.InjectIntoMany;
import org.needle4j.annotation.ObjectUnderTest;
import org.needle4j.injection.DefaultMockInjectionProvider;
import org.needle4j.junit.NeedleRule;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class SkillBasedRoutingServiceBeanTest {

  @Rule
  public final NeedleRule needle = new NeedleRule();

  @InjectIntoMany
  private CreateApprovalSheet createApprovalSheet = new CreateApprovalSheet();

  @ObjectUnderTest(postConstruct = true)
  private SkillBasedRoutingServiceBean bean;

  @Test
  @Ignore
  public void evaluate() {
    DelegateTask task = CreateDelegateTask.delegateTask("foo", 1.0, CustomerStatus.BRONZE);

    final CandidateResult result = null;
    // = bean.evaluate(task);

    Assertions.assertThat(result.getCandidateGroups()).hasSize(1);

    Assertions.assertThat(result.getCandidateGroups().get(0)).isEqualTo("customerService");

  }
}