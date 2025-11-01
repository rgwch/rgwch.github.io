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

Leider ist WinBoat etwas unflexibel, was die Grüsse des Windows-Fensters angeht: Es belegt immer einen ganzen Bildchirm. Wenn Sie das nicht wollen, können Sie freerdp auch unabhängig von WinBoat starten, sofern der Container läuft:

`xfreerdp3 /u:Ihrname /p:Ihrpasswort /v:localhost +dynamic-resolution`

Zeigt den Windows-Desktop in einem Fenster an, das Sie beliebig vergrössern und verkleinern können.

Mit `xfreerdp3 /u:Ihrname /p:Ihrpasswort /v:localhost -w:1280 -h:1024 /scale:140 +dynamic-resolution` können Sie eine Anfangsgrösse und einen internen Vergrösserungsfaktor für Windows vorgeben.

Sie können Windows sogar in einem gewöhnliche Brower darstellen, indem Sie ihn auf `http://127.0.0.1:8006` richten. Allerdings ist dann die Darstellung deutlich träger, als mit RDP. 

## Windows ohne Bildschirm

Wie oben geschrieben braucht der Computer, auf dem Ihr Docker-Windows läuft, keinen Bildschirm. Wenn WinBoat fertig ist, hat es einen Docker-container erstellt, den Sie zum Beispiel mit `docker start WinBoat` auch von einem entfernten Terminal aus starten können. (Um genau zu sein: WinBoat installiert im Hintergrund ein anderes Projekt: [dockur/windows](https://github.com/dockur/windows), das einen solchen Container erstellt.) Und damit haben Sie den perfekten Fernzugriff auf Ihre Praxis:

``` 
#! /bin/bash

# Mit WireGuard (separat zu installieren) ein VPN zur Praxis öffnen
sudo wg-quick up praxis
# FreeRDP starten und verbinden
xfreerdp3 /u:Ihrname /p:Ihrpassword /v:praxisserver +dynamic-resolution

# Wenn wir fertig sind, schliessen wir den Tunnel wieder
sudo wg-quick down praxis
```

Dank der Effizienz des RDP Protokolls können Sie so von zuhause aus über eine halbwegs schnelle DSL- oder 4G-Verbindung fast genau so mit derart bereitgestellten Windows-Programmen arbeiten, wie von einem Praxis-PC aus.

Achtung: Wählen Sie, wenn Sie fertig sind, nicht "herunterfahren" im Windows-Fenster, sondern "Disconnect", um den Container nich ganz zu stoppen.

