package de.holisticon.bpm.example.sbr.adapter;

import javax.inject.Named;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Named(LoadApprovalSheet.NAME)
public class LoadApprovalSheet implements JavaDelegate {

  public final static String NAME = "loadApprovalSheet";
  private final static Logger LOG = LoggerFactory.getLogger(LoadApprovalSheet.class);

  @Override
  public void execute(final DelegateExecution execution) throws Exception {
    LOG.info("Loading approval sheet...");

    LOG.info("Approval sheet loaded.");
  }
}
