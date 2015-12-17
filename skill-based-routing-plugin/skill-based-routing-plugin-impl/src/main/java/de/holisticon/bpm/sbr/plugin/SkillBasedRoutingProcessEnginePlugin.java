package de.holisticon.bpm.sbr.plugin;

import com.google.common.base.Charsets;
import com.google.common.base.Throwables;
import com.google.common.io.Files;
import com.google.common.io.Resources;
import de.holisticon.bpm.sbr.plugin.setup.ShowcaseSetup;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.impl.bpmn.behavior.UserTaskActivityBehavior;
import org.camunda.bpm.engine.impl.bpmn.parser.AbstractBpmnParseListener;
import org.camunda.bpm.engine.impl.bpmn.parser.BpmnParseListener;
import org.camunda.bpm.engine.impl.cfg.AbstractProcessEnginePlugin;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.camunda.bpm.engine.impl.pvm.process.ActivityImpl;
import org.camunda.bpm.engine.impl.pvm.process.ScopeImpl;
import org.camunda.bpm.engine.impl.task.TaskDefinition;
import org.camunda.bpm.engine.impl.util.ClassLoaderUtil;
import org.camunda.bpm.engine.impl.util.xml.Element;
import org.camunda.bpm.engine.repository.DeploymentBuilder;
import org.slf4j.Logger;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import static org.camunda.bpm.engine.delegate.TaskListener.EVENTNAME_CREATE;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * Engine plugin, installing Skill-Based-Routing Listener to User Tasks.
 * <p/>
 * This class is registered in the ProcessEngineConfiguration.
 */
public class SkillBasedRoutingProcessEnginePlugin extends AbstractProcessEnginePlugin {

  private final Logger logger = getLogger(this.getClass());

  @Override
  public void preInit(final ProcessEngineConfigurationImpl configuration) {
    new ShowcaseSetup().run();

    customPreBPMNParseListeners(configuration).add(new AbstractBpmnParseListener() {
      @Override
      public void parseUserTask(final Element userTaskElement, final ScopeImpl scope, final ActivityImpl activity) {
        taskDefinition(activity).addTaskListener(EVENTNAME_CREATE, new SkillBasedRoutingListener());
      }
    });
  }


  /**
   * @param processEngineConfiguration the configuration
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
   * @param activity the taskActivity
   * @return taskDefinition for activity
   */
  private static TaskDefinition taskDefinition(final ActivityImpl activity) {
    final UserTaskActivityBehavior activityBehavior = (UserTaskActivityBehavior) activity.getActivityBehavior();
    return activityBehavior.getTaskDefinition();
  }

}
