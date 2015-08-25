package de.holisticon.bpm.sbr.plugin.decision;

import java.util.Map;

import org.camunda.bpm.dmn.engine.test.DecisionResource;
import org.camunda.bpm.dmn.engine.test.DmnEngineTestRule;
import org.junit.Rule;
import org.junit.Test;

import com.google.common.collect.Maps;

import static org.camunda.bpm.dmn.engine.test.asserts.DmnAssertions.assertThat;

public class ConstantDecisionTest {

  @Rule
  public DmnEngineTestRule rule = new DmnEngineTestRule();

  private final Map<String, Object> emptyVariables = Maps.newHashMap();

  @Test
  @DecisionResource(resource = "dmn/1.dmn", decisionKey = "constant")
  public void test_constant_value_foo() {
    assertThat(rule.getEngine()).evaluates(rule.getDecision(), emptyVariables).hasResult().hasSingleOutput().hasSingleEntry("value", "foo");
  }

  @Test
  @DecisionResource(resource = "dmn/2.dmn", decisionKey = "constant")
  public void test_constant_value_bar() {
    assertThat(rule.getEngine()).evaluates(rule.getDecision(), emptyVariables).hasResult().hasSingleOutput().hasSingleEntry("value", "bar");
  }

}
