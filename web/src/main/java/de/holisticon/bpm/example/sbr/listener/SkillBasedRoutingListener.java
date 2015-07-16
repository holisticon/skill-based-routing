package de.holisticon.bpm.example.sbr.listener;

import de.holisticon.bpm.sbr.dmn.ApprovalSheet;
import de.holisticon.bpm.sbr.dmn.CustomerStatus;
import de.holisticon.bpm.sbr.dmn.DecisionBean;
import org.camunda.bpm.engine.delegate.DelegateTask;
import org.camunda.bpm.engine.delegate.TaskListener;
import org.camunda.dmn.engine.DmnDecisionResult;
import org.slf4j.Logger;

import javax.inject.Inject;
import javax.inject.Named;

import static org.slf4j.LoggerFactory.getLogger;

@Named
public class SkillBasedRoutingListener implements TaskListener{

  private final Logger logger = getLogger(this.getClass());

  //@Inject
  private DecisionBean decisionBean;

  @Override
  public void notify(DelegateTask delegateTask) {
    logger.info(delegateTask.getTaskDefinitionKey());

    //final DmnDecisionResult result = decisionBean.evaluate(new ApprovalSheet("foo", 1.0, CustomerStatus.BRONZE));

    //delegateTask.addCandidateGroup((String) result.getOutputs().iterator().next().getValue());
  }
}
