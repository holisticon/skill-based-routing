package de.holisticon.bpm.example.sbr.adapter;

import javax.inject.Named;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;

import de.holisticon.bpm.example.sbr.ApprovalProcess.Variables;

/**
 * Skill-based group selector.
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
@Named(SkillBasedRoutingGroupSelector.NAME)
public class SkillBasedRoutingGroupSelector implements JavaDelegate {

  public final static String NAME = "sbrGroupSelector";

  @Override
  public void execute(final DelegateExecution execution) throws Exception {
    execution.setVariable(Variables.APPROVER_GROUP, "Team Blue");
  }

}
