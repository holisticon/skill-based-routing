package de.holisticon.bpm.sbr.plugin;

import de.holisticon.bpm.sbr.plugin.SkillBasedRoutingService;
import de.holisticon.bpm.sbr.plugin.api.CandidateResult;
import de.holisticon.bpm.sbr.plugin.api.TaskHolder;
import org.camunda.bpm.engine.DecisionService;
import org.camunda.bpm.engine.delegate.DelegateTask;
import org.camunda.bpm.engine.delegate.TaskListener;
import org.slf4j.Logger;

import java.util.Map;

import static org.slf4j.LoggerFactory.getLogger;

public class SkillBasedRoutingListener implements TaskListener {

  private final Logger logger = getLogger(this.getClass());

  @Override
  public void notify(final DelegateTask delegateTask) {
    logger.info("Determining routing for {}", delegateTask.getTaskDefinitionKey());
    final DecisionService decisionService = delegateTask.getProcessEngineServices().getDecisionService();

    final Map<String, Object> vars = delegateTask.getVariables();
    final TaskHolder task = TaskHolder.fromTask(delegateTask);
    final CandidateResult candidateResult = SkillBasedRoutingService.evaluate(decisionService, task, vars);

    if (candidateResult != null) {
      delegateTask.addCandidateUsers(candidateResult.getCandidateUsers());
    }
  }
}
