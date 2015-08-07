package de.holisticon.bpm.sbr.dmn.test.assertions;

import org.assertj.core.api.Assertions;
import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.camunda.bpm.dmn.engine.impl.context.DmnContextFactoryImpl;

public class DmnEngineAssertions extends Assertions {

  static ThreadLocal<DmnEngine> dmnEngineTL = new ThreadLocal<DmnEngine>();
  static ThreadLocal<DmnDecisionAssert> dmnDecisionAssertTL = new ThreadLocal<DmnDecisionAssert>();

  protected DmnEngineAssertions() {
  }

  public static void init(final DmnEngine dmnEngine) {
    DmnEngineAssertions.dmnEngineTL.set(dmnEngine);
  }

  public static void reset() {
    DmnEngineAssertions.dmnEngineTL.remove();
  }

  public static DmnEngine dmnEngine() {
    return dmnEngineTL.get();
  }

  public static DmnDecisionAssert assertThat(DmnDecision decision) {
    final DmnDecisionAssert decisionAssert = DmnDecisionAssert.assertThat(decision, dmnEngine());
    DmnEngineAssertions.dmnDecisionAssertTL.set(decisionAssert);
    return decisionAssert;
  }

  public static DmnDecisionAssert decision() {
    final DmnDecisionAssert decisionAssert = DmnEngineAssertions.dmnDecisionAssertTL.get();
    return decisionAssert;
  }

}
