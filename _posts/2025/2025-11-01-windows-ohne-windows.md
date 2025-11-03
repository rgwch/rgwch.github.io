---
layout: post
title: Windows ohne Windows
date: 2025-11-01
tags: [admin,windows,linux]
category: 
---

Der Titel ist vielleicht ein wenig reisserisch, aber ja: Man kann heute Windows-Programme auf einem Linux-Computer laufen lassen. Streng genommen ging das schon länger: Mt einem [Windows Terminal Server](https://learn.microsoft.com/de-de/troubleshoot/windows-server/remote/terminal-server-startup-connection-application) und einem oder mehreren [Thin Clients](https://de.wikipedia.org/wiki/Thin_Client), die nicht eigentliche Programme ausführen, sondern nur die Bildschirmausgabe des Terminalservers darstellen. Die Programme selber laufen auf diesem Terminalserver.

Neu ist, dass man ein ganzes Windows-System auch in einem [Docker](/2015/06/Docker) Container laufen lassen kann Und solche Docker-Container kann man ja bekanntlich unter beliebigen Betriebssystemen laufen lassen. Der entsprechende Computer braucht dazu nicht einmal einen Bildschirm. Die Bildschirmausgabe leitet man, wie beim Terminalserver, auf einen beliebigen Client um, der ebenfalls ein beliebiges Betriebssystem haben kann.

Und verblüffenderweise ist das Ganze völlig legal. Sie brauchen keine geheimnisvollen Seiten im Darknet aufzusuchen.

Am Einfachsten geht die Installation unter Linux mit [WinBoat](https://www.winboat.app/). Der Installer prüft, ob alle Voraussetzungen gegeben sind. Der Prozessor muss Virtualisierung beherrschen (das gilt heute für fast alle), und die Virtualisierung muss im Bios eingeschaltet sein. Vermutlich müssen Sie dann noch freeRDP installieren (`sudo apt install freerdp3-x11` unter Ubuntu). Den Rest erledigt WinBoat vollautomatisch. Es installiert z.B. Windows 11 von der offiziellen Microsoft-Seite. (Wählen Sie die englische Version, die deutsche scheint nicht zu funktionieren). Danach Läuft Windows 11 auf Ihrem Linux-Computer. Wenn Sie mehrere Bildschirme haben, können Sie auf einem Windows und auf einem Linux anzeigen. In diesem Windows können Sie installieren, was Sie wollen. Zum Beispiel funktioniert Microsoft Office durchaus, ebenso Elexis. Und als Besonderheit können Sie solche Programme auch direkt auf dem Linux-Desktop ausführen. statt in einem Windows-Fenster.

Leider ist WinBoat etwas unflexibel, was die Grösse des Windows-Fensters angeht: Es belegt immer einen ganzen Bildchirm. Wenn Sie das nicht wollen, können Sie freerdp auch unabhängig von WinBoat starten, sofern der Container läuft:

`xfreerdp3 /u:Ihrname /p:Ihrpasswort /v:localhost +dynamic-resolution`

Zeigt den Windows-Desktop in einem Fenster an, das Sie beliebig vergrössern und verkleinern können.

Mit `xfreerdp3 /u:Ihrname /p:Ihrpasswort /v:localhost -w:1280 -h:1024 /scale:140 +dynamic-resolution` können Sie eine Anfangsgrösse und einen internen Vergrösserungsfaktor für Windows vorgeben.

Sie können Windows sogar in einem gewöhnliche Brower darstellen, indem Sie ihn auf `http://127.0.0.1:8006` richten. Allerdings ist dann die Darstellung deutlich träger, als mit RDP. 

Hier ein Beispiel des Windows-11-Desktops in einem Fenster eines Linux KDE Desktops:

![Windows in Linux](/images/windows_linux.jpg)

## Windows ohne Bildschirm

Wie oben geschrieben braucht der Computer, auf dem Ihr Docker-Windows läuft, keinen Bildschirm. Wenn WinBoat fertig ist, hat es einen Docker-container erstellt, den Sie zum Beispiel mit `docker start WinBoat` auch von einem entfernten Terminal aus starten können. (Um genau zu sein: WinBoat installiert im Hintergrund ein anderes Projekt: [dockur/windows](https://github.com/dockur/windows), das einen solchen Container erstellt.) Und damit haben Sie den perfekten Fernzugriff auf Ihre Praxis:

```bash 
#! /bin/bash

# Z.B. mit WireGuard (separat zu installieren) ein VPN zur Praxis öffnen. Sicherheit geht vor.
sudo wg-quick up praxis

# FreeRDP starten und verbinden
xfreerdp3 /u:Ihrname /p:Ihrpassword /v:praxisserver +dynamic-resolution

# Wenn wir fertig sind, schliessen wir den Tunnel wieder
sudo wg-quick down praxis
```

Dank der Effizienz des RDP Protokolls können Sie so von zuhause aus über eine halbwegs schnelle DSL- oder 4G-Verbindung fast genau so mit derart bereitgestellten Windows-Programmen arbeiten, wie von einem Praxis-PC aus.

Achtung: Wählen Sie, wenn Sie fertig sind, nicht "Shut down" im Windows-Fenster, sondern "Disconnect", um den Container nicht ganz zu stoppen.

## Windows auf Windows

Natürlich können Sie auch von einem Windows-Computer auf Ihr virtuelles Windows zugreifen. Geben Sie dort einfach `mstsc` ein. Windows erfragt dann die Verbindungsdaten.

## Noch ein Tip

Wenn Sie sind wie ich, dann reservieren Sie am Anfang viel zu wenig Platz für die Windows-Festplatte. Die von WinBoat vorgeschlagenen 30GB reichen jedenfalls nicht weit. Mit Java, Elexis und Office ist sie voll. Gut ist: Man kann die Platte ohne Datenverlust vergrössern (Aber natürlich sollten Sie trozdem alles Wichtige sichern, bevor Sie hier weitermachen).

* Finden Sie die zuständige docker-compose.yml: `docker inspect WinBoat|grep compose`
* Gehen Sie in dieses Verzeichnis, z.B.  `cd ~/.winboat` und beenden Sie den Windows-Container völlig: `docker compose down`
* `nano docker-compose.yml`
* Finden Sie die Zeile DISK_SIZE und ändern Sie sie in z.B. 60G. Achten Sie darauf, keine Einrückungen zu verändern.
* ^O ^X
* `docker compose up -d`
* Verbinden Sie sich wieder mit Windows
* Drücken Sie die Windows-Taste und geben Sie ein "Disk". Wählen Sie das Applet "create and format hardisk partitions".
* Auf Ihrer Festplatte sollte nun ein freier Bereich enstanden sein, in den Sie Windows (C) erweitern können. Dann war das schon alles. Aber:
* Eventuell ist eine Recovery Partition im Weg. Die brauchen Sie nicht wirklich, da Sie dieses Windows ja jederzeit in wenigen Minuten regenerieren können. Allerdings ist sie gegen normales Löschen geschützt.
* Starten Sie Powershell
* Diskpart
* list disk
* select disk 1
* list part
* select part 3 (oder welche auch immer die störende Parition ist)
* delete partition override
* Starten Sie Windows neu
* Öffnen Sie wieder den Festplattenmanager
* Jetzt sollte der Raum hinter der Windows(C) - Partition frei sein.
* Rechtsklick auf die Windows-Partition und "extend"
* Voilà, Sie haben eine grössere Platte, ohne Datenverlust oder Neuinstallation.

Das Ganze geht schneller, als es gedauert hat, es hier aufzuschreiben.



## Schlussbemerkung

Dieses Windows ist natürlich nicht aktiviert. Microsoft ist derzeit recht tolerant mit nicht aktivierten Windows-11-Installationen und vertreibt die Installer ja auch selber kostenlos. Aber das kann sich natürlich jederzeit ändern. Sie können ggf. einen key kaufen (Bei Microsoft selbst oder bei einem der vielen erheblich günstigeren Drittverkäufer, wobei es dort leider auch schwarze Schafe gibt), und Ihr Linux-Windows mit diesem key ganz nornal aktivieren.
