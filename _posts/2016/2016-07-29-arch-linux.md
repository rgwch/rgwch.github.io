---
layout: "post"
title: "Arch Linux"
date: "2016-07-29 14:21"
tags: "linux,installieren"
category: "Linux admin"
---
[Arch Linux](http://www.archlinux.org) hat ja den Ruf, ein Linux für eher hartgesottene Freaks zu sein.

Richtig ist, dass man bei Arch Linux mehr selber machen muss, als bei anderen Distributionen. Allerdings gibt es Arch-Varianten, die eher anfängerfreundlich gestaltet sind, z.B. [Manjaro](http://manjaro.org).

Ein Vorteil von Arch ist, dass es wirklich nur das enthält, was man braucht, und dass man nach der Installation schon ziemlich viel über den Aufbau "seines" Linux Systems weiss.
Denn Arch hat keinen simplen Installer, wie etwa [Ubuntu](http://www.ubuntu.com). Stattdessen gibt es bei Arch eine ausführliche [Anleitung](https://wiki.archlinux.org/index.php/Beginners%27_guide), wie man das System aus einem laufenden Linux heraus von null an zusammenbaut.

Ein weiterer Vorteil ist, dass ein Arch System leicht aktuell gehalten werden kann: Einerseits funktioniert es nach dem "Rolling Release"-Prinzip, es gibt also keine Release-Stufen, sondern einen kontinuierlichen Update-Prozess. Und andererseits besteht das Package-System von Arch aus einer automatisierten "Bedienungsanleitung", wie die Software direkt aus den Quellen zusammengeabut und installiert wird. Man braucht also nicht darauf zu warten, dass der Distributions-Maintainer Updates bereitstellt.

 Doch vor den Erfolg haben die Götter den Schweiss gestellt...


### Installation

Die Grundinstallation ist auf der Archlinux Seite sehr gut [beschrieben](https://wiki.archlinux.org/index.php/Beginners%27_guide).

Wie es dann weiter gehen kann, kann man ebenfalls bei [Arch Linux](https://wiki.archlinux.org/index.php/General_recommendations)   nachlesen. Auch hier wird man vieles, was andere Distributionen einem vorfertigen, noch von Hand erledigen müssen (Zum Beispiel, einen User und Gruppe anlegen). Im Folgenden arbeiten wir immer als "normaler" User, nicht als root.

Aber zunächst muss auch noch das Package-System anegkegt werden. Arch hat einen Package Manager namens "pacman", der die Aufgaben erledigt, die man in debian-Derivaten gerne aptitude oder apt-get anvertraut. Das Standardkommando ist synchronize: `pacman -S <paketname>`. Um das ganze System auf den neuesten Stand zu bringen. schreibt man `pacman -Syu`.

Auch eine Klickibunti-Oberfläche muss man selber anlegen, denn der Arch Installationsprozess führt zunächst nur mal nur zu einem reinen Textsystem. Das hat wiederum den Vorteil (oder ist es ein Nachteil?) der grossen Auswahl:

Praktisch alle Fenstersysteme gibt es auch für Arch. Sie können also frei entscheiden, ob Sie etwa Gnome oder KDE oder Lxde oder Mate oder was auch immer haben möchten. Aber Sie müssen es selber zusammenstöpseln. Daher im Folgenden eine sehr subjektive Zusammenstellung.

### Fenstersystem
Zunächst mal gibt es da viele Begriffe, die zusammenspielen:

- Display Driver: Steuert direkt die Grafikkarte an. Im Prinzip ist es heutzutage problemlos ohne Verrenkungen möglich, den Bildschirm mit (fast) jeder Grafikkarte zu einer Anzeige zu bewegen. Aber je nachdem, wie hohe Ansprüche man an die 2D/3D Grafikleistung stellt, wird man mehr oder weniger Aufwand treiben müssen, um einen möglichst genau zur eigenen Grafikkarte passenden Treiber zu finden. Man kann sich aber ohne Weiteres fürs Erste mal auf die automatisch installierten Treiber verlassen und später weiter schauen.

- Display Server / X-Server: Zuständig für die Umwandlung von Programmbefehlen in Bildschirmpunkte. Also die niedrigste Ebene der Anzeigensteuerung. Ausserdem zuständig füs Umleiten der Anzeige an ein anderes Terminal, wenn gewünscht.

- Display Manager: Zuständig für den Start des Fenstersystems. Erlaubt meist auch beim Login die Auswahl aus mehreren installierten Fenstersystemen.

- Window Manager: Fenstersystem. Über dem Display Server stehende Ebene der Bildschirmansteuerung. Der Window-Manager baut Fenster und Fensterelemente auf und stellt die coolen Ein/Ausblend/Transparenzeffekte zur Verfügung.

- Desktop Environment: Setzt auf dem Window Manager auf und sorgt für einheitliches Design und Verhalten (Themes).

In einem Linux-System braucht man nicht all diese Elemente. Wenn man einen Leistungsschwachen Computer hat, installiert man vielleicht nur den X-Server. Programmen wie xterm etx. genügt das. Oder man eght einme Stufe weiter, und installiert noch einen Window-Manager. Dann laufen die Programme in hübschen Fenstern, aber man hat noch keinen Desktop, kein Menü und keine Taskleisten. (Man kann allerdings diese Dinge durchaus einzeln nachinstallieren).

Meistens wird man heutzutage ein kompklettes Desktopsystem installieren. Dann sieht die Oberfläche aus wie aus einem Guss und funktioniert auch so, wie wir es nunmal gewöhnt sind.

Mir gefällt der Cinnamon-Desktop von Linux Mint. Natürlich kann man den auch in arch installieren. Damit der Computer gleich in den Desktop startet, füge ich gleich noch den Display Manager gdm hinzu.

Also: `sudo pacman -S gdm cinnamon`


#### Drucker

Der Anschluss von Hardware ist unter Linux ja immer ein besonderer Quell der Freude. Natürlich gibt es immer alles, aber meistens in -zig Varianten und Versionen und ohne komplette Bedienungsanleitung.
Der Prozess der Druckerinstallation ist immerhin dank cups (**c**ommon **u**nix **p**rint **s**ystem) ein Stück weit automatisiert.

    sudo pacman -S cups gutenprint foomatic-db-gutenprint

installiert eine Reihe von Druckertreibern. Die Konfiguration erledigt man dann am besten entweder mit dem Drucker-Systemsteuerungs-Applet von Cinnamon, oder über die Webseite des CUPS-Servers: http://localhost:631

Nach einigem Hin und Her gelang es mir damit, meine Drucker (Brother HL-4570CDW und Brother MFC 8510 übers Netz, Canon MG 5550 am USB-Port) anzusteuern. Nicht perfekt gelang dies mit dem Dymo LabelWriter 400/450: Dort gelingt es mir nicht, meine Etikettengrösse korrekt einzustellen - Work in progress.

#### Scanner

Die Scannerinstallation ist theoretisch sehr einfach geworden:

    sudo pacman -S sane simple-scan

Damit wird das Backend (sane) und ein einfaches grafisches Frontend installiert. Sehr viele Scanner werden von sane (**s**canner **a**ccess **n**ow **e**asy) problemlos automatisch erkannt und eingebunden. Ein probeweises `scanimage -L` zeigt, welche Scanner sane gefunden hat.

Meiner war leider nicht dabei. Ein nwenig Recherche im Internet zeigte, dass die Dinge für den Fujitsu ScanSnap s1300i leider etwas komplizierter sind. Fujitsu vertreibt Treiber für Mac und Windows, aber nicht für Linux. Und die Schnittstellen sind offenbar nicht dokumentiert, so dass es auch keine OpenSource Treiber gibt.

Also ging ich nach der Recherche am Ende folgendermassen vor:

* Die Windows-Treiber auf einem Windows-Computer installieren
* Den Computer mit der Dateisuche nach `*.nal` Dateien durchforsten. Glücklicherweise gibt es nicht sehr viele Dateien mitn dieser Endung. Zwei davon waren dieselben, die auch in /etc/sane.d/epjitsu.conf aufgeführt sind.
* Diese beiden Dateien auf den Linux-Computer nach `/usr/share/sane/epjitsu` kopieren.

Et voilà: Jetzt findet scanimage -L den Scanner, und simple-scan kann damit auch Dokumente einziehen, problemlos auch doppelseitig und mehrseitig.



#### Office Zubehör

    yaourt -S openoffice4
    sudo pacman -S evince gedit    

#### DICOM Viewer und PACS client

  yaourt -S ginkgo-cadx

  Hier ist die Auswahl nicht besonders gross. Es gibt ein paar Projekte, die zum Beispiel bei [Ubuntu](https://wiki.ubuntuusers.de/DICOM/) gelistet sind. Wenn man konkret nachschaut, gibt es darunter aber Projekte, die aufgegeben zu sein scheinen (z.B. Aeskulap), oder die nur sehr rudimentäre Funktionen bereitstellen. Kurz: Ein ernsthafter Konkurrent für [Osirix](http://www.osirix-viewer.com/) (oder seine freie 64-Bit-Variante [OsiriLXIV](http://bettar.no-ip.org/lxiv/)) ist nicht dabei. Aber leider stehen die Osirix Varianten nicht zur Debatte, da nur für Mac.

  Ziemlich gut finde ich [Ginkgo-CADx](http://ginkgo-cadx.com/en/). Die Bedienung ist etwas gewöhnungsbedürftig, aber wenn man es erst mal raus hat, kann man damit eigentlich fast alles machen, was man auch mit OsiriX kann. Nur zum CD Brennen muss man externe Tools bemühen, und auf 3D-Animationen muss man verzichten. Dafür hat man ein paar Dinge, die man mit OsiriX nicht kann, zum Beispiel Bilder aller Art "dicomisieren".

  #### Diverses

  * Viele Mac-User sind an [Quicksilver](https://qsapp.com/) oder [Alfred](https://www.alfredapp.com/) gewöhnt und vermissen das auf Linux. Ein Klon mit praktisch identischer Funktionalität ist [Kupfer](http://engla.github.io/kupfer/), welches in arch mit `yaourt -S kupfer` installiert werden kann.

  * Ein einfacher CD-Brenner ist Brasero -> `sudo pacman -S brasero`.
  * Computer durchsuchen: Catfish `sudo pacman -S catfish`.
