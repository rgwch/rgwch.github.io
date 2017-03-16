---
layout: post
title: Garagentor-Fernbedienung
description: Wie man das Garagentor mit dem Handy öffnet
category: Haus Automation
tags: [Wohnen,Fernbedienung,Raspberry,Javascript,NodeJS]
---

Eine defekte Garagentor-Fernbedienung gab den Ausschlag: Da unser Torantrieb schon das Methusalem-Alter von 15 Jahren hat, war ein Ersatzteil natürlich nicht mehr zu bekommen. Es gab nur noch Universalfernbedienungen für um die 100.-. Da kommt man ins Grübeln. Der Materialwert einer solchen Fernbedieung dürfte unter 10.- sein.

Aiusserdem gibt es noch ein zweites, davon unabhängiges Problem: Wir haben nie genug Schlüssel, und die Jungs vergessen ihren manchmal, wenn sie weg gehen. Aber was wir alle immer dabei haben, ist das Smartphone. Nun denn, die Idee, das Garagentor mit dem Smartphone zu öffnen ist, zugegeben, nicht ganz neu, aber es geht viel billiger und einfacher, als gedacht:

Innen hat der Torantrieb einen Taster, der einfach einen Kontakt schliesst und den Torantrieb so einschaltet. Mit diesem Taster kann man das Tor von Hand bedienen, wenn man sich in der Garage befindet. Das Tor fährt bei jedem Druck auf den Taster abwechselnd runter oder hoch, bzw. bleibt stehen, wenn es gerade am Fahren ist.

Natürlich kann man so einen Kontakt auch mit einem Relais, statt mit einem Handtaster schliessen.

Und ein Relais kann man mit einer beliebigen Elektronikschaltung steuern. Oder mit einem GPIO Ausgang eines Raspberry Pi. Und der Raspberry Pi wiederum kann via Netzwerk oder via Bluethooth mit der Umwelt drahtlos in Kontakt treten.

Also ist die Idee sehr einfach: Auf dem Raspi läuft ein REST-Server. Sobald man im häuslichen WLAN eingebucht ist, kann man mit dem Browser des Handys auf diesen REST-Server zugreifen, und einen GPIO-Pin schalten, der wiederum ein Relais ansteuert, welches den Kontakt schliesst, der das Garagentor losfahren oder stoppen lässt.
Da das WLAN mit WPA2 gesichert ist, und da der REST-Server nur vom WLAN aus erreichbar ist, braucht man sich um die Absicherung nicht allzu viele Gedanken zu machen. Eine einfache Passwortabfrage genügt. Und es wird dann geradezu trivial, Besuchern einen temporären Schlüssel zu geben: Man braucht sie nur auf dem Server einzutragen und am Ende wieder zu löschen.

## Software

Da ich eher ein Software-Mensch bin, mache ich mich zuerst an den Server:

 * Einen Raspi aus dem keller holen, es ist ein B+. Zwar langsamer, als die aktuellen 2er und 3er Versionen, aber für unsere Zwecke sollte es genügen.
 * NOOBS herunterladen und auf die SD-Karte aufspielen, für silentinstall konfigurieren, da ich keine Lust habe, den Raspi an Tastatur Bildschirm anzuschliessen.
 * NodeJS und NPM installieren (was weniger einfach ist, als gedacht, weil die neuren Node-Versionen auf den alten Raspi-Modellen nicht laufen, also nahm ich die alte Node-Version, die in Raspbian integriert ist)

 * Ein Projekt aufsetzen:

Im Terminal:

      mkdir garage
      cd garage
      npm init
      npm install express nconf crypto-js


 Dann kann man einen trivialen REST-Server erstellen:

    // garage.js
    var express=require('express')
    var nconf=require('nconf')
    var hash=require('crypto-js/sha256')
    nconf.env().argv().file('users.json')
    var app=express()

    app.get("/garage/:user/:password",function(request,response){
      var user=JSON.stringify(hash(request.params['user']))
      var password=JSON.stringify(hash(request.params['password']))
      var valid=nconf.get(user)
      if(valid && valid == password){
        console.log("Die Garage öffnet sich!")
        response.send("Willkommen, "+request.params['user'])
      }else{
        response.send("Wer bist denn du???")
      }
    })

    app.listen(3000,function(){
      console.log("Garagenserver läuft an port 3000")
    })

Mit `node garage.js` kann man das Ding starten. Dann können wir mit `http://raspi:3000/garage/hans/peter` zugreifen und erhalten immer "Wer bist denn Du???" zurück, da ja noch kein User 'hans' mit Paswort 'peter' bekannt ist.

Das wollen wir nun ändern:

Damit keine Usernamen und Passwörter im Klartext in users.json stehen, werden sie gehasht.
Allerdings ist es dann nicht ganz einfach, sie in die Konfiguration zu kriegen. Da dies ein kleines Projekt mit einer absehbaren Zahl von Usern ist, machen wir uns das sehr einfach: Es gibt einen zweiten REST-Endpoint zum Eintragen von Usern, den wir vor der app.listen()-Zeile einfügen:

    app.get("/adduser/:username/:password",function(req,resp){
      var user=JSON.stringify(hash(req.params['username']))
      var password=JSON.stringify(hash(req.params['password']))
        nconf.set(user,password)
        nconf.save()
        resp.send("Ok")
    })

Jetzt können wir höchst simpel mit `http://raspi:3000/adduser/hans/peter` unseren ersten User eintragen. Danach sollte `http://raspi:3000/garage/hans/peter` eine freundliche Willkommensmeldung zurückliefern. (Über die Tatsache, dass die Nachricht "Die Garage öffnet sich!" eine klassische Fake-News ist, wollen wir jetzt mal gnädig hinwegsehen.)

Natürlich wäre das nun doch allzu unsicher: So könnte sich ja jeder selbst als zugelassener User eintragen :)
Der Endpunkt "adduser" wird deshalb im Normalbetrieb auskommentiert und nur dann "scharf" geschaltet, wenn der Admin einen neuen User zufügen will. Wie gesagt, wir sprechen von einem System mit einer sehr überschaubaren Zahl von Usern. Wem das zu unbequem ist, der kann ja einen Admin-Zugang erstellen, um User zu verwalten.

Über die Klartextübermittlung von Usernamen und Passwörtern braucht man sich übrigens keine Gedanken zu machen, sofern man selbst die Kontrolle über den Router hat: Das mit WPA2 gesicherte WLAN verschlüsselt alle übertragenen Daten.

Damit ist der Software-Teil des Garagenentoröffners fertig.

## Hardware

Für den Hardware-Teil muss man wissen:

Die GPIOs des Raspberry bringen grade mal 3.3 Volt mit äusserst spärlichen Milliampères auf die Beine. Wenn man da herzlos ein handelsübliches Relais anschliesst, brennt der raspi glatt durch. Oder das Relais reagiert nicht. Oder was auch immer (ich bin ja kein Elektroniker). Jedenfalls wird es nicht klappen.

Man braucht also eine Steuerelektronik. Hinter diesem hochtraben Namen verbirgt sich ein Transistor, eine Diode und ein Widerstand. Für jemandem mit zwei linken Händen wie mich kann das schon limitierend sein. Aber viel kann ja nicht passieren. Schlimmstenfalls verbrennt man beim Löten den Transistor oder die Finger. Natürlich kann man auch fertige Relaismodule für den Raspberry kaufen, aber wir sind ja keine Warmduscher.

[Hier](https://asciich.ch/wordpress/raspberry-pi-relais-ansteuern/) kann man zum Beispiel nachlesen, wie man so etwas aufbaut.

## Zusammenbringen

Nun weiss unser Server allerdings noch nicht, wie er den passenden GPIO Pin schalten kann.
Wie fast immer bei NodeJS ist guter Rat billig: `npm install --save rpio`.

Dann fügen wir im Kopf von 'garage.js' folgende Zeilen hinzu:

    var rpio=require('rpio')
    rpio.open(12,rpio.OUTPUT,rpio.LOW)  // definierten Ausgangszustand erstellen

Und ändern dann den Erfolg-Teil des garage-Endpoints wie folgt:

    if(valid && valid == password){
      console.log("Das Garagentor tut etwas!")
      rpio.write(12,rpio:HIGH)
      rpio.sleep(1)
      rpio.write(12,rpio.LOW)
      response.send("Auftrag ausgeführt, "+request.params['user'])
    }

Also: Wir "drücken den Knopf" eine Sekunde lang und lassen ihn dann wieder los. Wenn das Garagentor sich zuletzt geöffnet hat, dann schliesst es sich jetzt, wenn es sich gerade bewegt, dann bleibt es stehen, und wenn es sich zuletzt geschlossen hatte, dann geht es jetzt auf.

Ziemlich einfach, nicht wahr?
