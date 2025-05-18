---
layout: post
title: Eclipse .classpath
description: Die Sache mit dem .classpath
category: programmieren
tags: [java, eclipse]
---

In Java hat der classpath ja eine klar definierte Bedeutung: Er enthält alle Orte, an denen der Java Compiler und
die JRE nach Klassen suchen, die das aufgerufene Programm beim Ablauf benötigt. Man übergibt den classpath
beispielsweise mit `java -cp /some/where:/some/other/place my_app`.

In Eclipse hat jedes Projekt eine versteckte Datei `.classpath`, die ähnliche, aber nicht
genau dieselben Aufgaben hat. In .classpath ist das Projektlayout festgelegt. Eclipse folt nämlich einer
etwas anderen Philosophie, als etwa Maven:

In Maven gilt strikt "convention over configuration". Das bedeutet, Maven erwartet, alle Teile eines Projekts
an einem ganz bestimmten relativen Ort vorzufinden. Beispielsweise wird der Quellcode immer in src/main/java erwartet.
Man kann das durchaus ändern, aber dazu muss man ausdrückliche Anweisungen in der pom.xml schreiben.

In Eclipse ist das umgekehrt. Eclipse erwartet Quellcode keineswegs ausdrücklich immer in 'src', obwohl
das in Projekten standardmässig so ist. Eclipse "weiss" erst, wo die Quellen sind, wenn die Orte in .classpath
festgelegt sind.

Beide Techniken haben ihre Vor- und Nachteile. Aber man sollte die Unterschiede kennen, wenn man Programme mit
beiden Systemen entwickelt.

Wenn man beispielsweise .classpath in `.gitignore` aufführt, dann wird das Projekt nach dem Import in eine andere
Eclipse-Instanc zunächst nicht kompilieren. Der classpath muss zuerst korrigiert werden. Wenn man
.classpath aber ins Repository aufnimmt, dann kommt es häufig zu "Classpath-Problems", weil manchmal implizite
Systemabhängigkeiten zum Beispiel bei Libraries in .classpath aufgeführt sind.

Derartige Probleme hat man mit der Maven-Methode nicht. Dafür kann man dort nicht so einfach, mehrere Quellcode-Hierarchien in einem Projekt integrieren.
