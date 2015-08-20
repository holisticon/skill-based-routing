package de.holisticon.bpm.sbr.dmn.api;

import java.util.Map;

/**
 * Skill-based routing service, evaluating the rules for task assignment.
 * 
 * @author Simon Zambrovski (Holisticon AG)
 */
public interface SkillBasedRoutingService {

  /**
   * Name of the input variable task.
   */
  String INPUT_TASK = "task";
  /**
   * Name of the output variable for skills.
   */
  String OUTPUT_REQUIRED_SKILLS = "requiredSkills";

  /**
   * Name of the output variable for authorizations.
   */
  String OUTPUT_REQUIRED_AUTHORIZATIONS = "requiredAuthorizations";

  /**
   * Name of the output variable for users.
   */
  String OUTPUT_CANDIDATE_USERS = "candidateUsers";
  /**
   * Name of the output variable for groups.
   */
  String OUTPUT_CANDIDATE_GROUPS = "candidateGroups";

  /**
   * Name of the decision table for required skills.
   */
  String DECISION_REQUIRED_SKILLS = "requiredSkills";

  /**
   * Name of the decision table for required skills.
   */
  String DECISION_REQUIRED_AUTHORIZATIONS = "requiredAuthorizations";

  /**
   * Name of the decision table for candidate users.
   */
  String DECISION_CANDIDATE_USERS_ROUTING = "candidateUsersRouting";

  /**
   * Global JNDI names of the implementation.
   */
  String PG_JNDI = "java:global/skill-based-routing-dmn/skill-based-routing-dmn-impl/SkillBasedRoutingServiceBean!de.holisticon.bpm.sbr.dmn.api.SkillBasedRoutingService";

  /**
   * Delivers candidate rules and groups for task routing.
   * 
   * @param taskHolder
   *          task information.
   * @param vars
   *          instance variables (payload).
   * @return candidate result.
   */
  CandidateResult evaluate(final TaskHolder taskHolder, final Map<String, Object> vars);

}
