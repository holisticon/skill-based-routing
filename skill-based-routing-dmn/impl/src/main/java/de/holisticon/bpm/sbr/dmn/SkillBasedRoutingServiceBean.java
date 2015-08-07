package de.holisticon.bpm.sbr.dmn;

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

import javax.annotation.PostConstruct;
import javax.ejb.Remote;
import javax.ejb.Stateless;
import javax.inject.Inject;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import static org.slf4j.LoggerFactory.getLogger;

@Stateless
@Remote(SkillBasedRoutingService.class)
public class SkillBasedRoutingServiceBean implements SkillBasedRoutingService {
  private final Logger logger = getLogger(this.getClass());

  private final static String DMN_RESOURCE = "findApprover.dmn";
  private DmnDecision decision;
  private DmnEngine dmnEngine;

  @Inject
  private CreateApprovalSheet createApprovalSheet;

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


    context.put("sheet", createApprovalSheet.apply(task));
    String candidateGroup = evaluateSingleResult(context, "group");
    if (candidateGroup != null) {
      candidateResult.getCandidateGroups().add(candidateGroup);
    }
    logger.info("Candidate group: {}", candidateGroup);
    return candidateResult;
  }

}
