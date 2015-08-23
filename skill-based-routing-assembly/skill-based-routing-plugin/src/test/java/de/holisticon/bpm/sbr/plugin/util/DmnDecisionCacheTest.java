package de.holisticon.bpm.sbr.plugin.util;


import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnDecisionResult;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.camunda.bpm.dmn.engine.DmnExpressionException;
import org.camunda.bpm.dmn.engine.impl.DmnEngineConfigurationImpl;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.slf4j.Logger;

import java.util.HashMap;

import static org.slf4j.LoggerFactory.getLogger;

public class DmnDecisionCacheTest {

    private final Logger logger = getLogger(this.getClass());
    private final DmnEngine dmnEngine = new DmnEngineConfigurationImpl().buildEngine();
    private final DmnDecisionCache dmnDecisionCache = new DmnDecisionCache(dmnEngine, DmnDecisionLoaderTest.testResources());

    @Rule
    public final ExpectedException thrown = ExpectedException.none();

    @Test
    public void evaluate() {
        // will fail because of missing context
        thrown.expect(DmnExpressionException.class);
        logger.info(evaluate(dmnDecisionCache.get("return-constant", "requiredSkills")));
    }


    private String evaluate(DmnDecision dmnDecision) {
        final DmnDecisionResult result = dmnEngine.evaluate(dmnDecision, new HashMap<String, Object>());
        return result.toString();
    }
}
