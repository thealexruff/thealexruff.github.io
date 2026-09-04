# 11EVENT — v2

Vier Seiten, ein Baukasten.

| Datei | Was |
|-------|-----|
| `index.html` | Startseite Party |
| `hochzeit.html` | Startseite Hochzeit |
| `partner.html` | Partner rund um die Hochzeit |
| `konfigurator.html` | Der Konfigurator. `?welt=hochzeit` schaltet die warme Welt. |

## Zwei Welten

`basis.css` hält alle Farben. Die Hochzeitswelt ist nichts weiter als
`body[data-welt="hochzeit"]` — dort werden dieselben Variablen mit creme,
gold und rosé überschrieben, dazu eine Serifenschrift. Wer eine dritte Welt
will, legt einen weiteren Block an und trägt sie in `WELTEN` in `data.js` ein.

Im Konfigurator bleibt die Fläche auch in der Hochzeitswelt dunkel — Licht
liest sich nur vor Dunkel. Was sich ändert, sind die **Farben der Strahlen**
(`WELTEN.hochzeit.strahlen`): Gold und Rosé statt Neon.

## Idee

Statt einer langen Scrollseite mit vielen Optionen gibt es **eine Fläche**,
die mit der Auswahl wächst:

1. **DJ** — drei flache Figuren, horizontal durchwischbar. Ganz oben steht
   der Name, sonst nichts. Alles Weitere — Porträt, Text, Eckdaten, Links
   und der SoundCloud-Player — steckt hinter "Über …". Beim Blättern
   wechselt der Mix automatisch mit.
2. **Stage** — **S ist immer dabei** (inklusive) und baut sich sofort nach
   der DJ-Wahl um die Figur herum auf: der DJ bleibt stehen, die Kamera
   fährt heraus, die Traverse fliegt ein, die Strahlen gehen einzeln an.
   Rund anderthalb Sekunden. M und L sind Ausbaustufen davon;
   "keine Stage" gibt es nicht.
3. **Skin** — Deko, die sich um das Rig legt. *Pur* ist inklusive,
   *Blüten* hängt Girlanden an die Traverse und stellt Blumensäulen
   und einen Bogen dazu, *Mainstage* baut Winkelportale, eine Panelwand,
   Finnen und eine Krone. Die Kamera fährt für die höheren Aufbauten
   etwas weiter heraus (`hoehe` in `data.js`).
4. **Anfrage** — Formular, öffnet das Mailprogramm mit der Zusammenstellung.

Die Fläche liegt fest im Hintergrund, das Blatt mit den Optionen scrollt
darüber. **Zugeklappt passt alles auf einen Bildschirm — dann scrollt
nichts.** Erst wenn ein Aufklapper den Inhalt über den Rand schiebt,
setzt `scrollPruefen()` in `app.js` `data-scroll="true"` am `<body>` und
das Scrollen geht an. Die Höhen dafür hängen an `--flaeche-h` und der
`min-height` von `.blatt` — wer eine davon ändert, sollte kurz
nachmessen.

Der Warenkorb läuft die ganze Zeit mit: unten als ausklappbares Blatt (mobil),
rechts als Spalte (Desktop).

## Warum das Rig nicht neu gebaut wird

Beim Wechsel der Größe oder des Skins wird **abgeglichen statt neu gebaut**.
Jedes Bauteil hat einen festen Schlüssel (`trav-3`, `kopf7`, `deko-gir2` …).
`Szene.plan()` stellt die Wunschliste auf, `abgleichen()` vergleicht sie mit
dem, was schon steht:

* gleicher Schlüssel → der DOM-Knoten **bleibt** und rückt höchstens an
  seinen neuen Platz (CSS-`transition` auf `transform`),
* neuer Schlüssel → poppt auf, mit kurzer Staffelung nach Bauteil-Art,
* fehlender Schlüssel → fliegt raus.

Damit das aufgeht, sind alle Positionen aus festen Rastern abgeleitet:
Ein Traversenstück ist immer 45 breit, und die kleinere Größe ist immer
die **Mitte** der größeren (8 → 16 → 24 Stücke). Lampenplätze wachsen mit
`platz(k, …)` von der Mitte nach außen, Platz 3 liegt also bei S, M und L
an derselben Stelle. **Wer die Zahlen in `rig` ändert, sollte das
beibehalten** — sonst springt beim Wechsel wieder alles.

Dasselbe beim Zurückgehen zur DJ-Auswahl: die Bühne wird abgebaut, und
das Karussell wird so aufgebaut, dass der gewählte DJ bei x = 0 steht
(`baueDjs(DJS, index)`). Dadurch schwenkt die Kamera nicht zur Seite.

## Ton

Ein einziger SoundCloud-Player (`js/klang.js`), der nie neu erzeugt und nie
im Baum verschoben wird — sonst würde die Musik beim Schrittwechsel abreißen.
Er steckt im Aufklapper unter dem DJ und ist zugeklappt nur verdeckt, nicht
entfernt: die `.klapp`-Technik (`grid-template-rows: 0fr → 1fr`) klappt zu,
ohne den Inhalt aus dem Bau zu nehmen. **Kein `display:none` auf dem
`<iframe>`** — das würde die Musik anhalten.

Beim Blättern durch die DJs startet der neue Mix sofort.

Der große runde Knopf auf der Fläche ist ein **Schalter, kein Pause-Knopf**:
solange stumm an ist, startet auch beim Auswählen eines DJs nichts von allein.
Erst beim Entstummen geht es los.

> **Noch zu tun:** in `js/data.js` steht bei allen drei DJs derselbe
> Platzhalter-Track (`SET_PLATZHALTER`), und bei `links` sind Website
> und Instagram leer. Einträge ohne `url` werden nicht angezeigt —
> einfach eintragen, dann erscheinen sie.
>
> `foto` ist ebenfalls leer. Solange da nichts steht, wird als Porträt
> der Kopf der flachen Figur gezeichnet.

## Dateien

| Datei          | Inhalt |
|----------------|--------|
| `css/basis.css`| **Farben, Schrift, Knöpfe, Leuchten** — beide Welten |
| `css/seite.css`| Landingpages |
| `css/style.css`| Konfigurator, mobile first |
| `js/data.js`   | **Namen, Preise, Texte, Aussehen der Figuren** — hier pflegen |
| `js/scene.js`  | Alles, was gezeichnet wird (Figuren, Rig, Deko, Kamera) |
| `js/klang.js`  | Der eine SoundCloud-Player, Stummschalter |
| `js/listen.js` | Karten der Landingpages, aus denselben Daten |
| `js/seite.js`  | Menü, Einblenden, Vorschaubühne, Partnerfilter |
| `js/app.js`    | Zustand, Schritte, Warenkorb |

Kein Build, keine Abhängigkeiten. Einfach Dateien.

## Preise oder DJs ändern

Nur `js/data.js` anfassen. Preise als reine Zahl, ohne Euro-Zeichen.

Ein neuer DJ braucht:

```js
{ id:'dj-xy', name:'…', preis:0, stil:'…', text:'…',
  set:'https://soundcloud.com/…',   // sein Set
  typ:'kurz'|'lang'|'muetze',      // Kopf
  pose:'hoch'|'monitor'|'pult',    // Arme
  bart:false, brille:false,
  look:{ haut, haar, shirt, hose, schuh, akzent } }
```

## Das Logo

`img/logo-11event.png` ist ein **senkrechtes** Banner mit blauem Grund:
die 11 steht, EVENT liegt. Egal wie man es dreht, eines von beidem liegt
falsch — der v2-Entwurf dreht es um -90° und legt damit die 11 auf die Seite.

Darum: für die Kopfzeile eine eigene waagerechte Sperrung als Inline-SVG
(dieselben Formen, nachgezeichnet) plus „EVENT" als Text. Das Original steht
als Kachel im Fuß, wo sein blauer Grund als Fläche funktioniert.

## Vorschaubühne auf der Startseite

Der Kasten unter „So sieht es aus" ist keine Grafik, sondern dieselbe
`Szene`-Klasse wie im Konfigurator — nur ohne Bedienung. Ändert sich das Rig,
ändert sich das Bild automatisch mit.

## Noch offen

* SoundCloud-Links, Websites und Instagram der Leute (`data.js`, überall `''`).
* Preise für Skin, Foto und Film sind gesetzt, aber nicht abgestimmt.
* Impressum und Datenschutz fehlen.

## Lokal ansehen

```bash
python3 -m http.server 4311
```

## Nach dem Hochladen: Cache

GitHub Pages schickt `Cache-Control: max-age=14400` — der Browser hält
Dateien also bis zu vier Stunden fest. Damit Änderungen sofort ankommen,
hängt an CSS und JS in `index.html` ein `?v=…`. **Nach jeder Änderung
diese Zahl hochzählen.**

Die `index.html` selbst wird ebenfalls gecacht. Wer sofort die neue Version
sehen will, hängt einmal eine beliebige Query an die Adresse:
`…/11event/?neu`
