package de.holisticon.bpm.sbr.plugin;

import de.holisticon.bpm.sbr.plugin.api.CandidateResult;
import de.holisticon.bpm.sbr.plugin.api.TaskHolder;
import org.camunda.bpm.engine.DecisionService;
import org.camunda.bpm.engine.delegate.DelegateTask;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Answers;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Collection;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class SkillBasedRoutingListenerTest {

  @Mock(answer = Answers.RETURNS_DEEP_STUBS)
  private DelegateTask delegateTask;

  @Mock
  private DecisionService decisionService;

  @Mock
  private SkillBasedRoutingService skillBasedRoutingService;

  @Captor
  private ArgumentCaptor<Collection<String>> candidateUsersCaptor;
  @Captor
  private ArgumentCaptor<TaskHolder> taskHolderCaptor;
  @Captor
  private ArgumentCaptor<Map<String, Object>> variablesCaptor;

  @Spy
  private final SkillBasedRoutingListener listener = new SkillBasedRoutingListener();

  @Before
  public void setUp() {
    when(delegateTask.getProcessEngineServices().getDecisionService()).thenReturn(decisionService);
    when(delegateTask.getProcessDefinitionId()).thenReturn("myProcess:1:1");
    when(delegateTask.getTaskDefinitionKey()).thenReturn("myTask");
    doReturn(skillBasedRoutingService).when(listener).skillBasedRoutingService(decisionService);
  }

  @Test
  public void writes_candidateUsers_resolved_from_sbrService() {

    CandidateResult candidateResult = new CandidateResult();
    candidateResult.getCandidateUsers().add("karl");
    candidateResult.getCandidateUsers().add("friedrich");

    when(skillBasedRoutingService.evaluate(taskHolderCaptor.capture(), variablesCaptor.capture())).thenReturn(candidateResult);

    listener.notify(delegateTask);

    verify(delegateTask).addCandidateUsers(candidateUsersCaptor.capture());

    assertThat(candidateUsersCaptor.getValue()).containsOnly("karl", "friedrich");

    assertThat(taskHolderCaptor.getValue().getTaskDefinitionKey()).isEqualTo("myTask");
    assertThat(taskHolderCaptor.getValue().getProcessDefinitionId()).isEqualTo("myProcess:1:1");

    assertThat(variablesCaptor.getValue().entrySet()).isEmpty();
  }

}
