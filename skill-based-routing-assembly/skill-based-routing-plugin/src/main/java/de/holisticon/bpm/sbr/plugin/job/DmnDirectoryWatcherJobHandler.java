package de.holisticon.bpm.sbr.plugin.job;

import java.io.File;
import java.util.Date;

import org.camunda.bpm.engine.impl.interceptor.Command;
import org.camunda.bpm.engine.impl.interceptor.CommandContext;
import org.camunda.bpm.engine.impl.jobexecutor.JobHandler;
import org.camunda.bpm.engine.impl.persistence.entity.ExecutionEntity;
import org.camunda.bpm.engine.impl.persistence.entity.TimerEntity;

import com.google.common.eventbus.EventBus;

import de.holisticon.bpm.sbr.plugin.util.DmnDirectorySupplier;
import static java.lang.String.format;

public class DmnDirectoryWatcherJobHandler implements JobHandler {

  public static final String TYPE = "DmnDirectoryWatcherJobHandler";
  public static final int INTERVAL_SECONDS = Integer.parseInt(System.getProperty("cache.eviction.timeout", "15"));

  /**
   * Creates a timerEntity that calls the jobHandler every INTERVAL_SECONDS.
   */
  public static final Command<String> CREATE_TIMER_ENTITY = new Command<String>() {
    @Override
    public String execute(CommandContext commandContext) {
      final TimerEntity timer = new TimerEntity();
      timer.setDuedate(new Date());
      timer.setRepeat(format("R/PT%dS", INTERVAL_SECONDS));

      timer.setJobHandlerType(TYPE);

      commandContext.getJobManager().schedule(timer);

      return timer.getId();
    }
  };

  private final EventBus eventBus;

  private DmnDirectoryWatcher dmnDirectoryWatcher;

  public DmnDirectoryWatcherJobHandler(final EventBus eventBus) {
    this.eventBus = eventBus;
  }

  public DmnDirectoryWatcherJobHandler(final EventBus eventBus, final DmnDirectorySupplier dmnDirectorySupplier) {
    this(eventBus);
    setDmnDirectoryWatcher(new DmnDirectoryWatcher(dmnDirectorySupplier));
  }

  public void setDmnDirectoryWatcher(DmnDirectoryWatcher dmnDirectoryWatcher) {
    this.dmnDirectoryWatcher = dmnDirectoryWatcher;
  }

  @Override
  public String getType() {
    return TYPE;
  }

  @Override
  public void execute(String context, ExecutionEntity execution, CommandContext commandContext) {
    if (dmnDirectoryWatcher == null) {
      return;
    }
    for (File changedFile : dmnDirectoryWatcher.detectChanges()) {
      eventBus.post(changedFile);
    }

  }

}
