---
layout: post
title: Garagentor-Fernbedienung, Zweiter Teil
description: Wie man das Garagentor mit dem Handy öffnet
category: Haus Automation
tags: [Wohnen,Fernbedienung,Raspberry,Javascript,NodeJS, IoT]
---

Zum [ersten Versuch](/2017/03/garagentor)

# Der zweite Entwurf

Nachdem ich sowohl den Finger, als auch den Transistor mit dem Lötkolben verbrannt hatte, stellte sich heraus: Ich bin
elektrotechnisch eben doch ein Warmduscher, und so kaufte ich anstelle der Eigenbau-Relaisplatine ein [PiFace Digital 2](http://www.piface.org.uk/products/piface_digital_2/). Das kann man einfach auf den Raspberry draufstecken, und es bietet nicht
nur zwei Relais, sondern auch 8 Aus- und 8 Eingänge. Ein wenig Overkill für unser Projekt, aber zumindest einen der Eingänge können wir noch
sinnvoll nutzen. Die Relais können bis zu 20V/5A schalten, mehr als genug für den GaragentorTaster, der mit 12V und wenigen mA betrieben wird.

Der Hardware-Aufbau sieht so aus:

* Eines der PiFace-relais wird parallel zum Garagentor-Taster geschaltet
* Ein Mikroschalter wird so befestigt, dass er bei geöffnetem Garagentor betätigt wird. Dieser Schalter wird zwischen Inputpin 0 und GND des PiFace geschaltet. Damit "weiss" die Garagentor-Fernbedienung, wenn das Tor offen steht.

Ein weiteres Problem mit dem ersten Versuch war, dass das Einbuchen ins häusliche WLAN zu lange dauert. Wenn man vor der Garage steht, mag man nicht eine Minute warten, bis das Handy Kontakt hat. Also wird der Software-Teil so umgebaut, dass man das Tor übers Internet bedienen kann. Es wird somit, modern ausgedrückt, Teil des <abbr title="Internet of Things">IoT</abbr>.

Damit entwickeln sich eine Reihe zusätzlicher Anforderungen für den Garagentor-Server:

1. Es muss eine DynDNS-Umleitung eingerichtet werden, damit man die Garage mit einem sprechenden Namen (some.where.ch) anstatt einer kryptischen Internetadresse (85.34.223.12) erreichen kann (welche obendrein bei den meisten Providern fast täglich ändert).
2. Der Raspberry muss so konfiguriert werden, dass er den DynDNS Provider mit der jeweils aktuellen IP versorgt.
3. Der häusliche Router muss Zugriffe auf den Garagengtorserver an diesen durchreichen.
4. Der Kontakt zum Server muss verschlüsselt erfolgen, damit Passwoörter nicht abgehört werden können.
5. Hackversuche müssen unterbunden werden.
6. Zugriffe müssen geloggt werden, damit Angriffe erkannt und analysiert werden können.

Somit wird aus dem kleinen Projekt des ersten Teils ein etwas grösseres Projekt, welches auch ganz gut als allgemeines NodeJS/Express-Server Beispiel dienen kann. Ich führe daher im Folgenden alles ein wenig deutlicher aus. Ganz am Ende findet sich dann der komplette Quellcode.

### 1. Dynamische DNS

Ein Teilnehmer im Internet ist durch seine IP-Adresse eindeutig indentifiziert. Es gibt zwei varianten: Das ältere IPV4, das aus 4 Gruppen von Zahlen zwischen 0 und 255 zusammengesetzt ist, etwa so: 85.198.16.82. Und das neuere IPV6, das aus 8 Gruppen von maximal 4-stelligen hexadezimalen Zahlen besteht, etwa so: 2f45:b8:8256:1fd:0:0:2345:ff1a. Die meisten Provider setzen derzeit noch auf IPV4 und erteilen eine IP je Router. Diese IP wird dynamisch erteilt, also meistens einmal pro Tag (und bei jedem neuen Verbindungsaufbau) neu vergeben. Fixe IPs kann man zwar von manchem Providern bekommen, aber meist nur für recht viel Geld. Um einen privaten Server von aussen zu erreichen, muss man also irgendwie herausfinden, welche IP er gerade hat.

Die Lösung hierfür heisst DynDNS: Unser Server teilt einem speziellen Internet-Service regelmässig mit, welche IP er gerade hat, und dieser publiziert diese IP unter einem symbolischen Namen. Man kann also zum Beispiel "mein.garagentor.ch" reservieren, Falls das noch nicht vergeben ist, und einen DynDNS Service einrichten, der jeden Internet-Zugriff auf diesen Namen auf unseren Server leitet.

www.dyndns.com ist der Pionier solcher Services, aber es gibt auch etliche Andere. ich verwende [ZoneEdit](http://www.zoneedit.com), weil ich dort ohnehin einige Domains gehostet habe, und der DynDNS Service nichts extra kostet.


### 2. Raspberry anweisen, mit DynDNS zu kooperieren

Dafür gibt es fixfertige Lösungen:

    sudo apt-get install ddclient

Den ddclient muss man für dne gewählten DynDNS-Diens konfigurieren, dann wird er fortan immer die aktuelle IP-Adresse an den Dienst melden-

### 3. Router konfigurieren

Da die vom Provider erteilte IP pro Router gilt, haben alle Computer "hinter" dem Router gegen aussen dieselbe IP. Der Router hat die Aufgabe, Zugriffe auf die inneren Computer zu verteilen, für die er ein internes Netzwerk mit eigenen IP-Nummern (z.B. 192.168.1.5) aufbaut. Wenn ein Browser jetzt auf https://meingaragentor.ch:2017 zugreift, dann wird er melden: "Diese Website ist nicht erreichbar". Er weiss ja nicht, wo der Server lauert, der diesen Dienst bereitstellt. Wir müssen also den Route anweisen, den Port 2017 zu unserem Raspberry weiterzuleiten.

Das dafür nötige Vorgehen ist bei jedem Router anders. Das entsprechende Menü heisst oft "NAT" oder "Dienst freigeben".

### 4. Kontakt zum Server verschlüsseln

Dies geschieht, indem man das https:// anstatt dem http:// Protokoll verwendet. Dies muss auf dem Server eingerichtet werden. Bisher hatten wir:

    app.listen(2017,function(){
      console.log("Garagenserver läuft an port 2017")
    })

Was einen HTTP-Server erstellt. Neu schreiben wir nun:

    https.createServer({
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    }, app).listen(2017)

Wobei "key" der private Schlüssel des Servers und "cert" das Zertifikat ist, das die Identität des Servers bestätigt. Bis vor kurzem war ein solches Zertifikat eine teure Sache. Man musste sich bei einer Zertifizierungsstelle als Inhaber der Website ausweisen und dann einen jährlichen Betrag bezahlen. Heute gibt es mit [Letsencrypt](https://letsencrypt.org) eine kostenlose Variante.  

So oder so kann man auch einfach ein selbstsigniertes Zertifikat benutzen. Dafür genügt ein simples:

    openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes

Damit erstellt man einen Schlüssel und bestätigt sich selber, wer man ist. Natürlich mekren alle Browser diese "Schummelei" und warnen vor einer nicht-sicheren Verbindung. Das ist aber nicht ganz korrekt: Die Verschlüsselung ist absolut gleichwertig mit der, die man mit einem "offiziellen" Zertifikat erhält. Nur der Identitätsnachweis des Serverbetreibers ist nicht gesichert. Aber das kann uns egal sein, da wir ja selber der Serverbetreiber sind.
Also wenn man mit der hässlichen Browserwarnung leben kann, dann ist ein selbstsigniertes Zertifikat der bequemste Weg.

### 5. Hackversuche unterbinden

Hier geht es nicht einmal so sehr um den Einbrecher, der durch die garage ins Haus eindringen will. Für den ist es allemal einfacher, ein Fenster einzuschlagen, als Passwörter zu hacken. Aber wenn man vom Internet aus erreichbar ist, dann ist man auch Hackern ausgesetzt, die einfach zum Spass irgendwo Schaden anrichten wollen, und auch leistungsfähigen automatischen Hackprogrammen, die Computer erobern wollen, um sie dann zum Beispiel als Spamschleudern oder als Selver für illegale Inhalte zu missbrauchen. Daher:

* Auf dem Raspberry läuft nur, was für den Garagenserver notwenidig ist. Was nicht vorhanden ist, kann auch nicht gehackt werden. Also kein VNC Zugang, keine Windows-Dateifreigabe etc.
* Der Router gibt nur den einen Port weiter, der benötigt wird, also in unserem Beispiel 2017. Alle anderen Ports werden abgewiesen.
* Der Server hat nur passwortgeschützte Funktionen. Ohne Passwort kann man gar nichts machen.
* Wenn jemand ein falsches Passwort eingibt, wird eine Zwangspause eingelegt. Dies stört Programme, die vollautomatisch hunderte von Passwörtern pro Sekunde ausprobieren können. Wir verwenden folgende Methode: Beim ersten Fehlversuch beträgt die Pause 3 Sekunden, bei jedem weiteren Fehlversuch verdoppelt sie sich. Wer also fünf Mal ein falsches Passwort eingibt, muss sich vor dem nächsten Versuch eineinhalb Minuten gedulden, nach zehn Mal schon fast eine Stunde.

### 6. Zugriffe loggen

Es könnte immer noch sein, dass ein raffinierter Hacker einen Weg findet, an den wir nicht gedacht haben. Also muss der Server alles, was er tut in ein Logfile schreiben. Wenn man das ab und zu durchsieht, kann man verdächtige Aktionen bemerken.

## Das Programm

### Vorbereitung



### Listings

```JavaScript

/**
 *  Garagentor-Fernbedienung mit Raspberry Pi
 */

"use strict"

// Damit wir das Programm auf einem normalen PC ohne GPIO testen können. Wenn es auf dem echten Pi läuft, true setzen
const realpi = false
// Pin des piface für den output. pin 1 ist das linke Relais.
const output_pin = 1
// pin für den Schalter, der feststellt, ob das Garagentor offen ist
const input_pin = 0
// Dauer des simulierten Tastendrucks in Millisekunden
const time_to_push = 1200
// Dauer des Öffnungs/Schliessvorgangs des Tors
const time_to_run = 4000
// Aussperren bei falscher Passworteingabe
const lock_time = 3000

const fs = require('fs')
const https = require('https')
const express = require('express')
const nconf = require('nconf')
const hash = require('crypto-js/sha256')
const path = require('path')
const bodyParser = require('body-parser');
const salt = "um Hackern mit 'rainbow tables' die Suppe zu versalzen"
const favicon = require('serve-favicon');

nconf.file('users.json')
const app = express()
// Dieses Flag nutzen wir später, um den Server temporär inaktiv zu schalten.
let disabled = false;
// Dieses Flag zeigt an, dass das Garagentor gerade fährt
let running = false
// Hier sammeln wir schiefgegangene Login-Versuche
const failures = {}

app.set('view-cache', true)
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

/*
 HTTPS-Server erstellen, damit Usernamen und Passwörter verschlüsselt übermittelt werden.
 Als Zertifikat kann man entweder ein self-signed certificate verwenden
 (openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes).
 Dann muss man allerdings damit leben, dass der Browser eine "Sicherheitswarnung" ausgibt.

 Oder man erstellt ein Zertifikat via letsencrypt, mit "sudo certbot certonly --manual" und kopiert
 "privkey.pem" nach "key.pem" und "fullchain.pem" nach "cert.pem".
 Dann muss man allerdings, das Zertifikat alle drei Monate erneuern, weil Letsencrypt keine länger gültigen
 Zertifikate ausstellt.

 Oder man kauft irgendwo ein kostenpflichtiges Zertifikat. Aber das scheint mir für einen Garagentorantrieb
 eigentlich zu aufwändig.
 */
https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app).listen(2017)

// Auf einem echten Pi ist pfio auf das piface (https://www.npmjs.com/package/piface) gesetzt
// Auf einem anderen PC wird es einfach mit leeren Funktionen simuliert.
let pfio
if (realpi) {
  pfio = require('piface')
  pfio.init()
} else {
  let pinstate = 1
  pfio = {
    digital_write: function () {
    },
    digital_read: function (pin) {
      pinstate = pinstate ? 0 : 1
      return pinstate
    }
  }
}

/**
 * Expressjs sagen, dass die Views im Verzeichnis "views" zu finden sind, und dass
 * pug benötigt wird, um sie nach HTML zu konvertieren.
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/**
 * Expressjs mitteilen, dass wir json- und urlencoded Parameter im request body erwarten
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

/**
 * Endpoint für https://adresse:2017/
 *  Login-Screen anzeigen
 */
app.get("/", function (request, response) {
  response.render("garage")
})

/**
 Check ob der Server inaktiv geschaltet ist, oder das Garagentor gerade läuft.
 Wird vor jeden POST-Request ("/*") geschaltet.
 */
app.post("/*", function (req, resp, next) {
  if (disabled) {
    resp.render("answer", {
      message: "Der Server ist derzeit inaktiv geschaltet."
    })
  } else if (running) {
    resp.render("answer", {
      message: "Das Garagentor fährt gerade. Bitte warten."
    })
  } else {
    next()
  }
})

/**
 Check, ob der aktuelle Anwender gesperrt ist
 */
function isLocked(lockinfo) {
  if (lockinfo) {
    let now = new Date().getTime()
    let locked_until = lockinfo.time + (Math.pow(2, lockinfo.attempt) * lock_time)
    if (now < locked_until) {
      return true;
    }
  }
  return false;
}

/**
 * Aktuellen User sperren. Wenn er schon gesperrt ist, Sperrzeit verlängern
 * @param user user
 * @returns {number} Zahl an Sekunden der aktuellen Sperrzeit
 */
function setLock(user) {
  let now = new Date().getTime()
  let lockinf = failures[user] ? failures[user] : {"attempt": 0}
  lockinf["attempt"] += 1
  lockinf["time"] = now
  failures[user] = lockinf
  return Math.round((Math.pow(2, lockinf.attempt) * lock_time) / 1000)
}

/**
 * Zugriffstest;
 * wird vor alle https://server:2017/garage/... Anfragen POST requessts geschaltet
 * Wenn ein user gesperrt ist, dann prüfe, ob die Sperre abgelaufen ist. Wenn nein, abweisen
 * Sonst:
 * Wenn das Passwort korrekt ist, allfällige Sperren löschen
 * Wenn das Passwort falsch ist, Sperre erneut setzen, Dauer erhöhen (2^attempt*lock_time)
 */
app.post("/garage/*", function (request, response, next) {
  let user = request.body.username.toLocaleLowerCase()
  if (isLocked(failures[user])) {
    response.render("answer", {message: "Sperre wegen falscher Passworteingabe. Bitte etwas später nochmal versuchen."})
  } else {
    let password = JSON.stringify(hash(request.body.password + salt))
    let valid = nconf.get(user)
    if (valid && valid === password) {
      delete failures[user]
      next()
    } else {
      console.log("Loginfehler mit Name " + user + ", " + new Date())
      let secs = setLock(user)
      response.render("answer", {
        message: "Wer bist denn du??? Sperre " + secs + " Sekunden."
      })
    }
  }
})

/**
 * Zugriffstest für Admin-Funktionen.
 * Wird vor alle https://server:2017/adm/... GET requests geschaltet.
 * Gemeinsame Syntax: /adm/masterpassword/funktion/parameter.
 * Bei falschem Masterpasswort: Sperre setzen bzw. verlängern.
 */
app.get("/adm/:master/*", function (req, resp, next) {
  if (isLocked(failures['admin'])) {
    resp.render("answer", {message: "Sperre wegen falscher Passworteingabe. Bitte etwas später nochmal versuchen."})
  } else {
    let master = JSON.stringify(hash(req.params.master + salt))
    let stored = nconf.get("admin")
    if (!stored) {
      nconf.set("admin", master)
      stored = master
    }
    if (stored === master) {
      delete failures['admin']
      next()
    } else {
      console.log("Admin-Fehler" + req.params.username + ", " + new Date())
      let secs = setLock("admin")
      resp.render("answer", {
        message: "Insufficient rights. Wait " + secs + " seconds."
      })
    }
  }
})

/*
 Nach dem Login-Screen und erfolgreicher Passworteingabe: Aktuellen Zustand des Tors anzeigen.
 */
app.post("/garage/login", function (request, response) {
  let state = pfio.digital_read(input_pin)
  let action = state === 1 ? "Schliessen" : "Öffnen"
  response.render("confirm", {
    name: request.body.username,
    pwd: request.body.password,
    status: state === 1 ? "offen" : "geschlossen",
    action: action
  })

})

/*
 "Taste drücken".  Kontakt wird für time_to_push Millisekunden geschlossen. Für time_to_run Millisekunden werden
 keine weiteren Kommandos entgegengenommen, um dem Tor Zeit zu geben, ganz hoch oder runter zu fahren.
 */
app.post("/garage/action", function (request, response) {
  console.log("Garage " + request.body.action + ", " + new Date())
  running=true
  pfio.digital_write(output_pin, 1)
  setTimeout(function () {
    pfio.digital_write(output_pin, 0)
  }, time_to_push);
  setTimeout(function(){
    running=false
  },time_to_run)
  response.render("answer", {
    message: "Auftrag ausgeführt, " + request.body.username
  })
})

/**
 * Einen neuen User eintragen.
 */
app.get("/adm/:master/add/:username/:password", function (req, resp) {
  var user = req.params.username.toLocaleLowerCase()
  var password = JSON.stringify(hash(req.params['password'] + salt))
  nconf.set(user, password)
  nconf.save()
  resp.render("answer", {
    message: "Ok"
  })

})

/**
 * Einen User löschen.
 */
app.get("/adm/:master/remove/:username", function (req, resp) {
  nconf.set(req.params.username, undefined)
  nconf.save()
  resp.render("answer", {
    message: "ok"
  })
})

/**
 * Server inaktiv schalten.
 */
app.get("/adm/:master/disable", function (req, resp) {
  disabled = true
  resp.render("answer", {
    message: "disabled"
  })
})

/**
 * Server aktiv schalten.
 */
app.get("/adm/:master/enable", function (req, resp) {
  disabled = false
  resp.render("answer", {
    message: "enabled"
  })
})

/**
 * Passwort ändern
 */
app.post("/garage/chpwd",function(req,resp) {
  let npwd=req.body.npwd
  if(npwd && npwd.length>4 && /\d/.test(npwd) && /[a-zA-Z]/.test(npwd)) {
    nconf.set(req.body.username, JSON.stringify(hash(req.body.npwd + salt)))
    nconf.save()
    console.log(req.body.username + " changed password, " + new Date())
    resp.render("answer", {message: "Ab sofort gilt das neue Passwort"})
  }else{
    resp.render("answer",{message:"Das neue Passwort muss mindestens 5 Zeichen lang sein und sowohl Zahlen als auch Buchstaben enthalten."})
  }
})

/**
 * Logfile auslesen
 */
app.get("/adm/:master/log",function(req,resp){
  fs.readFile("../forever.log",function(err,data){
    if(err){
      resp.render("answer",{message:err})
    }else{
      var lines=data.toString().split("\n")
      resp.render("answer",{message:"<p>"+lines.join("<br>")+"</p>"})
    }
  })
})

```

## Die Views

Views sind das, was der Server an den Browser zurückliefert, also das, was man letztlich zu Gesicht bekommt.
In diesem Beispiel sind alle Views in der Beschreibungssprache "pug" verfasst, die vor der Ausgabe vom Server nach HTML umgewandelt werden.

### layout.pug

Das ist der gemeinsame Rahmen um alle Views. Die jeweils spezifische View wird bei "content" eingesetzt. Hier wird das "Materialize"-
Styling geladen und festgelegt, dass die Seite auf kleinen Bildschirmen vergrössert dargestellt werden soll. Ausserdem deklarieren wir,
wo sich die Icons für iOS (apple-touch-icon) un Android (manifest.json) befinden, falls der User eine Verknüpfung auf
dem Handy-Desktop anlegen will.

```pug

doctype html
html
  head
    title= "Unsere Garage"
    link(rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/css/materialize.min.css")
    link(href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet")
    meta(content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=2, user-scalable=0" name="viewport")
    link(rel="apple-touch-icon" href="/garage-57x57.png")
    link(rel="manifest" href="/manifest.json")
  body
    block content
    script(src="simple.js")
```

### garage.pug

Das ist die Einstiegsseite, die auf den Aufruf von "/" gezeigt wird.

```pug

extends layout.pug
block content
  .container
    .row
      h1.col.s12 Garage
      form.col.s12(method="post" action="/garage/login")
        .row
          .col.s12
            .input-field.col.s12
              i.material-icons.prefix account_circle
              input(type="text" name="username" placeholder="Username" id="uname")
            .input-field.col.s8
              i.material-icons.prefix vpn_key
              input(type="password" name="password" placeholder="Passwort" id="pwd")
            .btn.btn-flat.col.s4(onClick="enterPwd()") ändern...

            button.btn.waves-effect.waves-light.col.s12(type="submit" name="action") Senden
              i.material-icons.right send

```

### answer.pug

Mit dieser Seite gibt der Server seine Antworten zurück. In der Variablen "message" befindet sich der Text der Antwort.


```pug

extends layout.pug
block content
  .container
    .row
      p.col.s12(style="font-size:large") Die Garage sagt: !{message}
      a.col.s3.btn.waves-effect.waves-light(href="/") Zurück
      a.col.s3.offset-s1.btn.waves-effect.waves-light(href="http://www.google.ch") Irgendwo anders hin

```

### confirm.pug

Hier wird dem user nach erfolgtem Login die Möglichkeit gegeben, das Tor zu öffnen oder zu schliessen. In der Variable "Status" steht, ob die garage derzeit offen oder zu ist, in "action" steht, was der User jetzt tun kann (schliessen oder öffnen).

``` pug

extends layout.pug
block content
  .container
    .row
      h3(style="color:blue") Willkommen, #{name}
      p Die Garage ist <b>#{status}</b>
      form.col.s12(method="post" action="/garage/action")
        input(type="hidden" name="username" value=name)
        input(type="hidden" name="password" value=pwd)
        input(type="hidden" name="action" value=action)
        button.col.s3.btn.waves-effect.waves-light(type="submit" name="action") #{action}
        a.col.s3.offset-s1.btn.waves-effect.waves-li

```
