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

* (bis auf weiteres) Laden des aktuellesten Snapshot Bundles aus dem [camunda nexus](https://app.camunda.com/nexus/content/repositories/camunda-bpm-snapshots/org/camunda/bpm/jboss/camunda-bpm-jboss/7.4.0-SNAPSHOT/)

### Rules

* das /dmn Verzeichnis aus /docs kopieren nach $JBOSS_HOME/standalone/configuration

### Deployments

* das Process WAR skill-based-routing-web-X.X.X.war muss in standalone/deployments liegen (symlink oder copy)

### Plugin Module

Wir haben ein eigenes  Process Engine Plugin gebaut, dass das automatische Handling der CandidateUsers aus den dmn Files übernimmt.

dazu muss unter $JBOSS_HOME/modules folgende Struktur existieren:

     modules/
       de/
         


## Docs

* [ExpressionRequirements.pdf von Bernd](docs/ExpressionRequirements.pdf)
* [JBoss 7.2.0-Final Camunda BPM EE 7.4.0-SNAPSHOT](https://app.camunda.com/nexus/content/repositories/camunda-bpm-snapshots/org/camunda/bpm/jboss/camunda-bpm-ee-jboss/7.4.0-SNAPSHOT/)

* Zugang

Simon -> holisticon
Jan -> holisticon
Jo -> holisticon


