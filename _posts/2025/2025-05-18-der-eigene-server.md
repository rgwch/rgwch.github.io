---
layout: post
title: Der eigene Web- und App-Server
date: 2025-05-18
tags: [Website, Apache. Proxy, Server]
draft: true
category: Administration
---
Eine Website zu publizieren, ist einfach: Es gibt viele Anbieter, die entsprechende Hosting-Angebote für wenig Geld bereitstellen, und oft auch verschiedenene Hilfen zum Erstellen der Seiten anbieten. Wenn man allerdings eine grössere Anzahl von Seiten hosten möchte, braucht man entweder mehrere Anbieter, oder ein "stärkeres" Angebot, welches mehrere Domains mit mehreren Seiten erlaubt.
Noch schwieriger wird es, wenn man WebApps hosten möchte, zum Beispiel eine eigene Cloud mit OwnCloud oder Nextcloud, oder eigene NodeJS-Apps. Dann braucht man einen Hoster, der es erlaubt, NodeJS und/oder Docker laufen zu lassen. Da wird die Luft schon dünner, und immer wieder stösst man auf unerwartete Beschränkungen.

Nun haben ja die meisten von uns inzwischen eine recht leistungsfähige Internet-Anbindung, die mit dem Datenaufkommen einer Familie oder eines Vereins ohne Weiteres fertig würde.  Was liegt also näher, als die zu hostenden Dienste auf einem eigenen Computer bereitzustellen?

Allerdings sei gleich ein ernstes Wort vorweg gesprochen: Eine Zugriffsmöglichkeit von aussen ist auch eine Angriffsmöglichkeit von aussen. Wenn Sie Dienste anbieten wollen, sollten Sie diese Dienste auf einem Computer laufen lassen, der keine anderen Computer in Ihrem Netzwerk erreichen kann.

### Der Internet-Anschluss

Es gibt Anbieter, die den Zugriff von aussen ohne Weiteres zulassen, und es gibt solche, die das nicht tun. Welchen Typ Sie haben, können Sie so herausfinden:

* besuchen Sie die Seite [https://www.whatismyip.com/](https://www.whatismyip.com/). Diese Seite zeigt Ihnen an, unter welcher IP-Adresse Sie aktuell im Internet eingebucht sind.
* Öffnen Sie ein Terminal und geben Sie dort ein: ping &lt;IP-Adresse&gt;. Wenn irgendeine Antwort kommt, dann ist Ihr Router grundsätzlich erreichbar. Wenn Ping keine Antwort liefert, müssen Sie sich mit einem  [Reverse-Tunnel](/2025/05/reverse-tunnel) behelfen.

Als nächstes müssen Sie sicherstellen, dass Ihr Server oder Proxy überhaupt gefunden werden kann. Dazu benötigen Sie einen sogenannten DNS-Eintrag, der aus einem Namen wie www.meinserver.irgendwo eine IP-Adresse wie 14.345.28.10 macht. Wenn Sie den Proxy samt Domain bei einem Internet-Provider gemietet haben, ist dieser Schritt bereits erledigt. Andernfalls müssen Sie einen dynamischen DNS Eintrag erstellen, der auch dann, wenn Ihre IP vom Provider gewechselt wird, immer angepasst wird. Die meisten aktuellen Router sind in der Lage, ohne soezielle Konfiguration mit verschiedenen DynDNS-Providern zusammenzuarbeiten (Schauen Sie im Menü Ihres Routers nach, hier zum Beispiel das Vorgehen bei [Fritz!Boxen](https://fritz.com/service/wissensdatenbank/dok/FRITZ-Box-7590/30_Dynamic-DNS-in-FRITZ-Box-einrichten/))

### Der Server

Was für einen Computer benötigen Sie als Server für, sagen wir, 5 Websites, einer NodeJS-App und einen Docker-Container mit NextCloud?
Verblüffend wenig: Ein Raspberri Pi 4 mit 4GB Ram genügt. Wie oben gesagt soll der Computer möglichst keine Verbindung zu Ihrem restlichen Netz haben. Manche Router und Switches gestatten für solche Zwecke, eine sogenannte "Demilitarisierte Zone" (DMZ) einzurichten, die logisch vom restlichen LAN völlig getrennt ist. Wenn das nicht geht, sorgen Sie zumindest dafür, dass auf dem Server keinerlei Daten gespeichert sind, die den Zugriff auf andere Computer ermöglichen und dass alles im Netz passwortgeschützt ist.

Setzen Sie den Raspberry auf, am besten mit einem minimalen OS. (Serverdienste brauchen kein UI). Wenn Ihr Router von aussen erreichbar ist, müssen Sie eine Portweiterleitung auf den Server einrichten, wenn nicht, auf dem Server einen Reverse Tunnel zu einem externen Proxy aufbauen.

### Der Verteiler

Angenommen, Sie haben 5 Websites, eine NodeJS-App und einen Nextcloud-Container laufen. Woher weiss der Server denn, welche Seite er einem Besucher ausgeben soll?
Dafür richten wir einen Reverse Proxy auf dem Server (oder einem anderen Computer) ein. Das ist nicht zu verwechseln mit dem Reverse Tunnel, über den wir weiter oben gesprochen haben. Der Reverse Proxy entnimmt dem Header jeder Anfrage die Information, welcher Dienst gemeint war, und sendet sie zum entsprechenden "virtuellen Server" weiter.

Nun nehmen wir mal an, wir haben die Webseiten "meine-familie.ch", "ich.meine-familie.ch", den Webservice "agenda.meine-familie.ch" und den Clouddienst "cloud.meine-familie.ch"

Dann benötigen wir folgende Konfigurationen in /etc/apache2/

1. Definition für den nextcloud-Container, der auf Port 8082 erreichbar ist: 
`/etc/apache2/sites-available/cloud.conf`:
(Der Dateiname ist egal)

```apache
<VirtualHost *:80>
	ServerName cloud.meine-familie.ch
	ProxyPreserveHost On
	ProxyPass / http://localhost:8082/
	ProxyPassReverse / http://localhost:8082/
</VirtualHost>

```

Hier leiten wir Anfragen für cloud.meine-familie.ch auf Port 80 auf einen Serverprozess um, der auf demselben Server auf Port 8082 läuft. Man könnte ohne Weiteres statt localhost auch einen anderen im gleichen Netz erreichbaren Computer einsetzen. Eine solche Konfiguration kann zum Beispiel unabhängige Docker-Applikationen, oder eigenständige Web-Apps ansteuern.

2. Definition für die Website 'meine-familie.ch'
`/etc/apache2/sites-available/familienseite.conf`

```apache
<VirtualHost *:80>
        ServerName meine-familie.ch
        ServerAlias www.meine-familie.ch
        DocumentRoot "/var/www/family/http"
        CustomLog /var/www/family/log/access.log combined
</VirtualHost>
```
Hier bedient der Apache Server Anfragen selbst. Wir sagen ihm nur, in welchem Verzeichnis er die Dateien finden kann, die er ausliefern soll, und in welches Verzeichnis er seine Logdateien schreiben soll.
Im Verzeichnis /var/www/family/http sollte mindestens eine index.html - Datei zu finden sein, damit die Seite funktioniert. Diese Konfiguration würde auf http://meine-familie.ch und auch auf http://www.meine-familie.ch reagieren (Wegen der ServerAlias-Direktive)

Im momenmtr sind unsere Konfigurationen aber noch nicht aktiv. Wir aktivieren sie mit 

```bash
sudo a2ensite cloud
sudo a2ensite familienseite
sudo systemctl reload apache2
```

Das tut eigentlich nichts anderes, als entsprechende Symlinks von sites-available in seites-enabled zu erstellen. Um eine Seite wieder zu deaktivieren, können Sie `a2dissite <konfiguration>` eingeben und danach mit `systemctl reload apache2` die Änderung scharf stellen.

Wie kommt nun die Anfrage eines externen Browsers auf diese Seite?

1. Der User will zu http://meine-familie.ch navigieren.
2. Der Browser fragt beim DNS-Server nach der Adresse.
3. Der DNS-Server fragt beim Registrar der Domain meine-Familie.ch nach dem zuständigen Nameserver
4. Der Nameserver kann z.B. ein DynDNS-Server sein, der von unserem Router die aktuelle IP erhalten hat. Oder, bei einer fixen Adresse, kann er direkt die IP ausgeben.
5. Der Browser steuert diese IP auf Port 80 an (Das ist der Standard-Port für HTTP). Dort wartet der Router unseres Internetzugangs
6. Der Router hat eine Portweiterleitung für Port 80 und Port 443 (dazu kommen wir später) auf unseren Heimserver.
7. Dort wartet der Apache Webserver und schaut im HEader der Anfrage nach, welchen von den verschiedenen Hosts, die er verwaltet, der Browser eigentlich haben wollte.
8. Wenn er ihn findet, sendet er die Anfrage weiter und  gibt dessen Antwort zurück. Wenn nicht, liefert er eine "Nicht gefunden" Antwort.

Damit sind wir fast am Ende dieses Kurses. Aber mehr als nbzr ein Schönheitsfehler ist es heutzutage, eine seite per http erreichbar zu machen. Standard ist die verschlüsselte Kommunikation via https bzw. SSL
Dabei funktioniert praktisch alles gleich, nur dfass der Port 443 angesteuert wird, und ein Session-Key zur Verschlüsselung des gesamten Datenverkehrs erzeugt wird. Dieser Session selber wird seinerseits durch ein public/provate Schlüsselpaar erzeugt: Der Server "beweist" mit dem Besitz eines privaten Schlüssels, der zu einem zertifizierten öffentlichen Schlüssel passt, dass er der ist, der er zu sein vorgibt, und die Verschlüsselung stellt sicher, dass niemand den Datenverkehr mitlesen kann.

SSL war früher eine teure Sache, weil man eine Firma brauchte, die einem bestätigte, dass man der ist, der eine Seite rechtmässig betrieb, und dies mit einem Zertifikat des öffentlichen Schlüssels bestätigte. Diese Firmen ihrerseits mussten von allen Browser- und Betriebssystemherstellern als vertrauenswürdig anerkannt sein, damit diese ihre Zertifikate anerkannten. Dieser Aufwand hatte einen im Abonnement zu entrichtenden Preis.

Privatleute behalfen sich darum oft mit einem self-signed certificate, zertifizierten sich ihre Identität also selber. Das ändert nichts an der Sicherheit der Verschlüsselung, sondern nur an der Identifikation des Servers. Wenn man den aber selber betreibt, oder den Betreiber persönlich kennt, ist das natürlich kein Problem. Nur geben alle modernen Browser dann immer diese unangenehmen Warnmeldungen heraus und wollen per Ausnahmeregelung überredet werden, sich trotzdem zu verbinden.

Heute ist alles ein wenig einfacher geworden: Es gibt jetzt [Letsencrypt](https://letsencrypt.org/).
Das ist ein kostenloser automatischer Dienst, der Schlüssel für Webseiten so zertifiziert, dass er sich beweisen lässt, dass der Antragssteller den Inhalt der Seite oder des Name-Servers manipulieren kann. Solche Tests sind automatisierbar. Alles was man dazu braucht, ist der Certbot

`sudo apt install certbot`

und dann:

`certbot --apache`

Certbot zeigt dann alle Sites an, die er in der laufenden Apache-Konfiguration finden kann, und Sie brauchen bloss anzugeben, welche Sie absichern wollen.

Wenn alles gut geht, schreibt der certbot eine neue Konfiguration `etc/apache2/sites-available/familienseite-le-ssl.conf` und vcerändert die vestehende Konfiguration cloud.conf so, dass Anfragen über http:// direkt auf https:// umgeleitet werden.

Wenn Sie sich jetzt wieder mit Ihrer Seite verbinden, werden Sie sehen, dass Der Browser ein Schloss neben der Adresse anzeigt, und wenn Sie dieses Schloss anklicken, können Sie das Zertifikat ansehen, das Letsencrapt ausgestellt hat.

Diese Zertifikate sind immer nur drei Monate gültig, aber certbot kümmert sich selber darum, sie jeweils rechtzeitig zu erneuern. Nur wenn Sie eine weitere Site erstellen, müssen Sie certbot wieder manuell bemühen.

Auf diese Weise können Sie im Grunde beliebig viele Serverdienste selber bereitstellen. Die einzige fremde und Hilfe, die Sie dazu brauchen, ist ein DynDNS-Dienst. der Ihren Server auffindbar macht.

