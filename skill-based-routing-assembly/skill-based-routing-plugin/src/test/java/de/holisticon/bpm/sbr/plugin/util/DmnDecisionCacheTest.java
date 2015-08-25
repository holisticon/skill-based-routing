package de.holisticon.bpm.sbr.plugin.util;

import java.util.HashMap;

import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnDecisionResult;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.camunda.bpm.dmn.engine.DmnExpressionException;
import org.camunda.bpm.dmn.engine.impl.DmnEngineConfigurationImpl;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.slf4j.Logger;

import static org.slf4j.LoggerFactory.getLogger;

import static org.junit.Assert.assertFalse;

public class DmnDecisionCacheTest {

  private final Logger logger = getLogger(this.getClass());
  private final DmnEngine dmnEngine = new DmnEngineConfigurationImpl().buildEngine();
  private final DmnDecisionCache dmnDecisionCache = new DmnDecisionCache(dmnEngine, DmnDecisionLoaderTest.testResources());

  @Rule
  public final ExpectedException thrown = ExpectedException.none();

  @Test
  public void evaluate_existing_file_and_decision() {
    // will fail because of missing context
    thrown.expect(DmnExpressionException.class);
    logger.info(evaluate(dmnDecisionCache.get("return-constant", "requiredSkills").get()));
  }

  @Test
  public void evaluate_existing_file_and_missing_decision() {
    assertFalse(dmnDecisionCache.get("return-constant", "missing").isPresent());
  }

  
  @Test
  public void evaluate_missing_file() {
    assertFalse(dmnDecisionCache.get("missing", "requiredSkills").isPresent());
  }

  private String evaluate(DmnDecision dmnDecision) {
    final DmnDecisionResult result = dmnEngine.evaluate(dmnDecision, new HashMap<String, Object>());
    return result.toString();
  }
}
