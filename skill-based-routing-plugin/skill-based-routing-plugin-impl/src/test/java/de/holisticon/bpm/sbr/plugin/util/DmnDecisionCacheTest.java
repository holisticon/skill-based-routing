package de.holisticon.bpm.sbr.plugin.util;

import com.google.common.eventbus.EventBus;
import de.holisticon.bpm.sbr.plugin.util.DmnDecisionLoader.Key;
import org.camunda.bpm.dmn.engine.DmnDecision;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import java.io.File;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class DmnDecisionCacheTest {

  private final static Key KEY = new Key("foo", "bar");

  private final static DmnDecision DECISION_1 = mock(DmnDecision.class);
  private final static DmnDecision DECISION_2 = mock(DmnDecision.class);

  private final DmnDecisionLoader loader = mock(DmnDecisionLoader.class);

  private final EventBus eventBus = new EventBus(this.getClass().getCanonicalName());

  private final DmnDecisionCache dmnDecisionCache = new DmnDecisionCache(loader);

  @Rule
  public final ExpectedException thrown = ExpectedException.none();

  @Before
  public void setUp() throws Exception {
    eventBus.register(dmnDecisionCache);
    when(loader.load(KEY)).thenReturn(DECISION_1, DECISION_2);
  }

  @Test
  public void returns_always_the_same_decision_if_no_invalidation() {
    assertThat(dmnDecisionCache.get("foo", "bar").get()).isEqualTo(DECISION_1);
    assertThat(dmnDecisionCache.get("foo", "bar").get()).isEqualTo(DECISION_1);
  }

  @Test
  public void returns_next_decision_when_file_is_changed() {
    assertThat(dmnDecisionCache.get("foo", "bar").get()).isEqualTo(DECISION_1);

    eventBus.post(KEY.getFile(new File("")));
    assertThat(dmnDecisionCache.get("foo", "bar").get()).isEqualTo(DECISION_2);
  }


}
