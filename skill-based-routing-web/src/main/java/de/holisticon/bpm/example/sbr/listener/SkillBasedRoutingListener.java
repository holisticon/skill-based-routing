package de.holisticon.bpm.example.sbr.listener;

import com.google.common.base.Joiner;
import de.holisticon.bpm.sbr.dmn.api.CandidateResult;
import de.holisticon.bpm.sbr.dmn.api.SkillBasedRoutingService;
import org.camunda.bpm.engine.delegate.DelegateTask;
import org.camunda.bpm.engine.delegate.TaskListener;
import org.slf4j.Logger;

import javax.inject.Inject;
import javax.inject.Named;

import static org.slf4j.LoggerFactory.getLogger;

@Named
public class SkillBasedRoutingListener implements TaskListener {

  private final Logger logger = getLogger(this.getClass());

  @Inject
  private SkillBasedRoutingService decisionBean;

  @Override
  public void notify(DelegateTask delegateTask) {
    logger.info(delegateTask.getTaskDefinitionKey());

    final CandidateResult candidateResult = decisionBean.evaluate(delegateTask);
    if (candidateResult != null) {
      delegateTask.addCandidateUser(Joiner.on(",").join(candidateResult.getCandidateUsers()));
      delegateTask.addCandidateGroup(Joiner.on(",").join(candidateResult.getCandidateGroups()));
    }
  }
}
