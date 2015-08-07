package de.holisticon.bpm.sbr.dmn;

import com.google.common.base.Function;
import de.holisticon.bpm.sbr.api.CustomerStatus;
import org.camunda.bpm.engine.delegate.DelegateTask;

/**
 * Created by jangalinski on 07.08.15.
 */
public class CreateApprovalSheet implements Function<DelegateTask, ApprovalSheet> {

  @Override
  public ApprovalSheet apply(DelegateTask task) {
    CustomerStatus customerStatus = (CustomerStatus) task.getVariable("customerStatus");


    double approvalSum = (double) task.getVariable("approvalSum");
    String customerCode = (String) task.getVariable("customerCode");
    return new ApprovalSheet(customerCode, approvalSum, customerStatus);
  }
}
