package de.holisticon.bpm.sbr.plugin;

import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.test.Deployment;
import org.camunda.bpm.engine.test.ProcessEngineRule;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineAssertions.*;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import de.holisticon.bpm.sbr.plugin.test.FluentProcessEngineConfiguration;

/**
 * This test runs end-to-end integration test with engine with plugin and is
 * based on rule exchange on the filesystem.
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
public class TotalWarITest {

  @Rule
  public final TemporaryFolder temporaryFolder = new TemporaryFolder();

  @Rule
  public final ProcessEngineRule processEngineRule = new ProcessEngineRule(new FluentProcessEngineConfiguration().addProcessEnginePlugin(
      new SkillBasedRoutingProcessEnginePlugin()).buildProcessEngine());

  @Test
  @Deployment(resources = "bpmn/user.bpmn")
  public void test_process_without_candidate_users() {
    ProcessInstance instance = processEngineRule.getRuntimeService().startProcessInstanceByKey("user-process");
    assertThat(instance).isActive().task().hasDefinitionKey("userTask").isNotAssigned();
    // todo add assertion on candidate users.
  }
}
