package de.holisticon.bpm.sbr.plugin.util;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class WatchServiceSpike {

    public static class Watcher {

    }

    @Rule
    public final TemporaryFolder tmp = new TemporaryFolder();


    @Test
    public void watches_changes_on_dir() {

    }

    public static String substituteVariables(String template, Map<String, String> variables) {
        Pattern pattern = Pattern.compile("\\$\\{(.+?)\\}");
        Matcher matcher = pattern.matcher(template);
        // StringBuilder cannot be used here because Matcher expects StringBuffer
        StringBuffer buffer = new StringBuffer();
        while (matcher.find()) {
            if (variables.containsKey(matcher.group(1))) {
                String replacement = variables.get(matcher.group(1));
                // quote to work properly with $ and {,} signs
                matcher.appendReplacement(buffer, replacement != null ? Matcher.quoteReplacement(replacement) : "null");
            }
        }
        matcher.appendTail(buffer);
        return buffer.toString();
    }
}
