package de.holisticon.bpm.sbr.dmn;

import java.io.Serializable;
import java.math.BigDecimal;

public class Leistung implements Serializable {

  private static final long serialVersionUID = 1L;

  private String bezeichnung;
  private boolean gebuehrenrechtlichOk;
  private Tarif tarif;
  private BigDecimal erstattungsbetrag;

  public Leistung(String bezeichung) {
    bezeichnung = bezeichung;
  }

  public String getBezeichnung() {
    return bezeichnung;
  }

  public void setBezeichnung(String bezeichnung) {
    this.bezeichnung = bezeichnung;
  }

  public boolean isGebuehrenrechtlichOk() {
    return gebuehrenrechtlichOk;
  }

  public void setGebuehrenrechtlichOk(boolean gebuehrenrechtlichOk) {
    this.gebuehrenrechtlichOk = gebuehrenrechtlichOk;
  }

  public Tarif getTarif() {
    return tarif;
  }

  public void setTarif(Tarif tarif) {
    this.tarif = tarif;
  }

  public BigDecimal getErstattungsbetrag() {
    return erstattungsbetrag;
  }

  public void setErstattungsbetrag(BigDecimal erstattungsBetrag) {
    this.erstattungsbetrag = erstattungsBetrag;
  }

}
