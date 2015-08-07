package de.holisticon.bpm.sbr.dmn;

import de.holisticon.bpm.sbr.api.CustomerStatus;
import org.camunda.bpm.engine.delegate.DelegateTask;

import javax.inject.Named;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@Named
public final class CreateDelegateTask {

  public static DelegateTask delegateTask(String customerCode, Double approvalSum, CustomerStatus customerStatus) {
    DelegateTask task = mock(DelegateTask.class);
    when(task.getVariable("customerCode")).thenReturn("foo");
    when(task.getVariable("customerStatus")).thenReturn(CustomerStatus.BRONZE);
    when(task.getVariable("approvalSum")).thenReturn(1.0);

  return task;
  }
}
