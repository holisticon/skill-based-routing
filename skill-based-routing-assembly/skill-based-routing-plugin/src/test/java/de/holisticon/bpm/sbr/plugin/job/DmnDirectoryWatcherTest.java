package de.holisticon.bpm.sbr.plugin.job;

import de.holisticon.bpm.sbr.plugin.util.DmnDirectorySupplier;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;

import static org.assertj.core.api.Assertions.assertThat;

public class DmnDirectoryWatcherTest {

  @Rule
  public final TemporaryFolder tmp = new TemporaryFolder();

  private DmnDirectoryWatcher watcher;

  @Before
  public void setUp() {
    watcher = new DmnDirectoryWatcher(new DmnDirectorySupplier(tmp.getRoot()));
  }

  @Test
  public void no_changes() throws Exception {
    assertThat(watcher.detectChanges()).isEmpty();
    assertThat(watcher.detectChanges()).isEmpty();
  }

  @Test
  public void file_created() throws Exception {
    File f1 = tmp.newFile("1.dmn");

    assertThat(watcher.detectChanges()).containsOnly(f1);

    File f2 = tmp.newFile("2.dmn");

    assertThat(watcher.detectChanges()).containsOnly(f2);
  }

  @Test
  public void file_deleted() throws Exception {
    File f1 = tmp.newFile("1.dmn");
    File f2 = tmp.newFile("2.dmn");

    assertThat(watcher.detectChanges()).containsOnly(f1, f2);
    f1.delete();

    assertThat(watcher.detectChanges()).containsOnly(f1);
  }

  @Test
  public void file_renamed() throws Exception {
    File f1 = tmp.newFile("1.dmn");
    File f2 = tmp.newFile("2.dmn");

    assertThat(watcher.detectChanges()).containsOnly(f1, f2);

    File f3 = new File(tmp.getRoot() + File.separator + "3.dmn");

    f1.renameTo(f3);

    // f1 removed, f3 created
    assertThat(watcher.detectChanges()).containsOnly(f1, f3);
  }

  @Test
  public void file_changed() throws Exception {
    File f1 = tmp.newFile("1.dmn");
    File f2 = tmp.newFile("2.dmn");

    assertThat(watcher.detectChanges()).containsOnly(f1, f2);

    // need to wait here or lastModified wont differ
    Thread.sleep(1500L);
    modifyFile(f2);


    assertThat(watcher.detectChanges()).containsOnly(f2);
  }

  private void modifyFile(File f2) throws IOException {
    RandomAccessFile raf = new RandomAccessFile(f2, "rw");
    long length = raf.length();
    raf.setLength(length + 1);
    raf.setLength(length);
    raf.close();
  }
}
