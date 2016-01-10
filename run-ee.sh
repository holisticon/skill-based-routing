#!/bin/sh

mvn -Pee clean install -DskipTests && ./skill-based-routing-setup/target/jboss-camunda/server/jboss-as-7.2.0.Final/bin/standalone.sh



