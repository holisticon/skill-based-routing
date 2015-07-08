package org.camunda.dmn.engine.test.rule;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface DecisionDeployment {
  public abstract String resource();
}
