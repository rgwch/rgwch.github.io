---
layout: post
title: Der eigene Mailserver
date: 2025-05-20
tags: [server,administration,mail]
category: 
---

Ein eigener Mailserver ist meistens keine gute Idee: Man ist dann der Spamflut und permanenten Angriffen direkt ausgesetzt und wird ausserdem von professionellen Mailservern, mit denen man kommunizieren muss, um Mails auszutauschen, misstrauisch beäugt und oft abgelehnt.
Fast immer ist es somit besser, mman nutzt für Mails entweder den Provider der Website, oder einen Maildienst wie gmail, gmx oder proton.

Wenn man allerdings seine Webseiten selbst gehostet hat und für Mailadressen den Namen einer eigenen Domain verwenden möchte, dann geht das nicht mehr mit jedem Provider. Und wenn man noch dazu etwa grossen Platzbedarf für seine Mails braucht, dann kann es auch schnell teuer werden.

Aber wir haben ja sowieso einen Server für unsere Websites [aufgesetzt](/2025/05/der-eigene-server), dann kann der sich ja auch gleich um alle Mails der Domains kümmern, die er hostet.

Zuerst ein kleiner Exkurs: E-Mails sollen jederzeit versendet werden können, nicht nur, wenn der Empfänger online ist. Sie werden deshalb üblicherweise nicht direkt an den Empfänger gesendet, sondern an dessen Mail-Provider. Dieser ist es also, dem wir Mails senden müssen, und der kümmert sich dann darum, dass jede Mail vom richtigen Empfänger abgeholt werden kann.

Dazu einige Begriffe:

* SMTP (Simple Mail Transfer Protocol): Das ist genau das. Ein Standard, fast so alt wie das Internet selbst, der es ermöglicht, Mails zu versenden. Die Schöpfer des Standards haben allerdings weder an Spammer noch an Spione noch an Malware noch an Betrüger gedacht, sondern an eine überschaubare Anzahl von Anwendern, die einander kennen. Daher hat SMTP keinerlei Sicherheitselemente. Jeder kann jedem jede beliebige Mail senden. Und das wurde von Spammern und Malware-Versendern weidlich ausgenützt. Es gab viele Ideen, SMTP sicherer zu machen, aber die meisten wurden nicht realisiert, da man rückwärtskompatibel bleiben wollte. Somit griffen die Provider zunehmend zur Selbsthilfe: Sie weisen jede Mail ab, die von einem Sender stammt, dem sie nicht vertrauen. Dieses Vertrauen kann man sich erwerben, indem man entweder zu einem grossen Provider gehört, oder indem man verschiedene Sicherheitsmechanismen umsetzt, die wir weiter unten zeigen. Dass all diese Massnahmen die Spam-Flut aber trotzdem nicht wirklich eindämmen können, merken wir jeden Tag.

* POP3 (Post Office Protocol Version 3): Eine Methode, um Mails vom Provider auf den eigenen Computer herunterzuladen. Dies geschieht idR passwortgesichert und meist auch verschlüsselt. Die Mails werden dabei auf dem Server des Providers gelöäscht, sobald man sie heruntergeladen hat.

* IMAP (Internet Message Access Protocol): Doent dazu, Mails zu lesen und zu bearbeiten, ohne sie zwingend herunterzuladen. Die Mails bleiben auf dem Server des Providers gespeichert, bis man sie explizit löscht.

* Verbindungssicherheit: Wie die Verbindung vom Client (IMAP oder POP3) zum Server verschlüsselt wird. Gar nicht, SSL/TLS oder StartTLS. Letzteres ist eine Kombination aus den ersten beiden: Die Verbindung wird zuerst unvberschlüsselt aufgebaut, und dann, wenn beide Seiten einverstanden sind, auf TLS verbessert. Achtung: Verschlüsselt heisst nur, dass der Dastenverkehr zwischen Provider und Empfänger verschlüsselt stattfindet. Zwischen dem Absender und dem Provider des Empfängers laufen Mails idR unverschlüsselt.

* Authentisierung: Hat trotz der Verwandtschaft nichts mit der Verbindungssicherheit zu tun, sondern beschreibt, wie der Client sich gegenüber dem Server ausweist. Normales Passwort, verschlüsseltes Passwort oder eine indirekrte Lösung (Kerberos, OAuth etc.). Wenn die Verbinsung verschlüsselt ist, genügt Normales Passwort. Wenn die Verbindung unverschlüsselt ist, sollte das Passwort verschlüsselt übertragen werden..


## Komplettlösung

Die m.E. einfachste Lösung, ein eigenes Mailsystem aufzusetzen, ist [mailcow:dockerized](https://docs.mailcow.email), eine Sammlung von Docker-Containern, die alle benötigte Software unter einer brauchbaren Oberfläche vereinigt.
