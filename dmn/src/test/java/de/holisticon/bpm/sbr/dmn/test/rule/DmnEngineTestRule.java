package de.holisticon.bpm.sbr.dmn.test.rule;

import java.io.InputStream;
import java.util.Map;

import org.camunda.dmn.engine.DmnDecision;
import org.camunda.dmn.engine.DmnDecisionResult;
import org.camunda.dmn.engine.DmnEngine;
import org.camunda.dmn.engine.context.DmnContextFactory;
import org.camunda.dmn.engine.context.DmnDecisionContext;
import org.camunda.dmn.engine.impl.DmnEngineConfigurationImpl;
import org.camunda.dmn.engine.impl.context.DmnContextFactoryImpl;
import de.holisticon.bpm.sbr.dmn.test.assertions.DmnEngineAssertions;
import org.junit.rules.TestRule;
import org.junit.runner.Description;
import org.junit.runners.model.Statement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Simple DMN Engine de.holisticon.bpm.sbr.dmn.test.test rule.
 * 
 * @author Simon Zambrovski (Holisticon AG)
 */
public class DmnEngineTestRule implements TestRule {

  private DmnEngine dmnEngine;
  private Logger logger;
  private DmnDecision decision;
  private DmnContextFactory decisionContextFactory;
  private DmnDecisionContext decisionContext;
  private boolean installAssertions;
  private boolean shutdownAssertions;

  DmnEngineTestRule(final boolean installAssertions, final boolean shutdownAssertions) {
    this.installAssertions = installAssertions;
    dmnEngine = new DmnEngineConfigurationImpl().buildEngine();
    logger = LoggerFactory.getLogger(DmnEngineTestRule.class);
    decisionContextFactory = new DmnContextFactoryImpl();
  }

  @Override
  public Statement apply(Statement statement, Description paramDescription) {
    if (this.installAssertions) {
      DmnEngineAssertions.init(getDmnEngine());
    }

    final DecisionDeployment annotation = paramDescription.getAnnotation(DecisionDeployment.class);
    if (annotation != null) {
      final String decisionResource = annotation.resource();
      if (decisionResource != null) {
        final InputStream dmnResource = this.getClass().getClassLoader().getResourceAsStream(decisionResource);
        if (dmnResource == null) {
          logger.error("Decision resource can not be loaded: {}", decisionResource);
          throw new IllegalArgumentException("Decision resource not found");
        }
        decision = dmnEngine.parseDecision(dmnResource);
        
        if (this.installAssertions) {
            DmnEngineAssertions.assertThat(decision);
        }
        
        decisionContext = decisionContextFactory.createDecisionContext();
      }
    }

    if (this.shutdownAssertions) {
      DmnEngineAssertions.reset();
    }

    return statement;
  }

  /**
   * Retrieves the DMN engine.
   * 
   * @return engine instance.
   */
  public DmnEngine getDmnEngine() {
    return dmnEngine;
  }

  /**
   * Retrieves decision annotated with {@Link DecisionDeployment}.
   * 
   * @return decision parsed from decision resource.
   */
  public DmnDecision getDecision() {
    return decision;
  }

  /**
   * Retrieves decision context.
   * 
   * @return decision context.
   */
  public DmnDecisionContext getDecisionContext() {
    return decisionContext;
  }

  /**
   * Evaluates decision using variables.
   * 
   * @param variables
   *          variables to use during evaluataion.
   * @return decision result.
   */
  public DmnDecisionResult evaluate(final Map<String, Object> variables) {
    if (variables != null) {
      getDecisionContext().getVariableContext().setVariables(variables);
    }
    return getDecisionContext().evaluate(getDecision());
  }

  /**
   * Evaluate decision without variables.
   * 
   * @return decision result.
   * @see {@link DmnEngineTestRule#evaluate(Map)}
   */
  public DmnDecisionResult evaluate() {
    return evaluate(null);
  }

}
