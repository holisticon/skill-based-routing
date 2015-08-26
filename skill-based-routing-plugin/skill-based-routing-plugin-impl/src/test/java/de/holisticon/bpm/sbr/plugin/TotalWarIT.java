package de.holisticon.bpm.sbr.plugin;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URISyntaxException;
import java.util.Calendar;

import org.camunda.bpm.engine.impl.util.ClockUtil;
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
import com.google.common.io.OutputSupplier;

import de.holisticon.bpm.sbr.plugin.job.DmnDirectoryWatcher;
import de.holisticon.bpm.sbr.plugin.job.DmnDirectoryWatcherJobHandler;
import de.holisticon.bpm.sbr.plugin.test.FluentProcessEngineConfiguration;
import de.holisticon.bpm.sbr.plugin.util.DmnDirectorySupplier;
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
  
  // unsauber ... um seiteneffekte zu vermeiden, benutzt das plugin einen eigenen, named-eventBus. besser: getter ins plugin
  private final EventBus eventBus = new EventBus();
  
  // unsauber ... das plugin registriert einen anderen handler als diesen ... besser getter ins plugin
  private DmnDirectoryWatcherJobHandler jobHandler = new DmnDirectoryWatcherJobHandler(eventBus);
  private File authorizations;
  
  @Rule
  public final TemporaryFolder temporaryFolder = new TemporaryFolder();


  @Rule
  public final ProcessEngineRule processEngineRule = new ProcessEngineRule(new FluentProcessEngineConfiguration().addCustomJobHandler(jobHandler).addProcessEnginePlugin(plugin)
      .buildProcessEngine());

  @Before
  public void initProperties() throws Exception {

    // wenn das die poll frequenz steuert, ist es ja keine eviction time ... nur eine "check for changes" time
    System.setProperty("cache.eviction.timeout", "1");
    
    jobHandler.setDmnDirectoryWatcher(new DmnDirectoryWatcher(new DmnDirectorySupplier(temporaryFolder.getRoot())));
    
    Files.copy(getFile("total-war/user_requiredSkills.dmn"), temporaryFolder.newFile("user_requiredSkills.dmn"));
    Files.copy(getFile("total-war/user_candidateUsersRouting.dmn"), temporaryFolder.newFile("user_candidateUsersRouting.dmn"));
    
    authorizations = temporaryFolder.newFile("user_requiredAuthorizations.dmn");
    Files.copy(getFile("total-war/user_requiredAuthorizations.dmn"), authorizations);
    

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

    // start process and get Kermit as candidate user
    startProcessAssertCandidateUser("Kermit");
    
    // change the authorization files, trigger job execution
    Files.copy(getFile("total-war/user_requiredAuthorizations_2.dmn"), authorizations);
    Calendar cal = Calendar.getInstance();
    cal.add(Calendar.HOUR, 2);
    ClockUtil.setCurrentTime(cal.getTime());
    processEngineRule.getManagementService().executeJob(findJob().getId());

    // start process and get Poggy as candidate user
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