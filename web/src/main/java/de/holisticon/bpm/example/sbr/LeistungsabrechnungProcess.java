package de.holisticon.bpm.example.sbr;

import javax.inject.Named;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;

public class LeistungsabrechnungProcess {

  public static final String KEY = "leistungsabrechnung";
  public static final String RESOURCE = "Leistungsabrechnung.bpmn";

  public static enum Activities {
    ;
    public static final String service_versicherungsschutz_ermitteln = "service_versicherungsschutz_ermitteln";
    public static final String task_leistungen_erfassen = "task_leistungen_erfassen";
    public static final String task_gebuehrenrechtlich_pruefen = "task_gebuehrenrechtlich_pruefen";
    public static final String task_erstattungsbetrag_berechnen = "task_erstattungsbetrag_berechnen";
    public static final String task_zahlung_freigeben = "task_zahlung_freigeben";
  }

  public static enum Variables {
    ;
    public static final String VERSICHERUNGSNUMMER = "vsnr";
    public static final String RECHNUNGSART = "rechnungsart";
    public static final String ERSTATTUNGSWUNSCH = "erstattungswunsch";
    public static final String PRODUKT = "produkt";
    public static final String KUNDENSTATUS = "kundenstatus";
    public static final String LEISTUNGEN = "leistungen";
    public static final String ERSTATTUNG_GESAMT = "erstattungGesamt";
    public static final String FREIGEGEBEN = "freigegeben";
  }


  @Named(AbrechnungVerschickt.NAME)
  public class AbrechnungVerschickt implements JavaDelegate {

    public static final String NAME = "abrechnungVerschickt";

    @Override
    public void execute(DelegateExecution execution) throws Exception {

    }
  }
}