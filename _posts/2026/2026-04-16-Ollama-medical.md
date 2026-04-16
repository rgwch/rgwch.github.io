---
layout: post
title: Ollama als Diagnosehelfer
date: 2026-04-16
tags: [KI,LLM,LLama]
category: KI
---

In einem [früheren](/2025/05/Ollama) Beitrag habe ich ja schon den KI-Manager Ollama vorgestellt.

Die Entwicklung der KI-Modelle macht Fortschritte, und sie werden immer brauchbarer. Hier als Beispiel ein Helfer für Röntgenbilder:

```bash
ollama run medgemma
```
<span style="color:green">&gt;
Bitte befunde dieses Röntgenbild. Die 64-jährige Patientin hat Husten. Bild:
...  '/home/user/Bilder/Bildschirmfotos/Bildschirmfoto vom 2026-04-16 08-10-18.
... png'
</span><br /> 
Added image '/home/user/Bilder/Bildschirmfotos/Bildschirmfoto vom 2026-04-16 08-10-18.png'
Das Röntgenbild zeigt eine normale Lungenstruktur. Es gibt keine 
offensichtlichen Anzeichen für eine akute Entzündung, Infektion oder 
andere pathologische Veränderungen. Die Lungen sind relativ klar, die 
Herzgröße ist normal, und es sind keine Auffälligkeiten in den Mediastinum 
oder den Brustkorb erkennbar.

**Befunde:**

*   **Lungen:** Normale Lungenstruktur, keine sichtbaren Infiltrate oder 
Verschiebungen.
*   **Herz:** Normales Herzvolumen.
*   **Mediastinum:** Kein Hinweis auf pathologische Veränderungen.
*   **Brustkorb:** Keine sichtbaren Frakturen oder andere Auffälligkeiten.

**Hinweis:**

Obwohl das Bild keine offensichtlichen Auffälligkeiten zeigt, ist es 
wichtig zu beachten, dass ein Röntgenbild nur ein Momentaufnahme ist. Eine 
umfassende Beurteilung erfordert die Berücksichtigung des klinischen 
Bildes und der Anamnese des Patienten.

**Empfehlung:**

Da die Patientin Husten hat, ist es ratsam, weitere Untersuchungen 
durchzuführen, um die Ursache des Hustens zu ermitteln. Mögliche 
Untersuchungen könnten ein CT-Thorax, eine Bronchoskopie oder eine 
Lungenfunktionstests sein.

**Disclaimer:** Ich bin ein KI-Modell und kann keine medizinische Diagnose 
stellen. Bitte konsultieren Sie einen Arzt oder Radiologen für eine 
korrekte Interpretation des Röntgenbildes und für eine individuelle 
Behandlungsempfehlung.

<span style="color:green">&gt;Hier ist das dazugehörige laterale Bild: '/home/user/Bilder/Bildschirmfotos/Bildschirmfoto vom 2026-04-16 08-14-10.png'</span><br />
 
Added image '/home/user/Bilder/Bildschirmfotos/Bildschirmfoto vom 2026-04-16 08-14-10.png'
Okay, ich habe das laterale Bild erhalten. Hier ist meine Befundung:

**Befunde:**

*   **Lunge:**
    *   Die Lunge sieht generell normal aus.
    *   Es gibt keine offensichtlichen Zeichen für Pneumonie, Lungenödem oder andere parenchymale Veränderungen.
    *   Die Bronchien scheinen normal zu sein.
    *   Es gibt keine Hinweise auf eine Pleuraerguss.
*   **Herz:**
    *   Die Herzgröße ist innerhalb der Norm.
*   **Mediastinum:**
    *   Der Mediastinum erscheint normal.
*   **Brustwand:**
    *   Keine sichtbaren Frakturen oder andere pathologische Veränderungen.
*   **Klüver-Bell-Sign:** Ich sehe keine klaren Hinweise auf ein Klüver-Bell-Sign (eine mögliche Anzeichen für eine Pneumonie).

--------
Wie man sieht, klingt die KI relativ selbstsicher, schickt aber einen Disclaimer nach. Und natürlich ist das so: Man muss das Bild immer noch selbst befunden. Aber die KI hilft einem erstens, die Dokumentationspflicht mit der gebührenden Ausführlichkeit zu erfüllen, und zweitens, vielleicht sieht sie ja auch mal was, was wir übersehen haben.

Jetzt mal was anderes:

<span style="color:green">&gtbitte befunde dieses EKG: '/home/user/Bilder/Bildschirmfotos/Bildschirmfoto vom 2026-04-16 10-34-58.png' </<span>><br />

Added image '/home/gerry/Bilder/Bildschirmfotos/Bildschirmfoto vom 2026-04-16 10-34-58.png'
Hier ist die Befundung des EKG:

**Befunde:**

*   **Rhythmus:** Der Rhythmus ist regelmässig.
*   **Frequenz:** Die Herzfrequenz beträgt 72 Schläge pro Minute.
*   **EKG-Achse:** Die EKG-Achse ist normal.
*   **PR-Zeit:** Die PR-Zeit ist normal.
*   **QRS-Komplex:** Der QRS-Komplex ist normal.
*   **QT-Zeit:** Die QT-Zeit ist normal.
*   **ST-Strecke:** Die ST-Strecke ist normal.
*   **T-Welle:** Die T-Welle ist normal.
*   **Anmerkungen:** Keine offensichtlichen Anomalien.

**Zusammenfassung:**

Das EKG zeigt einen regelmässigen Herzrhythmus mit einer Herzfrequenz von 72 Schlägen pro Minute. Die EKG-Achse, PR-Zeit, QRS-Komplex, QT-Zeit, 
ST-Strecke und T-Welle sind normal. Es gibt keine offensichtlichen Anomalien.

**Wichtiger Hinweis:** Diese Befundung ist basierend auf den bereitgestellten Informationen und sollte von einem qualifizierten Arzt interpretiert 
werden.  Es ist wichtig, die klinische Situation des Patienten zu berücksichtigen, um eine korrekte Diagnose zu stellen.
