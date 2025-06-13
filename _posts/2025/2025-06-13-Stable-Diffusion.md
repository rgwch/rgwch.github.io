---
layout: post
title: Stable-Diffusion
date: 2025-06-13
tags: [KI,Bilder]
category: KI 
---

Vielleicht haben die vorherigen Kapitel Sie ja neugierig auf weitere KI-Experimente gemacht. Ein ganz heisser Kandidat für nähere Beschäftigung wird vermutlich Bilderstellung mit KI sein - zumindest, sobald sie einmal hineingeschnuppert haben.
Das Hineinschnuppern ist allerdings nicht ganz einfach, denn die Platzhirsche [ChatGPT 4o](https://chatgpt.com/), [Midjourney](https://www.midjourney.com/explore?tab=top), [Firefly](https://www.adobe.com/ch_de/products/firefly/features/text-to-image.html) und wie sie alle heissen, sind für simples Ausprobierne zu teuer. Sie erlauben zwar kostenlopse Nutzung, aber dann ist die Erstellung der Bilder sehr langsam oder kompliziert oder auf wenige Bilder begrenzt.

Vielleicht erst mal eine Idee, was man zum Beispiel machen kann: Eine Möglichkeit von Bildgeneratoren ist, aus einer Textbeschreibung ein Bild zu machen. Zum Beispiel: 

    a van gogh painting of a tired doctor sitting in front of a computer

![Van Gogh am Cpmputer](/images/vanGogh.png)

Oder:

    a picasso painting of a tired doctor sitting in front of a computer

 ![Picasso](/images/picasso.png)

Sie sehen das Prinzip. Es spielt keine Rolle, dass Van Gogh oder Picasso vermutlich eher keinen Laptop besassen.
Nebst Kopien von Malern kann man auch fotorealistische oder Cartoon-ähnliche oder Anime-ähnliche Bilder einfach nur aus Textbeschreibungen erstellen.

Dies wäre nicht das Amateur-Blog, wenn es hier nicht um eine Möglichkeit ginge, KI-Bilder auf der eigenen Hardware zu erstellen. Ich stelle hier die OpenSource-Lösung [Stable-Diffusion](https://stablediffusionweb.com/de) vor. Und die gute Nachricht ist: Wenn Sie den [letzten Artikeln](/2025/05/LLM4) gefolgt sind, dann haben Sie schon alles, was Sie brauchen. Um Stable-Diffusion lokal laufen zu lassen, benötigen Sie:

* Einen halbwegs modernen Computer mit mindestens 16GB RAM (Mehr ist besser)
* Eine Grafikkarte mit mindestens 8GB RAM (mehr ist besser). Idealerweise mit NVidia RTX-Chip,
* Ein Betriebssystem. auf dem die Programmiersprache Python laufen kann (gilt z.B. für Linux, Mac, Windows) 
* Die Grafik-Treiber von NVidia (geht bei Windows und Mac automatisch, bei Linux braucht es manchmal bei ganz neuen Karten ein wenig Frickelei)
* Das [CUDA](https://developer.nvidia.com/cuda-toolkit) von NVidia, dass zu Grafikkarte und Treiber passt.

Ich schlage vor, das [stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) von AUTOMATIC1111 zu verwenden. Die Installation ist auf der Github-Seite sehr gut erklärt, scrollen Sie einfach zu "Installation and Running" hinunter.

Wenn alles geklappt hat, öffnet sich nach der (Durchaus einige Zeit dauernden) Installation ein Browser-Fenster, das so ähnlich wie dieses aussieht (Wenn nicht, schauen Sie weiter unten unter "Probleme bei der Installation):

![WebUI](/images/webui.png)

Sie erkennen hier ine Menge etwas verwirrende Felder und Einstellmöglichkeiten. Zunächst sehen Sie ganz oben, dass der Browser offenbar die Adresse `http://localhost:7860` geöffnet hat. Das ist darum interessant, weil es bedeutet, dass Sie Stable-Diffusion nicht nur an dem Computer nutzen können, auf dem das Programm läuft, sondern an jedem, der diesen Computer erreichen kann. Wenn Stable-Diffusion 