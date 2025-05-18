---
layout: post
title: Reverse Tunnel
date: 2025-05-18
tags: [Website, Proxy, Server]
category: Administration
---
Ein reverse tunnel dient dazu, eine SSH-Verbindung vom Server zum Client aufzubauen, also umgekehrt, wie man das normalerweise tut. Das ist nützlich, wenn der Server von aussen nicht direkt erreichbar ist, und darum selber die Verbindnung initiieren muss.

### Beispiel 1

Nehmen wir an, ich habe einen Heim-Server, der gut geschützt hinter einer Firewall sitzt. Ich möchte aber dennoch eine Möglichkeit, eine SSH-Verbindung zu ihm aufzubauen. Dazu benötige ich einen im Internet erreichbaren Computer als Proxy.

Ich habe also 

* Meinen Heimserver, dessen IP.-Adresse ich nicht kenne, und der sowieso nicht von aussen erreichbar ist, und der auf port 22 einen SSH-Server laufen hat.
* Meinen Proxy, der unter https://mein.computer.irgendwo erreichbar ist, und der nichts von meinem Heimserver "weiss".

Ziel: Ich möchte mit `ssh -i schlüssel -p 1999 mein.computer.irgendwo` indirekt auf heimserver:22 kommen.

Vorgehen:


* Ich erstelle ein [SSH-Schlüsselpaar](https://www.heise.de/tipps-tricks/SSH-Key-erstellen-so-geht-s-4400280.html), um den Zugriff möglichst sicher zu gestalten.
* Dann sorge ich dafür, dass der Proxy auf port 12445 erreichbar ist, zum Beispiel mit einer Portweiterleitung auf dem Router von 12445 auf Port 22 (SSH) des Proxy-Computers. Eine zweite Portweiterleitung mache ich von 1999 auf 1999 des Porxy-Computers.
* Und kopiere den öffentlichen Schlüssel des vorhin erstellten Schlüsselbars auf den Proxy: `ssh-copy-id -i <public key> -p 12445 ich@mein.computer.irgendwo`.
* Schliesslich schalte ich in der ssh-konfigurationsdatei des Proxy die passwor-authentication aus, so dass er immer den Schlüssel verlang.

Soweit die Vorarbeiten. Den Tunnel erstellt man dann so (auf dem Heimserver eingeben):

`ssh -p 12445 -i <private key> -R 1999:localhost:22 ich@mein.computer.irgendwo`

Wenn man dann irgendwo im Internet `ssh -p 1999 -i <schlüssel> ich@mein.computer.irgendwo' eingibt, dann landet man direkt auf Port 22 des Heimservers.

### Beispiel 2

Nehmen wir an, Sie möchten, dass die Web-Oberfläche Ihres Heimservers auch von aussen erreichbar ist, zum Beispiel wenn Sie im Urlaub sind. Leider sieht Ihr Internet-Provider keine Möglichkeit vor, Ihren Router von aussen zu erreichen. Sie müssen sich also mit einem Reverse-Tunnel zu einem Proxy-Computer verbinden, der vopm Internet aus erreichbar ist. So einen (virtuellen) Computer können Sie bei vielen Providern günstig mieten, die einzige Bedingung für unsere ZWecke ist, dass Sie Shell-Zugriff haben. Dann brauchen Sie eine Domain (wie www.pseudoproxy.irgendwo), die Sie auf den Mietserver zeigen lassen (Kann meist beim selben Provider gebucht werden, wie der webspace).

Wir wollen also, dass ein Zugriff auf http://www.pseudoproxy.irgendwo umgeleitet wird auf den Heimserver, dessen IP-Adresse mnicht bekannt ist.

Vorgehen:

* Richten Sie den Shell-Zugriff auf dem Mietserver ein, idealerweise mit einem SSH-Schlüsselpaar wie oben gezeigt.
* Geben Sie auf Ihrem Heimserver ein: `ssh -fN -R 80:localhost:80 ich@pseudoproxy.irgendwo`


### Allgemeine Erwägungen

* Der SSH-Zugriff sollte wenn immer möglich nicht über Passwörter, sondern über Schlüsselpaare geschehen.
* SSH-Server neigen dazu, die Verbindung ab und zu abzubrechen. Es empfiehlt sich daher, die Tunnelerstellung in ein watchdog-Skript einzubauen, etwa so:

```bash
#! /bin/bash

nc -z localhost 80

if [ $? -eq 0 ]; then
        echo alive at `date`
else
        echo dead at `date` - $?  >>tunnel.log
        cp wget.log wget.err.log
        echo killing `/bin/pidof ssh`
        kill `/bin/pidof ssh`
        ssh -fN -R 80:localhost:80 ich@pseudoproxy.irgendwo
     
        if [[ $? -eq 0 ]]; then
                echo Tunnel to proxy created successfully >>tunnel.log
        else
                echo An error occurred creating a tunnel to proxy. RC was $? >>tunnel.log
  fi

fi

```
Und dieses Watchdog-Skript über einen Cronjob zum Beispiel halbstündlich laufen zu lassen.

