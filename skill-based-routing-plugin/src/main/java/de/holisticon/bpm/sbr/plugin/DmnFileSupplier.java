package de.holisticon.bpm.sbr.plugin;

import com.google.common.base.Supplier;
import com.google.common.collect.Maps;

import java.io.File;
import java.io.FileFilter;
import java.util.Map;


public class DmnFileSupplier implements Supplier<Map<String, File>> {

  private final String dmnDirPath;

  public DmnFileSupplier() {
    this(System.getProperty("de.holisticon.skill-based-routing.dmn"));
  }

  public DmnFileSupplier(String dmnDirPath) {
    this.dmnDirPath = dmnDirPath;
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
