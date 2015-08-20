package de.holisticon.bpm.sbr.plugin;

import api.CandidateResult;
import api.SkillBasedRoutingService;
import api.TaskHolder;
import com.google.common.base.Optional;
import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnDecisionOutput;
import org.camunda.bpm.dmn.engine.DmnDecisionResult;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.camunda.bpm.dmn.engine.impl.DmnEngineConfigurationImpl;
import org.slf4j.Logger;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.slf4j.LoggerFactory.getLogger;

public class SkillBasedRoutingServiceBean implements SkillBasedRoutingService {

  private final Logger logger = getLogger(this.getClass());
  private final DmnEngine dmnEngine = new DmnEngineConfigurationImpl().buildEngine();
  private final Map<String, DmnDecision> decisions = new HashMap<String, DmnDecision>();

  private final DmnFileSupplier dmnFileSupplier = new DmnFileSupplier();

  @Override
  public CandidateResult evaluate(final TaskHolder task, final Map<String, Object> variables) {
    final CandidateResult candidateResult = new CandidateResult();

    // prepare decision context for skills and authorizations
    Map<String, Object> context = new HashMap<String, Object>();
    prepareEvaluationProcessContext(context, task, variables);

    // skills
    final List<String> requiredSkills = evaluateResults(getProcessDefinitionKey(task), DECISION_REQUIRED_SKILLS, context, OUTPUT_REQUIRED_SKILLS);
    logger.info("Required skills {}", requiredSkills);
    // authorizations
    final List<String> requiredAuthorizations = evaluateResults(getProcessDefinitionKey(task), DECISION_REQUIRED_AUTHORIZATIONS, context,
        OUTPUT_REQUIRED_AUTHORIZATIONS);
    logger.info("Required authorizations {}", requiredAuthorizations);

    // prepare decision context for routing
    context = new HashMap<String, Object>();
    prepareEvaluationRoutingContext(context, requiredSkills, requiredAuthorizations);

    // routing
    final List<String> candidateUsers = evaluateResults(getProcessDefinitionKey(task), DECISION_CANDIDATE_USERS_ROUTING, context, OUTPUT_CANDIDATE_USERS);

    // users
    if (candidateUsers != null) {
      candidateResult.getCandidateUsers().addAll(candidateUsers);
      logger.info("Candidate users: {}", candidateUsers);
    }

    return candidateResult;
  }

  @SuppressWarnings("unchecked")
  public <T> List<T> evaluateResults(final String decisionResourceName, final String decisionName, final Map<String, Object> context, final String resultName) {

    final Optional<DmnDecision> decision = getDecision(decisionResourceName, decisionName);
    if (!decision.isPresent()) {
      return Collections.EMPTY_LIST;
    }

    final DmnDecisionResult result = dmnEngine.evaluate(decision.get(), context);
    final List<T> outputValues = new ArrayList<T>();
    if (result != null && !result.isEmpty()) {
      for (DmnDecisionOutput output : result) {
        outputValues.add((T) output.get(resultName));
      }
    }
    return outputValues;
  }

  /**
   * Retrieves a decision by name.
   * <p>
   * This method will try to load a decision, if this is not loaded yet
   * </p>
   *
   * @param decisionName name of the decision.
   * @return decision.
   */
  public Optional<DmnDecision> getDecision(final String decisionResourceName, final String decisionName) {
    if (!decisions.containsKey(decisionName)) {
      final File decisionPath = constructDecisionPath(decisionResourceName);

      try {
        final InputStream resourceAsStream = new FileInputStream(decisionPath);
        logger.info("Loading decision resource {} from {}", decisionResourceName, decisionPath);

        final DmnDecision decision = dmnEngine.parseDecision(resourceAsStream, decisionName);
        logger.info("Created decision {} from {}.", decisionName, decisionPath);
        decisions.put(decisionName, decision);
      } catch (FileNotFoundException e) {
        logger.error("Cannot read from {}", decisionPath);
      }

    }
    return Optional.fromNullable(decisions.get(decisionName));
  }

  /**
   * Constructs path for decision resource from decision name.
   *
   * @param decisionName name of the decision.
   * @return path to decision DMN resource.
   */
  private File constructDecisionPath(String decisionName) {
    String path = decisionName.concat(".dmn");

    return dmnFileSupplier.get().get(path);
  }

  /**
   * Prepares decision context for evaluation of process relevant information.
   *
   * @param context   context to use.
   * @param task      task information.
   * @param variables process/case execution variables.
   */
  public static void prepareEvaluationProcessContext(final Map<String, Object> context, final TaskHolder task, final Map<String, Object> variables) {
    context.put(INPUT_TASK, task);
    for (final String variableName : variables.keySet()) {
      context.put(variableName, variables.get(variableName));
    }
  }

  /**
   * Prepares evaluation context for evaluation of routing information.
   *
   * @param context                context to use.
   * @param requiredSkills         required skills.
   * @param requiredAuthorizations required authorizations.
   */
  public static void prepareEvaluationRoutingContext(final Map<String, Object> context, final List<String> requiredSkills,
                                                     final List<String> requiredAuthorizations) {

    context.put(OUTPUT_REQUIRED_AUTHORIZATIONS, requiredAuthorizations == null ? new ArrayList<String>() : requiredAuthorizations);
    context.put(OUTPUT_REQUIRED_SKILLS, requiredSkills == null ? new ArrayList<String>() : requiredSkills);
  }

  /**
   * Retrieves the process definition key from the task properties map.
   *
   * @param task map with task properties.
   * @return process definition key.
   */
  public String getProcessDefinitionKey(final Map<String, String> task) {
    final String processDefinitionId = task.get("processDefinitionId");
    return processDefinitionId.split(":")[0];
  }

  /**
   * Retrieves the process definition key from the task holder.
   *
   * @param task holder
   * @return process definition key.
   */
  public static String getProcessDefinitionKey(final TaskHolder task) {
    final String processDefinitionId = task.getProcessDefinitionId();
    return processDefinitionId.split(":")[0];
  }

}
