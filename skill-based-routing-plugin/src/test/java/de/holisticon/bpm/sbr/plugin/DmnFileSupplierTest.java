package de.holisticon.bpm.sbr.plugin;


import org.junit.Test;

import java.io.File;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

public class DmnFileSupplierTest {

  @Test
  public void gets_all_dmn_files_from_dir() {
    final DmnFileSupplier supplier = new DmnFileSupplier(getDmnDirPath());

    Map<String, File> files = supplier.get();

    assertThat(files).containsOnlyKeys("1.dmn", "2.dmn");

    assertThat(files.get("1.dmn").getPath()).endsWith("test-classes" + File.separator +"dmn" + File.separator +  "1.dmn");
  }

  private String getDmnDirPath() {
    ClassLoader classLoader = getClass().getClassLoader();
    File file = new File(classLoader.getResource("dmn").getFile());
    return file.getAbsolutePath();
  }

}