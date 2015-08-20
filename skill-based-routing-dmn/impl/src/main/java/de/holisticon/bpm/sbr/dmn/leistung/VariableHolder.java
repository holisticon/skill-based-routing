package de.holisticon.bpm.sbr.dmn.leistung;

import java.util.Set;

public final class VariableHolder {

  public static final String VARIABLES = "variables";
  
  public static enum RequiredAuthorizations {
    INTERNA, KULANZ, EXKASSO_S, EXKASSO_M, EXKASSO_L;
  }

  public static enum RequiredSkills {
    SH, TAR_ES, TAR_EZ, TAR_AB, HeilM_RL, GOÄ, GOZ,  
  }
  
  private String rechnungsart;
  private String produkt;
  private String kundenstatus;
  private Long erstattungGesamt;
  private Set<String> requiredSkills;
  private Set<String> requiredAuthorizations;

  public Set<String> getRequiredSkills() {
    return requiredSkills;
  }

  public void setRequiredSkills(Set<String> requiredSkill) {
    this.requiredSkills = requiredSkill;
  }

  public Set<String> getRequiredAuthorizations() {
    return requiredAuthorizations;
  }

  public void setRequiredAuthorizations(Set<String> requiredAuthorization) {
    this.requiredAuthorizations = requiredAuthorization;
  }

  public Long getErstattungGesamt() {
    return erstattungGesamt;
  }

  public void setErstattungGesamt(Long erstattungGesamt) {
    this.erstattungGesamt = erstattungGesamt;
  }

  public String getKundenstatus() {
    return kundenstatus;
  }

  public void setKundenstatus(String kundenStatus) {
    this.kundenstatus = kundenStatus;
  }

  public String getProdukt() {
    return produkt;
  }

  public String getRechnungsart() {
    return rechnungsart;
  }

  public void setProdukt(String produkt) {
    this.produkt = produkt;
  }

  public void setRechnungsart(String rechnunsart) {
    this.rechnungsart = rechnunsart;
  }
}