package de.holisticon.bpm.sbr.plugin.util;


import com.google.common.cache.CacheBuilder;
import com.google.common.cache.LoadingCache;
import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnEngine;

import java.io.File;

public class DmnDecisionCache {

    private final LoadingCache<DmnDecisionLoader.Key, DmnDecision> cache;
    private final DmnEngine dmnEngine;
    private final File dmnDir;

    public DmnDecisionCache(DmnEngine dmnEngine, File dmnDir) {
        this.dmnEngine = dmnEngine;
        this.dmnDir = dmnDir;
        this.cache  = CacheBuilder.newBuilder().build(new DmnDecisionLoader(dmnEngine,dmnDir));
    }

    public DmnDecision get(String processDefinitionKey, String decisionId) {
        return cache.getUnchecked(new DmnDecisionLoader.Key(processDefinitionKey, decisionId));
    }

}
