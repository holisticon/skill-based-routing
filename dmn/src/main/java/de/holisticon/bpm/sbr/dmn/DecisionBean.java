package de.holisticon.bpm.sbr.dmn;


import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.camunda.bpm.dmn.engine.context.DmnDecisionContext;
import org.camunda.bpm.dmn.engine.impl.DmnEngineConfigurationImpl;
import org.camunda.bpm.dmn.engine.impl.context.DmnContextFactoryImpl;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.inject.Singleton;
import java.io.InputStream;

import static org.slf4j.LoggerFactory.getLogger;

@Singleton
public class DecisionBean {
  private final Logger logger = getLogger(this.getClass());

  private DmnDecision decision;

  @PostConstruct
  public void loadDecision() {

    DmnEngine dmnEngine = new DmnEngineConfigurationImpl().buildEngine();
    final InputStream resourceAsStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("findApprover.dmn");
    decision = dmnEngine.parseDecision(resourceAsStream);

    logger.info("create decision for findApprover.dmn");
  }

  public CandidateResult evaluate(ApprovalSheet sheet) {
    final DmnDecisionContext decisionContext = new DmnContextFactoryImpl().createDecisionContext();
    decisionContext.getVariableContext().setVariable("sheet", sheet);

    //return decisionContext.evaluate(decision);
    return new CandidateResult();
  }


}
