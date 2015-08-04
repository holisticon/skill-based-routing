package de.holisticon.bpm.sbr.dmn.test.assertions;

import org.assertj.core.api.Assertions;
import org.assertj.core.api.Condition;
import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnDecisionOutput;
import org.camunda.bpm.dmn.engine.DmnDecisionResult;

/**
 * Assert for decision result.
 * 
 * @author Simon Zambrovski (Holisticon AG)
 */
public class DmnDecisionResultAssert {

  private DmnDecisionResult current;
  private DmnDecision decision;

  public DmnDecisionResultAssert(DmnDecision decision, DmnDecisionResult current) {
    this.decision = decision;
    this.current = current;
  }
  
  /**
   * Checks if the output has exactly one result.
   * 
   * @return fluent instance.
   */
  public DmnDecisionResultAssert hasSingleResult() {
    return hasResults(1);
  }

  /**
   * Checks if the output has a given number of results.
   * 
   * @param count
   *          number of results.
   * @return fluent instance.
   */
  public DmnDecisionResultAssert hasResults(final int count) {
    Assertions
        .assertThat(current.size())
        .overridingErrorMessage("Expecting %s to evaluate to %d result(s), but found it to be evaluating to to '%d!", decision.toString(), count,
            current.size()).isEqualTo(count);

    return this;
  }

  /**
   * Checks if the result contains a value.
   * 
   * @param value
   *          value to check.
   * @return fluent instance.
   */
  public <T> DmnDecisionResultAssert hasValue(final T value) {

    final Condition<DmnDecisionOutput> dmnDecisionOutputCondition = new Condition<DmnDecisionOutput>("DmnDecisionOutput") {
      @Override
      public boolean matches(DmnDecisionOutput output) {
        return value.equals(output.getValue());
      }
    };

    Assertions.assertThat(current)
        .overridingErrorMessage("Expecting %s to contain a result %s result(s), but didn't find it!", current.toString(), value)
        .are(dmnDecisionOutputCondition);

    return this;
  }

}
