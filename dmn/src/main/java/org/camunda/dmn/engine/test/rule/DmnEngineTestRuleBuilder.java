package org.camunda.dmn.engine.test.rule;

import org.apache.commons.lang3.builder.Builder;

/**
 * DMN Engine Rule builder.
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
public final class DmnEngineTestRuleBuilder implements Builder<DmnEngineTestRule> {

  private boolean installAssertions;
  private boolean shutdownAssertions;

  public DmnEngineTestRuleBuilder(Object testInstance) {
    withoutAssertions();
  }

  /**
   * Activate installation and shutdown of assertions.
   * 
   * @return fluent instance.
   */
  public DmnEngineTestRuleBuilder withAssertions() {
    this.installAssertions = true;
    this.shutdownAssertions = true;

    return this;
  }

  /**
   * Activate installation and shutdown of assertions.
   * 
   * @return fluent instance.
   */
  public DmnEngineTestRuleBuilder withoutAssertions() {
    this.installAssertions = false;
    this.shutdownAssertions = false;

    return this;
  }

  /**
   * Should install fluent assertions on startup.
   * 
   * @param installAssertions
   *          if true will install.
   * @return fluent instance.
   */
  public DmnEngineTestRuleBuilder installAssertions(final boolean installAssertions) {
    this.installAssertions = installAssertions;
    return this;
  }

  /**
   * Should shutdown fluent assertions on shutdown.
   * 
   * @param shutdownAssertions
   *          if true will shutdown.
   * @return fluent instance.
   */
  public DmnEngineTestRuleBuilder shutdownAssertions(final boolean shutdownAssertions) {
    this.shutdownAssertions = shutdownAssertions;
    return this;
  }

  @Override
  public DmnEngineTestRule build() {
    return new DmnEngineTestRule(installAssertions, shutdownAssertions);
  }

}