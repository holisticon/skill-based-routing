package de.holisticon.bpm.sbr.dmn;

import de.holisticon.bpm.sbr.api.CustomerStatus;

/**
 * Represents an approval sheet document.
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
public class ApprovalSheet {

  public ApprovalSheet() {

  }

  public ApprovalSheet(String customerCode, Double approvalSum, CustomerStatus customerStatus) {
    this.customerCode = customerCode;
    this.approvalSum = approvalSum;
    this.customerStatus = customerStatus;
  }

  private String customerCode;
  private Double approvalSum;
  private CustomerStatus customerStatus;

  public String getCustomerCode() {
    return customerCode;
  }

  public void setCustomerCode(String customerCode) {
    this.customerCode = customerCode;
  }

  public Double getApprovalSum() {
    return approvalSum;
  }

  public void setApprovalSum(Double approvalSum) {
    this.approvalSum = approvalSum;
  }

  public CustomerStatus getCustomerStatus() {
    return customerStatus;
  }

  public void setCustomerStatus(CustomerStatus customerStatus) {
    this.customerStatus = customerStatus;
  }
}