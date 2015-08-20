package de.holisticon.bpm.example.sbr.listener;

import java.util.Map;

import javax.inject.Inject;
import javax.inject.Named;

import org.camunda.bpm.engine.delegate.DelegateTask;
import org.camunda.bpm.engine.delegate.TaskListener;
import org.slf4j.Logger;

import com.google.common.base.Joiner;

import de.holisticon.bpm.sbr.dmn.api.CandidateResult;
import de.holisticon.bpm.sbr.dmn.api.SkillBasedRoutingService;
import de.holisticon.bpm.sbr.dmn.api.TaskHolder;
import static org.slf4j.LoggerFactory.getLogger;

@Named
public class SkillBasedRoutingListener implements TaskListener {

  private final Logger logger = getLogger(this.getClass());

  @Inject
  private SkillBasedRoutingService decisionBean;

  @Override
  public void notify(final DelegateTask delegateTask) {
    logger.info("Determining routing for {}", delegateTask.getTaskDefinitionKey());

    final Map<String, Object> vars = delegateTask.getVariables();
    final TaskHolder task = TaskHolder.fromTask(delegateTask);
    final CandidateResult candidateResult = decisionBean.evaluate(task, vars);

    if (candidateResult != null) {
      for (String user : candidateResult.getCandidateUsers()) {
        delegateTask.addCandidateUser(user);
      }
      for (String group : candidateResult.getCandidateGroups()) {
        delegateTask.addCandidateGroup(group);
      }
    }
  }
}
