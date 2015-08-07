package de.holisticon.bpm.example.sbr;

import static org.camunda.bpm.engine.test.assertions.ProcessEngineAssertions.assertThat;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineAssertions.init;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineTests.runtimeService;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineTests.task;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineTests.taskService;
import static org.camunda.bpm.engine.test.assertions.ProcessEngineTests.withVariables;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

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

import de.holisticon.bpm.example.sbr.LeistungsabrechnungProcess.Activities;
import de.holisticon.bpm.example.sbr.LeistungsabrechnungProcess.Variables;
import de.holisticon.bpm.example.sbr.adapter.SkillBasedRoutingGroupSelector;
import de.holisticon.bpm.example.sbr.adapter.VersicherungsschutzErmittelnDelegate;
import de.holisticon.bpm.sbr.api.Leistung;

@SuppressWarnings("unchecked")
public class LeistungsabrechnungProcessTest {

    @Rule
    public ProcessEngineNeedleRule rule = new ProcessEngineNeedleRuleBuilder(this).build();

    @Inject
    RuntimeService runtimeService;

    @Inject
    TaskService taskService;

    @Inject
    SkillBasedRoutingGroupSelector selector;

    Driver driver;

    @Before
    public void setup() {
        init(rule.getProcessEngine());
        driver = new Driver();
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
        assertThat(instance).task().hasDefinitionKey(Activities.task_leistungen_erfassen);
        assertThat(instance).hasVariables(Variables.VERSICHERUNGSNUMMER, Variables.RECHNUNGSART);
    }

    @Test
    @Deployment(resources = LeistungsabrechnungProcess.RESOURCE)
    public void leistungenErfassenToGebuehrenPruefen() {
        ProcessInstance instance = driver.startProcess();
        driver.leistungenErfassen();
        assertThat(instance).task().hasDefinitionKey(Activities.task_gebuehrenrechtlich_pruefen);
        assertThat(instance).hasVariables(Variables.PRODUKT, Variables.KUNDENSTATUS, Variables.LEISTUNGEN);

    }

    @Test
    @Deployment(resources = LeistungsabrechnungProcess.RESOURCE)
    public void gebuehrenPruefenToErstattungBerechnen() throws Exception {
        ProcessInstance instance = driver.inGebuehrenPruefen();
        driver.gebuehrenPruefen();
        assertThat(instance).task().hasDefinitionKey(Activities.task_erstattungsbetrag_berechnen);
    }

    @Test
    @Deployment(resources = LeistungsabrechnungProcess.RESOURCE)
    public void erstattungBerechnenToZahlungFreigeben() {
        ProcessInstance instance = driver.inErstattungBerechnen();
        driver.erstattungBerechnen();
        assertThat(instance).task().hasDefinitionKey(Activities.task_zahlung_freigeben);
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
            variables.put(Variables.VERSICHERUNGSNUMMER, "4711");
            variables.put(Variables.RECHNUNGSART, "Arzt");
            ProcessInstance instance = runtimeService.startProcessInstanceByKey(LeistungsabrechnungProcess.KEY, variables);
            assertThat(instance).isNotNull();
            return instance;
        }

        public void ermittleVersicherungsschutz() throws Exception {
            JavaDelegate mock = DelegateExpressions.registerJavaDelegateMock(VersicherungsschutzErmittelnDelegate.NAME).getMock();
            Mockito.doAnswer(new JavaDelegateAnswer(mock) {

                @Override
                protected void answer(DelegateExecution execution) throws Exception {
                    List<Leistung> leistungen = (List<Leistung>) execution.getVariable(Variables.LEISTUNGEN);
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
                    execution.setVariable(Variables.LEISTUNGEN, leistungen);
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
            taskService().complete(task().getId(), withVariables(Variables.LEISTUNGEN, leistungen));
        }

        public void gebuehrenPruefen() {
            final List<Leistung> leistungen = getLeistungen();
            for (final Leistung leistung : leistungen) {
                leistung.setGebuehrenrechtlichOk(!leistung.getBezeichnung().endsWith("2"));
            }
            taskService().complete(task().getId(), withVariables(Variables.LEISTUNGEN, leistungen));
        }

        public void zahlungFreigeben() {
            taskService().complete(task().getId(), withVariables(Variables.FREIGEGEBEN, true));
        }

        private List<Leistung> getLeistungen() {
            return (List<Leistung>) runtimeService().getVariable(processInstance().getId(), Variables.LEISTUNGEN);
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
                withVariables(Variables.LEISTUNGEN, leistungen, Variables.PRODUKT, "Premium", Variables.KUNDENSTATUS, "VIP"));
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
