package de.holisticon.bpm.sbr.plugin;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnDecisionOutput;
import org.camunda.bpm.dmn.engine.DmnDecisionResult;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.camunda.bpm.dmn.engine.impl.DmnEngineConfigurationImpl;
import org.slf4j.Logger;

import com.google.common.base.Optional;

import de.holisticon.bpm.sbr.plugin.api.CandidateResult;
import de.holisticon.bpm.sbr.plugin.api.TaskHolder;
import de.holisticon.bpm.sbr.plugin.util.DmnDecisionCache;
import de.holisticon.bpm.sbr.plugin.util.DmnDecisionResourceNameRetriever;
import static org.slf4j.LoggerFactory.getLogger;

public class SkillBasedRoutingService {

  /**
   * Name of the input variable task.
   */
  public static final String INPUT_TASK = "task";
  /**
   * Name of the output variable for skills.
   */
  public static final String OUTPUT_REQUIRED_SKILLS = "requiredSkills";

  /**
   * Name of the output variable for authorizations.
   */
  public static final String OUTPUT_REQUIRED_AUTHORIZATIONS = "requiredAuthorizations";

  /**
   * Name of the output variable for users.
   */
  public static final String OUTPUT_CANDIDATE_USERS = "candidateUsers";
  /**
   * Name of the output variable for groups.
   */
  public static final String OUTPUT_CANDIDATE_GROUPS = "candidateGroups";

  /**
   * Name of the decision table for required skills.
   */
  public static final String DECISION_REQUIRED_SKILLS = "requiredSkills";

  /**
   * Name of the decision table for required skills.
   */
  public static final String DECISION_REQUIRED_AUTHORIZATIONS = "requiredAuthorizations";

  /**
   * Name of the decision table for candidate users.
   */
  public static final String DECISION_CANDIDATE_USERS_ROUTING = "candidateUsersRouting";

  private final Logger logger = getLogger(this.getClass());
  private final DmnEngine dmnEngine = new DmnEngineConfigurationImpl().buildEngine();
  private final File dmnPath = new File(System.getProperty("jboss.server.config.dir") + File.separator + "dmn");
  private final DmnDecisionCache decisionCache = new DmnDecisionCache(dmnEngine, dmnPath);
  private final DmnDecisionResourceNameRetriever fromTask = new DmnDecisionResourceNameRetriever();

  /**
   * Delivers candidate rules and groups for task routing.
   * 
   * @param task
   *          task information.
   * @param variables
   *          instance variables (payload).
   * @return candidate result.
   */
  public CandidateResult evaluate(final TaskHolder task, final Map<String, Object> variables) {
    final CandidateResult candidateResult = new CandidateResult();

    // prepare decision context for skills and authorizations
    Map<String, Object> context = new HashMap<String, Object>();
    prepareEvaluationProcessContext(context, task, variables);

    // skills
    final List<String> requiredSkills = evaluateResults(fromTask.apply(task), DECISION_REQUIRED_SKILLS, context, OUTPUT_REQUIRED_SKILLS);
    logger.info("Required skills {}", requiredSkills);
    // authorizations
    final List<String> requiredAuthorizations = evaluateResults(fromTask.apply(task), DECISION_REQUIRED_AUTHORIZATIONS, context,
        OUTPUT_REQUIRED_AUTHORIZATIONS);
    logger.info("Required authorizations {}", requiredAuthorizations);

    // prepare decision context for routing
    context = new HashMap<String, Object>();
    prepareEvaluationRoutingContext(context, requiredSkills, requiredAuthorizations);

    // routing
    final List<String> candidateUsers = evaluateResults(fromTask.apply(task), DECISION_CANDIDATE_USERS_ROUTING, context, OUTPUT_CANDIDATE_USERS);

    // users
    if (candidateUsers != null) {
      candidateResult.getCandidateUsers().addAll(candidateUsers);
      logger.info("Candidate users: {}", candidateUsers);
    }

    return candidateResult;
  }

  @SuppressWarnings("unchecked")
  public <T> List<T> evaluateResults(final String decisionResourceName, final String decisionName, final Map<String, Object> context, final String resultName) {

    final Optional<DmnDecision> decision = decisionCache.get(decisionResourceName, decisionName);
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
   * Prepares decision context for evaluation of process relevant information.
   * 
   * @param context
   *          context to use.
   * @param task
   *          task information.
   * @param variables
   *          process/case execution variables.
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
   * @param context
   *          context to use.
   * @param requiredSkills
   *          required skills.
   * @param requiredAuthorizations
   *          required authorizations.
   */
  public static void prepareEvaluationRoutingContext(final Map<String, Object> context, final List<String> requiredSkills,
      final List<String> requiredAuthorizations) {

    context.put(OUTPUT_REQUIRED_AUTHORIZATIONS, requiredAuthorizations == null ? new ArrayList<String>() : requiredAuthorizations);
    context.put(OUTPUT_REQUIRED_SKILLS, requiredSkills == null ? new ArrayList<String>() : requiredSkills);
  }
}
