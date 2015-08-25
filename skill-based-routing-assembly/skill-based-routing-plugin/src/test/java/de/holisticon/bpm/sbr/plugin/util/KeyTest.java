package de.holisticon.bpm.sbr.plugin.util;

import de.holisticon.bpm.sbr.plugin.util.DmnDecisionLoader.Key;
import org.assertj.core.api.Assertions;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.rules.TemporaryFolder;

import java.io.File;
import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

public class KeyTest {

  @Rule
  public final TemporaryFolder tmp = new TemporaryFolder();

  @Rule
  public final ExpectedException thrown = ExpectedException.none();

  @Test
  public void create_key_from_valid_file() throws IOException {
    final File file = tmp.newFile("decisionResourceName_decisionId.dmn");

    assertThat(Key.fromFile(file)).isEqualTo(new Key("decisionResourceName","decisionId"));
  }


  @Test
  public void fails_when_file_is_null() throws IOException {
    thrown.expect(IllegalArgumentException.class);

    Key.fromFile(null);
  }

  @Test
  public void fails_when_file_is_no_dmn_file() throws IOException {
    final File file = tmp.newFile("decisionResourceName_decisionId.txt");

    thrown.expect(IllegalArgumentException.class);

    Key.fromFile(file);
  }

  @Test
  public void fails_when_file_does_not_contain_resource_and_decision() throws IOException {
    final File file = tmp.newFile("decisionResourceName.dmn");

    thrown.expect(IllegalArgumentException.class);

    Key.fromFile(file);
  }


}
