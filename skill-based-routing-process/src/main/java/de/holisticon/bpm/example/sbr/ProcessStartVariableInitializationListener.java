package de.holisticon.bpm.example.sbr;

import javax.inject.Named;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.ExecutionListener;

import de.holisticon.bpm.example.sbr.LeistungsabrechnungProcess.Variables;

/**
 * Pre-fill execution with variable names.
 *
 * @author Simon Zambrovski (Holisticon AG)
 */
@Named
public final class ProcessStartVariableInitializationListener implements ExecutionListener {

  @Override
  public void notify(DelegateExecution execution) throws Exception {
    for (String variableName : Variables.TO_BE_INITIALIZED_WITH_NULL) {
      if (!execution.hasVariable(variableName)) {
        execution.setVariable(variableName, null);
      }
    }
  }
}