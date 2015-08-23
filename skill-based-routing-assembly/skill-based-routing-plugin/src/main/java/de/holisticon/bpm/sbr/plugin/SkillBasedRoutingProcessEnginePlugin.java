package de.holisticon.bpm.sbr.plugin;

import de.holisticon.bpm.sbr.plugin.listener.SkillBasedRoutingListener;
import org.camunda.bpm.engine.delegate.TaskListener;
import org.camunda.bpm.engine.impl.bpmn.behavior.UserTaskActivityBehavior;
import org.camunda.bpm.engine.impl.bpmn.parser.AbstractBpmnParseListener;
import org.camunda.bpm.engine.impl.bpmn.parser.BpmnParseListener;
import org.camunda.bpm.engine.impl.cfg.AbstractProcessEnginePlugin;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.camunda.bpm.engine.impl.pvm.process.ActivityImpl;
import org.camunda.bpm.engine.impl.pvm.process.ScopeImpl;
import org.camunda.bpm.engine.impl.task.TaskDefinition;
import org.camunda.bpm.engine.impl.util.xml.Element;
import org.slf4j.Logger;

import java.util.ArrayList;
import java.util.List;

import static org.camunda.bpm.engine.delegate.TaskListener.EVENTNAME_CREATE;
import static org.slf4j.LoggerFactory.getLogger;

public class SkillBasedRoutingProcessEnginePlugin extends AbstractProcessEnginePlugin {

    private final Logger logger = getLogger(this.getClass());

    private final SkillBasedRoutingService skillBasedRoutingService = new SkillBasedRoutingService();

    public SkillBasedRoutingProcessEnginePlugin() {

    }

    @Override
    public void preInit(final ProcessEngineConfigurationImpl processEngineConfiguration) {
        List<BpmnParseListener> preParseListeners = getCustomPreBPMNParseListeners(processEngineConfiguration);

        preParseListeners.add(new AbstractBpmnParseListener() {
            @Override
            public void parseUserTask(Element userTaskElement, ScopeImpl scope, ActivityImpl activity) {
                getTaskDefinition(activity).addTaskListener(EVENTNAME_CREATE, new SkillBasedRoutingListener(skillBasedRoutingService));
            }

            private TaskDefinition getTaskDefinition(ActivityImpl activity) {
                UserTaskActivityBehavior activityBehavior = (UserTaskActivityBehavior) activity.getActivityBehavior();
                return activityBehavior.getTaskDefinition();
            }
        });
    }



    private List<BpmnParseListener> getCustomPreBPMNParseListeners(ProcessEngineConfigurationImpl processEngineConfiguration) {
        List<BpmnParseListener> preParseListeners = processEngineConfiguration.getCustomPreBPMNParseListeners();
        if (preParseListeners == null) {
            preParseListeners = new ArrayList();
            processEngineConfiguration.setCustomPreBPMNParseListeners(preParseListeners);
        }
        return preParseListeners;
    }
}
