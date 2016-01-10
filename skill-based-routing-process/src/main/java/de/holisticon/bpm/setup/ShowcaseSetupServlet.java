package de.holisticon.bpm.setup;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import de.holisticon.bpm.example.sbr.LeistungsabrechnungProcess;
import de.holisticon.bpm.example.sbr.LeistungsabrechnungProcess.VARIABLES;
import de.holisticon.bpm.sbr.api.Leistung;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.task.Task;
import org.camunda.bpm.engine.variable.Variables;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Set;

@WebServlet(name = "ShowcaseSetup", urlPatterns = { "/showcasesetup" })
public class ShowcaseSetupServlet extends HttpServlet {

  @Inject
  private RuntimeService runtimeService;

  @Inject
  private TaskService taskService;

  @Override
  protected void doGet(HttpServletRequest httpServletRequest, HttpServletResponse resp) throws ServletException, IOException {

    final ProcessInstance process1 = startProcess("HCL19471026", "Vorsorgeuntersuchung Arteriosklerose");
    resp.getOutputStream().println("Started Process 'HCL19471026' .");
    leistungenErfassen(process1, "Ines", "Premium Komplett","VIP", Sets.newHashSet(
      "GOÄ-539 Ultraschall Duplex",
      "GOÄ-355 Blutbild",
      "Sonderberatung (VIP)",
      "AM Atrovastatin 20mg",
      "AM Aspirin protect 100"));
    pruefungDurchfuehren(process1, "Ines", Sets.newHashSet("Sonderberatung (VIP)"));

    final ProcessInstance process2 = startProcess("JBJ7800", "Treatment of my headbanging whiplash ;-)");
    resp.getOutputStream().println("Started Process 'JBJ7800' .");
    leistungenErfassen(process2, "Ines", "Premium Komplett","VIP", Sets.newHashSet(
      "GOÄ-538 Wärmebehandlung",
      "HM Manuelle Therapie (MT)",
      "Thai-Massage",
      "AM Finalgon Forte"));
    pruefungDurchfuehren(process2, "Ines", Sets.newHashSet("Thai-Massage"));
  }

  private void pruefungDurchfuehren(ProcessInstance processInstance, String user, Set<String> ablehnung) {
    Task task = claimTask(processInstance, user);

    List<Leistung> leistungen = (List<Leistung>) taskService.getVariableTyped(task.getId(), VARIABLES.LEISTUNGEN).getValue();
    for (Leistung leistung : leistungen) {
      leistung.setGebuehrenrechtlichOk(!ablehnung.contains(leistung.getBezeichnung()));
    }

    taskService.complete(task.getId(), Variables.putValueTyped(VARIABLES.LEISTUNGEN, Variables.objectValue(leistungen).create()));
  }

  private void leistungenErfassen(ProcessInstance processInstance, String user, String produkt, String status, Set<String> leistungsNamen) {
    Task task = claimTask(processInstance, user);

    List<Leistung> leistungen = Lists.newArrayList();
    for (String leistungsName : leistungsNamen) {
      Leistung leistung = new Leistung();
      leistung.setBezeichnung(leistungsName);
      leistungen.add(leistung);
    }

    taskService.complete(task.getId(), Variables
      .putValue(VARIABLES.KUNDENSTATUS, status)
      .putValue(VARIABLES.PRODUKT, produkt)
      .putValueTyped(VARIABLES.LEISTUNGEN, Variables.objectValue(leistungen).create())
    );
  }

  private Task claimTask(ProcessInstance processInstance, String user) {
    Task task = taskService.createTaskQuery().processInstanceId(processInstance.getId()).singleResult();
    taskService.claim(task.getId(), user);
    return task;
  }

  private ProcessInstance startProcess(String verNr, String erstattungswunsch) {
    return runtimeService.startProcessInstanceByKey(LeistungsabrechnungProcess.KEY,
      Variables
        .putValue(VARIABLES.VERSICHERUNGSNUMMER, verNr)
        .putValue(VARIABLES.ERSTATTUNGSWUNSCH, erstattungswunsch)
        .putValue(VARIABLES.RECHNUNGSART, "Arzt")
    );

  }
}
