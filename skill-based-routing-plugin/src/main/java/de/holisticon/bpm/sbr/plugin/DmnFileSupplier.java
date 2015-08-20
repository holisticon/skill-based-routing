package de.holisticon.bpm.sbr.plugin;

import com.google.common.base.Supplier;
import com.google.common.collect.Maps;
import org.slf4j.Logger;

import java.io.File;
import java.io.FileFilter;
import java.util.Map;

import static org.slf4j.LoggerFactory.getLogger;


public class DmnFileSupplier implements Supplier<Map<String, File>> {

  private final Logger logger = getLogger(this.getClass());
  private final String dmnDirPath;

  public DmnFileSupplier() {
    this(System.getProperty("jboss.server.config.dir") + File.separator + "dmn" );
  }

  public DmnFileSupplier(String dmnDirPath) {
    this.dmnDirPath = dmnDirPath;
    logger.info("creating dmnFileSupplier for {}", dmnDirPath);
  }

  @Override
  public Map<String, File> get() {
    Map<String, File> map = Maps.newHashMap();
    for (File file : new File(dmnDirPath).listFiles(new FileFilter() {
      @Override
      public boolean accept(File pathname) {
        return pathname.getPath().endsWith(".dmn");
      }
    })) {
      map.put(file.getName(), file);
    }

    return map;
  }
}
