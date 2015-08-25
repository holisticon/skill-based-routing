package de.holisticon.bpm.sbr.plugin.util;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Supplier;

import java.io.File;

public class DmnDirectorySupplier implements Supplier<File> {

    private File dmnDirectory;

    public DmnDirectorySupplier() {
        this(new File(System.getProperty("jboss.server.config.dir") + File.separator + "dmn"));
    }

    public DmnDirectorySupplier(final File dmnDirectory) {
        this.dmnDirectory = dmnDirectory;
    }

    @Override
    public File get() {
        return dmnDirectory;
    }

    @VisibleForTesting
    void setDmnDirectory(File dmnDirectory) {
        this.dmnDirectory = dmnDirectory;
    }
}
