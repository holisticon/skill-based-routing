package de.holisticon.bpm.sbr;

import org.camunda.bpm.engine.IdentityService;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.RuntimeService;
import org.slf4j.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;

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
