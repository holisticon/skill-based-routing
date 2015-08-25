package de.holisticon.bpm.sbr.plugin.util;

import java.io.File;

import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.slf4j.Logger;

import com.google.common.base.Optional;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.LoadingCache;
import com.google.common.util.concurrent.UncheckedExecutionException;

import static org.slf4j.LoggerFactory.getLogger;

/**
 * DMN Decision cache, capable to load decisions from the provided directory of
 * the file system.
 * 
 * @author Simon Zambrovski (Holisticon AG)
 * 
 */
public class DmnDecisionCache {

  private final LoadingCache<DmnDecisionLoader.Key, DmnDecision> cache;
  private final DmnEngine dmnEngine;
  private final File dmnDir;
  private final Logger logger = getLogger(this.getClass());

  /**
   * Constructs the cache.
   * 
   * @param dmnEngine
   *          engine to use for decision parsing.
   * @param dmnDir
   *          directory to load files from.
   */
  public DmnDecisionCache(final DmnEngine dmnEngine, final File dmnDir) {
    this.dmnEngine = dmnEngine;
    this.dmnDir = dmnDir;
    this.cache = CacheBuilder.newBuilder().build(new DmnDecisionLoader(dmnEngine, dmnDir));
  }

  /**
   * Retrieves the DMN decision.
   * 
   * @param deicisionResourceName
   *          file name with decision definition.
   * @param decisionId
   *          decision id.
   * @return Optional decision (null or decision).
   */
  public Optional<DmnDecision> get(String deicisionResourceName, String decisionId) {
    if (deicisionResourceName == null) {
      logger.warn("Decision resource name must be not null");
      return Optional.absent();
    }
    if (decisionId == null) {
      logger.warn("Decision name name must be not null");
      return Optional.absent();
    }
    try {
      final DmnDecision decision = cache.getUnchecked(new DmnDecisionLoader.Key(deicisionResourceName, decisionId));
      return Optional.of(decision);
    } catch (UncheckedExecutionException e) {
      logger.error("Error loading decision {} from {}", decisionId, deicisionResourceName);
    }

    return Optional.absent();
  }

  public DmnEngine getDmnEngine() {
    return dmnEngine;
  }

  public File getDmnDir() {
    return dmnDir;
  }

}
