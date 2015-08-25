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

  @Test
  @DecisionResource(resource = "dmn/1.dmn", decisionKey = "constant")
  public void test_constant_value_foo() {
    Map<String, Object> variables = Maps.newHashMap();
    assertThat(rule.getEngine()).evaluates(rule.getDecision(), variables).hasResult().hasSingleOutput().hasSingleEntry("value", "foo");
  }

  @Test
  @DecisionResource(resource = "dmn/2.dmn", decisionKey = "constant")
  public void test_constant_value_bar() {
    Map<String, Object> variables = Maps.newHashMap();
    assertThat(rule.getEngine()).evaluates(rule.getDecision(), variables).hasResult().hasSingleOutput().hasSingleEntry("value", "bar");
  }

}
