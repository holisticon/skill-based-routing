package de.holisticon.bpm.sbr.dmn.test.assertions;

import java.util.HashMap;
import java.util.Map;

import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnDecisionResult;
import org.camunda.bpm.dmn.engine.DmnEngine;

public class DmnDecisionAssert {

  private DmnDecision current;
  private DmnEngine dmnEngine;

  /**
   * Constructs the assert.
   * 
   * @param current
   * @param factory
   */
  public DmnDecisionAssert(DmnDecision current, DmnEngine engine) {
    this.current = current;
    this.dmnEngine = engine;
  }

  public static DmnDecisionAssert assertThat(DmnDecision decision, DmnEngine engine) {
    return new DmnDecisionAssert(decision, engine);
  }

  /**
   * Evaluates the rule.
   * 
   * @return fluent instance.
   */
  public DmnDecisionResultAssert evaluate() {
    return evaluate((Map<String, Object>) null);
  }

  /**
   * Evaluates the rule using variables.
   * 
   * @param variables
   *          in form of key1, value1, key2, value2, etc...
   * 
   * @return fluent instance.
   */
  public DmnDecisionResultAssert evaluate(Object... variables) {
    final Map<String, Object> varMap = new HashMap<String, Object>(variables.length);
    for (int i = 0; i < variables.length; i++) {
      varMap.put((String) variables[i], variables[++i]);
    }
    return evaluate(varMap);
  }

  /**
   * Evaluates the rule with a map of variables.
   * 
   * @param variables
   *          map of variables, keyed by names.
   * 
   * @return fluent instance.
   */
  public DmnDecisionResultAssert evaluate(final Map<String, Object> variables) {
    final DmnDecisionResult result = dmnEngine.evaluate(this.current, variables);
    return new DmnDecisionResultAssert(this.current, result);
  }

}
