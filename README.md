<img src="https://www.holisticon.de/wp-content/uploads/2013/05/holisticon-logo-hamburg.gif" align="right" />
# Skill-based-Routing mit DMN

Skill-based Routing mit DMN - Out of the box!

Wer kann was? Wer darf was? Wer ist verfügbar? Dies sind die immer wiederkehrenden Fragen, wenn es um die Zusteuerung von Benutzeraufgaben in Geschäftsprozessen geht. In der Praxis wirkt sich dies in irgendeiner Form immer auch auf die Implementierung der ausführbaren Prozessmodelle aus. In der Konsequenz kann dies u.U. bedeuten, dass Prozesse angepasst und neue Versionen ausgerollt werden müssen, wenn eigentlich eine schnelle Reaktion auf veränderte Bedingungen gefragt ist.

Holisticon hat auf Basis von DMN eine Lösung für camunda BPM entwickelt, mit der die Zuordnung von Benutzeraufgaben komplett aus den ausführbaren Prozessmodellen ausgelagert werden kann. Die Definition der Skills und Berechtigungen erfolgt extern über DMN-Entscheidungstabellen und lässt sich individuell und flexibel auf die jeweiligen Anwendungsfälle anpassen. Der Clou dabei ist jedoch, dass die ausführbaren Prozesse keinerlei Kenntnis über die Existenz dieses Skill-based Routing besitzen müssen. Dadurch lässt sich die Lösung auch ohne weiteres auf bereits bestehende Prozesse anwenden, ohne dass Anpassungen nötig sind! 

## Beispiel

Als Beispiel haben wir einen vereinfachten Prozess ausgesucht, der an die Leistungsabrechnung einer Krankenversicherung angelehnt ist. 

![Beispielprozess Leistungsabrechnung](https://raw.githubusercontent.com/holisticon/skill-based-routing/master/docs/Leistungsabrechnung.png)

Dabei hat der Prozess keinerlei Informationen über das Routing, es findet ausschließlich über die in DMN ausgelagerte Entschedungstabellen statt. 


## Installation

### Camunda DMN Web Modeller

Für die Bearbeitung der DMN Dateien, kann der Web Modeler verwendet werden. Dieser ist Teil des Camunda BPM Enterprise Cockpits oder kann alternativ auch auf der [bpmn.io](http://demo.bpmn.io/dmn/) verwendet werden.  

### JBoss einrichten

Laden des aktuellesten (Camunda BPM ee 7.4.0) Bundles aus dem [camunda nexus](https://app.camunda.com/nexus/content/repositories/camunda-bpm-snapshots/org/camunda/bpm/jboss/camunda-bpm-ee-jboss/7.4.0/)

#### Deployments
    
Das Process WAR `skill-based-routing-process-X.X.X.war` muss in `$JBOSS_HOME/standalone/deployments` liegen (symlink oder copy)    


#### Camunda Engine Plugin als JBoss Module

Wir haben ein eigenes Process Engine Plugin gebaut, dass das automatische Handling der CandidateUsers aus den DMN Regeldateien übernimmt.

![Architekturskizze](https://raw.githubusercontent.com/holisticon/skill-based-routing/master/docs/sbr_camunda-plugin_architecture.png)

Für die Installation muss der Inhalt des `jboss-module-de.holisticon.skill-based-routing-0.2-SNAPSHOT.zip` ins `$JBOSS_HOME/modules` ausgepackt werden.    

Weiterhin muss das module in der `org/camunda/bpm/jboss/camunda-jboss-subsystem/main/module.xml` eingetragen werden:

     ...
     <module name="org.camunda.bpm.camunda-engine-plugin-spin" />
     <module name="org.camunda.bpm.camunda-engine-plugin-connect" />
     <module name="de.holisticon.skill-based-routing" />
     ...


Und unsere Plugin Klasse in der `standalone.xml` registriert werden

    <subsystem xmlns="urn:org.camunda.bpm.jboss:1.1">
       <process-engines>
          <process-engine name="default" default="true">
             ...
             <plugins>
                ...
                <plugin>
                   <class>de.holisticon.bpm.sbr.plugin.SkillBasedRoutingProcessEnginePlugin</class>
                </plugin>
                ...


Camunda BPM zieht beim Hochfahren unser Plugin, das Plugin registriert TaskListener für jedes TaskCreate-Element und dieser Listener liest aus Deployment die entsprechenden *.dmn Dateien ein und wertet sie aus. 

## Resources

* [JBoss 7.2.0-Final Camunda BPM EE 7.4.0](https://app.camunda.com/nexus/content/repositories/camunda-bpm-snapshots/org/camunda/bpm/jboss/camunda-bpm-ee-jboss/7.4.0/)
* [sbr-decision-tables.xlsx](https://github.com/holisticon/skill-based-routing/raw/master/docs/sbr_decision_tables.xlsx)

### Autoren

* [Jo Ehm](https://github.com/joehm)
* [Jan Galinski](https://github.com/galinski)
* [Simon Zambrovski](https://github.com/zambrovski)

### License

This project is released under the revised BSD License (s. LICENSE). 

## Useful

* `curl -v http://localhost:8080/engine-rest/deployment/create -F deployment-name="<NAME>" -F table.dmn=@<FILE>` deploy resource via REST
* `mvn dependency:get -Dartifact=org.camunda.bpm.jboss:camunda-bpm-jboss:7.4.0-SNAPSHOT:zip` download the latest jboss distro bundle
* [current DMN editor at camunda](https://camunda.org/dmn/demo-stage/)
* (http://localhost:8080/camunda)
* (http://localhost:8080/skill-based-routing-1.0-SNAPSHOT/showcasesetup)
