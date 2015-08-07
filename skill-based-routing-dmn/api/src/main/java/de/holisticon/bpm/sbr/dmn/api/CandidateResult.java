package de.holisticon.bpm.sbr.dmn.api;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class CandidateResult implements Serializable {

  private final List<String> candidateUsers = new ArrayList<>();
  private final List<String> candidateGroups = new ArrayList<>();

  public List<String> getCandidateUsers() {
    return candidateUsers;
  }

  public List<String> getCandidateGroups() {
    return candidateGroups;
  }
}
