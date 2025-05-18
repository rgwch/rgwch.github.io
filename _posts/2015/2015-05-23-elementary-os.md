---
layout: post
title: "Elementary OS"
date: "2015-05-23"
tags: [linux, admin]
category: linux
---

[Elementary](http://elementary.io) ist ein relativ neues Ubuntu-Derivat, das vor allem durch elegante, Mac-ähnliche Optik glänzt.

Allerdings übertreiben die Hersteller es meines Erachtens mit der Mac-Ähnlichkeit: Sie wollen erst mal Geld sehen. Das ist per se nicht unmoralisch und auch nicht verkehrt, aber sie tun es etwas hinterhältig: Man hat auf der Download-Site den Eindruck, dass man nur weiter kommt, wenn man $10 bezahlt. Weil ich vor einigen Monaten für eine ältere Version, mit der ich dann nicht wirklich zufrieden war, schonmal freiwillig 25 Dollar vorausbezahlt hatte, ärgerte mich das.
Die Lösung ist einfach: Man kann beim Betrag unter "Anderer" einfach 0 einsetzen, dann kommt man ebenso zum Download, wie wenn man bezahlt hätte.

Die Installation erfolgt dann Ubuntu-typisch sehr gut geführt und weitgehend automatisch.

Beim ersten Probelauf erneut der EIndruck: Sie übertreiben es mit der Mac-Ähnlichkeit: Der Anwender wird als weitgehend unmündig behandelt. Zu konfigurieren gibt es nicht viel und die Dokumentation ist mager.

 Aber schön ist es schon :)

 Für den Pantheon-Desktop (den man auch ausserhalb von Elementary einsetzen kann) findet man etwas mehr Informationen bei [Arch Linux](https://wiki.archlinux.org/index.php/Pantheon).
 Unter anderem den Tip, dass man mit dconf-editor an die Eingeweide kommt. (in Elementary: `sudo apt-get install dconf-editor?)

 EIn bisschen Nomenklatur, um die richtigen Settings zu finden: Das Dock unten heisst "plank", das Menu oben heisst "wingpanel", der Launcher unter "Anwendungen" heisst "slingshot"


 Gleich nach der Installation traf mich der Bug mit der [verschwundenen Zeit](https://bugs.launchpad.net/elementaryos/+bug/1356698). Die genannten Reparaturversuche nützen alle nichts. Auf die richtige Spur kommt man mit der Fehlermeldung von dpkg-reconfigure. Er kann LC_ALL nicht finden. Man muss /etc/default/locale editieren und dort LC_ALL setzen. z.B. auf `de_CH.UTF-8`. Dann geht `sudo dpkg-reconfigure locales` und die Uhr erscheint. Alles sehr logisch.

 Danach natürlich die Plficht: Arbeitsumgebung für Webelexis installieren. Das geht problemlos mit der Anleitung für [Ubuntu](https://github.com/rgwch/webelexis/wiki/Build-environment:-Ubuntu-Debian-Linux). Allerdings: Midori mag die Webelexis-Site nicht anzeigen. Bzw. nur den Quellcode. Also noch [Chrome](https://www.google.de/chrome/browser/desktop/) installieren, dann läuft alles.
