---
layout: post
title: Der eigene Mailserver
date: 2025-05-20
tags: [server,administration,mail]
category: 
---

Ein eigener Mailserver ist meistens keine gute Idee: Man ist dann der Spamflut und permanenten Angriffen direkt ausgesetzt und wird ausserdem von professionellen Mailservern, mit denen man kommunizieren muss, um Mails auszutauschen, misstrauisch beäugt und oft abgelehnt.
Fast immer ist es somit besser, man nutzt für Mails entweder den Internet-Provider, oder den Anbieter der Website, oder einen Maildienst wie gmail, gmx oder proton.

Wenn man allerdings seine Webseiten selbst gehostet hat und für Mailadressen den Namen einer eigenen Domain verwenden möchte, dann geht das nicht mehr mit jedem Provider. Und wenn man noch dazu etwa grossen Platzbedarf für seine Mails braucht, dann kann es auch schnell teuer werden.

Aber wir haben ja sowieso einen Server für unsere Websites [aufgesetzt](/2025/05/der-eigene-server), dann kann der sich ja auch gleich um alle Mails der Domains kümmern, die er hostet.

Zuerst ein kleiner Exkurs: E-Mails sollen jederzeit versendet werden können, nicht nur, wenn der Empfänger online ist. Sie werden deshalb üblicherweise nicht direkt an den Empfänger gesendet, sondern an dessen Mail-Provider. Dieser ist es also, dem wir Mails senden müssen, und der kümmert sich dann darum, dass jede Mail vom richtigen Empfänger abgeholt werden kann.

Dazu einige Begriffe:

* SMTP (Simple Mail Transfer Protocol): Das ist genau das. Ein Standard, fast so alt wie das Internet selbst, der es ermöglicht, Mails zu versenden. Die Schöpfer des Standards haben allerdings weder an Spammer noch an Spione noch an Malware noch an Betrüger gedacht, sondern an eine überschaubare Anzahl von Anwendern, die einander kennen. Daher hat SMTP keinerlei Sicherheitselemente. Jeder kann jedem jede beliebige Mail senden. Und das wurde von Spammern und Malware-Versendern weidlich ausgenützt. Es gab viele Ideen, SMTP sicherer zu machen, aber die meisten wurden nicht realisiert, da man rückwärtskompatibel bleiben wollte. Somit griffen die Provider zunehmend zur Selbsthilfe: Sie weisen jede Mail ab, die von einem Sender stammt, dem sie nicht vertrauen. Dieses Vertrauen kann man sich erwerben, indem man entweder zu einem grossen Provider gehört, oder indem man verschiedene Sicherheitsmechanismen umsetzt, die wir weiter unten zeigen. Dass all diese Massnahmen die Spam-Flut aber trotzdem nicht wirklich eindämmen können, merken wir jeden Tag.

* POP3 (Post Office Protocol Version 3): Eine Methode, um Mails vom Provider auf den eigenen Computer herunterzuladen. Dies geschieht idR passwortgesichert und meist auch verschlüsselt. Die Mails werden dabei auf dem Server des Providers gelöäscht, sobald man sie heruntergeladen hat.

* IMAP (Internet Message Access Protocol): Doent dazu, Mails zu lesen und zu bearbeiten, ohne sie zwingend herunterzuladen. Die Mails bleiben auf dem Server des Providers gespeichert, bis man sie explizit löscht.

* Verbindungssicherheit: Wie die Verbindung vom Client (IMAP oder POP3) zum Server verschlüsselt wird. Gar nicht, SSL/TLS oder StartTLS. Letzteres ist eine Kombination aus den ersten beiden: Die Verbindung wird zuerst unverschlüsselt aufgebaut, und dann, wenn beide Seiten einverstanden sind, auf TLS verbessert. Achtung: Verschlüsselt heisst nur, dass der Dastenverkehr zwischen Provider und Empfänger verschlüsselt stattfindet. Zwischen dem Absender und dem Provider des Empfängers laufen Mails idR unverschlüsselt.

* Authentisierung: Hat trotz des ähnlichen Zwecks nichts mit der Verbindungssicherheit zu tun, sondern beschreibt, wie der Client sich gegenüber dem Server ausweist. Normales Passwort, verschlüsseltes Passwort oder eine indirekrte Lösung (Kerberos, OAuth etc.). Wenn die Verbinsung verschlüsselt ist, genügt Normales Passwort. Wenn die Verbindung unverschlüsselt ist, sollte das Passwort verschlüsselt übertragen werden..


## Komplettlösung

Die m.E. einfachste Lösung, ein eigenes Mailsystem aufzusetzen, ist [mailcow:dockerized](https://docs.mailcow.email), eine Sammlung von Docker-Containern, die alle benötigte Software unter einer brauchbaren Oberfläche vereinigt.

Ein wesentlicher Teil der Konfiguration muss allerdings am Name-Server erfolgen. Das ist die Stelle, die Anfragen nach ihre-url.com auf Ihre IP-Adresse übersetzt. Häufig ist das Ihr Webspace-Provider, aber Sie können beim Domain-Registrar im Prinzip auch jeden anderen Server angeben, der die Aufgaben eines Nameservers übernehmen kann. Ich verwende gern die Dienste von [ZoneEdit](https://www.zoneedit.com/).
Für die Mailzustellung muss man den MX-Record des Domain-Eintrags auf den zuständigen Mailserver legen.

## Sicherheit

Wie eingangs bereits geschrieben, gibt es Bestrebungen, den Mailverkehr besser gegen Spam und Malware zu sichern. Diese Bestrebungen erschweren unglücklicherweise der Betrieb eines eigenen Postausgangsservers (der Posteingangsserver, egal ob POP3 oder IMAP, ist hingegen kein Problem).

Dazu nochmal ein Exkurs: Wie funktioniert das Senden einer Mail?

Wenn sie in Ihrem Mailprogramm auf "senden" klicken, dann nimmt das Mailprogramm mit dem in den Einstellungen festgelegten Postausgangsserver auf. Es identifiziert sich dafür meist mit einem Benutzernamen und Passwort (oder es hat sich, beim einige Zeit üblichen SMTP-after-POP-Konzept kurz zuvor mit einer POP-Session identifiziert). Dieser Postausgangsserver wird die Mail also üblicherweise problemlos entgegennehmen, sofern die "Personalien" stimmen. Knifflig wird der nächste Schritt: Der Postausgangsserver muss mit dem Posteingangsserver des Empfängers Kontakt aufnehmen, und diesem die Mail übergeben. Das kann möglicherweise über mehrere Zwischenstationen erfolgen, aber das änfert nichts am Konzept. Der Posteingangsserver wird die Mail oft nur dann entgegennehmen, wenn er den Sender für vertrauenswürdig hält, um seine User vor Spam und Malware zu schützen. Die Provider sind in der Umsetzung dieser Politik unterschiedlich streng. Wenn Sie einen eigenen Postausgangsserver betreiben, dann kann es durchaus sein, dass manche Epmfänger Ihre Mails akzeptieren, und andere genau dieselben Mails abweisen. Ein Beispiel für ein besonders strenges System ist Googles Gmail. Es ist recht schwierig, Gmail dazu zu bewegen, Mails von einem ihm unbekannten System entgegenzunehmen, insbesondere, wenn dieses System keine fixe IP hat.

Hier zwei häufig gebrauchte Sicherheitsmechanismen:

### DKIM: Domain Keys Identified Mail

Hier wird im Nameserver-Eintrag der Domain ein öffentlicher Schlüssel im Feld DKIM abgelegt, der ungefähr so aussehen kann:

```
DKIM dkim._domainkey-mysite.ch v=DKIM1;k=rsa;t=s;s=email;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQCAQEArpXtxxQCVMaR+X/htM0NyG5a83N7ay+Ru6B7MQmqtBX7GD6dUejkO4aasa+T8W19WRNk3zAcHciV3KnAbAL9ZkX/7BJctY2HE29kRTH+grUjU1RtMb3Ay10xaAYHEulN7TTrAmwtsI08sRituFaL4YVpCLSd+T71L57atrX9OisFJTG5TJuBbg92rThEgcFfr6pWxSVULfk3WVJILq+QQgRjvl8HhQXfcp/ynQc9Zcos7v0kKa7f87d0PcQYbnF7RbgPF8dDE4YQIDAQAB
```
Der Mailserver hat den dazu passenden privaten Schlüssel und signiert jede Mail damit. Auf diese Weise kann der Eingangsserver des Empfängers der Mail die Signatur mit dem öffentlichen Schlüssel prüfen, und so dafür garantieren, dass die Mail tatsächlich von der Domain kommt, von der sie zu kommen scheint. Allerdings hilft das nicht zuverlässig gegen gefälschte "von"-Felder in der Mail selber, sondern nur gegen gefälschte Absender im "envelope" der Mail. Darum prüfen manche Empfänger auch, ob "von" veld und "envelope-sender" identisch sind.

### SPF: Sender Policy Framework

Auch das ist ein Eintrag im Nameserver der Domain, diesmal in einem TXT-Feld, das zum Beispiel so aussehen kann:

```
TXT @-mysite.ch v=spf1 a mx include:smtp.myhoster.mail ~all
```

Dieser Eintrag beschreibt, welche Mailserver überhaupt autorisiert sind, Mails für diese Domain zu senden. Damit kann man verhindern, dass ein Bösewicht einen eigenen Mailserver verwendet, um Fake-Accounts zu erstellen, die genauso aussehen, wie echte Mailadressen von echten Gegenübern.
Leider ist dieser Eintrag meist der k.o. für Mailserver, die keine fixe IP haben. Viele Provider lehnen solche Mailserver nit einer IP aus dem Endkunden-bereich direkt ab.

Sie können beide Funktionen mit einem mailcow-basierten Server nutzen, aber wie gesagt wird Ihnen das möglicherweise nicht viel helfen, wenn Sie keine fixe IP haben.

## Lösungen:

* Sie mieten einen fertigen Mailserver bei einem entsprechenden Dienst.

* Sie mieten einen Webspace mit fixer IP für Ihren Mailserver. Allerdings ist damit noch nicht sichergestellt, dass alle möglichen Empfänger-Server Ihren Nailer für vertrauenswürdig genug halten.

* Sie verwenden Ihren eigenen Maiserver nur als Posteingangsserver und senden Mails z.B. über den SMPT-Server Ihres Internet-Providers. Das kann man ja im Mailprogramm beliebig konfigurieren.
