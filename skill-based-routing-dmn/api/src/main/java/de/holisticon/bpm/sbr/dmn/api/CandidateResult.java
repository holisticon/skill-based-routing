package de.holisticon.bpm.sbr.dmn.api;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class CandidateResult implements Serializable {

  private static final long serialVersionUID = 1L;
  private final List<String> candidateUsers = new ArrayList<>();
  private final List<String> candidateGroups = new ArrayList<>();

  public List<String> getCandidateUsers() {
    return candidateUsers;
  }

  public List<String> getCandidateGroups() {
    return candidateGroups;
  }
}
