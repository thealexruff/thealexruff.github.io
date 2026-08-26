/* ==================================================================
   INHALTE — hier pflegst du Namen, Preise, Texte und das Aussehen
   der Figuren. Sonst nichts anfassen.
   ================================================================== */

const KONTAKT_MAIL = 'info@11event.de';

/* ------------------------------------------------------------------
   PLATZHALTER — hier die echten SoundCloud-Links der DJs eintragen.
   Aktuell zeigen alle drei auf denselben Beispiel-Track aus der
   SoundCloud-Doku, damit der Player überhaupt etwas abspielt.
   Format: die normale Track- oder Set-Adresse von soundcloud.com.
   ------------------------------------------------------------------ */
const SET_PLATZHALTER = 'https://soundcloud.com/forss/flickermood';

/* ---------- 1. DJs ----------
   look:   haut, haar, shirt, hose, schuh, akzent
   typ:    'kurz' | 'lang' | 'muetze'    (Kopf-Variante)
   pose:   'hoch' | 'monitor' | 'pult'   (Arm-Variante)
   foto:   Pfad zu einem echten Bild. Leer lassen — dann wird das
           flache Porträt aus der Figur gezeichnet.
   links:  Einträge ohne url werden einfach nicht angezeigt.       */
const DJS = [
  {
    id: 'dj-marco',
    set: SET_PLATZHALTER,
    foto: '',
    lang: 'Marco kennt den Punkt, an dem eine Feier kippt — und den, an dem sie hält. Er liest den Raum, statt eine Playlist abzuspielen: erst Disco und Soul, solange noch geredet wird, später Charts und House. Wünsche nimmt er den ganzen Abend entgegen, spielt sie aber dann, wenn sie passen.',
    fakten: [['Dabei seit','2017'],
              ['Spielt bis','offenes Ende'],
              ['Anlage','auf Wunsch'],
              ['Wunschliste','vorab']],
    links: [
      { titel: 'SoundCloud', url: SET_PLATZHALTER },
      { titel: 'Website',    url: '' },   /* hier eintragen */
      { titel: 'Instagram',  url: '' }    /* hier eintragen */
    ], name: 'Marco K.', preis: 450,
    stil: 'House · Disco · Charts',
    text: 'Spielt seit acht Jahren Feiern und hat ein Gespür für die Uhrzeit. Holt die Eltern auf die Tanzfläche, bevor sie gehen wollen.',
    typ: 'kurz', pose: 'hoch', bart: true,
    look: { haut:'#E5A97C', haar:'#2A1E16', shirt:'#2645C9', hose:'#171A22', schuh:'#0D0F14', akzent:'#F9A163' }
  },
  {
    id: 'dj-nele',
    set: SET_PLATZHALTER,
    foto: '',
    lang: 'Nele springt zwischen den Jahrzehnten, ohne dass es holpert — 90er, 2000er, Charts, alles sauber ineinander. Wenn ihr wollt, übernimmt sie auch die Ansagen: Buffet, Rede, Tortenanschnitt. Das spart euch einen Moderator und klingt aus einer Hand.',
    fakten: [['Dabei seit','2019'],
              ['Spielt bis','3 Uhr'],
              ['Moderation','inklusive'],
              ['Wunschliste','vorab']],
    links: [
      { titel: 'SoundCloud', url: SET_PLATZHALTER },
      { titel: 'Website',    url: '' },   /* hier eintragen */
      { titel: 'Instagram',  url: '' }    /* hier eintragen */
    ], name: 'Nele B.', preis: 520,
    stil: '90er bis Charts · Moderation',
    text: 'Breite Bandbreite, sauber gemixt, kein Bruch zwischen den Jahrzehnten. Übernimmt auf Wunsch auch die Ansagen des Abends.',
    typ: 'lang', pose: 'monitor', bart: false,
    look: { haut:'#F0C09B', haar:'#8A4B24', shirt:'#F9A163', hose:'#20242F', schuh:'#0D0F14', akzent:'#2645C9' }
  },
  {
    id: 'dj-tobi',
    set: SET_PLATZHALTER,
    foto: '',
    lang: 'Tobi ist der für die zweite Hälfte der Nacht. Techno und House, durchgehend gemixt, kein Bruch. Er fährt eng am Licht — wir arbeiten oft zusammen, und er stimmt seine Sets vorher mit unserem Rig ab. Für kleine Räume ist er zu viel, für große genau richtig.',
    fakten: [['Dabei seit','2021'],
              ['Spielt bis','offenes Ende'],
              ['Läuft mit','unserem Licht'],
              ['Ab','80 Gästen']],
    links: [
      { titel: 'SoundCloud', url: SET_PLATZHALTER },
      { titel: 'Website',    url: '' },   /* hier eintragen */
      { titel: 'Instagram',  url: '' }    /* hier eintragen */
    ], name: 'Tobi R.', preis: 600,
    stil: 'Techno · House',
    text: 'Für die späte Stunde. Spielt eng am Licht — läuft mit unserem Rig auf einer Wellenlänge, weil wir oft zusammen arbeiten.',
    typ: 'muetze', pose: 'pult', bart: false, brille: true,
    look: { haut:'#C98A63', haar:'#181B23', shirt:'#2A3040', hose:'#1E222C', schuh:'#0D0F14', akzent:'#3FC9D6' }
  }
];

/* ---------- 2. Stage ----------
   rig.segmente steuert die Breite der Traverse (ein Stück = 45).
   Die Zahlen sind so gewählt, dass die kleinere Größe immer die Mitte
   der größeren ist — nur so kann beim Wechsel stehenbleiben, was schon
   da ist, statt alles neu aufzubauen.                              */
const STAGE = [
  {
    id: 'stage-S', name: 'S', zusatz: 'Der Raum', gaeste: 'bis 60 Gäste',
    preis: 0, inklusive: true,
    text: 'Eine kurze Traverse über der Tanzfläche. Setzt Akzente, ohne den Raum zu übernehmen.',
    rig: { segmente: 8, koepfe: 4, sunbars: 2, tubes: 0, tuerme: false, laser: false, leute: 5 },
    sicht: 730,
    daten: [['Fläche','bis 100 m²'],['Traverse','4 m'],['Movingheads','4'],['Sunbars','2'],['Crew','1 Person']]
  },
  {
    id: 'stage-M', name: 'M', zusatz: 'Der Saal', gaeste: '60 bis 150 Gäste', preis: 500,
    text: 'Durchgehende Traverse über die ganze Fläche, Wash und Beam getrennt gefahren. Passt auf die meisten Säle und Scheunen.',
    rig: { segmente: 16, koepfe: 8, sunbars: 4, tubes: 4, tuerme: false, laser: false, leute: 11 },
    sicht: 900,
    daten: [['Fläche','100–300 m²'],['Traverse','8 m'],['Movingheads','8'],['Sunbars','4'],['LED-Schläuche','4'],['Crew','2 Personen']]
  },
  {
    id: 'stage-L', name: 'L', zusatz: 'Die Halle', gaeste: 'ab 150 Gäste', preis: 750,
    text: 'Vollausbau mit Seitentürmen und Laser, live gefahren auf GrandMA3. Für Hallen, Festzelte und große Flächen.',
    rig: { segmente: 24, koepfe: 12, sunbars: 6, tubes: 6, tuerme: true, laser: true, leute: 18 },
    sicht: 1200,
    daten: [['Fläche','ab 300 m²'],['Traverse','12 m + 2 Türme'],['Movingheads','12'],['Sunbars','6'],['LED-Schläuche','6'],['Laser','inklusive'],['Crew','2 Personen']]
  }
];

/* ---------- 3. Skin ----------
   Deko, die sich um das Rig legt. hoehe = wie viel weiter die Kamera
   herausfahren muss, damit die Aufbauten ins Bild passen.          */
const SKINS = [
  {
    id: 'skin-pur', name: 'Pur', zusatz: 'Nur Technik', gaeste: 'immer dabei',
    preis: 0, inklusive: true, hoehe: 0,
    text: 'Traverse, Licht, sonst nichts. Die ehrliche Variante — passt in Räume, die schon von sich aus etwas hermachen.',
    daten: [['Aufbau','wie gehabt'],['Zusatzzeit','—']]
  },
  {
    id: 'skin-bluete', name: 'Blüten', zusatz: 'Hochzeit & Sommerfest', gaeste: 'warm, weich',
    preis: 350, hoehe: 60,
    text: 'Girlanden über die ganze Traverse, zwei Blumensäulen neben dem Pult und ein grüner Bogen dahinter. Dazu warmes Licht statt kaltem Beam.',
    daten: [['Girlanden','über die volle Breite'],['Säulen','2 Stück'],['Bogen','hinter dem Pult'],['Blumen','saisonal, regional'],['Zusatzzeit','2 Stunden Aufbau']]
  },
  {
    id: 'skin-mainstage', name: 'Mainstage', zusatz: 'Festival im Kleinen', gaeste: 'laut, groß',
    preis: 600, hoehe: 190,
    text: 'Winkelportale an beiden Seiten, eine gestufte Panelwand hinter dem DJ, Finnen auf der Traverse und eine Krone darüber. Macht aus einer Traverse eine Bühne.',
    daten: [['Portale','2 Seitenwinkel'],['Panelwand','5 Felder'],['Finnen','auf der Traverse'],['Krone','über der Mitte'],['Zusatzzeit','3 Stunden Aufbau']]
  }
];

/* ---------- Kommt später: Fotograf, Videograf ---------- */
const BALD = [
  { name: 'Fotograf',  text: 'Kommt als Nächstes dazu.' },
  { name: 'Videograf', text: 'Kommt als Nächstes dazu.' }
];
