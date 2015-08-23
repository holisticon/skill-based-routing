package de.holisticon.bpm.sbr.plugin.util;

import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.camunda.bpm.dmn.engine.impl.DmnEngineConfigurationImpl;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.slf4j.Logger;

import java.io.File;

import static org.assertj.core.api.Assertions.assertThat;
import static org.slf4j.LoggerFactory.getLogger;

public class DmnDecisionLoaderTest {

    @Rule
    public final TemporaryFolder tmp = new TemporaryFolder();
    private final Logger logger = getLogger(this.getClass());
    private final DmnEngine dmnEngine = new DmnEngineConfigurationImpl().buildEngine();

    @Test
    public void gets_fullPath() {
        File file = new DmnDecisionLoader.Key("foo", "").getFile(new File("/"));
        assertThat(file.getAbsolutePath()).isEqualTo("/foo.dmn");
    }

    @Test
    public void load_existing_dmn_file() throws Exception {
        DmnDecisionLoader loader = new DmnDecisionLoader(dmnEngine, testResources());

        final DmnDecision dmnDecision = loader.load(new DmnDecisionLoader.Key("return-constant", "requiredSkills"));

        assertThat(dmnDecision).isNotNull();

        assertThat(dmnDecision.getKey()).isEqualTo("requiredSkills");
    }

    public static File testResources() {
        ClassLoader classLoader = DmnDecisionLoaderTest.class.getClassLoader();
        return new File(classLoader.getResource("").getFile());
    }
}
