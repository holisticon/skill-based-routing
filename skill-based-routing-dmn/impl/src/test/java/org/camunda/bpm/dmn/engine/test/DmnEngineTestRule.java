package org.camunda.bpm.dmn.engine.test;

import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.junit.runner.Description;

public class DmnEngineTestRule extends DmnEngineRule {

  public DmnDecision getDecision() {
    return decision;
  }

  public DmnEngine getDmnEngine() {
    return engine;
  }

  @Override
  protected DmnDecision loadDecision(Description description) {

    final DecisionResource annotation = description.getAnnotation(DecisionResource.class);
    if (annotation != null) {
      final String resourcePath = annotation.resource();
      if (resourcePath == null) {
        throw new IllegalStateException("Resource must be provided");
      }
      return this.engine.parseDecision(resourcePath);
    }

    return null;
  }
}
