package de.holisticon.bpm.sbr.plugin;

import org.camunda.bpm.engine.impl.bpmn.behavior.UserTaskActivityBehavior;
import org.camunda.bpm.engine.impl.bpmn.parser.AbstractBpmnParseListener;
import org.camunda.bpm.engine.impl.bpmn.parser.BpmnParseListener;
import org.camunda.bpm.engine.impl.cfg.AbstractProcessEnginePlugin;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.camunda.bpm.engine.impl.pvm.process.ActivityImpl;
import org.camunda.bpm.engine.impl.pvm.process.ScopeImpl;
import org.camunda.bpm.engine.impl.task.TaskDefinition;
import org.camunda.bpm.engine.impl.util.xml.Element;

import java.util.ArrayList;
import java.util.List;

import static org.camunda.bpm.engine.delegate.TaskListener.EVENTNAME_CREATE;

/**
 * Engine plugin, installing Skill-Based-Routing Listener to User Tasks.
 * <p/>
 * This class is registered in the ProcessEngineConfiguration.
 */
public class SkillBasedRoutingProcessEnginePlugin extends AbstractProcessEnginePlugin {


  @Override
  public void preInit(final ProcessEngineConfigurationImpl configuration) {

    customPreBPMNParseListeners(configuration).add(new AbstractBpmnParseListener() {
      @Override
      public void parseUserTask(final Element userTaskElement, final ScopeImpl scope, final ActivityImpl activity) {
        taskDefinition(activity).addTaskListener(EVENTNAME_CREATE, new SkillBasedRoutingListener());
      }
    });
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
   * @param activity
   *          the taskActivity
   * @return taskDefinition for activity
   */
  private static TaskDefinition taskDefinition(final ActivityImpl activity) {
    final UserTaskActivityBehavior activityBehavior = (UserTaskActivityBehavior) activity.getActivityBehavior();
    return activityBehavior.getTaskDefinition();
  }

}
