---
layout: post
title: Datensicherheit
description: Ist RAID wirksam
category: Administration
tags: [Server, admin, filesystem, Dateisystem]
---

## Festplattenredundanz mit RAID & Co.

Festplatten sind heutzutage sehr zuverlässig. Nur etwa 2% aller preiswerten Consumer-Festplatten gehen innerhalb des ersten Jahres kaputt, und werden dann auf Garantie ersetzt. 
In den folgenden Jahren steigt die Wahrscheinlichkeit allerdings an. Nach 5 Jahren werden etwa 30% dieser Platten kaputt sein.
 
Unabhängig davon existiert auch bei funktionierenden Platten das Risiko eines Bit-Fehlers: Etwa eines von 10 hoch 13 Bit wird falsch gelesen. Das kann durch magnetische Störungen oder
durch kosmische Strahlung oder durch Spannungsschwankungen geschehen, aber jedenfalls ist es seit Jahren ungefähr bei dieser Rate. 10^13 Bit, das sind ca. 12 Terabyte. Also wenn man
12 Terabyte liest, dann wird im Schnitt ein Bit falsch sein. Ein Bit, das bedeutet, dass die Prüfsumme des Sektors nicht mehr stimmt, in dem es sich befindet, und das wiederum 
bedeutet, dass die Platte sich weigert, den Sektor herauszurücken. Und das wiederum bedeutet, dass die Datei, die diesen Sektor belegt hat, nicht mehr lesbar ist. 
Sie hat nicht einfach ein defekltes Bit, was ja bei einem Text oder einen Bild oder einem Film oder einem Musikstück kein grosses Problem wäre, sondern sie ist ganz weg.

### RAID-5

Aber wir sind ja intelligente Leute und schützen uns vor solchen Pannen, indem wir die Disks als RAID anordnen. Zum Beispiel kaufen wir 4 Disks zu 4TB und ordnen die zu einem
RAID-5 an, das heisst, wir haben dann total eine Kapazität von 12 TB (Ja, ich habe absichtlich diese Zahl gewählt :)), und das System verkraftet den Totalausfall von einer beliebigen
dieser Platten ohne jeden Datenverlust.

Nun ist die Wahrscheinlichkeit, dass keine dieser Platten ausfällt, im ersten Jahr immerhin 0.98⁴. Nach drei Jahren haben wir aber schon eine solide 20-30%ige Chance, dass 
mindestens eine der Platten ausfällt. Dann tritt der RAID-Ernstfall ein, denn genau dafür haben wir ja das RAID gekauft und 4TB der gekauften Plattenkapazität der Redundanz geopfert.

Wir tauschen also frohen Mutes die defekte Platte aus und überlassen das RAID eine Nacht lang sich selber, um sich zu rekonstruieren.
Am nächsten Morgen überrascht uns eine kryptische Meldung, die uns, wenn wir sie entschlüsseln,  klar macht, dass leider alle Daten verloren sind.

Warum denn das?
Nun, um die Daten zu rekonstruieren, musste das RAID sämtliche Sektoren aller Platten auslesen, um daraus die Daten der fehlenden Platte zu rekonstruieren (So funktioniert RAID
nun einmal: Redundanzinformationen werden über alle Platten verteilt, so dass irgendeine ausfallen und rekonstruiert werden kann).

Beim Lesen dieser 12 TB stolperte mindestens eine der Platten aber über das 10 hoch 13-Bit-Problem und meldete den Sektor als unlesbar. Damit ist im Fall von RAID die ganze Platte 
unbrauchbar und da ein RAID_5 den Ausfall von zwei Platten nicht verkraftet, sind somit alle Daten futsch.

Natürlich spreche ich hier von statistsichen Mittelwerten. Das 10 hoch 13-Bit-Problem kann auch schon nach 10 hoch 10 Bit auftreten, oder erst nach 10 hoch 15. Aber das Prinzip
sollte klar sein. Zum Glück haben wir uns nicht nur aufs RAID verlassen, sondern haben auch noch ein Backup.

Und über ein zweites Problem habe ich noch gar nicht gesprochen: Da wir alle vier Platten gleichzeitig gekauft haben, und sie vermutlich zum gleichen Typ gehören, wird mit relativ hoher 
Wahrscheinlichkeit bald nach der ersten auch eine zweite Platte total ausfallen.

### Dann eben RAID-6

Mit RAID-6 lösen wir dieses Problem zunächst: RAID-6 verkraftet den Ausfall von zwei Platten, statt nur einer. Allerdings auf Kosten der Kapazität. Um auf dieselben 12TB zu kommen,
brauchen wir nun 5 Platten à 4 TB.
Es ist aber ohne erneute mathematische Herleitung einsichtig, dass das Problem damit nur aufgeschoben und nicht aufgehoben ist: Je grösser die Kapazität unseres Speichers ist, desto
grösser wird die Wahrscheinlichkeit, dass auch zwei Platten Lesefehler haben.

### Mirroring!

Wenn wir RAID-1, also Mirroring, betreiben, dann enthält jede Platte alle Daten. Der Ausfall einer Platte ändert also zunächst mal gar nichts, alles bleibt lesbar. Allerdings brauchen wir 
bei Mirroring 6 Platten à 4 TB, um auf 12 TB Kapazität zu kommen. Es besteht natürlich immer noch die Möglichkeit, dass eine Platte ausfällt, und eine andere einen Bitfehler aufweist.
Immerhin bleiben jetzt aber die Daten aller nicht-betroffenen Platten vollständig erhalten, und auch bei der Platte mit Bit-Fehler kann man vermutlich die nicht betroffenen Sektoren mit
einem gewissen Aufwand noch retten.

### Was tun?

Ich denke, was man aus obigem sehr gut sieht ist, dass RAID keinesfalls ein Ersatz für Backup ist. Wenn man ein aktuelles Backup hat, sind die ausfallenden Platten und Bitfehler ein
wesentlich kleineres Problem, das sich im Kauf von neuen Platten und dem Zeitaufwand fürs Rückspielen des BAckups erschöpft.

Wie soll man also vorgehen?

- Wenn ein Raid (egal ob Mirror oder RAID-1 oder RAID5/6) einen Fehler meldet, keinesfalls als erstes die kauptte Platte ersetzen, sondern als erstes ein neues Backup erstellen. Beim
Backup werden nicht alle Sektoren gelesen, sondern nur die, welche Nutzdaten enthalten. Die Belastung der verbleibenden Platten ist also kleiner, und man hat anschliessend ein
aktuelles Backup.

- Dann erst die defekte Platte ersetzen und abwarten, was passiert. Wenn das rebuild scheitert, würde ich alle Platten ersetzen und das Backup einspielen.

- Auf keinen Fall sollte man die Methode des "hot spare" anwenden. Manche Kontroller bieten einem an, eine Reserveplatte von vornherein im System einzubinden, und diese dann 
automatisch zu nutzen, wenn eine Nutzplatte ausfällt. Das ist gefährlich, weil man dann keine Chance hat, vor dem Rebuild die Daten zu retten. Mit einiger Wahrscheinlichkeit findet
man anstelle einer Fehlermeldung eines Morgens einfach ein kaputtes RAID mit einer halb beschriebenen, nutzlosen hot spare Platte vor.


- Gegen Bitfehler kann auch ein Dateisystem helfen, das eigene Prüfsummen und Redundanzen mitbringt, zum Beispiel ZFS. Ein solches Dateisystem kann Bitfehler in manchen Fällen selbst
korrigieren und somit die Wahrscheinlichkeit eines nicht behebbaren Fehlers reduzieren.
