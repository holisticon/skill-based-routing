package de.holisticon.bpm.sbr.plugin.util;

import com.google.common.cache.CacheLoader;
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

import static de.holisticon.bpm.sbr.plugin.util.DmnDecisionLoader.Key;
import static org.slf4j.LoggerFactory.getLogger;

public class DmnDecisionLoader extends CacheLoader<Key, DmnDecision> {

    public static class Key {

        private final String processDefinitionKey;
        private final String tableId;

        public Key(final String processDefinitionKey, final String tableId) {
            this.processDefinitionKey = processDefinitionKey;
            this.tableId = tableId;
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
            return Paths.get(dir.getPath(), processDefinitionKey + ".dmn").toFile();
        }

        @Override
        public boolean equals(Object other) {
            return EqualsBuilder.reflectionEquals(this, other);
        }
    }

    private final Logger logger = getLogger(this.getClass());
    private final File dmnDir;
    private final DmnEngine dmnEngine;

    public DmnDecisionLoader(final DmnEngine dmnEngine, final File dmnDir) {
        this.dmnEngine = dmnEngine;
        this.dmnDir = dmnDir;
    }

    @Override
    public DmnDecision load(final Key key) throws Exception {
        logger.info("loading {}", key);
        return dmnEngine.parseDecision(new FileInputStream(key.getFile(dmnDir)), key.tableId);
    }
}
