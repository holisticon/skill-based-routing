package de.holisticon.bpm.example.sbr.listener;

import com.google.common.base.Joiner;
import de.holisticon.bpm.sbr.dmn.ApprovalSheet;
import de.holisticon.bpm.sbr.dmn.CandidateResult;
import de.holisticon.bpm.sbr.dmn.CustomerStatus;
import de.holisticon.bpm.sbr.dmn.DecisionBean;
import org.camunda.bpm.engine.delegate.DelegateTask;
import org.camunda.bpm.engine.delegate.TaskListener;
import org.slf4j.Logger;

import javax.inject.Inject;
import javax.inject.Named;

import static org.slf4j.LoggerFactory.getLogger;

@Named
public class SkillBasedRoutingListener implements TaskListener{

  private final Logger logger = getLogger(this.getClass());

  @Inject
  private DecisionBean decisionBean;

  @Override
  public void notify(DelegateTask delegateTask) {
    logger.info(delegateTask.getTaskDefinitionKey());

    final CandidateResult result = decisionBean.evaluate(new ApprovalSheet("foo", 1.0, CustomerStatus.BRONZE));

    delegateTask.addCandidateGroup(Joiner.on(",").join(result.getCandidateGroups()));
  }
}
