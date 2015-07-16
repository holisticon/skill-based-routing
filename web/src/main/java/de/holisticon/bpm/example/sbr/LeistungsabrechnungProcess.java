package de.holisticon.bpm.example.sbr;

import java.util.List;

import javax.inject.Named;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;

import de.holisticon.bpm.sbr.dmn.Leistung;

public class LeistungsabrechnungProcess {

  public static final String KEY = "leistungsabrechnung";
  public static final String RESOURCE = "Leistungsabrechnung.bpmn";

  public static enum Activities {
    ;
    public static final String service_versicherungsschutz_ermitteln = "service_versicherungsschutz_ermitteln";
    public static final String task_leistungen_erfassen = "task_leistungen_erfassen";
    public static final String task_gebuehren_pruefen = "task_gebuehren_pruefen";
    public static final String task_erstattungsbetrag_berechnen = "task_erstattungsbetrag_berechnen";
    public static final String task_zahlung_freigeben = "task_zahlung_freigeben";
  }

  public static enum Variables {

    ;
    public static final String LEISTUNGEN = "leistungen";
    public static final String VERSICHERUNGSNUMMER = "vsnr";
    public static final String FREIGABE = "freigabe";
  }

  @Named(VersicherungschutzErmitteln.NAME)
  public class VersicherungschutzErmitteln implements JavaDelegate {

    public static final String NAME = "versicherungsschutzErmitteln";

    @Override
    public void execute(DelegateExecution execution) throws Exception {
      List<Leistung> leistung = (List<Leistung>) execution.getVariable(Variables.LEISTUNGEN);
    }
  }

  @Named(AbrechnungVerschickt.NAME)
  public class AbrechnungVerschickt implements JavaDelegate {

    public static final String NAME = "abrechnungVerschickt";

    @Override
    public void execute(DelegateExecution execution) throws Exception {

    }
  }
}
