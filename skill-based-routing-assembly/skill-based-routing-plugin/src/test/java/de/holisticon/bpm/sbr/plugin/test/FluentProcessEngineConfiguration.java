package de.holisticon.bpm.sbr.plugin.test;

import com.google.common.base.Supplier;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.impl.bpmn.parser.BpmnParseListener;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.camunda.bpm.engine.impl.cfg.ProcessEnginePlugin;
import org.camunda.bpm.engine.impl.cfg.StandaloneInMemProcessEngineConfiguration;
import org.camunda.bpm.engine.impl.jobexecutor.JobHandler;
import org.camunda.bpm.engine.test.mock.MockExpressionManager;

import java.util.ArrayList;

public class FluentProcessEngineConfiguration implements Supplier<ProcessEngineConfigurationImpl> {

    private final StandaloneInMemProcessEngineConfiguration processEngineConfiguration = new StandaloneInMemProcessEngineConfiguration() {{
        this.history = HISTORY_FULL;
        this.databaseSchemaUpdate = DB_SCHEMA_UPDATE_DROP_CREATE;
        this.jobExecutorActivate = false;
        this.expressionManager = new MockExpressionManager();
        this.setProcessEnginePlugins(new ArrayList<ProcessEnginePlugin>());
        this.setCustomPostBPMNParseListeners(new ArrayList<BpmnParseListener>());
        this.setCustomJobHandlers(new ArrayList<JobHandler>());
    }};

    public FluentProcessEngineConfiguration addProcessEnginePlugin(ProcessEnginePlugin plugin) {
        processEngineConfiguration.getProcessEnginePlugins().add(plugin);
        return this;
    }

    public FluentProcessEngineConfiguration addCustomJobHandler(JobHandler jobHandler) {
        processEngineConfiguration.getCustomJobHandlers().add(jobHandler);

        return this;
    }

    @Override
    public ProcessEngineConfigurationImpl get() {
        return processEngineConfiguration;
    }

    public ProcessEngine buildProcessEngine() {
        return processEngineConfiguration.buildProcessEngine();
    }
}
