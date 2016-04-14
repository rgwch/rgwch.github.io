---
layout: post
title: Asterisk Te1l 1
description: Eine Telefonanlage
category: Administration
tags: [Server, admin, sip, telefon, asterisk]
---
## Eine neue Telefonanlage

ISDN wird per Ende 2017 eingestellt. Schon jetzt gibt es kaum noch brauchbare Endgeräte. Unsere Telefone spucken immer mal wieder, aber eine neue Anlage auf ISDN-Basis
lohnt sich definitiv nicht. Also was tun?

 * Eine Telefonanlage fürs Analognetz?
 * Eines der verschiedenen VOIP-Komplettangebote von Swisscom oder Sunrise?
 * Ein VirtualPBX
 * Eine selbstgebastelte PBX-Anlage auf Asterisk-Basis
 
Da dies ein Amateur-Blog ist, ist es klar, dass wir uns am Ende für die Bastel-Lösung entscheiden. Telefonanlagen fürs Analognetz sind zu teuer, aussserdem weiss
niemand, wie lange es das Anaolgnetz noch gibt. Die Angebote von Swisscom und Sunrise sind sehr schwierig zu verstehen. Ich brauche keinen Fernseher bei der ARbeit, aber dafürr mehrere Telefone
und die Möglichkeit, weiterzuverbinden und mehrere Nummern zu führen. Dafür braucht man dann die teuren Business-Varianten. 
 
Für VirtualPBX gibt es Angebote z.B. von Swisscom, Sunrise, sibcall, e-fon und VTX. Was mit dabei stinkt ist, dass keiner der Anbieter seine Preise auf der Website wirklich offenlegt.
Alle behaupten gleichermassen, sie seien "günstig". Intensiveres Nachforschen führt dann zu Tage, dass der Grundpreis wohl irgendwo zwischen 15 und 30 Franken pro Endgerät 
und Monat liegt, Kosten für die Telefonnummern und Gespräche noch nicht eingerechnet. Zu teuer.

 
 
### Anforderungsprofil
 
Wir benötigen mindestens:

 * Vier Telefonnummern, davon eine Sammelnummer, eine Faxnummer und zwei Direktwahl-Nummern.
 * Vier Telefone, die alle auf die Sammelnummer hören, zwei sollen zusätzlich auf eine der Direktwahl-Nummern hören.
 * Ein Faxgerät, das auf die Faxnummer hört.
 * Zwei Anrufbeantworter.
 
Von jedem Telefon muss eine Weiterleitung auf jedes der anderen möglich sein, mit oder ohne Rückfrage.
 
 
 
 
 