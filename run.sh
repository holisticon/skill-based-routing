#!/bin/sh

mvn clean install -DskipTests && mvn -f skill-based-routing-setup assembly:single && ./skill-based-routing-setup/target/jboss-camunda-7.4.0/server/jboss-as-7.2.0.Final/bin/standalone.sh

