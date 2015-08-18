package de.holisticon.bpm.sbr.dmn.api;

import org.camunda.bpm.engine.delegate.DelegateTask;

public final class TaskHolder {

  public static final String TASK = "task";

  public static enum TASK_IDS {
    task_erstattungsbetrag_berechnen, ;
  }

  private String taskDefinitionKey;
  private String processDefinitionId;

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