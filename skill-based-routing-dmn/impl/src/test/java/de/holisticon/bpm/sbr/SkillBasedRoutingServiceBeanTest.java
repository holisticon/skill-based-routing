package de.holisticon.bpm.sbr;

import java.util.HashMap;
import java.util.Map;

import org.assertj.core.api.Assertions;
import org.camunda.bpm.engine.delegate.DelegateTask;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.needle4j.annotation.ObjectUnderTest;
import org.needle4j.junit.NeedleRule;

import de.holisticon.bpm.sbr.api.CustomerStatus;
import de.holisticon.bpm.sbr.dmn.ApprovalSheet;
import de.holisticon.bpm.sbr.dmn.SkillBasedRoutingServiceBean;
import de.holisticon.bpm.sbr.dmn.api.CandidateResult;
import de.holisticon.bpm.sbr.dmn.api.TaskHolder;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class SkillBasedRoutingServiceBeanTest {

  @Rule
  public final NeedleRule needle = new NeedleRule();

  @ObjectUnderTest(postConstruct = true)
  private SkillBasedRoutingServiceBean bean;

  /**
   * Currently ignored, because of unclear mapping between variables from execution to the DMN context.
   */
  @Test
  @Ignore
  public void evaluate() {
    DelegateTask task = mock(DelegateTask.class);
    when(task.getProcessDefinitionId()).thenReturn("FindApprover:1");

    Map<String, Object> context = new HashMap<String, Object>();
    context.put("sheet", new ApprovalSheet("foo", 1.0, CustomerStatus.BRONZE));

    final CandidateResult result = bean.evaluate(TaskHolder.fromTask(task), context);

    Assertions.assertThat(result.getCandidateGroups()).hasSize(1);
    Assertions.assertThat(result.getCandidateGroups().get(0)).isEqualTo("customerService");
  }
}