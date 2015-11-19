package de.holisticon.bpm.sbr.plugin.decision;

import com.google.common.collect.Maps;
import org.camunda.bpm.engine.test.Deployment;
import org.junit.Test;

import java.util.Map;


public class ConstantDecisionTest {

  private final Map<String, Object> emptyVariables = Maps.newHashMap();

  @Test
  @Deployment(resources = "dmn/1.dmn")
  public void test_constant_value_foo() {
    //assertThat(rule.getEngine()).evaluates(rule.getDecision(), emptyVariables).hasResult().hasSingleOutput().hasSingleEntry("value", "foo");
  }

  @Test
  @Deployment(resources = "dmn/2.dmn")
  public void test_constant_value_bar() {
    //assertThat(rule.getEngine()).evaluates(rule.getDecision(), emptyVariables).hasResult().hasSingleOutput().hasSingleEntry("value", "bar");
  }

}
