package de.holisticon.bpm.sbr.plugin;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import org.camunda.bpm.engine.impl.jobexecutor.JobHandler;
import org.camunda.bpm.engine.runtime.Job;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.task.Task;
import org.camunda.bpm.engine.test.Deployment;
import org.camunda.bpm.engine.test.ProcessEngineRule;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import com.google.common.eventbus.EventBus;
import com.google.common.io.Files;

import de.holisticon.bpm.sbr.plugin.job.DmnDirectoryWatcherJobHandler;
import de.holisticon.bpm.sbr.plugin.test.FluentProcessEngineConfiguration;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineAssertions.assertThat;

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
  private final EventBus eventBus = new EventBus();
  private DmnDirectoryWatcherJobHandler jobHandler = new DmnDirectoryWatcherJobHandler(eventBus);

  @Rule
  public final TemporaryFolder temporaryFolder = new TemporaryFolder();


  @Rule
  public final ProcessEngineRule processEngineRule = new ProcessEngineRule(new FluentProcessEngineConfiguration().addCustomJobHandler(jobHandler).addProcessEnginePlugin(plugin)
      .buildProcessEngine());

  @Before
  public void initProperties() throws Exception {

    Files.copy(getFile("total-war/user_requiredSkills.dmn"), temporaryFolder.newFile("user_requiredSkills.dmn"));
    Files.copy(getFile("total-war/user_requiredAuthorizations.dmn"), temporaryFolder.newFile("user_requiredAuthorizations.dmn"));
    Files.copy(getFile("total-war/user_candidateUsersRouting.dmn"), temporaryFolder.newFile("user_candidateUsersRouting.dmn"));

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
    startProcessAssertCandidateUser("Kermit");
  }

  @Test
  @Deployment(resources = "bpmn/user.bpmn")
  public void test_process_with_candidate_users_and_changing_authorizations() throws InterruptedException, IOException, URISyntaxException {

    startProcessAssertCandidateUser("Kermit");

    Files.copy(getFile("total-war/user_requiredAuthorizations.dmn"), temporaryFolder.newFile("user_requiredAuthorizations_2.dmn"));
    Thread.sleep(1000);
    processEngineRule.getManagementService().executeJob(findJob().getId());

    startProcessAssertCandidateUser("Piggy");

  }

  private void startProcessAssertCandidateUser(String username) {
    ProcessInstance instance = processEngineRule.getRuntimeService().startProcessInstanceByKey("user");
    assertThat(instance).isActive().task().hasDefinitionKey("userTask").isNotAssigned();
    Task actual = assertThat(instance).isActive().task().getActual();
    Task query = processEngineRule.getTaskService().createTaskQuery().processInstanceId(instance.getProcessInstanceId()).taskCandidateUser(username)
        .singleResult();
    assertEquals(actual, query);

  }

  private File getFile(String name) throws URISyntaxException {
    return new File(getClass().getClassLoader().getResource(name).toURI());
  }

  private Job findJob() {
    return processEngineRule.getManagementService().createJobQuery().singleResult();
  }

}
