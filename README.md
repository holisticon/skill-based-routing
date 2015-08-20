# Overview


# Installation

## Prerequisites

### Camunda DMN Web Modeller

For editing DMN files, the web modeller can be used. 

Checkout https://github.com/holisticon/dmn-js-examples.git
Build it with `grunt auto-build` run from modeler

## Abstract

Skill-based Routing mit DMN - Out of the box!

Wer kann was? Wer darf was? Wer ist verfügbar? Dies sind die immer wiederkehrenden Fragen, wenn es um die Zusteuerung von Benutzeraufgaben in Geschäftsprozessen geht. In der Praxis wirkt sich dies in irgendeiner Form immer auch auf die Implementierung der ausführbaren Prozessmodelle aus. In der Konsequenz kann dies u.U. bedeuten, dass Prozesse angepasst und neue Versionen ausgerollt werden müssen, wenn eigentlich eine schnelle Reaktion auf veränderte Bedingungen gefragt ist.

Holisticon hat auf Basis von DMN eine Lösung für camunda BPM entwickelt, mit der die Zuordnung von Benutzeraufgaben komplett aus den ausführbaren Prozessmodellen ausgelagert werden kann. Die Definition der Skills und Berechtigungen erfolgt extern über DMN-Entscheidungstabellen und lässt sich individuell und flexibel auf die jeweiligen Anwendungsfälle anpassen. Der Clou dabei ist jedoch, dass die ausführbaren Prozesse keinerlei Kenntnis über die Existenz dieses Skill-based Routing besitzen müssen. Dadurch lässt sich die Lösung auch ohne weiteres auf bereits bestehende Prozesse anwenden, ohne dass Anpassungen nötig sind! 

## JBoss einrichten

(Bis auf weiteres) Laden des aktuellesten Snapshot Bundles aus dem [camunda nexus](https://app.camunda.com/nexus/content/repositories/camunda-bpm-snapshots/org/camunda/bpm/jboss/camunda-bpm-ee-jboss/7.4.0-SNAPSHOT/)

Obacht: sowohl camunda als auch wir können aktuell noch refactoren, also ggf. überprüfen, ob jar- und Klassennamen noch stimmen

### Rules

Das `/dmn` Verzeichnis aus `/docs` kopieren nach `$JBOSS_HOME/standalone/configuration`

### Deployments

Das Process WAR `skill-based-routing-web-X.X.X.war` muss in `$JBOSS_HOME/standalone/deployments` liegen (symlink oder copy)

### Plugin Module

Wir haben ein eigenes  Process Engine Plugin gebaut, dass das automatische Handling der CandidateUsers aus den dmn Files übernimmt.

Dazu muss unter `$JBOSS_HOME/modules` folgende Struktur existieren:

    mkdir -p modules/de/holisticon/skill-based-routing/main/
    
In diesem Verichnis sind die folgenden Dateien aus dem Projekt `skill-based-routing-plugin` abzulegen:

    skill-based-routing-plugin/module.xml
    skill-based-routing-plugin/target/skill-based-routing-plugin-X.X.X.jar
    

Weiterhin muss das module in der `org/camunda/bpm/jboss/camunda-jboss-subsystem/main/module.xml` eingetragen werden:

<pre>
     ...
     &lt;module name="org.camunda.bpm.camunda-engine-plugin-spin" /&gt;
     &lt;module name="org.camunda.bpm.camunda-engine-plugin-connect" /&gt;
     &lt;module name="de.holisticon.skill-based-routing" /&gt;
     ...
</pre>

Und unsere Plugin Klasse in der standalone.xml registriert werden

<pre>
    ...
    &lt;plugins>
      &lt;plugin>
        &lt;class>org.camunda.bpm.application.impl.event.ProcessApplicationEventListenerPlugin&lt;/class>
      &lt;/plugin>
      &lt;plugin>
        &lt;class>de.holisticon.bpm.sbr.plugin.SkillBasedRoutingProcessEnginePlugin&lt;/class>
      &lt;/plugin>
      ...
</pre>


Das wars. Camunda zieht beim Hochfahren unser plugin, das Plugin registriert TaskListener für jedes TaskCreate-Element und dieser 
Listener liest aus $JBOSS_HOME/standalone/configuration/dmn die entsprechende *.dmn Datei ein und wertet sie aus




## Resources

* [ExpressionRequirements.pdf von Bernd](docs/ExpressionRequirements.pdf)
* [JBoss 7.2.0-Final Camunda BPM EE 7.4.0-SNAPSHOT](https://app.camunda.com/nexus/content/repositories/camunda-bpm-snapshots/org/camunda/bpm/jboss/camunda-bpm-ee-jboss/7.4.0-SNAPSHOT/)

## Zugang

Simon -> holisticon   
Jan -> holisticon   
Jo -> holisticon 


