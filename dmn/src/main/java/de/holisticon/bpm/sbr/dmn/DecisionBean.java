package de.holisticon.bpm.sbr.dmn;


import org.camunda.bpm.model.dmn.impl.DmnElementImpl;
import org.camunda.dmn.engine.DmnDecision;
import org.camunda.dmn.engine.DmnDecisionResult;
import org.camunda.dmn.engine.DmnEngine;
import org.camunda.dmn.engine.context.DmnDecisionContext;
import org.camunda.dmn.engine.impl.DmnEngineConfigurationImpl;
import org.camunda.dmn.engine.impl.DmnEngineImpl;
import org.camunda.dmn.engine.impl.context.DmnContextFactoryImpl;
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
    decision = dmnEngine.parseDecision(getClass().getClassLoader().getResourceAsStream("/findApprover.dmn"));

    logger.info("create decision for findApprover.dmn");
  }

  public DmnDecisionResult evaluate(ApprovalSheet sheet) {
    final DmnDecisionContext decisionContext = new DmnContextFactoryImpl().createDecisionContext();
    decisionContext.getVariableContext().setVariable("sheet", sheet);

    return decisionContext.evaluate(decision);
  }


}
