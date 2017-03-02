---
layout: post
title: asynchroner code
description: Callback, Promise & Co
category: Programmieren allgemein
tags: [JavaScript, TypeScript]
---

Asynchrones Programmieren erhält in Zeiten der Web-Apps immer grössere Bedeutung. Nehmen wir ein einfaches Beispiel:
Eine Anwendung brauche drei von anderswo (z.B. aus einer Datenbank ofer von einem REST Service) zu besorgende Datenelemente,
A, B und C, um eine Anfrage zu beantworten. Dabei sei B von A abhängig, während
C unabhängig besorgt werden kann. Am Ende braucht man aber alle drei. In klassischem, synchronem
Code würde man das ungefähr so machen (Psudocode):

    function fetchABC(){
      a=fetch(A)
      b=fetch(B,a)
      c=fetch(C)
      return {a,b,c}
    }
    
So weit, so einfach und klar. Das funktioniert auch super, wenn die einzelnen "fetch" Zugriffe ausreichend schnell sind.
Doch was, wenn diese Zugriffe übers Internet gehen? Dann verbrät die Anwendung bei jedem fetch() unnötig Zeit damit, auf
jedes Zwischenresultat zu warten, und scheint für den Anwender eingefroren zu sein.

Um das zu verhindern, entwickelte man die TEchnik der asynchronen Programmierung. Da JavaScript als klassische Webapp-Sprache,
die typischerweise single threaded im Browser abläuft, besonders stark mit diesem Problem konfrontiert ist, ist asynchrone
Programmierung in JavaScipt auch am weitesten Verbreitet.

Wir schreiben den Code also so um:

    function fetchABC(callback){
      a=fetch(A)
      b=fetch(B,a)
      c=fetch(C)
      callback({a,b,c})
    }
  
Viel besser. Die Funktion fetchABC kehrt sofort zurück und die Anwendung kann normal weiter laufen. Wenn alle Resultate da sind,
  wird die beim Aufruf angegebene callback-Funktion aufgerufen und die Anwendung kann sich dann um die Wieterverarbeitung kümmern.
  
Aber es ist noch nicht optimal: Das Resultat würde vermutlich schneller vorliegen, wenn man die Zugriffe gleichzeitig statt 
nacheinander ausführen würde. Wenn C und A von unabhängigen Datenquellen bereitgestellt wird, können ja beide Anfragen parallel
bearbeitet werden.

Dann könnte der Code so aussehen:

    function fetchA(callback){
      a=fetch(A)
      callback(A)
    }
    
    function fetchB(a, callback){
      b=fetch(B,a)
      callback(b)
    }
    
    function fetchC(callback){
      c=fetch(C)
      callback(c)
    }
    
    
    function fetchABC(){
      fetchA(callB(result))
    }