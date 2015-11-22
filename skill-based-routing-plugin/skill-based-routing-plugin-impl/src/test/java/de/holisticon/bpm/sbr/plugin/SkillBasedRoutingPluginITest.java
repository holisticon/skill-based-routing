package de.holisticon.bpm.sbr.plugin;

import com.google.common.base.Function;
import com.google.common.collect.FluentIterable;
import de.holisticon.bpm.sbr.plugin.test.FluentProcessEngineConfiguration;
import org.camunda.bpm.engine.repository.DecisionDefinition;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.task.IdentityLink;
import org.camunda.bpm.engine.task.Task;
import org.camunda.bpm.engine.test.Deployment;
import org.camunda.bpm.engine.test.ProcessEngineRule;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.slf4j.Logger;

import javax.annotation.Nullable;
import java.util.List;
import java.util.Set;

import static org.camunda.bpm.engine.test.assertions.ProcessEngineAssertions.assertThat;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineTests.runtimeService;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineTests.task;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineTests.taskService;
import static org.slf4j.LoggerFactory.getLogger;

@Ignore
@Deployment(resources = {
  "showcase/leistungsabrechnung_requiredSkills.dmn",
  "showcase/leistungsabrechnung_candidateUsersRouting.dmn",
  "showcase/leistungsabrechnung_requiredAuthorizations.dmn",
  "bpmn/LeistungsabrechnungTest.bpmn"})
public class SkillBasedRoutingPluginITest {

  private final Function<IdentityLink, String> users = new Function<IdentityLink, String>() {
    @Override
    public String apply(@Nullable IdentityLink input) {
      return input.getUserId();
    }
  };

  private final Function<DecisionDefinition, String> name = new Function<DecisionDefinition, String>() {
    @Override
    public String apply(@Nullable DecisionDefinition input) {
      return input.getKey();
    }
  };

  private final Logger logger = getLogger(this.getClass());

  @Rule
  public final ProcessEngineRule processEngineRule = FluentProcessEngineConfiguration.processEngineRule();


  @Test
  public void deploys() {
    assertThat(FluentIterable.from(decisionDefinitions()).transform(name).toImmutableSet()).containsOnly("leistungsabrechnung_requiredSkills", "leistungsabrechnung_requiredAuthorizations.dmn", "leistungsabrechnung_candidateUsersRouting.dmn");
  }

  @Test
  public void start_process_and_assert_correct_candidateUsers_on_first_task() {
    final ProcessInstance processInstance = runtimeService().startProcessInstanceByKey("leistungsabrechnung");
    assertThat(processInstance).isWaitingAt("task_leistungen_erfassen");

    assertThat(candidateUsers(task())).containsOnly("foo", "bar");


  }

  private Set<String> candidateUsers(Task task) {
    return FluentIterable.from(taskService().getIdentityLinksForTask(task.getId())).transform(users).toImmutableSet();
  }

  private List<DecisionDefinition> decisionDefinitions() {
    return processEngineRule.getRepositoryService().createDecisionDefinitionQuery().list();
  }

}
