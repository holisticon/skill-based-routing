package de.holisticon.bpm.sbr.plugin;

import de.holisticon.bpm.sbr.plugin.api.TaskHolder;
import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class DmnDecisionResourceNameRetrieverTest {

  private final DmnDecisionResourceNameRetriever retriever = new DmnDecisionResourceNameRetriever();

  @Test
  public void returns_processDefintionKey() {
    TaskHolder taskHolder = new TaskHolder();
    taskHolder.setProcessDefinitionId("fooProcess:1:1");

    assertThat(retriever.apply(taskHolder)).isEqualTo("fooProcess");
  }
}
