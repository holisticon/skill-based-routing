package de.holisticon.bpm.sbr.dmn;

import java.io.Serializable;
import java.util.List;

public class Leistungsabrechnung implements Serializable {

    private static final long serialVersionUID = 1L;

    private String leistungsbereich;
    private List<Leistung> leistungen;
    private boolean freigegeben;

    public String getLeistungsbereich() {
        return leistungsbereich;
    }

    public void setLeistungsbereich(String leistungsbereich) {
        this.leistungsbereich = leistungsbereich;
    }

    public List<Leistung> getLeistungen() {
        return leistungen;
    }

    public void setLeistungen(List<Leistung> leistungen) {
        this.leistungen = leistungen;
    }

    public boolean isFreigegeben() {
        return freigegeben;
    }

    public void setFreigegeben(boolean freigegeben) {
        this.freigegeben = freigegeben;
    }

}
