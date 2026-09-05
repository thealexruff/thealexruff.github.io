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
* `fokus` — Kamera fährt heraus, Bühne wird unscharf, die Person
  tritt nach vorn (Foto, Video)

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

Die Bühne im Konfigurator bleibt in allen drei Welten dunkel — Licht liest
sich nur vor Dunkel. Was sich ändert, sind die **Farben der Strahlen**
(`WELTEN.<id>.strahlen`) und der Grundton der Fläche (`flaeche`).

## Bilder

Es gibt noch keine Fotos. `js/bilder.js` zeichnet stattdessen flache
Motive, die die Palette der jeweiligen Welt benutzen — dasselbe Motiv sieht
bei Hochzeit anders aus als bei Private. Das bleibt ehrlich (niemand hält es
für ein Foto) und passt zur Bühne, die ebenfalls flach ist.

Sobald echte Aufnahmen da sind: `bild()` in `seite.js` durch `<img>`
ersetzen, die Motiv-Namen bleiben als Sortierung nützlich.

## Tiefenschärfe im Fokusschritt

`#lTiefe` trägt alles, was unscharf werden darf, `#lFokus` liegt davor.
Der Weichzeichner ist ein CSS-`filter` in Bildschirm-Pixeln — er bleibt
also gleich stark, egal wie weit die Kamera herausgefahren ist, und die
SMIL-Animationen darunter laufen weiter.

## Noch offen

* Echte SoundCloud-Adressen, Websites und Bildstrecken (`katalog.js`, überall `''`).
* Preise für LED, Bühnenbilder, Foto und Video sind gesetzt, aber nicht abgestimmt.
* Die Eingangsseite ist absichtlich schlicht — Animationen kommen später.
* Impressum und Datenschutz fehlen.

## Cache

GitHub Pages cacht vier Stunden. An CSS und JS hängt darum ein `?v=…`.
**Nach jeder Änderung hochzählen** (`sed -i '' 's/?v=6"/?v=7"/g' */*.html index.html`).
