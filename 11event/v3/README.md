# 11EVENT — v3

Ein Baukasten, drei Häute, eine Quelle für alle Inhalte.

## Wege durch die Seite

```
/                     Eingang: Karussell mit drei Anlässen
  └ /wedding/         Überblick  ─┐
    /corporate/                   ├─ dieselben vier Seiten,
    /private/                    ─┘  nur anders eingekleidet
       ├ index.html          Überblick über das Angebot
       ├ services.html       Bibliothek, nach Kategorien
       ├ service.html?id=…   Eine Leistung ganz
       └ konfigurator.html   Zusammenstellen und anfragen
```

Die drei Ordner sind bewusst eigenständig — später wird daraus
`wedding.11event.com` und so weiter. Bis dahin holen sie CSS und JS über
`../`; beim Umzug auf Subdomains muss nur dieser Pfad gerade gezogen werden.

## Die eine Quelle: `js/katalog.js`

Hier stehen **Welten, Kategorien und Leistungen**. Alles andere liest daraus:

| Trägt man ein … | … taucht es auf in |
|---|---|
| eine **Leistung** | Bibliothek, eigene Detailseite, passender Schritt im Konfigurator |
| eine **Kategorie** | Übersicht der Landingpage, neue Gruppe in der Bibliothek, **neuer Schritt** im Konfigurator |
| eine **Welt** | Karussell auf der Eingangsseite |

`welten: ['corporate']` an einer Leistung oder Kategorie heißt: gibt es nur
dort. Fehlt das Feld, gilt sie überall. So hat Corporate die LED-Wand und
sonst niemand, und die Blüten-Deko gibt es nur bei Hochzeiten.

Der Konfigurator baut seine Schritte aus `kategorienFuer(welt)` — er kennt
keine feste Reihenfolge. Wer eine siebte Kategorie einträgt, bekommt einen
siebten Schritt, ohne dass `app.js` angefasst werden muss.

### Wie eine Kategorie im Konfigurator auftritt

`schritt` in der Kategorie entscheidet:

* `karussell` — eine Figur, seitlich durchwischbar (DJ)
* `stufen` — S/M/L, immer eine davon gewählt (`pflicht: true`)
* `fokus` — die Person tritt groß nach vorn, die Bühne dahinter wird
  unscharf und läuft weiter (Foto, Video)

## Die drei Häute

Alles Farbige steht in `css/basis.css`, geschaltet über `data-welt` am
`<body>`. Es gibt **keine Standardwelt** — wer eine Seite anlegt, muss sich
entscheiden.

| | Hochzeit | Corporate | Private |
|---|---|---|---|
| Grund | warmweiß | hellgrau-blau | fast schwarz |
| Schrift | Cormorant Garamond | Space Grotesk | Space Grotesk |
| Ecken | 2 px, fast eckig | 10 px | 18–26 px |
| Flächen | weiß, Haarlinie | weiß, feiner Schatten | Glas mit `backdrop-filter` |
| Akzent | Gold | Blau | Violett |
| Knöpfe | gesperrt, versal | eckig | Pille mit Schein |

**Die Bühne wechselt mit.** Jede Welt bringt in `WELTEN.<id>.szene` ihre
eigenen Materialfarben mit — Wand, Boden, Metall, Publikum und die
Deckkraft der Lichtstrahlen. Hochzeit ist die einzige helle Bühne: der Saal
ist creme, und das Licht arbeitet als warme Fläche statt als Strahl im
Dunkeln (`strahlBreit: .30` statt `.16`). Wer eine Welt umfärbt, ändert nur
diesen Block — `scene.js` liest alles über `F`.

## Bilder

Es gibt noch keine Fotos. `js/bilder.js` zeichnet stattdessen flache
Motive, die die Palette der jeweiligen Welt benutzen — dasselbe Motiv sieht
bei Hochzeit anders aus als bei Private. Das bleibt ehrlich (niemand hält es
für ein Foto) und passt zur Bühne, die ebenfalls flach ist.

Sobald echte Aufnahmen da sind: `bild()` in `seite.js` durch `<img>`
ersetzen, die Motiv-Namen bleiben als Sortierung nützlich.

## Der Fokusschritt

`#lTiefe` trägt alles, was unscharf werden darf, `#lFokus` liegt davor.
Der Weichzeichner ist ein CSS-`filter` in Bildschirm-Pixeln — er bleibt
also gleich stark, egal wie weit die Kamera steht, und die SMIL-Animationen
darunter laufen weiter.

Allein steht die Person sehr nah im Bild, Oberkörper aufwärts. Kommt die
zweite dazu, tritt die Kamera einen Schritt zurück und die neue **schiebt
sich von der Seite herein** — wer schon da war, bleibt stehen.
`setzeFokus()` merkt sich dafür in `fokusVorher`, wer zuletzt im Bild war.

## Korb

`js/korb.js` hält die Auswahl in `localStorage`, pro Welt getrennt
(`11event.korb.<welt>`), in derselben Form, die der Konfigurator führt:
`{ kategorie: leistungsId }`.

Dadurch funktioniert die Bibliothek als Warenkorb: Was dort mit
**Hinzufügen** eingesammelt wird, ist im Konfigurator schon ausgewählt —
und was der Konfigurator ändert, steht danach wieder in der Bibliothek.
Beim Laden wirft `Korb.laden()` alles weg, was es nicht mehr gibt oder was
in dieser Welt nicht gilt; sonst hinge nach einer Katalogänderung eine
Leiche im Korb.

Zusätzlich hängt die Auswahl am Link der Korbleiste (`?korb=id,id,…`).
Das macht sie verschickbar — und rettet die Übergabe, falls der Browser
noch eine alte Seite im Speicher hält.

**Anlass wechseln:** Auf der Eingangsseite fragt ein Dialog, ob die
Auswahl mitkommen soll. `Korb.passend(von, nach)` trennt dabei, was in
der Zielwelt gilt, von dem, was es dort nicht gibt (LED-Wand, Blüten,
welt-eigene DJs) — Letzteres wird durchgestrichen angezeigt und fällt
weg. Der alte Korb bleibt unangetastet, man kann also zurück.

## Schrittleiste

Alle Schritte sind Punkte auf gleicher Höhe; nur der aktuelle wird zur
Pille **mit der Beschriftung darin**. Erledigte Punkte sind eingefärbt,
kommende grau. Beim Zeigen (oder per Tastaturfokus) sagt jeder Punkt über
`data-titel`, wofür er steht. Dasselbe auf Handy und Desktop.

**Zurück gibt es nicht mehr als Knopf** — dafür sind die Punkte da.
Weiter sitzt oben rechts neben der Überschrift.

## Bibliothek

Oben ein **Gruppenwähler**, darunter immer nur eine Kategorie. Ein Klick auf
eine Karte öffnet die **volle Vorschau über der Seite** — mit ‹ › zum
Weiterblättern innerhalb der Gruppe, ohne zurückzuspringen. Der Anker
(`#dj/dj-marco`) macht sie verlinkbar.

`service.html` gibt es weiterhin für direkte Links von außen; die Bibliothek
selbst benutzt es nicht mehr.

## Noch offen

* Echte SoundCloud-Adressen, Websites und Bildstrecken (`katalog.js`, überall `''`).
* Preise für LED, Bühnenbilder, Foto und Video sind gesetzt, aber nicht abgestimmt.
* Die Eingangsseite ist absichtlich schlicht — Animationen kommen später.
* Impressum und Datenschutz fehlen.

## Cache

GitHub Pages cacht vier Stunden. An CSS und JS hängt darum ein `?v=…`.
**Nach jeder Änderung hochzählen** (`sed -i '' 's/?v=6"/?v=7"/g' */*.html index.html`).
