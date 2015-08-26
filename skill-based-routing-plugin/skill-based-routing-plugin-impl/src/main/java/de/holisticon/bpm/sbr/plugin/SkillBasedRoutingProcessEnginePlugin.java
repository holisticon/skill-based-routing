package de.holisticon.bpm.sbr.plugin;

import java.util.ArrayList;
import java.util.List;

import org.camunda.bpm.dmn.engine.DmnEngine;
import org.camunda.bpm.dmn.engine.impl.DmnEngineConfigurationImpl;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.impl.bpmn.behavior.UserTaskActivityBehavior;
import org.camunda.bpm.engine.impl.bpmn.parser.AbstractBpmnParseListener;
import org.camunda.bpm.engine.impl.bpmn.parser.BpmnParseListener;
import org.camunda.bpm.engine.impl.cfg.AbstractProcessEnginePlugin;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.camunda.bpm.engine.impl.interceptor.CommandExecutor;
import org.camunda.bpm.engine.impl.jobexecutor.JobHandler;
import org.camunda.bpm.engine.impl.pvm.process.ActivityImpl;
import org.camunda.bpm.engine.impl.pvm.process.ScopeImpl;
import org.camunda.bpm.engine.impl.task.TaskDefinition;
import org.camunda.bpm.engine.impl.util.xml.Element;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.eventbus.EventBus;

import de.holisticon.bpm.sbr.plugin.job.DmnDirectoryWatcherJobHandler;
import de.holisticon.bpm.sbr.plugin.listener.SkillBasedRoutingListener;
import de.holisticon.bpm.sbr.plugin.util.DmnDecisionCache;
import de.holisticon.bpm.sbr.plugin.util.DmnDecisionLoader;
import de.holisticon.bpm.sbr.plugin.util.DmnDirectorySupplier;
import static org.camunda.bpm.engine.delegate.TaskListener.EVENTNAME_CREATE;

/**
 * Engine plugin, installing Skill-Based-Routing Listener to User Tasks.
 * <p/>
 * This class is registered in the ProcessEngineConfiguration.
 */
public class SkillBasedRoutingProcessEnginePlugin extends AbstractProcessEnginePlugin {

  /**
   * EventBus for instance communication
   */
  private final EventBus eventBus;
  private final DmnEngine dmnEngine;
  private final DmnDirectorySupplier dmnDirectorySupplier;

  private final DmnDirectoryWatcherJobHandler jobHandler;

  private SkillBasedRoutingService skillBasedRoutingService;

  public SkillBasedRoutingProcessEnginePlugin() {
    this(new DmnEngineConfigurationImpl().buildEngine(), //
        new EventBus("SkillBasedRoutingProcessEnginePlugin"), //
        new DmnDirectorySupplier());
  }

  public SkillBasedRoutingProcessEnginePlugin(final DmnEngine dmnEngine, //
      final EventBus eventBus, //
      final DmnDirectorySupplier dmnDirectorySupplier) {
    this.dmnEngine = dmnEngine;
    this.eventBus = eventBus;
    this.dmnDirectorySupplier = dmnDirectorySupplier;
    this.jobHandler = new DmnDirectoryWatcherJobHandler(eventBus, dmnDirectorySupplier);
  }

  @Override
  public void preInit(final ProcessEngineConfigurationImpl configuration) {

    final DmnDecisionLoader decisionLoader = new DmnDecisionLoader(dmnEngine, dmnDirectorySupplier);
    final DmnDecisionCache cache = new DmnDecisionCache(decisionLoader);
    eventBus.register(cache);

    this.skillBasedRoutingService = new SkillBasedRoutingService(dmnEngine, cache);
    customJobHandlers(configuration).add(jobHandler);

    customPreBPMNParseListeners(configuration).add(new AbstractBpmnParseListener() {
      @Override
      public void parseUserTask(final Element userTaskElement, final ScopeImpl scope, final ActivityImpl activity) {
        taskDefinition(activity).addTaskListener(EVENTNAME_CREATE, new SkillBasedRoutingListener(skillBasedRoutingService));
      }
    });
  }

  @Override
  public void postProcessEngineBuild(final ProcessEngine processEngine) {
    final CommandExecutor commandExecutor = commandExecutor(processEngine);

    // create repeating timerEntity.
    commandExecutor.execute(DmnDirectoryWatcherJobHandler.CREATE_TIMER_ENTITY);
  }

  // static helpers

  /**
   * @param processEngine
   *          the engine
   * @return commandExecutor for given engine
   */
  private static CommandExecutor commandExecutor(ProcessEngine processEngine) {
    return ((ProcessEngineConfigurationImpl) processEngine.getProcessEngineConfiguration()).getCommandExecutorSchemaOperations();
  }

  /**
   * @param processEngineConfiguration
   *          the configuration
   * @return null-safe list of custom parseListeners
   */
  private static List<BpmnParseListener> customPreBPMNParseListeners(ProcessEngineConfigurationImpl processEngineConfiguration) {
    List<BpmnParseListener> preParseListeners = processEngineConfiguration.getCustomPreBPMNParseListeners();
    if (preParseListeners == null) {
      preParseListeners = new ArrayList<BpmnParseListener>();
      processEngineConfiguration.setCustomPreBPMNParseListeners(preParseListeners);
    }
    return preParseListeners;
  }

  /**
   * @param processEngineConfiguration
   *          the configuration
   * @return null-safe list of custom job handlers
   */
  private static List<JobHandler> customJobHandlers(ProcessEngineConfigurationImpl processEngineConfiguration) {
    List<JobHandler> customJobHandlers = processEngineConfiguration.getCustomJobHandlers();
    if (customJobHandlers == null) {
      customJobHandlers = new ArrayList<>();
      processEngineConfiguration.setCustomJobHandlers(customJobHandlers);
    }
    return customJobHandlers;
  }

  /**
   * @param activity
   *          the taskActivity
   * @return taskDefinition for activity
   */
  private static TaskDefinition taskDefinition(final ActivityImpl activity) {
    final UserTaskActivityBehavior activityBehavior = (UserTaskActivityBehavior) activity.getActivityBehavior();
    return activityBehavior.getTaskDefinition();
  }

  public DmnDirectorySupplier getDmnDirectorySupplier() {
    return dmnDirectorySupplier;
  }

}
