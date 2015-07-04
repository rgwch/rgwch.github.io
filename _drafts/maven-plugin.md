---
layout: post
title: Plugin! Plug in!
description: Wie man ein Maven-Plugin schreibt
category: Programmieren allgemein
tags: [Maven, Programmieren, Plugin]
---

### Plug in!

Irgendwann will man etwas, was Maven nicht kann. Dann macht man sich entweder auf die Suche nach einem Plugin
mit den gewünschten Fähigkeiten, oder man schreibt selber eins. Das ist verblüffenderweise gar nicht so schwierig.

Anstatt irgendein Pseudoprojekt zu erstellen, beziehe ich mich im Folgenden auf ein real existierendes Projekt: 
[Webelexis](http://github.com/rgwch/webelexis), und ein real existierendes Plugin: 
[mimosa-maven-plugin](http://gitlab.com/rgwch/mimosa-maven-plugin), das ich für dieses Projekt gemacht habe.

Die Idee ist folgende: Das Teilprojekt webelexis-client ist eine JavaScript-Applikation, das Teilprojekt webelexis-server
ist ein Java-Programm. Das Gesamtprojekt besteht dann aus dem Server, welcher das client-Programm in seinem 
 Ubterverzeichnis 'web' hält, und mit diesem zusammen in ein einziges jar gepackt wird, welches der Anwender
 dann einfach mit `java -jar webelexis-servr-x.y.z.jar` starten kann und sofort eine voll funktionsfähige Web-Anwendung
 hat. Um das zu erreichen sind folgende Arbeitsschritte notwendig:
 
#### Clientseitig:

* Jade-Dateien nach HTML compilieren
* JavaScript Dateien minimieren und zusammenfassen
* CSS Dateien minimieren und zusammenfassen
* alles andere unverändert ins Zielverzeichnis kopieren
* Unit-Tests laufen lassen

Diese ganzen clientseitigen Arbeiten  habe ich [mimosa](http://mimosa.io) übertragen. Ein einfaches `mimosa build -m` baut
die minimierte Version der Website im Verzeichnis webelexis-client/dist

#### Serverseitig

* Java Dateien compilieren
* Ressourcen ins Zielverzeichnis kopieren
* Tests laufen lassen
* Alles in ein .jar packen.

Diese Aufgaben erledigt, wen wundert's, Maven.

#### Bisher:

Der manuelle Ablauf ist so, dass man zuerst `mimosa build` im client startet, dann `maven compile` im server, 
dann den Inhalt von "webelexis-client/dist" nach "webelexis-server/target/classes/web" kopiert und dann
`maven package` aufruft, um alles zusammenzupacken.

#### Neu:

Okay, man könnte sich einfach ein Shell-Script schreiben, was das alles erledigt. Oder meinetwegen einen Ant-Task.
Oder man könnte ein existierendes Maven-Plugin, zum Beispiel exec-maven-plugin einsetzen. Aber wir wollen ja etwas lernen.
Also bauen wir unser eigenes Plugin für diesen Job. Das Ziel ist: Ich gebe nur `maven package` ein, und dann werden
client und server gebaut, getestet, zusammenkopiert und in ein jar abgefüllt.


### Aufbau:

Das Plugin besteht aus folgenden Teilen:

pom.xml (wer hätte das gedacht?) Ich zitiere hier nur die relevanten Stellen. Die ganze Datei kann im Quelltext mit
oben im ersten Absatz stehendem Link heruntergeladen werden.

        <?xml version="1.0" encoding="UTF-8"?>
        <project xmlns="http://maven.apache.org/POM/4.0.0"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
            <modelVersion>4.0.0</modelVersion>
            <groupId>rgwch</groupId>
            <artifactId>mimosa-maven-plugin</artifactId>
            <version>1.0.1</version>
            <packaging>maven-plugin</packaging>
            <dependencies>
                <dependency>
                    <groupId>org.apache.maven</groupId>
                    <artifactId>maven-plugin-api</artifactId>
                    <version>3.3.3</version>
                </dependency>
                <dependency>
                    <groupId>org.apache.maven.plugin-tools</groupId>
                    <artifactId>maven-plugin-annotations</artifactId>
                    <version>3.4</version>
                </dependency>
                <dependency>
                    <groupId>org.apache.commons</groupId>
                    <artifactId>commons-io</artifactId>
                    <version>1.3.2</version>
                </dependency>
        
            </dependencies>
        </project>

Das Einzige, was anders ist, als bei anderen Maven-Projekten, ist <packaging>

Und dann im Wesentlichen der Klasse ch.rgw.mmp.MimosaMavenPlugin.java:

     package ch.rgw.mmp;
     
     import org.apache.commons.io.FileUtils;
     import org.apache.maven.plugin.AbstractMojo;
     import org.apache.maven.plugin.MojoExecutionException;
     import org.apache.maven.plugin.MojoFailureException;
     import org.apache.maven.plugins.annotations.Mojo;
     import org.apache.maven.plugins.annotations.Parameter;
     
     import java.io.File;
     import java.io.IOException;
     
     @Mojo(name = "mimosa")
     public class MimosaMavenPlugin extends AbstractMojo {
     
       @Parameter private File source;
       @Parameter private File intermediate;
       @Parameter private File dest;
       @Parameter private String mimosaOptions;
     
       public void execute() throws MojoExecutionException, MojoFailureException {
         if (!dest.exists() && !dest.mkdirs()) {
           throw new MojoFailureException(null, "could not create directory " + dest.getAbsolutePath(), "");
         }
         getLog().info("launching mimosa from " + source.getAbsolutePath());
         try {
           Process mimosa=Runtime.getRuntime().exec("mimosa build", null,source);
           StreamBuffer errorStream=new StreamBuffer(mimosa.getErrorStream(),"ERROR");
           StreamBuffer outputStream=new StreamBuffer(mimosa.getInputStream(),"OUTPUT");
           errorStream.start();
           outputStream.start();
           getLog().info(Integer.toString(mimosa.waitFor()));
           FileUtils.copyDirectory(intermediate,dest);
         } catch (IOException e) {
           e.printStackTrace();
           throw new MojoFailureException(e.getMessage());
         } catch (InterruptedException e) {
           e.printStackTrace();
           throw new MojoFailureException(e.getMessage());
         }
       }
     }


Das ist alles. Die Klasse StreamBuffer liste ich hier jetzt nicht auf, die erledigt nur das
Handling des outputs von Mimosa. Die einzige Besonderheit dieser Klasse sind die Annotationen @Mojo und
@Parameter, sowie der Aufruf von getLog(). Alles Andere ist standard Java.

@Mojo, das mich immer an diese kanarische Sauce erinnert, ist das Kommando mit dem dieses Plugin involviert wird.
Hier definieren wir, dass es auf den Namen "mimosa" hören soll.

@Parameter sind die Werte, die das aufrufende Projekt dem Plugin mitgeben kann.

#### Einsatz

Der Aufruf unseres Plugins in der pom.xml von webelexis-server sieht so aus:

      <plugin>
          <groupId>rgwch</groupId>
          <artifactId>mimosa-maven-plugin</artifactId>
          <version>1.0.1</version>
          <configuration>
              <source>../webelexis-client</source>
              <intermediate>../webelexis-client/dist</intermediate>
              <dest>target/classes/web</dest>
              <mimosaOptions>-m</mimosaOptions>
          </configuration>
          <executions>
              <execution>
                  <id>1</id>
                  <phase>process-resources</phase>
                  <goals>
                      <goal>mimosa</goal></goals>
              </execution>
          </executions>
      </plugin>
      
      
Hier wird deklariert, welche Parameter das Plugin bekommt, nämlich das Basisverzeichnis des Client-Projekts, 
dessen Ausgabeverzeichnis, sowie das endgültige Zielverzeichnis im Server-Projekt.
Dann werd unter <executions> festgelegt, wann es ausgeführt wird, und welches Kommando ausgeführt wird:
Wir möchten, dass in der Phase "process-resources" das Kommando "mimosa" unseres Plugins ausgeführt wird. Danach
soll der Inhalt des mimosa-Ausgabeverzeichnisses ins Unterverzeichnis "web" des server-Ausgabeverzeichnisses
kopiert werden. 

Das ist eigentlich alles. Wenn wir jetzt zunächst im Verzeichnis mimosa-maven-plugin den Befehl `mvn install` ausführen, 
können wir anschliessend im Server-Verzeichnis `mvn package` aufrufen und erhalten am Ende ein .jar, welches
den verarbeiteten Server- und Client- Code enthält.

### Publish or perish

Um ein Plugin auch anderen zur Verfügung zu stellen, muss man ein wenig mehr Aufwand betreiben. Bisher haben wir es ja
nur mittels `mvn install`im lokalen Repository installiert.
