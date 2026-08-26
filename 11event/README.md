# 11event — Konfigurator

Erster Baustein der neuen Seite: der Event-Konfigurator.
Die Landingpage kommt später dazu.

## Idee

Statt einer langen Scrollseite mit vielen Optionen gibt es **eine Fläche**,
die mit der Auswahl wächst:

1. **DJ** — drei flache Figuren, horizontal durchwischbar. Wer gewählt wird,
   rückt in die Mitte, die anderen verschwinden.
2. **Licht** — S / M / L bauen sich als Rig *um den DJ herum* auf.
   Traverse, Movingheads, Sunbars, LED-Schläuche, Türme, Laser, Publikum.
   Der Bildausschnitt zoomt mit: die Fläche wird sichtbar größer.
3. **Anfrage** — Formular, öffnet das Mailprogramm mit der Zusammenstellung.

Der Warenkorb läuft die ganze Zeit mit: unten als ausklappbares Blatt (mobil),
rechts als Spalte (Desktop).

## Dateien

| Datei          | Inhalt |
|----------------|--------|
| `index.html`   | Gerüst |
| `css/style.css`| Gestaltung, mobile first |
| `js/data.js`   | **Namen, Preise, Texte, Aussehen der Figuren** — hier pflegen |
| `js/scene.js`  | Alles, was gezeichnet wird (Figuren, Rig, Kamera) |
| `js/app.js`    | Zustand, Schritte, Warenkorb |

Kein Build, keine Abhängigkeiten. Einfach Dateien.

## Preise oder DJs ändern

Nur `js/data.js` anfassen. Preise als reine Zahl, ohne Euro-Zeichen.

Ein neuer DJ braucht:

```js
{ id:'dj-xy', name:'…', preis:0, stil:'…', text:'…',
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
