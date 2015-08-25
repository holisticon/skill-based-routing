package de.holisticon.bpm.sbr.plugin.util;

import com.google.common.cache.CacheLoader;
import de.holisticon.bpm.sbr.plugin.job.DmnDirectoryWatcher;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnEngine;
import org.slf4j.Logger;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;

import static com.google.common.base.Preconditions.checkArgument;
import static de.holisticon.bpm.sbr.plugin.job.DmnDirectoryWatcher.DMN_SUFFIX;
import static de.holisticon.bpm.sbr.plugin.util.DmnDecisionLoader.Key;
import static org.slf4j.LoggerFactory.getLogger;

public class DmnDecisionLoader extends CacheLoader<Key, DmnDecision> {

  /**
   * A key for decision cache.
   */
  public static class Key {

    public static Key fromFile(final File file) {
      checkArgument(file != null, "file is null.");
      String name = file.getName();
      checkArgument(name.endsWith(DMN_SUFFIX), "file is no dmn file.");

      name = StringUtils.removeEnd(name, DMN_SUFFIX);

      final String[] split = name.split("_");
      checkArgument(split.length == 2, "file must match 'decisionResourceName_decisionId.dmn'.");

      return new Key(split[0], split[1]);
    }

    private final String decisionResourceName;
    private final String decisionId;

    /**
     * Constructs a key from decision resource name and decision id.
     *
     * @param decisionResourceName
     * @param decisionId
     */
    public Key(final String decisionResourceName, final String decisionId) {
      this.decisionResourceName = decisionResourceName;
      this.decisionId = decisionId;
    }

    @Override
    public String toString() {
      return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    @Override
    public int hashCode() {
      return HashCodeBuilder.reflectionHashCode(this);
    }

    public File getFile(final File dir) {
      return Paths.get(dir.getPath(), decisionResourceName + "_" + decisionId + DmnDirectoryWatcher.DMN_SUFFIX).toFile();
    }

    @Override
    public boolean equals(Object other) {
      return EqualsBuilder.reflectionEquals(this, other);
    }
  }

  private final Logger logger = getLogger(this.getClass());
  private final DmnDirectorySupplier dmnDir;
  private final DmnEngine dmnEngine;

  public DmnDecisionLoader(final DmnEngine dmnEngine, final DmnDirectorySupplier dmnDir) {
    this.dmnEngine = dmnEngine;
    this.dmnDir = dmnDir;
  }

  @Override
  public DmnDecision load(final Key key) throws Exception {
    logger.info("Loading {}", key);
    return dmnEngine.parseDecision(new FileInputStream(key.getFile(dmnDir.get())), key.decisionId);
  }
}
