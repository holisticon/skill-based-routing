package de.holisticon.bpm.sbr.dmn.api;

import java.io.Serializable;

import org.camunda.bpm.engine.delegate.DelegateTask;

/**
 * Holder for task properties.
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
public final class TaskHolder implements Serializable {

  private static final long serialVersionUID = 1L;

  public static final String TASK = "task";

  private String taskDefinitionKey;
  private String processDefinitionId;
  private String caseDefinitionId;

  public String getCaseDefinitionId() {
    return caseDefinitionId;
  }

  public void setCaseDefinitionId(String caseDefinitionId) {
    this.caseDefinitionId = caseDefinitionId;
  }


  public String getTaskDefinitionKey() {
    return taskDefinitionKey;
  }

  public void setTaskDefinitionKey(String taskDefinitionKey) {
    this.taskDefinitionKey = taskDefinitionKey;
  }

  public String getProcessDefinitionId() {
    return processDefinitionId;
  }

  public void setProcessDefinitionId(String processDefinitionKey) {
    this.processDefinitionId = processDefinitionKey;
  }

  /**
   * Factory method.
   * 
   * @param task
   *          Camunda BPM Task.
   * @return task holder
   */
  public static TaskHolder fromTask(final DelegateTask task) {
    final TaskHolder holder = new TaskHolder();
    holder.setProcessDefinitionId(task.getProcessDefinitionId());
    holder.setTaskDefinitionKey(task.getTaskDefinitionKey());
    return holder;
  }
}