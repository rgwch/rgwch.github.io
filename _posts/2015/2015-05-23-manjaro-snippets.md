---
layout: post
title: "Manjaro Snippets"
date: "2015-05-23"
category: linux
tags: [linux,admin]
---
Paket installieren:

    pacman -S <name>   # manjaro repositories
    yaourt -S <name>     # User repositories

System update:

    pacman -Syu

Pacman aufräumen:

    sudo pacman -Rns $(pacman -Qqtd)
    pacman -Sc -> cleanup

Kernel management

    mhwd-kernel -li
