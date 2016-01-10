package de.holisticon.bpm.example.sbr.adapter;

import com.google.common.collect.Lists;
import de.holisticon.bpm.example.sbr.LeistungsabrechnungProcess.VARIABLES;
import de.holisticon.bpm.sbr.api.Leistung;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.needle4j.annotation.Mock;
import org.needle4j.annotation.ObjectUnderTest;
import org.needle4j.junit.NeedleRule;

import java.util.List;

import static de.holisticon.bpm.example.sbr.adapter.VersicherungsschutzErmittelnDelegate.PRODUKT_PREMIUM_KOMPLETT;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsNull.nullValue;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;

public class VersicherungsschutzErmittelnTest {

  @Rule
  public final NeedleRule needle = new NeedleRule();

  @ObjectUnderTest
  private VersicherungsschutzErmittelnDelegate delegate;

  @Mock
  private DelegateExecution execution;

  private List<Leistung> leistungen;


  @Before
  public void setUp() throws Exception {

    Leistung leistung1 = new Leistung("GOÄ-251 Blutentnahme, Arterie"); // OK, durch Tarif abgedeckt
    Leistung leistung2 = new Leistung("HM Thai-Massage"); // NOK
    Leistung leistung3 = new Leistung("AM Aspirin"); // OK, durch Tarif abgedeckt
    Leistung leistung4 = new Leistung("GOÄ-269 Akupunktur"); // OK, aber nicht tariflich abgedeckt

    leistung1.setGebuehrenrechtlichOk(true);
    leistung3.setGebuehrenrechtlichOk(true);
    leistung4.setGebuehrenrechtlichOk(true);

    leistungen = Lists.newArrayList(leistung1, leistung2, leistung3, leistung4);
  }


  @Test
  public void shouldMapLeistungenToTarife() throws Exception {
    given(execution.getVariable(VARIABLES.PRODUKT)).willReturn(PRODUKT_PREMIUM_KOMPLETT);
    given(execution.getVariable(VARIABLES.LEISTUNGEN)).willReturn(leistungen);

    delegate.execute(execution);

    assertThat(leistungen.get(0).getTarif(), is("ABZ (80%)"));
    assertThat(leistungen.get(1).getTarif(), nullValue());
    assertThat(leistungen.get(2).getTarif(), is("AE+ (100%)"));
    assertThat(leistungen.get(3).getTarif(), nullValue());
  }

  @Test
  public void shouldReturnUpperCaseKey() {
    Leistung leistung = new Leistung("Goz-107 Bezeichnung usw.");
    assertThat(delegate.getKey(leistung), is("GOZ-107"));
  }

  @Test
  public void shouldReturnCompleteDescription() {
    Leistung leistung = new Leistung("Goz107foo");
    assertThat(delegate.getKey(leistung), is("GOZ107FOO"));
  }

  @Test
  public void shouldReturnNull() {
    Leistung leistung = new Leistung(null);
    assertNull(delegate.getKey(leistung));
    leistung.setBezeichnung("   ");
    assertNull(delegate.getKey(leistung));

  }

}
