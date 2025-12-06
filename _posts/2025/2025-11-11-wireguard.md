---
layout: post
title: Wireguard
date: 2025-11-11
tags: []
category: 
---
Ein VPN (virtual private network) dient dazu, sich von auswärts auf sichere Weise ins eigene Netwerk einzubuchen. Dazu benötigt man einen Computer im Netzwerk, der als Brücke fungiert, und Software, die den gesamten Datenverkehr verschlüsselt und die Zugriffsberechtigungen ünerprüft.

Viele Router bieten bereits die Möglichkeit, als VPN-Brücke zu dienen. Wenn das für Ihre Zwecke genügt, verwenden Sie das. Wenn nicht, möchten Sie vielleicht weiter lesen.

Hier zeige ich kurz die Installation von Wireguard, einem modernen und doch recht einfachen VPN-System. Sie können die VPN-Brücke im LAN auf einem separaten Computer installieren (z.B. einem Raspberry Pi). Clients gibt es für "fast alles": Windows, Linux, Mac, Android, iOS).

## Grundsätzlich

Eine Wireguard-Verbindung ist grundsätzlich eine Vrebindung zwischen "Peers", also gleichberechtigten Partnern. Es gibt keine strikte Rollenverteilung, daher ist die Konfiguration auf Server und clients jeweils sehr ähnlich:
Jeder Peer hat einen privaten Schlüssel, den nur er selber kennt, und einen öffentlichen Schlüssel, der zu diesem privaten Schlüssel passt, und den jeder kennen darf. (Das Prinzip der asymmetrischen Verschlüsselung habe ich [früher](/2019/05/tls)) ausgeführt).
Die Konfiguration des Peers, der als Server dienen soll, unterscheidet sich nur darin, dass zusätzlich eine Netzwerkbrücke eingerichtet werden muss, die den verbindenden Peers Adressen aus dem lokalen Netzwerk zuweist.

 Damit ein wireguard client Verbindung zu einem anderne aufnehmen kann, benötigt er

 * dessen IP
 * dessen öffentlichen Schlüssel

und: Er muss diesem bekannt sein. Also sein eigener öffentlicher Schlüssel muss beim Peer eingetragen sein.

### Installation und Einrichtung

* Debian-Linux und Derivate: `sudo apt install wireguard`.
* Windows: Wireguard aus dem App store.
* Android: Wireguard aus dem Play Store.

### Server

Ich zeige im Folgenden das Vorgehen für Ubuntu Linux. Andere Systeme funktionieren ähnlich

* `sudo -s`oder `su`, da für alle folgenden Schritte Administrator-Rechte nötig sind
* `wg genkey >server.key` - Privaten Schlüssel erstellen (Der Dateiname ist egal)
* `wg pubkey <server.key >server.pub` Passenden öffentlichen Schlüssel erstellen.

Dann /etc/wireguard/wg0.conf einrichten:

```bash
[Interface]
PrivateKey = Inhalt von server.key, z.B. UDqRf6+UaLmlcacePjIGs=

Address = 10.0.0.1/24

ListenPort = 51820

PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eno1 -j MASQUERADE

PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eno1 -j MASQUERADE
```

### Client (für jeden client separat)

* `sudo -s`
* `wg genkey >client.key`
* `wg genkey <client.key >client.pub`

Dann auch hier eine Konfiguration in /etc/wireguard erstellen:

`sudo nano /etc/wireguard/myvpn.conf`

```
[Interface]

PrivateKey = Inhalt von client.key GFY+esEyMOaiUQxnUeE20=

Address = 10.0.0.3/24

DNS = 192.168.17.1 # Oder ein anderer DNS-Server, z.B. 1.1.1.1 oder die IP deines Routers (z.B. 192.168.1.1)

# (eventuell) PostUp = resolvectl dns pinas 192.168.1.17 && resolvectl domain pinas "~." lan

[Peer]
PublicKey = Inhalt von server.pub SkavMdbXTZ4uG+SDf=

Endpoint = meine.oeffentliche.ip:51820

AllowedIPs = 192.168.17.0/24, 0.0.0.0/0 # Leitet den gesamten Traffic über das VPN

PersistentKeepalive = 25

```

### Clients auf dem Server bekannt machen

Für jeden client in /etc/wireguard/wg0.conf einen Eintrag anhängen:


```
... Anfang von wg0.conf s. oben...

[Peer] # Für jeden client [Peer], keine eigenen Namen!

PublicKey = client.pub des jeweiligen Clients 0j4y0cA0Y3qPsBg=

AllowedIPs = 10.0.0.2/32 # Für jeden Client eine eigene Adresse aus dem eingestellten Adressbereich vergeben!

```

### Wireguard aktivieren:

Auf dem Server: 

```
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0
```
(So wird der Wireguard Dienst bei Neustart des Servers automatisch gestartet)

Mit dem Client Verbindung herstellen:

`sudo wg-quick up myvpn` 

Verbindung beenden:

`sudo wg-quick down myvpn`


### Mobile Geräte

Auf mobilen Geräten ist das hier gezeigte Vorgehen mit Erstllen eines Schlüssels auf dem Client via Kommandozeile nicht praktikabel.

Man kann aber natürlich auch die client-Schlüssel auf dem Server erzeugen.

```
sudo -s
cd /etc/wireguard
mkdir meinhandy
wg genkey >meinhandy/client.key
wg genkey <meinhandy/client.key >meinhandy/client.pub
```
Dann in /etc/wireguard/wg0.conf einen [Peer]- Abschnitt mit dem Inhalt von meinhandy/client.pub erstellen, und meinhandy/client.key aufs Handy übertragen und in die wireguard-App eintragen.

Dafür gibt es eine weitere Vereinfachung:

Auf dem Server: 

Die ganze myvpn.conf wie oben gezeigt mitsamt dem eben erstellten privaten Schlüssel in meinhandy erstellen.

`sudo apt install qrencode`

`qrencode -t ansiutf8 < meinhandy/myvpn.conf`

Es wird ein QR-Code angezeigt, den man mit der Wireguard-App des Handys einfach abfotografieren kann, um die Verbingung einzurichten.
