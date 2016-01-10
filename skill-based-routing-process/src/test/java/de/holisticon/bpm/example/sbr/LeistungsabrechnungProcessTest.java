package de.holisticon.bpm.example.sbr;

import de.holisticon.bpm.example.sbr.LeistungsabrechnungProcess.ACTIVITIES;
import de.holisticon.bpm.example.sbr.LeistungsabrechnungProcess.VARIABLES;
import de.holisticon.bpm.example.sbr.adapter.VersicherungsschutzErmittelnDelegate;
import de.holisticon.bpm.sbr.api.Leistung;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.test.Deployment;
import org.camunda.bpm.engine.test.assertions.ProcessEngineTests;
import org.camunda.bpm.extension.mockito.DelegateExpressions;
import org.camunda.bpm.extension.mockito.answer.JavaDelegateAnswer;
import org.camunda.bpm.extension.needle.ProcessEngineNeedleRule;
import org.camunda.bpm.extension.needle.ProcessEngineNeedleRuleBuilder;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.mockito.Matchers;
import org.mockito.Mockito;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.camunda.bpm.engine.test.assertions.ProcessEngineAssertions.assertThat;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineAssertions.init;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineTests.runtimeService;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineTests.task;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineTests.taskService;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineTests.withVariables;

@SuppressWarnings("unchecked")
public class LeistungsabrechnungProcessTest {

  @Rule
  public ProcessEngineNeedleRule rule = new ProcessEngineNeedleRuleBuilder(this).build();

  @Inject
  RuntimeService runtimeService;

  @Inject
  TaskService taskService;


  Driver driver;

  @Before
  public void setup() {
    init(rule.getProcessEngine());
    driver = new Driver();

    DelegateExpressions.autoMock(LeistungsabrechnungProcess.RESOURCE);
  }

  @Test
  @Deployment(resources = LeistungsabrechnungProcess.RESOURCE)
  public void deploy() {
    // just deploy
  }

  @Test
  @Deployment(resources = LeistungsabrechnungProcess.RESOURCE)
  public void startToLeistungenErfassen() {
    ProcessInstance instance = driver.startProcess();
    assertThat(instance).task().hasDefinitionKey(ACTIVITIES.task_leistungen_erfassen);
    assertThat(instance).hasVariables(VARIABLES.VERSICHERUNGSNUMMER, VARIABLES.RECHNUNGSART);
  }

  @Test
  @Deployment(resources = LeistungsabrechnungProcess.RESOURCE)
  public void leistungenErfassenToGebuehrenPruefen() {
    ProcessInstance instance = driver.startProcess();
    driver.leistungenErfassen();
    assertThat(instance).task().hasDefinitionKey(ACTIVITIES.task_gebuehrenrechtlich_pruefen);
    assertThat(instance).hasVariables(VARIABLES.PRODUKT, VARIABLES.KUNDENSTATUS, VARIABLES.LEISTUNGEN);

  }

  @Test
  @Deployment(resources = LeistungsabrechnungProcess.RESOURCE)
  public void gebuehrenPruefenToErstattungBerechnen() throws Exception {
    ProcessInstance instance = driver.inGebuehrenPruefen();
    driver.gebuehrenPruefen();
    assertThat(instance).task().hasDefinitionKey(ACTIVITIES.task_erstattungsbetrag_berechnen);
  }

  @Test
  @Deployment(resources = LeistungsabrechnungProcess.RESOURCE)
  public void erstattungBerechnenToZahlungFreigeben() {
    ProcessInstance instance = driver.inErstattungBerechnen();
    driver.erstattungBerechnen();
    assertThat(instance).task().hasDefinitionKey(ACTIVITIES.task_zahlung_freigeben);
  }

  @Test
  @Deployment(resources = LeistungsabrechnungProcess.RESOURCE)
  public void zahlungFreigebenToEnd() {
    ProcessInstance instance = driver.inZahlungFreigeben();
    driver.zahlungFreigeben();
    assertThat(instance).isEnded();
  }

  /**
   * Glue between the test and the process.
   */
  class Driver {

    private static final String L3 = "L3";
    private static final String L2 = "L2";
    private static final String L1 = "L1";
    private static final double BETRAG = 12.45;

    public ProcessInstance startProcess() {
      Map<String, Object> variables = org.camunda.bpm.engine.variable.Variables.createVariables();
      variables.put(VARIABLES.VERSICHERUNGSNUMMER, "4711");
      variables.put(VARIABLES.RECHNUNGSART, "Arzt");
      ProcessInstance instance = runtimeService.startProcessInstanceByKey(LeistungsabrechnungProcess.KEY, variables);
      assertThat(instance).isNotNull();
      return instance;
    }

    public void ermittleVersicherungsschutz() throws Exception {
      JavaDelegate mock = DelegateExpressions.registerJavaDelegateMock(VersicherungsschutzErmittelnDelegate.NAME).getMock();
      Mockito.doAnswer(new JavaDelegateAnswer(mock) {

        @Override
        protected void answer(DelegateExecution execution) throws Exception {
          List<Leistung> leistungen = (List<Leistung>) execution.getVariable(VARIABLES.LEISTUNGEN);
          for (final Leistung leistung : leistungen) {
            if (leistung.isGebuehrenrechtlichOk()) {
              switch (leistung.getBezeichnung()) {
                case L1:
                  leistung.setTarif("T1");
                  break;
                case L2:
                  leistung.setTarif("T2");
                  break;
                case L3:
                  leistung.setTarif("T3");
                  break;
              }
            }
          }
          execution.setVariable(VARIABLES.LEISTUNGEN, leistungen);
        }

      }).when(mock).execute(Matchers.any(DelegateExecution.class));
    }

    public void erstattungBerechnen() {
      final List<Leistung> leistungen = getLeistungen();
      for (final Leistung leistung : leistungen) {
        if (leistung.isGebuehrenrechtlichOk() && leistung.getTarif() != null) {
          leistung.setErstattungsbetrag(BETRAG);
        }
      }
      taskService().complete(task().getId(), withVariables(VARIABLES.LEISTUNGEN, leistungen));
    }

    public void gebuehrenPruefen() {
      final List<Leistung> leistungen = getLeistungen();
      for (final Leistung leistung : leistungen) {
        leistung.setGebuehrenrechtlichOk(!leistung.getBezeichnung().endsWith("2"));
      }
      taskService().complete(task().getId(), withVariables(VARIABLES.LEISTUNGEN, leistungen));
    }

    public void zahlungFreigeben() {
      taskService().complete(task().getId(), withVariables(VARIABLES.FREIGEGEBEN, true));
    }

    private List<Leistung> getLeistungen() {
      return (List<Leistung>) runtimeService().getVariable(processInstance().getId(), VARIABLES.LEISTUNGEN);
    }

    private ProcessInstance processInstance() {
      return ProcessEngineTests.processInstanceQuery().singleResult();
    }

    public void leistungenErfassen() {
      List<Leistung> leistungen = new ArrayList<Leistung>();
      leistungen.add(new Leistung(L1));
      leistungen.add(new Leistung(L2));
      leistungen.add(new Leistung(L3));
      taskService().complete(task().getId(),
        withVariables(VARIABLES.LEISTUNGEN, leistungen, VARIABLES.PRODUKT, "Premium", VARIABLES.KUNDENSTATUS, "VIP"));
    }

    public ProcessInstance inGebuehrenPruefen() {
      try {
        ermittleVersicherungsschutz();
      } catch (Exception e) {
        Assert.fail(e.getMessage());
      }
      ProcessInstance instance = startProcess();
      leistungenErfassen();
      return instance;
    }

    public ProcessInstance inErstattungBerechnen() {
      ProcessInstance instance = inGebuehrenPruefen();
      gebuehrenPruefen();
      return instance;
    }

    public ProcessInstance inZahlungFreigeben() {
      ProcessInstance instance = inErstattungBerechnen();
      erstattungBerechnen();
      return instance;
    }

  }
}
