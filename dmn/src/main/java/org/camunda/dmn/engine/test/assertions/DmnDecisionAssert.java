package org.camunda.dmn.engine.test.assertions;

import java.util.HashMap;
import java.util.Map;

import org.camunda.dmn.engine.DmnDecision;
import org.camunda.dmn.engine.DmnDecisionResult;
import org.camunda.dmn.engine.context.DmnContextFactory;
import org.camunda.dmn.engine.context.DmnDecisionContext;

public class DmnDecisionAssert {

  private DmnDecision current;
  private DmnContextFactory dmnContextFactory;

  /**
   * Constructs the assert.
   * 
   * @param dmnEngine
   * @param current
   * @param factory
   */
  public DmnDecisionAssert(DmnDecision current, DmnContextFactory factory) {
    this.current = current;
    this.dmnContextFactory = factory;
  }

  public static DmnDecisionAssert assertThat(DmnDecision decision, DmnContextFactory factory) {
    return new DmnDecisionAssert(decision, factory);
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
    final DmnDecisionContext decisionContext = dmnContextFactory.createDecisionContext();
    if (variables != null) {
      decisionContext.getVariableContext().setVariables(variables);
    }
    final DmnDecisionResult result = decisionContext.evaluate(this.current);
    return new DmnDecisionResultAssert(this.current, result);
  }

}
