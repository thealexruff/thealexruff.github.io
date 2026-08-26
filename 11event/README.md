# 11event — Konfigurator

Erster Baustein der neuen Seite: der Event-Konfigurator.
Die Landingpage kommt später dazu.

## Idee

Statt einer langen Scrollseite mit vielen Optionen gibt es **eine Fläche**,
die mit der Auswahl wächst:

1. **DJ** — drei flache Figuren, horizontal durchwischbar. Zu jedem läuft
   sein SoundCloud-Set im Player darunter. Wer gewählt wird, rückt in die
   Mitte, die anderen verschwinden — und die Musik startet.
2. **Licht** — **S ist immer dabei** (inklusive) und baut sich sofort nach
   der DJ-Wahl um die Figur herum auf. M und L sind Ausbaustufen davon;
   "kein Licht" gibt es nicht. Der Bildausschnitt zoomt mit: die Fläche
   wird sichtbar größer.
3. **Anfrage** — Formular, öffnet das Mailprogramm mit der Zusammenstellung.

Die Fläche liegt fest im Hintergrund, das Blatt mit den Optionen scrollt
darüber. Jede Karte zeigt nur das Nötige; Details stehen hinter
"Was ist dabei?" bzw. "Über …".

Der Warenkorb läuft die ganze Zeit mit: unten als ausklappbares Blatt (mobil),
rechts als Spalte (Desktop).

## Ton

Ein einziger SoundCloud-Player (`js/klang.js`), der nie neu erzeugt und nie
im Baum verschoben wird — sonst würde die Musik beim Schrittwechsel abreißen.
Sichtbar ist er nur im DJ-Schritt, weiter läuft er trotzdem.

Der große runde Knopf auf der Fläche ist ein **Schalter, kein Pause-Knopf**:
solange stumm an ist, startet auch beim Auswählen eines DJs nichts von allein.
Erst beim Entstummen geht es los.

> **Noch zu tun:** in `js/data.js` steht bei allen drei DJs derselbe
> Platzhalter-Track (`SET_PLATZHALTER`). Da gehören die echten
> SoundCloud-Adressen der DJs hin.

## Dateien

| Datei          | Inhalt |
|----------------|--------|
| `index.html`   | Gerüst |
| `css/style.css`| Gestaltung, mobile first |
| `js/data.js`   | **Namen, Preise, Texte, Aussehen der Figuren** — hier pflegen |
| `js/scene.js`  | Alles, was gezeichnet wird (Figuren, Rig, Kamera) |
| `js/klang.js`  | Der eine SoundCloud-Player, Stummschalter |
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

## Später

Fotograf und Videograf kommen als weitere Schritte dazu — die Struktur
in `data.js` und `app.js` ist dafür schon angelegt.

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
