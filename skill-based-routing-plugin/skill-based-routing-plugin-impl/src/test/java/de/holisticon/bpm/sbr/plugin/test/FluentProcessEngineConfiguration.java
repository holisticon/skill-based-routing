package de.holisticon.bpm.sbr.plugin.test;

import com.google.common.base.Supplier;
import de.holisticon.bpm.sbr.plugin.SkillBasedRoutingProcessEnginePlugin;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.impl.bpmn.parser.BpmnParseListener;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.camunda.bpm.engine.impl.cfg.ProcessEnginePlugin;
import org.camunda.bpm.engine.impl.cfg.StandaloneInMemProcessEngineConfiguration;
import org.camunda.bpm.engine.impl.history.HistoryLevel;
import org.camunda.bpm.engine.impl.jobexecutor.JobHandler;
import org.camunda.bpm.engine.test.ProcessEngineRule;
import org.camunda.bpm.engine.test.mock.MockExpressionManager;

import java.util.ArrayList;

public class FluentProcessEngineConfiguration implements Supplier<ProcessEngineConfigurationImpl> {

  public static ProcessEngineConfigurationImpl configuration() {
    return new FluentProcessEngineConfiguration().get();
  }

  public static ProcessEngine processEngine() {
    return configuration().buildProcessEngine();
  }

  public static ProcessEngineRule processEngineRule() {
    return new ProcessEngineRule(processEngine());
  }

  private final StandaloneInMemProcessEngineConfiguration processEngineConfiguration = new StandaloneInMemProcessEngineConfiguration() {{
    this.historyLevel = HistoryLevel.HISTORY_LEVEL_FULL;
    this.databaseSchemaUpdate = DB_SCHEMA_UPDATE_DROP_CREATE;
    this.jobExecutorActivate = false;
    this.expressionManager = new MockExpressionManager();
    this.processEnginePlugins = new ArrayList<ProcessEnginePlugin>();
    this.postParseListeners = new ArrayList<BpmnParseListener>();
    this.customJobHandlers = new ArrayList<JobHandler>();

    this.processEnginePlugins.add(new SkillBasedRoutingProcessEnginePlugin());
  }};

  public FluentProcessEngineConfiguration addProcessEnginePlugin(ProcessEnginePlugin plugin) {
    processEngineConfiguration.getProcessEnginePlugins().add(plugin);
    return this;
  }

  public FluentProcessEngineConfiguration addCustomJobHandler(JobHandler jobHandler) {
    processEngineConfiguration.getCustomJobHandlers().add(jobHandler);
    return this;
  }

  @Override
  public ProcessEngineConfigurationImpl get() {
    return processEngineConfiguration;
  }
}
