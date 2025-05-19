---
layout: post
title: Pseudosecurity
date: 2008-06-13
tags: [security]
category: [administration]
---
Jeder hat sie: Die Personal Firewalls, Internet Shields usw. Lustigerweise hat man sie gar nicht zwischen LAN und WAN, wo sie eigentlich hingehören würden, sondern auf jeder Arbeitsstation einzeln.
Mit dem Ergebnis, dass sie vor allem den LAN-Verkehr im eigenen Netzwerk stören. Jedesmal, wenn sie eine ihrer Warnungen aufpoppen, klickt man sie unbesehen weg, weil man ja weiss, dass diese Warnungen meist nur vor einem harmlosen Verbindungsversuch harmloser Software im eigenen Netz warnen. Womit der Nutzen des ganzen Security-Zeugs dann gegen null tendiert.

Eigentlich ist es ja einfach:

*  Das grösste Sicherheitsrisiko befindet sich zwischen Stuhllehne und Tastatur.

*    Eine Firewall gehört zwischen LAN und WAN und darf sich nicht auf einer Arbeitsstation befinden, sondern auf einem dafür reservierten Gerät. Ob das jetzt ein alter PC oder eine "Hardware-Firewall" ist, ist egal.

*    Die Firewall muss sämtliche Ports ausser den benötigten blockieren.

*   Betriebssysteme und Web-Browser aller PC's im Netz müssen immer auf dem neuesten Stand sein.

*    Viren kommen nicht per Tröpfcheninfektion in den PC, sondern weil der Anwender einen malignen Link angeklickt oder ein malignes E-Mail-Attachment ausgeführt hat.

*    Computerviren sind Programme. Sie sind nur aktiv, wenn sie gestartet werden. Ein auf der Harddisk liegendes Virus ist harmlos, solange es niemand startet (und sofern es nicht automatisch vom Betriebssystem gestartet wird)

*    Ein Virenscanner ist eine Systembremse und kann aus grundsätzlichen Gründen keine hundertprozentige Sicherheit bieten.

*    Eine Personal Firewall ist Placebo-Software und wirkt nur, wenn sowohl der Anwender, als auch der Computer, als auch der Virenschreiber daran glauben, dass sie wirkt.

*    Ein Virenscanner auf dem Server ist entbehrlich, sofern man nicht am Server arbeitet. (Preisfrage: Auf welche Weise könnte ein Virus auf dem Server gestartet werden?) Ausnahme: Der Server dient auch als Mailserver oder Zwischenlager für Mails und kann so diese und deren Anhänge auf Viren testen.

*    Ein Virenscanner auf den Arbeitsstationen ist eigentlich auch entbehrlich, wenn man sich entsprechend umsichtig verhält. Aber das soll  jetzt keine offizielle Empfehlung sein. Ich hatte jedenfalls noch nie einen Virenscanner auf dem Computer. Allerdings scanne ich alle Arbeitsstationen ab und zu mit einem von CD gestarteten externen Scanner (Knoppicillin). Bisher wurde er noch nie fündig.
  
