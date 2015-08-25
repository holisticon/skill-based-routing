package de.holisticon.bpm.sbr.plugin;

import java.util.ArrayList;
import java.util.List;

import org.camunda.bpm.engine.impl.bpmn.behavior.UserTaskActivityBehavior;
import org.camunda.bpm.engine.impl.bpmn.parser.AbstractBpmnParseListener;
import org.camunda.bpm.engine.impl.bpmn.parser.BpmnParseListener;
import org.camunda.bpm.engine.impl.cfg.AbstractProcessEnginePlugin;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.camunda.bpm.engine.impl.pvm.process.ActivityImpl;
import org.camunda.bpm.engine.impl.pvm.process.ScopeImpl;
import org.camunda.bpm.engine.impl.task.TaskDefinition;
import org.camunda.bpm.engine.impl.util.xml.Element;

import de.holisticon.bpm.sbr.plugin.listener.SkillBasedRoutingListener;
import static org.camunda.bpm.engine.delegate.TaskListener.EVENTNAME_CREATE;

/**
 * Engine plugin, installing Skill-Based-Routing Listener to User Tasks.
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
public class SkillBasedRoutingProcessEnginePlugin extends AbstractProcessEnginePlugin {

  private final SkillBasedRoutingService skillBasedRoutingService = new SkillBasedRoutingService();

  public SkillBasedRoutingProcessEnginePlugin() {

  }

  @Override
  public void preInit(final ProcessEngineConfigurationImpl processEngineConfiguration) {

    final List<BpmnParseListener> preParseListeners = getCustomPreBPMNParseListeners(processEngineConfiguration);
    preParseListeners.add(new AbstractBpmnParseListener() {
      @Override
      public void parseUserTask(final Element userTaskElement, final ScopeImpl scope, final ActivityImpl activity) {
        getTaskDefinition(activity).addTaskListener(EVENTNAME_CREATE, new SkillBasedRoutingListener(skillBasedRoutingService));
      }

      private TaskDefinition getTaskDefinition(final ActivityImpl activity) {
        final UserTaskActivityBehavior activityBehavior = (UserTaskActivityBehavior) activity.getActivityBehavior();
        return activityBehavior.getTaskDefinition();
      }
    });
  }

  private List<BpmnParseListener> getCustomPreBPMNParseListeners(ProcessEngineConfigurationImpl processEngineConfiguration) {
    List<BpmnParseListener> preParseListeners = processEngineConfiguration.getCustomPreBPMNParseListeners();
    if (preParseListeners == null) {
      preParseListeners = new ArrayList<BpmnParseListener>();
      processEngineConfiguration.setCustomPreBPMNParseListeners(preParseListeners);
    }
    return preParseListeners;
  }
}
