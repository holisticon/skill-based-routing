package de.holisticon.bpm.sbr.dmn.api;

import org.camunda.bpm.engine.delegate.DelegateTask;

public interface SkillBasedRoutingService {

  String PG_JNDI = "java:global/skill-based-routing-dmn/skill-based-routing-dmn-impl/SkillBasedRoutinServiceBean";

  CandidateResult evaluate(final DelegateTask task);

}