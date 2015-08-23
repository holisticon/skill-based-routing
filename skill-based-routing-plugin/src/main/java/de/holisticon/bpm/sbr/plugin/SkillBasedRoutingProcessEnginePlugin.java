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

import static org.slf4j.LoggerFactory.getLogger;

public class SkillBasedRoutingProcessEnginePlugin extends AbstractProcessEnginePlugin {

    private final Logger logger = getLogger(this.getClass());

    private final SkillBasedRoutingService skillBasedRoutingService = new SkillBasedRoutingService();

    public SkillBasedRoutingProcessEnginePlugin() {

    }

    @Override
    public void preInit(final ProcessEngineConfigurationImpl processEngineConfiguration) {
        List<BpmnParseListener> preParseListeners = processEngineConfiguration.getCustomPreBPMNParseListeners();
        if (preParseListeners == null) {
            preParseListeners = new ArrayList();
            processEngineConfiguration.setCustomPreBPMNParseListeners(preParseListeners);
        }

        preParseListeners.add(new AbstractBpmnParseListener() {
            @Override
            public void parseUserTask(Element userTaskElement, ScopeImpl scope, ActivityImpl activity) {
                UserTaskActivityBehavior activityBehavior = (UserTaskActivityBehavior) activity.getActivityBehavior();
                TaskDefinition taskDefinition = activityBehavior.getTaskDefinition();
                taskDefinition.addTaskListener(TaskListener.EVENTNAME_CREATE, new SkillBasedRoutingListener(skillBasedRoutingService));
            }
        });
    }
}
