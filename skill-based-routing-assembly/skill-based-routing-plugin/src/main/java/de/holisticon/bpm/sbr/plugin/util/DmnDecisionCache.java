package de.holisticon.bpm.sbr.plugin.util;

import com.google.common.base.Optional;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.LoadingCache;
import com.google.common.util.concurrent.UncheckedExecutionException;
import de.holisticon.bpm.sbr.plugin.util.DmnDecisionLoader.Key;
import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.slf4j.Logger;

import java.io.File;

import static org.slf4j.LoggerFactory.getLogger;

/**
 * DMN Decision cache, capable to load decisions from the provided directory of
 * the file system.
 */
public class DmnDecisionCache {

  private final LoadingCache<Key, DmnDecision> cache;
  private final Logger logger = getLogger(this.getClass());


  public DmnDecisionCache(DmnEngine dmnEngine, File dmnDir) {
    this(new DmnDecisionLoader(dmnEngine, dmnDir));
  }

  public DmnDecisionCache(final DmnDecisionLoader dmnDecisionLoader) {
    this.cache = CacheBuilder.newBuilder().build(dmnDecisionLoader);
  }

  /**
   * Retrieves the DMN decision.
   *
   * @param decisionResourceName file name with decision definition.
   * @param decisionId           decision id.
   * @return Optional decision (null or decision).
   */
  public Optional<DmnDecision> get(String decisionResourceName, String decisionId) {
    //return Optional.fromNullable(cache.getUnchecked(new Key(processDefinitionKey, decisionId)));
    if (decisionResourceName == null) {
      logger.warn("Decision resource name must be not null");
      return Optional.absent();
    }
    if (decisionId == null) {
      logger.warn("Decision name name must be not null");
      return Optional.absent();
    }
    try {
      final DmnDecision decision = cache.getUnchecked(new DmnDecisionLoader.Key(decisionResourceName, decisionId));
      return Optional.of(decision);
    } catch (UncheckedExecutionException e) {
      logger.error("Error loading decision {} from {}", decisionId, decisionResourceName);
    }

    return Optional.absent();
  }

}
