package de.holisticon.bpm.sbr.dmn;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.ejb.Remote;
import javax.ejb.Singleton;

import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnDecisionOutput;
import org.camunda.bpm.dmn.engine.DmnDecisionResult;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.camunda.bpm.dmn.engine.impl.DmnEngineConfigurationImpl;
import org.slf4j.Logger;

import de.holisticon.bpm.sbr.dmn.api.CandidateResult;
import de.holisticon.bpm.sbr.dmn.api.SkillBasedRoutingService;
import de.holisticon.bpm.sbr.dmn.api.TaskHolder;
import static org.slf4j.LoggerFactory.getLogger;

@Singleton
@Remote(SkillBasedRoutingService.class)
public class SkillBasedRoutingServiceBean implements SkillBasedRoutingService {
  private final Logger logger = getLogger(this.getClass());

  private DmnEngine dmnEngine;

  private Map<String, DmnDecision> decisions;

  @PostConstruct
  public void initializeEngine() {
    decisions = new HashMap<String, DmnDecision>();
    dmnEngine = new DmnEngineConfigurationImpl().buildEngine();
  }

  @Override
  public CandidateResult evaluate(final TaskHolder task, final Map<String, Object> variables) {
    final CandidateResult candidateResult = new CandidateResult();
    final Map<String, Object> context = new HashMap<String, Object>();
    context.put("variables", variables);
    context.put("task", task);
    final String candidateGroup = evaluateSingleResult(getProcessDefinitionKey(task), context, "group");
    if (candidateGroup != null) {
      candidateResult.getCandidateGroups().add(candidateGroup);
      logger.info("Candidate group: {}", candidateGroup);
    }
    final String candidateUser = evaluateSingleResult(getProcessDefinitionKey(task), context, "user");
    if (candidateUser != null) {
      candidateResult.getCandidateUsers().add(candidateUser);
      logger.info("Candidate user: {}", candidateUser);
    }

    return candidateResult;
  }

  @SuppressWarnings("unchecked")
  public <T> T evaluateSingleResult(final String decisionName, final Map<String, Object> context, final String resultName) {
    final DmnDecisionResult result = dmnEngine.evaluate(getDecision(decisionName), context);
    if (result != null && !result.isEmpty()) {
      final DmnDecisionOutput output = result.get(0);
      if (result.size() > 1) {
        logger.warn("Warning, there were multiple results available.");
      }
      return (T) output.get(resultName);
    }
    return null;
  }

  /**
   * Retrieves the process definition key from the task delegate.
   * 
   * @param task
   *          delegate.
   * @return process definition key.
   */
  private String getProcessDefinitionKey(final Map<String, String> task) {
    final String processDefinitionId = task.get("processDefinitionId");
    return processDefinitionId.split(":")[0];
  }

  private String getProcessDefinitionKey(final TaskHolder task) {
    final String processDefinitionId = task.getProcessDefinitionId();
    return processDefinitionId.split(":")[0];
  }

  /**
   * Retrieves a decision by name.
   * <p>
   * This method will try to load a decision, if this is not loaded yet
   * </p>
   * 
   * @param decisionName
   *          name of the decision.
   * @return decision.
   */
  private DmnDecision getDecision(final String decisionName) {
    if (!decisions.containsKey(decisionName)) {
      final String decisionPath = constructDecisionPath(decisionName);
      logger.info("Loading decision {} from {}", decisionName, decisionPath);
      final InputStream resourceAsStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(decisionPath);
      if (resourceAsStream == null) {
        throw new IllegalArgumentException("Could not load specified decision " + decisionPath);
      }
      final DmnDecision decision = dmnEngine.parseDecision(resourceAsStream);
      logger.info("Created decision for {}.", decisionName);
      decisions.put(decisionName, decision);
    }
    return decisions.get(decisionName);
  }

  /**
   * Constructs path for decision resource from decision name.
   * 
   * @param decisionName
   *          name of the decision.
   * @return path to decision DMN resource.
   */
  private String constructDecisionPath(String decisionName) {
    return decisionName.concat(".dmn");
  }

}
