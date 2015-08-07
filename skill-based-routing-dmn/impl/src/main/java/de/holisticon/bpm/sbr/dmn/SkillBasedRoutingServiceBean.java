package de.holisticon.bpm.sbr.dmn;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.ejb.Remote;
import javax.ejb.Stateless;

import de.holisticon.bpm.sbr.api.CustomerStatus;
import de.holisticon.bpm.sbr.dmn.api.CandidateResult;
import de.holisticon.bpm.sbr.dmn.api.SkillBasedRoutingService;
import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnDecisionOutput;
import org.camunda.bpm.dmn.engine.DmnDecisionResult;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.camunda.bpm.dmn.engine.impl.DmnEngineConfigurationImpl;
import org.camunda.bpm.engine.delegate.DelegateTask;
import org.slf4j.Logger;

import static org.slf4j.LoggerFactory.getLogger;

@Stateless
@Remote(SkillBasedRoutingService.class)
public class SkillBasedRoutingServiceBean implements SkillBasedRoutingService {
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


  @Override
  public CandidateResult evaluate(final DelegateTask task) {
    final CandidateResult candidateResult = new CandidateResult();
    final Map<String, Object> context = new HashMap<String, Object>();

    String customerStatus = (String) task.getVariable("customerStatus");
    double approvalSum = (double) task.getVariable("aprovalSum");
    String

    context.put("sheet", new ApprovalSheet("",0.0, CustomerStatus.BRONZE));
    String candidateGroup = evaluateSingleResult(context, "group");
    if (candidateGroup != null) {
      candidateResult.getCandidateGroups().add(candidateGroup);
    }
    logger.info("Candidate group: {}", candidateGroup);
    return candidateResult;
  }
}
