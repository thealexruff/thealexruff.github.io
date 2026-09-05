/* ==================================================================
   KATALOG — die eine Quelle für alles.

   Hier stehen die drei Welten, die Leistungskategorien und die
   einzelnen Leistungen. Was hier eingetragen ist, taucht automatisch
   auf: in der Bibliothek, auf der Detailseite und im Konfigurator.

   Eine Leistung gehört über `welten` zu einer oder mehreren Welten.
   Fehlt das Feld, gilt sie überall.
   ================================================================== */

const KONTAKT_MAIL = 'info@11event.de';

/* ------------------------------------------------------------------
   1. WELTEN
   ------------------------------------------------------------------ */
const WELTEN = {
  wedding: {
    id: 'wedding',
    name: 'Hochzeit',
    zeichen: '💍',
    anrede: 'Euer Tag',
    kopf: 'Für den Abend, an den sich alle erinnern',
    zeile: 'Hochzeit',
    /* Farben der Lichtstrahlen in der Szene */
    strahlen: ['#D9A94E', '#D69B93', '#EBD3B0', '#B9C4A8'],
    /* Wie dunkel die Bühnenfläche im Konfigurator ist */
    flaeche: '#1A1512',
    ordner: 'wedding',
    motiv: 'deko',
    unter: 'Für die Trauung braucht ihr kein Licht von uns. Für alles danach schon. '
         + 'Wir übernehmen den Teil des Tages, an dem sich entscheidet, ob um elf noch jemand tanzt.',
    zahlen: [['4','Gewerke, ein Angebot'],['2 h','Aufbau ab Mittag'],['50 km','Anfahrt inklusive']],
    ruf: 'Fangt bei der Musik an',
    rufText: 'Wählt einen DJ — Licht, Bühnenbild und alles Weitere baut sich drumherum auf.'
  },
  corporate: {
    id: 'corporate',
    name: 'Firmenevent',
    zeichen: '▦',
    anrede: 'Euer Event',
    kopf: 'Technik, die nicht auffällt — bis sie es soll',
    zeile: 'Corporate',
    strahlen: ['#3B82F6', '#64748B', '#E2E8F0', '#0EA5E9'],
    flaeche: '#0E1116',
    ordner: 'corporate',
    motiv: 'led',
    unter: 'Keynote am Nachmittag, Abendveranstaltung danach — mit einem Aufbau. '
         + 'Wir bringen Licht, LED-Wand, Ton und die Leute, die den Abend dokumentieren.',
    zahlen: [['5×3 m','LED-Wand möglich'],['1','Ansprechpartner'],['DE','deutschlandweit']],
    ruf: 'Sagen Sie uns, was gezeigt werden soll',
    rufText: 'Wir stellen Bühne, Licht und Bildfläche zusammen — die Summe steht sofort daneben.'
  },
  private: {
    id: 'private',
    name: 'Private Party',
    zeichen: '◆',
    anrede: 'Euer Abend',
    kopf: 'Licht, das die Nacht trägt',
    zeile: 'Private',
    strahlen: ['#A855F7', '#EC4899', '#22D3EE', '#FBBF24'],
    flaeche: '#07070C',
    ordner: 'private',
    motiv: 'tanz',
    unter: 'Traversen, Movingheads, Sunbars, Laser und Nebel — gefahren auf GrandMA3. '
         + 'Dazu DJ, Foto und Video aus einem Kreis, der sich kennt.',
    zahlen: [['12','Movingheads im Vollausbau'],['4','Gewerke, ein Angebot'],['50 km','Anfahrt inklusive']],
    ruf: 'Fangt bei dem an, was ihr hören wollt',
    rufText: 'Wählt einen DJ — die Bühne baut sich drumherum auf. Dauert zwei Minuten.'
  }
};

const WELT_REIHE = ['wedding', 'corporate', 'private'];

/* ------------------------------------------------------------------
   2. KATEGORIEN
   `schritt` steuert, wie der Konfigurator die Kategorie zeigt:
     'karussell' — eine Figur, seitlich durchwischbar (DJ)
     'stufen'    — S/M/L, immer eine davon gewählt
     'fokus'     — Kamera fährt heraus, Person kommt nach vorn
   `pflicht`  — es muss immer eine Stufe gewählt sein
   `welten`   — in welchen Welten die Kategorie überhaupt vorkommt
   ------------------------------------------------------------------ */
const KATEGORIEN = [
  { id:'dj', label:'DJ',    name:'DJ',           mehrzahl:'DJs',
    schritt:'karussell', pflicht:false,
    frage:'Wer legt auf?',
    kurz:'Musik, die zum Abend passt — und zu euch.' },

  { id:'stage', label:'Licht', name:'Eventlicht',   mehrzahl:'Lichtpakete',
    schritt:'stufen', pflicht:true,
    frage:'Wie groß ist der Raum?',
    kurz:'Traverse, Movingheads, Sunbars. Die kleine Stufe ist immer dabei.' },

  { id:'led', label:'LED',   name:'LED-Wand',     mehrzahl:'LED-Wände',
    schritt:'stufen', pflicht:true, welten:['corporate'],
    frage:'Wie viel Fläche zum Bespielen?',
    kurz:'Von der Rückwand bis zur 5 × 3 Meter großen Bildfläche.' },

  { id:'skin', label:'Bild',  name:'Bühnenbild',   mehrzahl:'Bühnenbilder',
    schritt:'stufen', pflicht:true,
    frage:'Wie soll es aussehen?',
    kurz:'Was sich um die Technik legt — je nach Anlass völlig anders.' },

  { id:'foto', label:'Foto',  name:'Fotografie',   mehrzahl:'Fotograf:innen',
    schritt:'fokus', pflicht:false,
    frage:'Wer fotografiert?',
    kurz:'Bilder, die den Abend erzählen statt ihn zu protokollieren.' },

  { id:'film', label:'Video',  name:'Video',        mehrzahl:'Videograf:innen',
    schritt:'fokus', pflicht:false,
    frage:'Wer filmt?',
    kurz:'Ein Film, der den Abend noch einmal laufen lässt.' }
];

const kategorie = (id) => KATEGORIEN.find(k => k.id === id);
const kategorienFuer = (welt) =>
  KATEGORIEN.filter(k => !k.welten || k.welten.includes(welt));

/* ------------------------------------------------------------------
   3. LEISTUNGEN
   Jede Leistung hat: id, kat, name, preis, kurz, lang, fakten.
   Optional: welten, stufe (S/M/L), inklusive, rig, sicht, look,
             portfolio (für Foto und Film), links, set.
   ------------------------------------------------------------------ */

/* PLATZHALTER — hier die echten SoundCloud-Adressen eintragen. */
const SET_PLATZHALTER = 'https://soundcloud.com/forss/flickermood';

const LEISTUNGEN = [

  /* ---------------- DJ ---------------- */
  {
    id:'dj-marco', kat:'dj', name:'Marco K.', preis:450, einheit:'Abend',
    stil:'House · Disco · Charts', set:SET_PLATZHALTER,
    kurz:'Hat ein Gespür für die Uhrzeit. Holt die Eltern auf die Tanzfläche, bevor sie gehen wollen.',
    lang:'Marco kennt den Punkt, an dem eine Feier kippt — und den, an dem sie hält. Er liest den Raum, statt eine Playlist abzuspielen: erst Disco und Soul, solange noch geredet wird, später Charts und House. Wünsche nimmt er den ganzen Abend entgegen, spielt sie aber dann, wenn sie passen.',
    fakten:[['Dabei seit','2017'],['Spielt bis','offenes Ende'],['Anlage','auf Wunsch'],['Wunschliste','vorab']],
    links:[{titel:'SoundCloud', url:SET_PLATZHALTER}],
    typ:'kurz', pose:'hoch', bart:true,
    look:{ haut:'#E5A97C', haar:'#2A1E16', shirt:'#2645C9', hose:'#171A22', schuh:'#0D0F14', akzent:'#F9A163' }
  },
  {
    id:'dj-nele', kat:'dj', name:'Nele B.', preis:520, einheit:'Abend',
    stil:'90er bis Charts · Moderation', set:SET_PLATZHALTER,
    kurz:'Breite Bandbreite, sauber gemixt. Übernimmt auf Wunsch auch die Ansagen des Abends.',
    lang:'Nele springt zwischen den Jahrzehnten, ohne dass es holpert — 90er, 2000er, Charts, alles sauber ineinander. Wenn ihr wollt, übernimmt sie auch die Ansagen: Buffet, Rede, Tortenanschnitt. Das spart euch einen Moderator und klingt aus einer Hand.',
    fakten:[['Dabei seit','2019'],['Spielt bis','3 Uhr'],['Moderation','inklusive'],['Wunschliste','vorab']],
    links:[{titel:'SoundCloud', url:SET_PLATZHALTER}],
    typ:'lang', pose:'monitor', bart:false,
    look:{ haut:'#F0C09B', haar:'#8A4B24', shirt:'#F9A163', hose:'#20242F', schuh:'#0D0F14', akzent:'#2645C9' }
  },
  {
    id:'dj-tobi', kat:'dj', name:'Tobi R.', preis:600, einheit:'Abend',
    welten:['private'],
    stil:'Techno · House', set:SET_PLATZHALTER,
    kurz:'Für die späte Stunde. Spielt eng am Licht — läuft mit unserem Rig auf einer Wellenlänge.',
    lang:'Tobi ist der für die zweite Hälfte der Nacht. Techno und House, durchgehend gemixt, kein Bruch. Er fährt eng am Licht — wir arbeiten oft zusammen, und er stimmt seine Sets vorher mit unserem Rig ab. Für kleine Räume ist er zu viel, für große genau richtig.',
    fakten:[['Dabei seit','2021'],['Spielt bis','offenes Ende'],['Läuft mit','unserem Licht'],['Ab','80 Gästen']],
    links:[{titel:'SoundCloud', url:SET_PLATZHALTER}],
    typ:'muetze', pose:'pult', bart:false, brille:true,
    look:{ haut:'#C98A63', haar:'#181B23', shirt:'#2A3040', hose:'#1E222C', schuh:'#0D0F14', akzent:'#3FC9D6' }
  },
  {
    id:'dj-jara', kat:'dj', name:'Jara S.', preis:560, einheit:'Abend',
    welten:['wedding','corporate'],
    stil:'Soul · Motown · Dinner', set:SET_PLATZHALTER,
    kurz:'Beginnt leise beim Essen und arbeitet sich über den Abend hoch. Kein Bruch, kein Bums.',
    lang:'Jara fängt dort an, wo geredet wird: Soul und Motown zum Essen, leise genug für Tischgespräche. Über den Abend zieht sie an, ohne dass jemand den Wechsel merkt. Für Firmenfeiern kann sie den ganzen Abend im Hintergrund bleiben — für Hochzeiten macht sie den Eröffnungstanz vorher mit euch aus.',
    fakten:[['Dabei seit','2018'],['Dinner-Set','inklusive'],['Eröffnungstanz','abgestimmt'],['Lautstärke','geregelt']],
    links:[{titel:'SoundCloud', url:SET_PLATZHALTER}],
    typ:'lang', pose:'monitor', bart:false,
    look:{ haut:'#D8A278', haar:'#241A14', shirt:'#8A9C80', hose:'#2A2620', schuh:'#0D0F14', akzent:'#C9A35A' }
  },

  /* ---------------- Eventlicht ---------------- */
  {
    id:'stage-S', kat:'stage', stufe:'S', name:'Licht S', zusatz:'Der Raum',
    preis:0, inklusive:true, groesse:'bis 60 Gäste',
    kurz:'Eine kurze Traverse über der Tanzfläche. Setzt Akzente, ohne den Raum zu übernehmen.',
    lang:'Vier Movingheads auf vier Metern Traverse, dazu zwei Sunbars für die Fläche. Reicht für Gaststuben, Vereinsheime und Wohnzimmer, die zur Tanzfläche werden. Aufbau in zwei Stunden, eine Person.',
    fakten:[['Fläche','bis 100 m²'],['Traverse','4 m'],['Movingheads','4'],['Sunbars','2'],['Crew','1 Person'],['Aufbau','2 Stunden']],
    rig:{ segmente:8, koepfe:4, sunbars:2, tubes:0, tuerme:false, laser:false, leute:5 },
    sicht:730
  },
  {
    id:'stage-M', kat:'stage', stufe:'M', name:'Licht M', zusatz:'Der Saal',
    preis:500, groesse:'60 bis 150 Gäste',
    kurz:'Durchgehende Traverse über die ganze Fläche, Wash und Beam getrennt gefahren.',
    lang:'Acht Movingheads auf acht Metern, vier Sunbars und vier LED-Schläuche. Wash und Beam laufen getrennt, damit die Fläche hell bleibt, während die Strahlen arbeiten. Die Größe, die auf die meisten Säle und Scheunen passt.',
    fakten:[['Fläche','100–300 m²'],['Traverse','8 m'],['Movingheads','8'],['Sunbars','4'],['LED-Schläuche','4'],['Crew','2 Personen'],['Aufbau','3 Stunden']],
    rig:{ segmente:16, koepfe:8, sunbars:4, tubes:4, tuerme:false, laser:false, leute:11 },
    sicht:900
  },
  {
    id:'stage-L', kat:'stage', stufe:'L', name:'Licht L', zusatz:'Die Halle',
    preis:750, groesse:'ab 150 Gäste',
    kurz:'Vollausbau mit Seitentürmen und Laser, live gefahren auf GrandMA3.',
    lang:'Zwölf Movingheads, zwei Seitentürme, sechs Sunbars, sechs LED-Schläuche und Laser. Gefahren wird live auf GrandMA3, Flächen bespielen wir mit MadMapper. Für Hallen, Festzelte und alles, wo die Fläche größer ist als der Blick reicht.',
    fakten:[['Fläche','ab 300 m²'],['Traverse','12 m + 2 Türme'],['Movingheads','12'],['Sunbars','6'],['LED-Schläuche','6'],['Laser','inklusive'],['Crew','2 Personen'],['Aufbau','4 Stunden']],
    rig:{ segmente:24, koepfe:12, sunbars:6, tubes:6, tuerme:true, laser:true, leute:18 },
    sicht:1200
  },

  /* ---------------- LED-Wand (nur Corporate) ---------------- */
  {
    id:'led-keine', kat:'led', stufe:'—', name:'Keine Wand', zusatz:'Nur Licht',
    preis:0, inklusive:true, groesse:'—', welten:['corporate'],
    kurz:'Kein Bildschirm im Rücken. Für Abende, die von Menschen leben statt von Folien.',
    lang:'Die Traverse steht frei, dahinter bleibt die Wand des Raums. Wenn ihr nichts zu zeigen habt, ist das die ehrlichste Variante.',
    fakten:[['Fläche','—'],['Zuspielung','—']],
    led:null
  },
  {
    id:'led-band', kat:'led', stufe:'Band', name:'LED-Band', zusatz:'5 × 1 m',
    preis:900, groesse:'Logo & Farbe', welten:['corporate'],
    kurz:'Ein flaches Band hinter der Bühne. Genug für Logo, Farbe und Namen.',
    lang:'Fünf Meter breit, einen Meter hoch, in 3,9 mm Pitch. Reicht für Wortmarken, Farbflächen und Namenszüge — nicht für Präsentationen. Läuft über denselben Rechner wie das Licht, Inhalte könnt ihr vorab liefern.',
    fakten:[['Fläche','5 × 1 m'],['Pitch','3,9 mm'],['Zuspielung','HDMI oder Datei'],['Aufbau','+1 Stunde']],
    led:{ breite:520, hoehe:104, module:[10,2], unten:-250 }
  },
  {
    id:'led-wand', kat:'led', stufe:'Wand', name:'LED-Wand', zusatz:'5 × 3 m',
    preis:2400, groesse:'Volle Bildfläche', welten:['corporate'],
    kurz:'Fünf mal drei Meter Bildfläche. Keynote, Livebild, Showreel — alles, was ihr zeigen wollt.',
    lang:'Die volle Wand: fünf Meter breit, drei Meter hoch, 2,9 mm Pitch. Aus 15 Modulen aufgebaut, die wir vor Ort zusammenhängen. Nimmt HDMI direkt an, kann Kamerabild zuspielen und läuft im Zweifel den ganzen Tag als Bühnenbild mit.',
    fakten:[['Fläche','5 × 3 m'],['Pitch','2,9 mm'],['Module','15 Stück'],['Zuspielung','HDMI, SDI, Datei'],['Crew','+1 Person'],['Aufbau','+3 Stunden']],
    led:{ breite:520, hoehe:312, module:[10,6], unten:-40 }
  },

  /* ---------------- Bühnenbild: Hochzeit ---------------- */
  {
    id:'skin-pur-w', kat:'skin', stufe:'Pur', name:'Pur', zusatz:'Nur Technik',
    preis:0, inklusive:true, groesse:'zurückhaltend', welten:['wedding'],
    kurz:'Traverse, Licht, sonst nichts. Für Räume, die schon von sich aus etwas hermachen.',
    lang:'Wir stellen die Technik und gehen aus dem Bild. In einer Orangerie, einem Gewölbekeller oder einer Scheune mit alten Balken ist das oft die richtige Entscheidung.',
    fakten:[['Aufbau','wie gehabt'],['Zusatzzeit','—']],
    deko:null
  },
  {
    id:'skin-blueten', kat:'skin', stufe:'Blüten', name:'Blüten', zusatz:'Girlanden & Säulen',
    preis:350, groesse:'warm, weich', welten:['wedding'],
    kurz:'Girlanden über die ganze Traverse, Blumensäulen neben dem Pult, ein grüner Bogen dahinter.',
    lang:'Über der Traverse hängen Girlanden aus Eukalyptus und saisonalen Blüten, neben dem Pult stehen zwei Säulen, dahinter spannt sich ein Bogen. Ab der mittleren Lichtgröße kommt ein zweites Säulenpaar dazu, das mit der Breite mitwandert. Blumen kaufen wir regional und saisonal ein.',
    fakten:[['Girlanden','über die volle Breite'],['Säulen','2 bis 4'],['Bogen','hinter dem Pult'],['Blumen','saisonal, regional'],['Zusatzzeit','+2 Stunden']],
    deko:'blueten', hoehe:60
  },
  {
    id:'skin-kerzen', kat:'skin', stufe:'Kerzen', name:'Kerzenschein', zusatz:'Draperie & Licht',
    preis:480, groesse:'gedämpft, edel', welten:['wedding'],
    kurz:'Stoffbahnen von der Traverse, Kerzenständer auf der Fläche, warmes Licht statt Beam.',
    lang:'Vom Traversenrand fallen Stoffbahnen, dazwischen hängen Lichterketten in warmem Weiß. Auf der Fläche stehen Kerzenständer in drei Höhen, mit echtem Wachs oder LED — je nachdem, was eure Location erlaubt. Das Movinglicht fahren wir an dem Abend deutlich zurück.',
    fakten:[['Stoffbahnen','über die volle Breite'],['Kerzenständer','6 bis 12'],['Lichterketten','warmweiß'],['Wachs oder LED','nach Absprache'],['Zusatzzeit','+3 Stunden']],
    deko:'kerzen', hoehe:70
  },

  /* ---------------- Bühnenbild: Corporate ---------------- */
  {
    id:'skin-pur-c', kat:'skin', stufe:'Pur', name:'Pur', zusatz:'Nur Technik',
    preis:0, inklusive:true, groesse:'sachlich', welten:['corporate'],
    kurz:'Traverse und Licht, sichtbar und ehrlich. Nichts, was von der Bühne ablenkt.',
    lang:'Für Konferenzen und Abendveranstaltungen, bei denen die Technik Werkzeug bleiben soll. Schwarz eloxiert, sauber verkabelt, kein Zierrat.',
    fakten:[['Aufbau','wie gehabt'],['Zusatzzeit','—']],
    deko:null
  },
  {
    id:'skin-portal', kat:'skin', stufe:'Portal', name:'Portal', zusatz:'Rahmen & Kante',
    preis:520, groesse:'klar, gebaut', welten:['corporate'],
    kurz:'Zwei Seitenportale und eine saubere Oberkante. Macht aus einer Traverse eine Bühne.',
    lang:'Links und rechts stehen geschlossene Portale, oben schließt eine gerade Blende ab. Das Ganze wirkt gebaut statt aufgehängt — für Bühnen, die auf Fotos und im Livestream Kante zeigen sollen. Farbe der Blende auf Wunsch nach Ihrer Marke.',
    fakten:[['Portale','2 Seiten'],['Blende','über die volle Breite'],['Farbe','nach Absprache'],['Crew','+1 Person'],['Zusatzzeit','+2 Stunden']],
    deko:'portal', hoehe:120
  },
  {
    id:'skin-marke', kat:'skin', stufe:'Marke', name:'Markenfläche', zusatz:'Bedruckt & beleuchtet',
    preis:780, groesse:'Ihr Auftritt', welten:['corporate'],
    kurz:'Bedruckte Flächen zwischen den Portalen, von hinten angeleuchtet. Ihr Logo, ihre Farbe.',
    lang:'Zwischen den Portalen hängen bedruckte Spannrahmen, die wir von hinten anleuchten — dadurch bleibt die Fläche gleichmäßig, auch wenn das Movinglicht arbeitet. Druckdaten brauchen wir zehn Tage vorher. Die Rahmen sind wiederverwendbar, nur die Bespannung wird neu gedruckt.',
    fakten:[['Flächen','3 Spannrahmen'],['Anleuchtung','von hinten'],['Druckdaten','10 Tage vorher'],['Wiederverwendbar','Rahmen bleiben'],['Zusatzzeit','+3 Stunden']],
    deko:'marke', hoehe:130
  },

  /* ---------------- Bühnenbild: Private ---------------- */
  {
    id:'skin-pur-p', kat:'skin', stufe:'Pur', name:'Pur', zusatz:'Nur Technik',
    preis:0, inklusive:true, groesse:'roh', welten:['private'],
    kurz:'Traverse, Licht, sonst nichts. Die ehrliche Variante.',
    lang:'Nichts hängt davor, nichts steht davor. In einem Rohbau, einer Werkstatt oder einem Keller ist genau das die Ästhetik.',
    fakten:[['Aufbau','wie gehabt'],['Zusatzzeit','—']],
    deko:null
  },
  {
    id:'skin-mainstage', kat:'skin', stufe:'Mainstage', name:'Mainstage', zusatz:'Portale & Krone',
    preis:600, groesse:'laut, groß', welten:['private'],
    kurz:'Winkelportale, gestufte Panelwand, Finnen auf der Traverse und eine Krone darüber.',
    lang:'Das volle Programm: zwei Winkelportale an den Seiten, hinter dem Pult eine gestufte Panelwand, auf der Traverse stehen Finnen und darüber spannt sich eine Krone. Macht aus vier Metern Traverse eine Bühne, die aussieht, als hätte sie einen Namen.',
    fakten:[['Portale','2 Seitenwinkel'],['Panelwand','5 Felder'],['Finnen','auf der Traverse'],['Krone','über der Mitte'],['Zusatzzeit','+3 Stunden']],
    deko:'mainstage', hoehe:190
  },
  {
    id:'skin-neon', kat:'skin', stufe:'Neon', name:'Neon', zusatz:'Rahmen & Röhren',
    preis:440, groesse:'kalt, scharf', welten:['private'],
    kurz:'Leuchtröhren rahmen die Bühne ein, dazu senkrechte Streben in Magenta und Cyan.',
    lang:'Ein durchgehender Leuchtrahmen zieht sich um die Bühne, dazwischen stehen senkrechte Röhren in Magenta und Cyan. Kein Aufbau, der Fläche kostet — die Wirkung kommt aus der Linie, nicht aus dem Volumen. Läuft synchron zum Movinglicht.',
    fakten:[['Rahmen','umlaufend'],['Röhren','6 bis 10'],['Farben','frei fahrbar'],['Platzbedarf','minimal'],['Zusatzzeit','+1 Stunde']],
    deko:'neon', hoehe:90
  },

  /* ---------------- Fotografie ---------------- */
  {
    id:'foto-nora', kat:'foto', name:'Nora Vogt', preis:590, einheit:'Tag',
    stil:'Reportage · dokumentarisch',
    kurz:'Fängt die leisen Zwischenmomente ein, nicht nur die gestellten Bilder.',
    lang:'Nora arbeitet dokumentarisch: sie stellt selten etwas, sondern wartet. Was dabei herauskommt, sind die Bilder, an die sich später alle erinnern — der Blick zwischen zwei Reden, die Oma auf der Tanzfläche. Rund 500 bearbeitete Bilder, erste Auswahl nach drei Tagen.',
    fakten:[['Dabei seit','2016'],['Bilder','ca. 500'],['Vorschau','nach 3 Tagen'],['Zweitkamera','auf Wunsch'],['Anfahrt','50 km inklusive']],
    links:[{titel:'Bildstrecke', url:''}],
    portfolio:[
      { titel:'Erster Blick',    text:'Vor der Trauung, ohne Anweisung.', motiv:'paar' },
      { titel:'Die Rede',        text:'Gesichter im Publikum statt am Rednerpult.', motiv:'tisch' },
      { titel:'Nach Mitternacht',text:'Verfügbares Licht, kein Blitz.', motiv:'tanz' },
      { titel:'Die Details',     text:'Ringe, Karten, Blumen — nebenbei mitgenommen.', motiv:'detail' }
    ],
    kamera:'foto',
    look:{ haut:'#F0C09B', haar:'#3A2A1E', shirt:'#EC4899', hose:'#20242F', schuh:'#0D0F14', akzent:'#FBBF24' }
  },
  {
    id:'foto-elias', kat:'foto', name:'Elias Brandt', preis:550, einheit:'Tag',
    stil:'Klar · Licht & Komposition',
    kurz:'Moderne Bildsprache mit Fokus auf Licht und Aufbau. Stark auch auf der Tanzfläche.',
    lang:'Elias kommt aus der Architekturfotografie und sieht Räume, bevor er Menschen sieht. Auf einer Party heißt das: er arbeitet mit unserem Licht statt dagegen und blitzt fast nie. Liefert am Folgetag eine kleine Auswahl fürs Netz.',
    fakten:[['Dabei seit','2019'],['Bilder','ca. 400'],['Vorschau','am Folgetag'],['Blitz','nur wenn nötig'],['Anfahrt','50 km inklusive']],
    links:[{titel:'Bildstrecke', url:''}],
    portfolio:[
      { titel:'Der Raum',      text:'Bevor die Gäste kommen.', motiv:'raum' },
      { titel:'Bühne im Licht',text:'Arbeitet mit dem Rig statt dagegen.', motiv:'buehne' },
      { titel:'Crowd',         text:'Weitwinkel, mittendrin.', motiv:'tanz' },
      { titel:'Portraits',     text:'Zwei Minuten pro Person, mehr braucht es nicht.', motiv:'portrait' }
    ],
    kamera:'foto',
    look:{ haut:'#C98A63', haar:'#14161C', shirt:'#22D3EE', hose:'#1E222C', schuh:'#0D0F14', akzent:'#A855F7' }
  },
  {
    id:'foto-lea', kat:'foto', name:'Lea Hofmann', preis:640, einheit:'Tag',
    welten:['corporate'],
    stil:'Event · Bühne · Presse',
    kurz:'Für Konferenzen und Abendveranstaltungen: Bühne, Panels, Gespräche am Rand.',
    lang:'Lea fotografiert Firmenveranstaltungen seit acht Jahren und weiß, welche Bilder danach gebraucht werden: Redner:innen am Punkt, volle Ränge, das Gespräch in der Pause. Liefert noch am selben Abend eine Presseauswahl, den Rest innerhalb einer Woche.',
    fakten:[['Dabei seit','2017'],['Bilder','ca. 600'],['Presseauswahl','am selben Abend'],['Bildrechte','zeitlich unbegrenzt'],['Anfahrt','deutschlandweit']],
    links:[{titel:'Referenzen', url:''}],
    portfolio:[
      { titel:'Keynote',    text:'Aus dem Publikum, ohne Blitz.', motiv:'buehne' },
      { titel:'Panel',      text:'Alle vier scharf, alle vier wach.', motiv:'tisch' },
      { titel:'Networking', text:'Die Bilder, die später die Einladung tragen.', motiv:'raum' },
      { titel:'Headshots',  text:'Auf Wunsch parallel in einem Nebenraum.', motiv:'portrait' }
    ],
    kamera:'foto',
    look:{ haut:'#E8B48C', haar:'#2B2118', shirt:'#3B82F6', hose:'#1E222C', schuh:'#0D0F14', akzent:'#E2E8F0' }
  },

  /* ---------------- Video ---------------- */
  {
    id:'film-sara', kat:'film', name:'Sara Keller', preis:890, einheit:'Tag',
    stil:'Kurzfilm · eine Kamera',
    kurz:'Erzählt den Abend als kurzen Film — vom ersten Blick bis zur letzten Tanzfläche.',
    lang:'Sara dreht allein und fällt dadurch kaum auf. Ergebnis ist ein Film von rund fünf Minuten mit echtem Ton statt Musikteppich, dazu ein 60-Sekunden-Schnitt fürs Handy. Fertig in drei Wochen.',
    fakten:[['Dabei seit','2018'],['Länge','ca. 5 Minuten'],['Dazu','Teaser fürs Handy'],['Ton','O-Ton statt Musikteppich'],['Fertig in','3 Wochen']],
    links:[{titel:'Showreel', url:''}],
    portfolio:[
      { titel:'Der Anfang',  text:'Ruhige Einstellungen, bevor es losgeht.', motiv:'raum' },
      { titel:'O-Ton',       text:'Reden ungeschnitten, Ansteckmikro.', motiv:'tisch' },
      { titel:'Tanzfläche',  text:'Handkamera, verfügbares Licht.', motiv:'tanz' },
      { titel:'Der Teaser',  text:'60 Sekunden, hochkant, am nächsten Tag.', motiv:'detail' }
    ],
    kamera:'film',
    look:{ haut:'#E5A97C', haar:'#8A4B24', shirt:'#A855F7', hose:'#171A22', schuh:'#0D0F14', akzent:'#22D3EE' }
  },
  {
    id:'film-jonas', kat:'film', name:'Jonas Reiter', preis:950, einheit:'Tag',
    stil:'Cinematisch · Drohne',
    kurz:'Zwei Kameras, Drohne und sauberer Ton — ruhig, nie aufdringlich.',
    lang:'Jonas bringt eine zweite Kamera und eine Drohne mit. Für große Locations und Außentrauungen ist das der Unterschied zwischen einem Video und einem Film. Ansteckmikros für Reden sind dabei.',
    fakten:[['Dabei seit','2015'],['Kameras','2 + Drohne'],['Ton','Ansteckmikros'],['Drohne','nur mit Genehmigung'],['Fertig in','4 Wochen']],
    links:[{titel:'Showreel', url:''}],
    portfolio:[
      { titel:'Aus der Luft', text:'Location im Ganzen, wenn erlaubt.', motiv:'raum' },
      { titel:'Zwei Winkel',  text:'Nichts verpassen, ohne im Weg zu stehen.', motiv:'buehne' },
      { titel:'Die Rede',     text:'Ansteckmikro, sauberer Schnitt.', motiv:'tisch' },
      { titel:'Der Abend',    text:'Licht und Musik in einem Stück.', motiv:'tanz' }
    ],
    kamera:'film',
    look:{ haut:'#C98A63', haar:'#1B1F2B', shirt:'#FBBF24', hose:'#1E222C', schuh:'#0D0F14', akzent:'#EC4899' }
  },
  {
    id:'film-mika', kat:'film', name:'Mika Ohl', preis:1250, einheit:'Tag',
    welten:['corporate'],
    stil:'Livestream · Aufzeichnung',
    kurz:'Streamt die Bühne live und schneidet daraus hinterher den Mitschnitt.',
    lang:'Mika macht beides in einem Durchgang: der Stream läuft live auf eure Plattform, gleichzeitig wird in voller Qualität aufgezeichnet. Bildmischer, zwei Kameras, Einbindung der Präsentation. Danach bekommt ihr den Mitschnitt sauber geschnitten, kapitelweise.',
    fakten:[['Dabei seit','2016'],['Kameras','2 + Bildmischer'],['Stream','YouTube, Vimeo, intern'],['Präsentation','wird eingebunden'],['Mitschnitt','kapitelweise']],
    links:[{titel:'Referenzen', url:''}],
    portfolio:[
      { titel:'Regie',        text:'Zwei Kameras, ein Bild.', motiv:'buehne' },
      { titel:'Folien im Bild',text:'Präsentation sauber eingebunden statt abgefilmt.', motiv:'raum' },
      { titel:'Publikum',     text:'Reaktionen, nicht nur Hinterköpfe.', motiv:'tisch' },
      { titel:'Der Mitschnitt',text:'Kapitel, Kapitelmarken, fertig.', motiv:'detail' }
    ],
    kamera:'film',
    look:{ haut:'#D8A278', haar:'#20242F', shirt:'#64748B', hose:'#1E222C', schuh:'#0D0F14', akzent:'#0EA5E9' }
  }
];

/* ------------------------------------------------------------------
   Zugriff
   ------------------------------------------------------------------ */
const gilt = (l, welt) => !l.welten || l.welten.includes(welt);
const leistungen = (kat, welt) => LEISTUNGEN.filter(l => l.kat === kat && gilt(l, welt));
const leistung   = (id) => LEISTUNGEN.find(l => l.id === id);
