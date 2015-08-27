# Abstract

Skill-based Routing mit DMN - Out of the box!

Wer kann was? Wer darf was? Wer ist verfügbar? Dies sind die immer wiederkehrenden Fragen, wenn es um die Zusteuerung von Benutzeraufgaben in Geschäftsprozessen geht. In der Praxis wirkt sich dies in irgendeiner Form immer auch auf die Implementierung der ausführbaren Prozessmodelle aus. In der Konsequenz kann dies u.U. bedeuten, dass Prozesse angepasst und neue Versionen ausgerollt werden müssen, wenn eigentlich eine schnelle Reaktion auf veränderte Bedingungen gefragt ist.

Holisticon hat auf Basis von DMN eine Lösung für camunda BPM entwickelt, mit der die Zuordnung von Benutzeraufgaben komplett aus den ausführbaren Prozessmodellen ausgelagert werden kann. Die Definition der Skills und Berechtigungen erfolgt extern über DMN-Entscheidungstabellen und lässt sich individuell und flexibel auf die jeweiligen Anwendungsfälle anpassen. Der Clou dabei ist jedoch, dass die ausführbaren Prozesse keinerlei Kenntnis über die Existenz dieses Skill-based Routing besitzen müssen. Dadurch lässt sich die Lösung auch ohne weiteres auf bereits bestehende Prozesse anwenden, ohne dass Anpassungen nötig sind! 

# Installation

## Camunda DMN Web Modeller

Für die Bearbeitung der DMN Dateien, kann der Web Modeler verwendet werden. 

Von [https://github.com/holisticon/dmn-js-examples.git](https://github.com/holisticon/dmn-js-examples.git) auschecken und den Build mit `grunt auto-build` starten, um den Modeller zu verwenden.


## JBoss einrichten

(Bis auf weiteres) Laden des aktuellesten Snapshot Bundles aus dem [camunda nexus](https://app.camunda.com/nexus/content/repositories/camunda-bpm-snapshots/org/camunda/bpm/jboss/camunda-bpm-ee-jboss/7.4.0-SNAPSHOT/)

Obacht: sowohl camunda als auch wir können aktuell noch refactoren, also ggf. überprüfen, ob jar- und Klassennamen noch stimmen

#### Rules

Das `/dmn` Verzeichnis aus `/docs` kopieren nach `$JBOSS_HOME/standalone/configuration`

#### Deployments
    
Das Process WAR `skill-based-routing-web-X.X.X.war` muss in `$JBOSS_HOME/standalone/deployments` liegen (symlink oder copy)    

Eine vorkonfigurierte H2-Datenbank liegt im Verzeichnis `/docs`. Diese muss in `$JBOSS_HOME/bin/camunda-h2-dbs/`.

Dann auch immer gleich die Camunda Beispielanwendung (invoice) aus den Deployments entfernen.


#### Camunda Engine Plugin als JBoss Module

Wir haben ein eigenes  Process Engine Plugin gebaut, dass das automatische Handling der CandidateUsers aus den DMN Regeldateien übernimmt.

Dazu muss der Inhalt des `jboss-module-de.holisticon.skill-based-routing-0.2-SNAPSHOT.zip` ins `$JBOSS_HOME/modules` ausgepackt werden.    

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


Das wars. Camunda zieht beim Hochfahren unser Plugin, das Plugin registriert TaskListener für jedes TaskCreate-Element und dieser 
Listener liest aus `$JBOSS_HOME/standalone/configuration/dmn` die entsprechenden *.dmn Dateien ein und wertet sie aus. 



## Resources

* [ExpressionRequirements.pdf von Bernd](docs/ExpressionRequirements.pdf)
* [JBoss 7.2.0-Final Camunda BPM EE 7.4.0-SNAPSHOT](https://app.camunda.com/nexus/content/repositories/camunda-bpm-snapshots/org/camunda/bpm/jboss/camunda-bpm-ee-jboss/7.4.0-SNAPSHOT/)

## Logins

* Simon -> holisticon   
* Jan -> holisticon   
* Jo -> holisticon 


