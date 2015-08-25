package de.holisticon.bpm.sbr.plugin.util;

import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.model.dmn.Dmn;
import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

public class DmnDecisionCacheTest {

    private final DmnDecision d1 = mock(DmnDecision.class);
    private final DmnDecision d2 = mock(DmnDecision.class);

    private final DmnDecisionLoader loader = mock(DmnDecisionLoader.class);

    private final DmnDecisionCache cache = new DmnDecisionCache(loader);

    @Test
    public void returns_empty_optional_if_key_is_not_found() {
       
    }
}
