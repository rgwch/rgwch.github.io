---
layout: post
title: Maven - Konfiguration
description: einige Punkte in Pom.xml
category: Programmieren allgemein
tags: [Maven, pom]
---

[Teil 1](/2015/07/Maven) [Teil 2](/2015/07/pom) Teil 3 [Teil 4](/2015/07/maven-plugin)


### Convention over Configuration, but...

Wie wir in den letzten beiden Posts, [Einstieg](/2015/07/Maven) und [Pom](/2015/07/pom) gesehen haben, startet Maven
 mit "vernünftigen" Annahmen, die dazu führen, dass ein einfaches Projekt, welches ein Layout hat, das den Maven-Konventionen
 entspricht, erfolgreich gebaut werden kann. Und zwar ohne irgendwelche zusätzlich Konfiguration, die über das simple
 Basis-Pom hinausgeht.

Leider sind im "echten Leben" Projekte nur selten einfach genug, um allein per Konvention gebaut werden zu können.
Dann sind Eingriffe in der pom.xml notwendig. Die ultimative Unterstützung dabei ist die offizielle 
[POM-Referenz](https://maven.apache.org/pom.html) von Apache.

Ich zeige hier nur einige häufig benötigte Dinge.

#### Dependencies

Abhängigkeiten müssen in der Pom deklariert werden. Dies ist genauer im [letzten Post](/2015/07/pom) beschrieben. Man kann
entweder manuell &lt;dependency&gt; tags einfügen, oder man überlässt seiner IDE das Management. Zumindest Idea hat ziemlich
ausgedehnten [Maven Support](https://www.jetbrains.com/idea/help/resolving-references-with-maven.html).

#### Plugins

Fast alles, was Maven tut, tut es mit Plugins. Das heisst, es tut eigentlich nichts, als in jeder "lifecycle-phase" 
die dazu passenden Plugins aufzurufen und zu parametrisieren. Die Parameter entnimmt es der pom.xml. Dass man davon
im Grundzustand nichts sieht, das liegt -wieder einmal- am "convention over configuration". Wann immer ein Plugin 
in der pom.xml nicht konfiguriert wird, dann erhält es "vernünftige" Defaults.

Betrachten wir als Beispiel das "maven-compiler-plugin". Dieses gehört zu den Plugins, die standardmässig, also ohne
weitere Konfiguration, von Maven geladen und ausgeführt werden. Seine Aufgabe ist das Kompilieren von Java-Quellcode
aus src/main/java nach target/classes. Wenn man genau das will und mit den Standardeinstellungen des Compilers zufrieden
ist, muss man überhaupt nichts konfigurieren.

Wenn man etwas anderes will, dann muss man das Plugin in der Sektion &lt;build&gt; der pom.xml aufnehmen und konfigurieren.

```xml
<project>
  ...
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.3</version>
        <configuration>
          <source>1.8</source>
          <target>1.8</target>
          <debug>false</debug>
          <optimize>true</optimize>
        </configuration>
      </plugin>
    </plugins>
  </build>
  ...
</project>
```

In diesem Beispiel wollen wir, dass der Compiler optimierten java 8 - Bytecode 
ohne Debug-Informationen erstellt. Alle anderen Einstellungen bleiben auf default.

Diese Modifikation ist relativ häufig nötig, weil der Maven-Compiler standardmässig unoptimierten Java-5 Bytecode
mit debug-Informationen erstellt.

Ebenfalls häufig wird man das maven-jar-plugin rekonfigurieren wollen:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>2.6</version>
    <configuration>
        <archive>
            <addMavenDescriptor>true</addMavenDescriptor>
            <compress>true</compress>
            <index>true</index>
            <manifest>
                <addClasspath>true</addClasspath>
                <mainClass>ch.webelexis.Runner</mainClass>
            </manifest>
            <manifestEntries>
                <mode>production</mode>
                <url>${project.url}</url>
                <timestamp>${maven.build.timestamp}</timestamp>
            </manifestEntries>
        </archive>
    </configuration>
</plugin>
```

Standardmässig erstellt der jar.packager kein Attribut "mainClass" in Manifest, so dass das resultierende jar
nicht startfähig ist. Mit obiger Modifikation klappt es. Der Abschnitt &lt;manifestEntries&lt; dient nur zur
Illustration, wie man beliebige weitere Attribute ins Manifest einbringen kann.

Das nächste Beispiel ist ein Plugin, das nicht zum Standard-Lieferumfang von Maven gehört. Es wird darum beim ersten
Start des Projekts heruntergeladen.

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-shade-plugin</artifactId>
    <version>2.4</version>
    <executions>
        <execution>
            <phase>package</phase>
            <goals>
                <goal>shade</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

Dieses Plugin löst folgendes Problem: Wenn man ein Projekt erstellt, das mehrere Abhängigkeiten hat, dann läuft das auf dem eigenen
Computer wunderbar. Wenn man nun daraus ein .jar erstellt, und dieses jar weitergibt, dann wird es auf den meisten Zielcomputern
nicht laufen. Weil es Abhänigkeiten zu libraries hat, die im lokalen maven repository gespeichert sind. Nun kann man entweder
all diese Libraries mühsam zusammensuchen und mit ausliefern, sowie beim Prorgammstart den passenden classpath aufbauen, oder
man lässt ein Plugin diese Arbeit erledigen.
Das "shade" plugin kann einiges, aber in der hier gezeigten Basiskonfiguration tut es "nur" folgendes:
Es holt und entpackt alle Abhängigkeiten und verpackt sie neu im generierten jar unseres Projekts. Dieses jar heisst im
Apache-Speak dann "Uber-Jar" und hat keinerlei externe Abhängigkeiten mehr (Ausser Java natürlich). Gebräuchlicher
als "Uber-Jar" ist der Begriff "Fat-Jar" für solche jars.

#### Properties

Manchmal will man selber irgendwelche Eigenschaften definieren. Das Sammelbecken für alles Mögliche ist der Abschnitt
&lt;properties&gt;

```xml
<properties>
    <vertx-version>3.0.0</vertx-version>
    <maven.build.timestamp.format>E, dd MM yyyy HH:mm:ss z</maven.build.timestamp.format>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <hallo>Grüezi</hallo>
</properties>
```

Hier legen wir einige Variablen fest, auf die wir später zugreifen können:

```xml
<dependencies>
...
  <dependency>
      <groupId>io.vertx</groupId>
      <artifactId>vertx-core</artifactId>
      <version>${vertx-version}</version>
  </dependency>
  <dependency>
      <groupId>io.vertx</groupId>
      <artifactId>vertx-web</artifactId>
      <version>${vertx-version}</version>
  </dependency>
  <dependency>
      <groupId>io.vertx</groupId>
      <artifactId>vertx-mongo-client</artifactId>
      <version>${vertx-version}</version>
  </dependency>
<dependencies>
```

Wir haben eine Variable vertx.version definiert, damit wir bei Versionsänderungen nur eine einzige Stelle in der pom.xml 
ändern müssen.

oder:

```xml
<build>
  <plugins>
    ...
    <plugin>
      ...
      <artifactId>maven-jar-plugin</artifactId>
      <configuration>
        <archive>
            <manifestEntries>
                <mode>production</mode>
                <url>${project.url}</url>
                <timestamp>${maven.build.timestamp}</timestamp>
            </manifestEntries>
        </archive>
      <configuration>
    </plugin>
  </plugins>
</build>
```

Hier verwenden wir die property maven.build.timestamp.format, um im Manifest des erstellten jars ein
Attribut "timestamp" im gewünschten Format zu erstellen.

Die dritte oben gezeigte Property ist eine Maven Einstellung, die dazu führt, dass Maven den Quellcode systemunabhängig 
als UTF-8 intepretiert.
Die vierte Property ist selbstdefiniert und erfüllt hier ausser "weil ich es kann" keinen speziellen Zweck.