package de.holisticon.bpm.sbr.plugin.util;

import java.io.File;
import java.io.FileNotFoundException;

import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.camunda.bpm.dmn.engine.impl.DmnEngineConfigurationImpl;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.rules.TemporaryFolder;

import static org.assertj.core.api.Assertions.assertThat;

public class DmnDecisionLoaderTest {

  @Rule
  public ExpectedException expectedException = ExpectedException.none();

  @Rule
  public final TemporaryFolder tmp = new TemporaryFolder();
  private final DmnEngine dmnEngine = new DmnEngineConfigurationImpl().buildEngine();

  @Test
  public void gets_fullPath() {
    File file = new DmnDecisionLoader.Key("bar" + File.separator + "foo", "key").getFile(new File(File.separator));
    // fix for Windows UNC paths
    if (((String) System.getProperties().get("os.name")).contains("Windows")) {
      assertThat(file.getAbsolutePath()).isEqualTo(File.separator + File.separator + "bar" + File.separator + "foo_key.dmn");
    } else {
      assertThat(file.getAbsolutePath()).isEqualTo(File.separator + "bar" + File.separator + "foo_key.dmn");
    }
  }

  @Test
  public void load_existing_dmn_file() throws Exception {
    DmnDecisionLoader loader = new DmnDecisionLoader(dmnEngine, testResources());
    final DmnDecision dmnDecision = loader.load(new DmnDecisionLoader.Key("return-constant", "requiredSkills"));
    assertThat(dmnDecision).isNotNull();
    assertThat(dmnDecision.getKey()).isEqualTo("requiredSkills");
  }

  @Test
  public void load_missing_file() throws Exception {
    
    expectedException.expect(FileNotFoundException.class);
    DmnDecisionLoader loader = new DmnDecisionLoader(dmnEngine, testResources());
    loader.load(new DmnDecisionLoader.Key("missing", "requiredSkills"));

  }

  public static File testResources() {
    ClassLoader classLoader = DmnDecisionLoaderTest.class.getClassLoader();
    return new File(classLoader.getResource("").getFile());
  }
}
