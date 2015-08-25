package de.holisticon.bpm.sbr.plugin.util;

import java.io.File;

import org.camunda.bpm.dmn.engine.DmnDecision;
import org.slf4j.Logger;

import com.google.common.base.Optional;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.LoadingCache;
import com.google.common.eventbus.Subscribe;
import com.google.common.util.concurrent.UncheckedExecutionException;

import de.holisticon.bpm.sbr.plugin.util.DmnDecisionLoader.Key;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * DMN Decision cache, capable to load decisions from the provided directory of
 * the file system.
 */
public class DmnDecisionCache {

  private final LoadingCache<Key, DmnDecision> cache;
  private final Logger logger = getLogger(this.getClass());

  public DmnDecisionCache(final DmnDecisionLoader dmnDecisionLoader) {
    this.cache = CacheBuilder.newBuilder().build(dmnDecisionLoader);
  }

  /**
   * Retrieves the DMN decision.
   * 
   * @param decisionResourceName
   *          file name with decision definition.
   * @param decisionId
   *          decision id.
   * @return Optional decision (null or decision).
   */
  public Optional<DmnDecision> get(String decisionResourceName, String decisionId) {
    if (decisionResourceName == null) {
      logger.warn("Decision resource name must be not null");
      return Optional.absent();
    }
    if (decisionId == null) {
      logger.warn("Decision name name must be not null");
      return Optional.absent();
    }
    final DmnDecisionLoader.Key key = new DmnDecisionLoader.Key(decisionResourceName, decisionId);
    try {
      final DmnDecision decision = cache.getUnchecked(key);
      return Optional.of(decision);
    } catch (UncheckedExecutionException e) {
      logger.error("Error loading decision {} from {} caused by {}", decisionId, key.getFilenameSegment(), e.getMessage());
      logger.error("Error loading decision", e);
    }

    return Optional.absent();
  }

  @Subscribe
  public void fileChanged(final File file) {
    try {
      cache.invalidate(Key.fromFile(file));
    } catch (RuntimeException e) {
      logger.warn("could not invalidate {}", file);
    }
  }
}
