package de.holisticon.bpm.sbr.plugin.test;

import com.google.common.base.Function;
import com.google.common.collect.FluentIterable;
import org.assertj.core.api.ListAssert;
import org.camunda.bpm.dmn.engine.DmnDecisionRuleResult;
import org.camunda.bpm.dmn.engine.DmnDecisionTableResult;

public class DmnDecisionTableResultAssert extends ListAssert<String> {

  public static final DmnDecisionTableResultAssert assertThat(DmnDecisionTableResult actual, String key) {
    return new DmnDecisionTableResultAssert(actual, key);
  }

  protected DmnDecisionTableResultAssert(final DmnDecisionTableResult actual, final String key) {
    super(FluentIterable.from(actual).transform(new Function<DmnDecisionRuleResult, String>() {
      @Override
      public String apply(final DmnDecisionRuleResult input) {
        return input.getEntry(key);
      }
    }).toImmutableList());
  }
}
