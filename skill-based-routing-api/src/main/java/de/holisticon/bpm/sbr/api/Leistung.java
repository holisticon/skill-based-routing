package de.holisticon.bpm.sbr.api;

import java.io.Serializable;

public class Leistung implements Serializable {

    private static final long serialVersionUID = 1L;

    private String bezeichnung;
    private boolean gebuehrenrechtlichOk;
    private String tarif;
    private Double erstattungsbetrag;

    public Leistung() {
      // Needed for JSON
    }

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

    public String getTarif() {
        return tarif;
    }

    public void setTarif(String tarif) {
        this.tarif = tarif;
    }

    public Double getErstattungsbetrag() {
        return erstattungsbetrag;
    }

    public void setErstattungsbetrag(Double erstattungsBetrag) {
        this.erstattungsbetrag = erstattungsBetrag;
    }

}
