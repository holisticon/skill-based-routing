package de.holisticon.bpm.sbr.plugin.job;

import com.google.common.base.Function;
import com.google.common.base.Optional;
import com.google.common.base.Predicates;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import de.holisticon.bpm.sbr.plugin.util.DmnDirectorySupplier;

import java.io.File;
import java.io.FilenameFilter;
import java.util.Arrays;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import static com.google.common.collect.FluentIterable.from;

public class DmnDirectoryWatcher {

  public static final String DMN_SUFFIX = ".dmn";

  private final Map<File, Long> pastFiles = Maps.newHashMap();

  private final Function<File, Set<File>> readFiles = new Function<File, Set<File>>() {

    @Override
    public Set<File> apply(File directory) {
      return from(Arrays.asList(directory.listFiles(filter))).toImmutableSet();
    }
  };

  private final FilenameFilter filter = new FilenameFilter() {

    @Override
    public boolean accept(File dir, String name) {
      return name.endsWith(DMN_SUFFIX);
    }
  };

  private final DmnDirectorySupplier directorySupplier;

  public DmnDirectoryWatcher(final DmnDirectorySupplier directorySupplier) {
    this.directorySupplier = directorySupplier;
  }

  public Set<File> detectChanges() {
    final Set<File> changedFiles = Sets.newHashSet();

    final Set<File> currentFiles = readFiles.apply(directorySupplier.get());

    // added: in current but not in past
    for (File pastFile : currentFiles) {
      Optional<File> currentFile = from(pastFiles.keySet()).firstMatch(Predicates.equalTo(pastFile));
      if (!currentFile.isPresent()) {
        changedFiles.add(pastFile);
      }
    }
    // removed: in last but not current
    for (Entry<File, Long> pastFileEntry : pastFiles.entrySet()) {
      // does currentfiles contain file?
      Optional<File> currentFile = from(currentFiles).firstMatch(Predicates.equalTo(pastFileEntry.getKey()));
      if (!currentFile.isPresent()) {
        changedFiles.add(pastFileEntry.getKey());
      } else {
        if (pastFileEntry.getValue() != currentFile.get().lastModified()) {
          changedFiles.add(pastFileEntry.getKey());
        }
      }
    }


    resetPastFiles(currentFiles);

    return changedFiles;
  }

  private void resetPastFiles(Set<File> currentFiles) {
    pastFiles.clear();

    for (File currentFile : currentFiles) {
      pastFiles.put(currentFile, currentFile.lastModified());
    }
  }


}
