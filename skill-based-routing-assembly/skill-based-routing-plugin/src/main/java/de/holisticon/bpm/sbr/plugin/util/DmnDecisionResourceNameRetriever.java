package de.holisticon.bpm.sbr.plugin.util;

import java.util.Objects;

import com.google.common.base.Function;

import de.holisticon.bpm.sbr.plugin.api.TaskHolder;

/**
 * Retrieves the process definition key from the task holder.
 * 
 * @param task
 *          holder
 * @return process definition key.
 */
public class DmnDecisionResourceNameRetriever implements Function<TaskHolder, String> {

  @Override
  public String apply(final TaskHolder taskHolder) {
    Objects.requireNonNull(taskHolder, "TaskHolder must be not null");
    final String processDefinitionId = taskHolder.getProcessDefinitionId();
    return processDefinitionId.split(":")[0];
  }

}
