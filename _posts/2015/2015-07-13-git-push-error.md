---
layout: post
title: Git Error 411
description: 
category: tips/tricks
tags: [git, lighttpd]
---

Git meldet beim Push folgendes:

    $> git push origin master
    Counting objects: 117, done.
    Delta compression using up to 8 threads.
    Compressing objects: 100% (103/103), done.
    error: RPC failed; result=22, HTTP code = 411
    fatal: The remote end hung up unexpectedly

Tja, was nun?

Wenn man Zugriff auf den Server hat, kann man das Server log anschauen:

    2015-07-13 15:21:44: (request.c.1125) POST-request, but content-length missing -> 411 

Tja, was nun?

Google hilft, aber nur mit den exakt richtigen Suchbegriffen...

Kurz: Folgendes muss man beim git repository eingeben:

    `git config http.postBuffer 524288000`
    
Dann klappt's auch mit dem Pushen.

