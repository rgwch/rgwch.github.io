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

```apache
# Definition für den nextcloud-Container, der auf Port 8082 erreichbar ist
<VirtualHost *:80>
	ServerName cloud.meine-familie.ch
	ProxyPreserveHost On
	ProxyPass / http://localhost:8082/
	ProxyPassReverse / http://localhost:8082/
</VirtualHost>

```