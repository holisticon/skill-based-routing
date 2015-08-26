package org.camunda.bpm.dmn.engine.test;

import java.util.Map;

import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnDecisionOutput;
import org.camunda.bpm.dmn.engine.DmnDecisionResult;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.junit.runner.Description;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DmnEngineTestRule extends DmnEngineRule {

  private Logger logger;

  public DmnEngine getEngine() {
    return engine;
  }

  public DmnDecision getDecision() {
    return decision;
  }

  public Logger getLogger() {
    return logger;
  }

  @Override
  protected DmnDecision loadDecision(Description description) {

    logger = LoggerFactory.getLogger(description.getTestClass());

    final DecisionResource annotation = description.getAnnotation(DecisionResource.class);
    if (annotation != null) {
      final String decisionKey = annotation.decisionKey();
      final String resourcePath = annotation.resource();
      if (resourcePath == null) {
        throw new IllegalStateException("Resource must be provided");
      }
      if (decisionKey != null) {
        return this.engine.parseDecision(resourcePath, decisionKey);
      }
      return this.engine.parseDecision(resourcePath);
    }

    return null;
  }

  /**
   * Pretty printer for the result.
   * 
   * @param dmnDecisionResult
   *          result to print.
   */
  public void prettyPrint(final DmnDecisionResult dmnDecisionResult) {
    int i = 0;
    getLogger().info("DMN Decision result:");
    for (final DmnDecisionOutput dmnDecisionOutput : dmnDecisionResult) {
      getLogger().info("| Output {}:", i++);
      for (final String key : dmnDecisionOutput.keySet()) {
        getLogger().info("|\t {} -> {}", key, dmnDecisionOutput.get(key));
      }
    }
  }

  public void prettyPrint(Map<String, Object> context) {
    getLogger().info("DMN Context:");
    for (final String key : context.keySet()) {
      getLogger().info("|\t {} -> {}", key, context.get(key));
    }
  }
}
