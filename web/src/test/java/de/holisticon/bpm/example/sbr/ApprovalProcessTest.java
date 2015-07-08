package de.holisticon.bpm.example.sbr;

import javax.inject.Inject;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.test.Deployment;
import org.camunda.bpm.engine.test.assertions.ProcessEngineAssertions;
import org.camunda.bpm.extension.needle.ProcessEngineNeedleRule;
import org.camunda.bpm.extension.needle.ProcessEngineNeedleRuleBuilder;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;

import de.holisticon.bpm.example.sbr.adapter.SkillBasedRoutingGroupSelector;

public class ApprovalProcessTest {

  @Rule
  public ProcessEngineNeedleRule rule = new ProcessEngineNeedleRuleBuilder(this).build();
  @Inject
  RuntimeService runtimeService;
  @Inject
  TaskService taskService;
  @Inject
  SkillBasedRoutingGroupSelector selector;
  
  ProcessDriver driver;
  

  @Before
  public void setup() {
    ProcessEngineAssertions.init(rule.getProcessEngine());
    driver = new ProcessDriver();
  }

  @Test
  @Deployment(resources = ApprovalProcess.RESOURCE)
  public void shouldDeploy() {
    // just deploy
  }

  /**
   * Glue between the test and the process.
   */
  class ProcessDriver {

  }
}
