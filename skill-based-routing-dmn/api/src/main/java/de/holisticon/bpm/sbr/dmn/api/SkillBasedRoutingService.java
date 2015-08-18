package de.holisticon.bpm.sbr.dmn.api;

import java.util.Map;

public interface SkillBasedRoutingService {

  String PG_JNDI = "java:global/skill-based-routing-dmn/skill-based-routing-dmn-impl/SkillBasedRoutingServiceBean!de.holisticon.bpm.sbr.dmn.api.SkillBasedRoutingService";

  CandidateResult evaluate(final TaskHolder taskHolder, final Map<String, Object> vars);

}
