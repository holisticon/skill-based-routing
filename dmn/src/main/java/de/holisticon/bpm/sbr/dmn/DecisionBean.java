package de.holisticon.bpm.sbr.dmn;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Singleton;

import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnDecisionOutput;
import org.camunda.bpm.dmn.engine.DmnDecisionResult;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.camunda.bpm.dmn.engine.impl.DmnEngineConfigurationImpl;
import org.slf4j.Logger;

import static org.slf4j.LoggerFactory.getLogger;

@Singleton
public class DecisionBean {
  private final Logger logger = getLogger(this.getClass());

  private final static String DMN_RESOURCE = "findApprover.dmn";
  private DmnDecision decision;
  private DmnEngine dmnEngine;

  @PostConstruct
  public void loadDecision() {

    dmnEngine = new DmnEngineConfigurationImpl().buildEngine();
    final InputStream resourceAsStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(DMN_RESOURCE);
    decision = dmnEngine.parseDecision(resourceAsStream);
    logger.info("created decision for " + DMN_RESOURCE);
  }

  @SuppressWarnings("unchecked")
  public <T> T evaluateSingleResult(final Map<String, Object> context, String resultName) {
    final DmnDecisionResult result = dmnEngine.evaluate(decision, context);
    if (result != null && !result.isEmpty()) {
      final DmnDecisionOutput output = result.get(0);
      return (T) output.get(resultName);
    }
    return null;
  }

  public CandidateResult evaluate(ApprovalSheet sheet) {
    final CandidateResult candidateResult = new CandidateResult();
    final Map<String, Object> context = new HashMap<String, Object>();
    context.put("sheet", sheet);
    String candidateGroup = evaluateSingleResult(context, "group");
    if (candidateGroup != null) {
      candidateResult.getCandidateGroups().add(candidateGroup);
    }
    logger.info("Candidate group: {}", candidateGroup);
    return candidateResult;
  }

}
