package de.holisticon.bpm.sbr.plugin;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.task.Task;
import org.camunda.bpm.engine.test.Deployment;
import org.camunda.bpm.engine.test.ProcessEngineRule;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import com.google.common.io.Files;

import de.holisticon.bpm.sbr.plugin.test.FluentProcessEngineConfiguration;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineAssertions.assertThat;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineAssertions.processEngine;

import static org.junit.Assert.assertEquals;

/**
 * This test runs end-to-end integration test with engine with plugin and is
 * based on rule exchange on the filesystem.
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
public class TotalWarIT {

  private SkillBasedRoutingProcessEnginePlugin plugin = new SkillBasedRoutingProcessEnginePlugin();

  @Rule
  public final TemporaryFolder temporaryFolder = new TemporaryFolder();

  @Rule
  public final ProcessEngineRule processEngineRule = new ProcessEngineRule(new FluentProcessEngineConfiguration().addProcessEnginePlugin(plugin)
      .buildProcessEngine());

  @Before
  public void initProperties() throws Exception {
    Files.copy(new File(getClass().getClassLoader().getResource("total-war/user_requiredSkills.dmn").toURI()), temporaryFolder.getRoot());
    Files.copy(new File(getClass().getClassLoader().getResource("total-war/user_requiredAuthorizations.dmn").toURI()), temporaryFolder.getRoot());
    Files.copy(new File(getClass().getClassLoader().getResource("total-war/user_candidateUserRouting.dmn").toURI()), temporaryFolder.getRoot());

    plugin.getDmnDirectorySupplier().setDmnDirectory(temporaryFolder.getRoot());

  }

  @Test
  @Deployment(resources = "bpmn/user.bpmn")
  public void test_process_without_candidate_users() {
    ProcessInstance instance = processEngineRule.getRuntimeService().startProcessInstanceByKey("user");
    assertThat(instance).isActive().task().hasDefinitionKey("userTask").isNotAssigned();
    // todo add assertion on candidate users.
  }

  @Test
  @Deployment(resources = "bpmn/user.bpmn")
  public void test_process_with_candidate_users() {
    ProcessInstance instance = processEngineRule.getRuntimeService().startProcessInstanceByKey("user");
    assertThat(instance).isActive().task().hasDefinitionKey("userTask").isNotAssigned();
    Task actual = assertThat(instance).isActive().task().getActual();
    Task query = processEngine().getTaskService().createTaskQuery().processInstanceId(instance.getProcessInstanceId()).taskCandidateUser("Kermit")
        .singleResult();
    assertEquals(actual, query);
  }

}
