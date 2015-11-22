package de.holisticon.bpm.sbr.plugin;

import de.holisticon.bpm.sbr.plugin.api.TaskHolder;
import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class DmnDecisionResourceNameRetrieverTest {

  private final DmnDecisionResourceNameRetriever retriever = new DmnDecisionResourceNameRetriever();
  private final  TaskHolder taskHolder = new TaskHolder();

  @Test
  public void returns_processDefintionKey() {
    taskHolder.setProcessDefinitionId("fooProcess:1:1");

    assertThat(retriever.apply(taskHolder)).isEqualTo("fooProcess");
  }
}
