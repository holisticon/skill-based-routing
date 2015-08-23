package de.holisticon.bpm.sbr.cdi;

import com.google.common.base.Supplier;
import org.camunda.bpm.engine.AuthorizationService;
import org.camunda.bpm.engine.CaseService;
import org.camunda.bpm.engine.FilterService;
import org.camunda.bpm.engine.FormService;
import org.camunda.bpm.engine.HistoryService;
import org.camunda.bpm.engine.IdentityService;
import org.camunda.bpm.engine.ManagementService;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.ProcessEngineServices;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;

import javax.annotation.Resource;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import javax.inject.Named;

/**
 * It is not possible to use the original camunda class here (engine-cdi does not work per module ref and we cannot include the jar since this is an ejb-jar only deployment.
 * So this producer has to take over.
 */
@Named
public class ProcessEngineServicesProducer implements Supplier<ProcessEngine>, ProcessEngineServices {

    @Resource(mappedName = "java:global/camunda-bpm-platform/process-engine/default")
    private ProcessEngine processEngine;

    @Produces
    @ApplicationScoped
    @Override
    public RuntimeService getRuntimeService() {
        return processEngine.getRuntimeService();
    }

    @Produces
    @ApplicationScoped
    @Override
    public RepositoryService getRepositoryService() {
        return processEngine.getRepositoryService();
    }

    @Produces
    @ApplicationScoped
    @Override
    public FormService getFormService() {
        return processEngine.getFormService();
    }

    @Produces
    @ApplicationScoped
    @Override
    public TaskService getTaskService() {
        return processEngine.getTaskService();
    }

    @Produces
    @ApplicationScoped
    @Override
    public HistoryService getHistoryService() {
        return processEngine.getHistoryService();
    }

    @Produces
    @ApplicationScoped
    @Override
    public IdentityService getIdentityService() {
        return processEngine.getIdentityService();
    }

    @Produces
    @ApplicationScoped
    @Override
    public ManagementService getManagementService() {
        return processEngine.getManagementService();
    }

    @Produces
    @ApplicationScoped
    @Override
    public AuthorizationService getAuthorizationService() {
        return processEngine.getAuthorizationService();
    }

    @Produces
    @ApplicationScoped
    @Override
    public CaseService getCaseService() {
        return processEngine.getCaseService();
    }

    @Produces
    @ApplicationScoped
    @Override
    public FilterService getFilterService() {
        return processEngine.getFilterService();
    }

    @Produces
    @ApplicationScoped
    @Override
    public ProcessEngine get() {
        return processEngine;
    }
}
