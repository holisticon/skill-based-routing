package de.holisticon.bpm.example.sbr;

/**
 * Constants for the approval process.
 *
 * @author Simon Zambrovski (Holisticon AG)
 */
public class ApprovalProcess {

  public static final String KEY = "approval";
  public static final String RESOURCE = "ApprovalProcess.bpmn";

  public static enum Variables {
    ;
    public static final String APPROVER_GROUP = "approverGroup";

  }
}
