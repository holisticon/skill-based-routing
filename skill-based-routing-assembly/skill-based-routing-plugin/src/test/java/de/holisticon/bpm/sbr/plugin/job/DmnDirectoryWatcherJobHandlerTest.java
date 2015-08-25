package de.holisticon.bpm.sbr.plugin.job;

import com.google.common.eventbus.EventBus;
import com.google.common.eventbus.Subscribe;
import de.holisticon.bpm.sbr.plugin.test.FluentProcessEngineConfiguration;
import de.holisticon.bpm.sbr.plugin.util.DmnDirectorySupplier;
import org.apache.commons.lang.time.DateUtils;
import org.camunda.bpm.engine.impl.ProcessEngineImpl;
import org.camunda.bpm.engine.impl.interceptor.CommandExecutor;
import org.camunda.bpm.engine.runtime.Job;
import org.camunda.bpm.engine.test.ProcessEngineRule;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.bridge.SLF4JBridgeHandler;

import java.io.File;
import java.io.IOException;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

public class DmnDirectoryWatcherJobHandlerTest {

    static {
        SLF4JBridgeHandler.removeHandlersForRootLogger();
        SLF4JBridgeHandler.install();
    }

    private CommandExecutor commandExecutor;

    private final EventBus eventBus = new EventBus();

    private DmnDirectoryWatcherJobHandler jobHandler = new DmnDirectoryWatcherJobHandler(eventBus);

    @Rule
    public final TemporaryFolder temporaryFolder = new TemporaryFolder();

    @Rule
    public final ProcessEngineRule processEngineRule = new ProcessEngineRule(new FluentProcessEngineConfiguration().addCustomJobHandler(jobHandler).buildProcessEngine());

    private File changedFile;

    @Before
    public void setUp() throws Exception {
        eventBus.register(this);
        jobHandler.setDmnDirectoryWatcher(new DmnDirectoryWatcher(new DmnDirectorySupplier(temporaryFolder.getRoot())));

        commandExecutor = ((ProcessEngineImpl) processEngineRule.getProcessEngine()).getProcessEngineConfiguration().getCommandExecutorSchemaOperations();

        // assure no job is created
        assertThat(findJob()).isNull();
    }

    @Test
    public void watches_file_changes() throws IOException, InterruptedException {
        commandExecutor.execute(DmnDirectoryWatcherJobHandler.CREATE_TIMER_ENTITY);
        processEngineRule.getManagementService().executeJob(findJob().getId());

        assertThat(changedFile).isNull();

        // create file1
        File file1 = temporaryFolder.newFile("1.dmn");
        processEngineRule.getManagementService().executeJob(findJob().getId());
        assertThat(changedFile).isEqualTo(file1);
        changedFile = null;

        // create file 2
        File file2 = temporaryFolder.newFile("2.dmn");
        processEngineRule.getManagementService().executeJob(findJob().getId());
        assertThat(changedFile).isEqualTo(file2);
        changedFile = null;

        // delete file1
        file1.delete();
        processEngineRule.getManagementService().executeJob(findJob().getId());
        assertThat(changedFile).isEqualTo(file1);
        changedFile = null;

        // modify file2
        Thread.sleep(1500L);
        file2.setLastModified(new Date().getTime()+200);
        processEngineRule.getManagementService().executeJob(findJob().getId());
        assertThat(changedFile).isEqualTo(file2);
    }

    @Test
    public void creates_repeating_job() {
        // initially, create the instance
        commandExecutor.execute(DmnDirectoryWatcherJobHandler.CREATE_TIMER_ENTITY);

        Job job = findJob();
        assertThat(job).isNotNull();
        Date dueDate1 = job.getDuedate();
        assertThat(dueDate1).isCloseTo(new Date(), 1000L);

        processEngineRule.getManagementService().executeJob(job.getId());

        // now the second job was created with interval
        job = findJob();
        assertThat(job).isNotNull();
        Date dueDate2 = job.getDuedate();
        assertThat(dueDate2).isCloseTo(DateUtils.addSeconds(new Date(), DmnDirectoryWatcherJobHandler.INTERVAL_SECONDS), 1000L);

    }

    @Subscribe
    public void handle(File event) {
        this.changedFile = event;
    }


    private Job findJob() {
        return processEngineRule.getManagementService().createJobQuery().singleResult();
    }
}
