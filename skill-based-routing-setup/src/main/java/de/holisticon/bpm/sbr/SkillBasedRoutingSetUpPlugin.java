package de.holisticon.bpm.sbr;

import com.google.common.base.Joiner;
import org.camunda.bpm.engine.IdentityService;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.identity.User;
import org.camunda.bpm.engine.impl.cfg.AbstractProcessEnginePlugin;
import org.slf4j.Logger;

import java.util.List;

import static org.slf4j.LoggerFactory.getLogger;

public class SkillBasedRoutingSetUpPlugin extends AbstractProcessEnginePlugin {

  private final Logger logger = getLogger(this.getClass());

  @Override
  public void postProcessEngineBuild(final ProcessEngine processEngine) {
    final List<User> list = processEngine.getIdentityService().createUserQuery().list();


    logger.error("=============================================================== " + Joiner.on(",").join(list));
  }
}
