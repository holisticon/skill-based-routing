package de.holisticon.bpm.sbr.plugin.util;


import com.google.common.base.Optional;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.LoadingCache;
import de.holisticon.bpm.sbr.plugin.util.DmnDecisionLoader.Key;
import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnEngine;

import java.io.File;

public class DmnDecisionCache {

    private final LoadingCache<Key, DmnDecision> cache;

    public DmnDecisionCache(DmnEngine dmnEngine, File dmnDir) {
        this(new DmnDecisionLoader(dmnEngine, dmnDir));
    }

    public DmnDecisionCache(final DmnDecisionLoader dmnDecisionLoader) {
        this.cache = CacheBuilder.newBuilder().build(dmnDecisionLoader);
    }

    public Optional<DmnDecision> get(String processDefinitionKey, String decisionId) {
        return Optional.fromNullable(cache.getUnchecked(new Key(processDefinitionKey, decisionId)));
    }

}
