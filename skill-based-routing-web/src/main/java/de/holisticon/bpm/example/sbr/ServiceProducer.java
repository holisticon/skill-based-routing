package de.holisticon.bpm.example.sbr;

import de.holisticon.bpm.sbr.dmn.api.SkillBasedRoutingService;

import javax.ejb.EJB;
import javax.enterprise.inject.Produces;
import javax.inject.Singleton;

@Singleton
public final class ServiceProducer {

  @EJB(lookup = SkillBasedRoutingService.PG_JNDI)
  private SkillBasedRoutingService skillBasedRoutingService;

  @Produces
  SkillBasedRoutingService skillBasedRoutingService() {
    return skillBasedRoutingService;
  }

  private ServiceProducer() {
  }

}
