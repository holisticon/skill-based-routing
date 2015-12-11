package de.holisticon.bpm.sbr.plugin;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Function;
import com.google.common.collect.FluentIterable;
import de.holisticon.bpm.sbr.plugin.api.CandidateResult;
import de.holisticon.bpm.sbr.plugin.api.TaskHolder;
import org.camunda.bpm.dmn.engine.DmnDecisionRuleResult;
import org.camunda.bpm.dmn.engine.DmnDecisionTableResult;
import org.camunda.bpm.engine.DecisionService;
import org.slf4j.Logger;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.slf4j.LoggerFactory.getLogger;

public class SkillBasedRoutingService {

  private final DecisionService decisionService;

  public final static class Constants {

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
  }

  private static final Logger LOGGER = getLogger(SkillBasedRoutingService.class);

  private static final DmnDecisionResourceNameRetriever FROM_TASK = new DmnDecisionResourceNameRetriever();

  public SkillBasedRoutingService(DecisionService decisionService) {
    this.decisionService = decisionService;
  }

  /**
   * Delivers candidate rules and groups for task routing.
   *
   * @param task      task information.
   * @param variables instance variables (payload).
   * @return candidate result.
   */
  public CandidateResult evaluate(final TaskHolder task, final Map<String, Object> variables) {
    final CandidateResult candidateResult = new CandidateResult();

    // prepare decision context for skills and authorizations
    Map<String, Object> context = new HashMap<String, Object>();
    prepareEvaluationProcessContext(context, task, variables);

    // skills
    final List<String> requiredSkills = evaluateResults(FROM_TASK.apply(task), Constants.DECISION_REQUIRED_SKILLS, context, Constants.OUTPUT_REQUIRED_SKILLS);
    LOGGER.info("Required skills {}", requiredSkills);
    // authorizations
    final List<String> requiredAuthorizations = evaluateResults(FROM_TASK.apply(task), Constants.DECISION_REQUIRED_AUTHORIZATIONS, context, Constants.OUTPUT_REQUIRED_AUTHORIZATIONS);
    LOGGER.info("Required authorizations {}", requiredAuthorizations);

    // prepare decision context for routing
    context = new HashMap<String, Object>();
    prepareEvaluationRoutingContext(context, requiredSkills, requiredAuthorizations);

    // routing
    final List<String> candidateUsers = evaluateResults(FROM_TASK.apply(task), Constants.DECISION_CANDIDATE_USERS_ROUTING, context, Constants.OUTPUT_CANDIDATE_USERS);

    // users
    if (candidateUsers != null) {
      candidateResult.getCandidateUsers().addAll(candidateUsers);
      LOGGER.info("Candidate users: {}", candidateUsers);
    }

    return candidateResult;
  }

  @VisibleForTesting
  @SuppressWarnings("unchecked")
  <T> List<T> evaluateResults(final String decisionResourceName, final String decisionName, final Map<String, Object> context, final String resultName) {
    String decisionDefinitionKey = decisionResourceName + "_" + decisionName;

    final DmnDecisionTableResult results = decisionService.evaluateDecisionTableByKey(decisionDefinitionKey, context);

    return FluentIterable.from(results).transform(new Function<DmnDecisionRuleResult, T>() {
      @Override
      public T apply(DmnDecisionRuleResult result) {
        return (T) result.get(resultName);
      }
    }).toImmutableList();
  }

  /**
   * Prepares decision context for evaluation of process relevant information.
   *
   * @param context   context to use.
   * @param task      task information.
   * @param variables process/case execution variables.
   */
  void prepareEvaluationProcessContext(final Map<String, Object> context, final TaskHolder task, final Map<String, Object> variables) {
    context.put(Constants.INPUT_TASK, task);
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
  void prepareEvaluationRoutingContext(final Map<String, Object> context, final List<String> requiredSkills,
                                       final List<String> requiredAuthorizations) {

    context.put(Constants.OUTPUT_REQUIRED_AUTHORIZATIONS, requiredAuthorizations == null ? new ArrayList<String>() : requiredAuthorizations);
    context.put(Constants.OUTPUT_REQUIRED_SKILLS, requiredSkills == null ? new ArrayList<String>() : requiredSkills);
  }
}
