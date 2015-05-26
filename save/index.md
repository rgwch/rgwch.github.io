---
layout: page
title: Willkommen bei 'ohne Titel'
tagline: Webelexis und Anderes.
---
{% include JB/setup %}

Ein Notizbuch ohne viel Struktur.

Erstmal die Einträge..

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

Dann die Theorie, falls sich jemand dafür interessiert...

Das ist ein simples statisches Blog, erstellt mit [Jekyll Bootstrap](http://jekyllbootstrap.com/usage/jekyll-quick-start.html)

Der Trend bei Publikationssoftware geht ja zu immer komplexeren Framworks. Das Aufsetzen von Wordpress&Co ist alles Andere als trivial, und man braucht nicht nur einen Webserver, der dynamischen content erstellen kann, sondern auch eine Datenbank. Okay, beides ist heutzutage in den meisten Hosting Angeboten drin, aber schon allein die Fragen "Was muss jetzt alles ins Backup?" und "Wie geht ein Restore aus dem Backup?" können unsereinen als Hobby-Webhoster durchaus überfordern.

Jekyll geht einen anderen Weg: Die Seiten werden einfach als Markdown-Files erstellt. Jekyll kompiliert sie, baut sie ins gewählte Theme ein und fertig ist die rein statische Website. Sie braucht nur einen sehr simplen Webserver, zum Beispiel den, der in Jekyll eingebaut ist: `jekyll serve`genügt.

Und jekyll bootstrap stellt alles zusammen, was man zum Start braucht. Man erhält ein GitHub- Repository, welches zufällig gleichzeitig ein Blog (oder eine Website) ist. Backup ist nicht nötig, da man mit `git clone`sowieso eine Kopie auf dem eigenen Computer bekommt. Und posten bedeutet einfach: Neue Seite erstellen, `git commit`, `git push`, fertig. Also die Abläufe, die wir als Entwickler sowieso blind tippen können :)




## Einträge erstellen

(Memo für mich)

`rake post title=<title> [tags=<tags>] [category=<category>]`

Oder natürlich einfach mit dem Jekyll-Package für [Atom](http://www.atom.io).
