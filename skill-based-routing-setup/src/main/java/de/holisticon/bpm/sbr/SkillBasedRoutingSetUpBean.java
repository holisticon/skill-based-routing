package de.holisticon.bpm.sbr;

import com.google.common.base.Joiner;
import com.google.common.base.Objects;
import org.camunda.bpm.BpmPlatform;
import org.camunda.bpm.engine.IdentityService;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.ProcessEngines;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.identity.User;
import org.camunda.bpm.engine.impl.cfg.AbstractProcessEnginePlugin;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.DependsOn;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import java.util.List;

import static org.slf4j.LoggerFactory.getLogger;

@Startup
@Singleton
public class SkillBasedRoutingSetUpBean {

  private final Logger logger = getLogger(this.getClass());

  @Inject
  private IdentityService identityService;

  @Inject
  private ProcessEngine processEngine;

  @Inject
  private RuntimeService runtimeService;

  @PostConstruct
  public void init() {
    // empty
  }

}
