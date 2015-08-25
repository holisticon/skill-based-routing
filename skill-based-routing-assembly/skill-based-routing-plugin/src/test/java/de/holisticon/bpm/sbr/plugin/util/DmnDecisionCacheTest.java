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

import static org.junit.Assert.assertFalse;
import static org.mockito.Mockito.mock;
import static org.slf4j.LoggerFactory.getLogger;

public class DmnDecisionCacheTest {

  private final DmnDecision d1 = mock(DmnDecision.class);
  private final DmnDecision d2 = mock(DmnDecision.class);

  private final DmnDecisionLoader loader = mock(DmnDecisionLoader.class);

  private final DmnDecisionCache cache = new DmnDecisionCache(loader);

  private final Logger logger = getLogger(this.getClass());
  private final DmnEngine dmnEngine = new DmnEngineConfigurationImpl().buildEngine();
  private final DmnDecisionCache dmnDecisionCache = new DmnDecisionCache(dmnEngine, DmnDecisionLoaderTest.testResources());


  @Rule
  public final ExpectedException thrown = ExpectedException.none();

  @Test
  public void returns_empty_optional_if_key_is_not_found() {

  }


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
