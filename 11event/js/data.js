/* ==================================================================
   INHALTE — hier pflegst du Namen, Preise, Texte und das Aussehen
   der Figuren. Sonst nichts anfassen.
   ================================================================== */

const KONTAKT_MAIL = 'info@11event.de';

/* ---------- 1. DJs ----------
   look:  haut, haar, shirt, hose, schuh, akzent
   typ:   'kurz' | 'lang' | 'muetze'   (Kopf-Variante)
   pose:  'hoch' | 'pult' | 'mikro'    (Arm-Variante)          */
const DJS = [
  {
    id: 'dj-marco', name: 'Marco K.', preis: 450,
    stil: 'House · Disco · Charts',
    text: 'Spielt seit acht Jahren Feiern und hat ein Gespür für die Uhrzeit. Holt die Eltern auf die Tanzfläche, bevor sie gehen wollen.',
    typ: 'kurz', pose: 'hoch', bart: true,
    look: { haut:'#E5A97C', haar:'#2A1E16', shirt:'#2645C9', hose:'#171A22', schuh:'#0D0F14', akzent:'#F9A163' }
  },
  {
    id: 'dj-nele', name: 'Nele B.', preis: 520,
    stil: '90er bis Charts · Moderation',
    text: 'Breite Bandbreite, sauber gemixt, kein Bruch zwischen den Jahrzehnten. Übernimmt auf Wunsch auch die Ansagen des Abends.',
    typ: 'lang', pose: 'monitor', bart: false,
    look: { haut:'#F0C09B', haar:'#8A4B24', shirt:'#F9A163', hose:'#20242F', schuh:'#0D0F14', akzent:'#2645C9' }
  },
  {
    id: 'dj-tobi', name: 'Tobi R.', preis: 600,
    stil: 'Techno · House',
    text: 'Für die späte Stunde. Spielt eng am Licht — läuft mit unserem Rig auf einer Wellenlänge, weil wir oft zusammen arbeiten.',
    typ: 'muetze', pose: 'pult', bart: false, brille: true,
    look: { haut:'#C98A63', haar:'#181B23', shirt:'#2A3040', hose:'#1E222C', schuh:'#0D0F14', akzent:'#3FC9D6' }
  }
];

/* ---------- 2. Eventlicht ---------- */
const LICHT = [
  {
    id: 'licht-S', name: 'S', zusatz: 'Der Raum', gaeste: 'bis 60 Gäste', preis: 250,
    text: 'Eine kurze Traverse über der Tanzfläche. Setzt Akzente, ohne den Raum zu übernehmen.',
    rig: { trav: 200, koepfe: 4, sunbars: 2, tubes: 0, tuerme: false, laser: false, leute: 5 },
    sicht: 730,
    daten: [['Fläche','bis 100 m²'],['Traverse','4 m'],['Movingheads','4'],['Sunbars','2'],['Crew','1 Person']]
  },
  {
    id: 'licht-M', name: 'M', zusatz: 'Der Saal', gaeste: '60 bis 150 Gäste', preis: 500,
    text: 'Durchgehende Traverse über die ganze Fläche, Wash und Beam getrennt gefahren. Passt auf die meisten Säle und Scheunen.',
    rig: { trav: 400, koepfe: 8, sunbars: 4, tubes: 4, tuerme: false, laser: false, leute: 11 },
    sicht: 900,
    daten: [['Fläche','100–300 m²'],['Traverse','8 m'],['Movingheads','8'],['Sunbars','4'],['LED-Schläuche','4'],['Crew','2 Personen']]
  },
  {
    id: 'licht-L', name: 'L', zusatz: 'Die Halle', gaeste: 'ab 150 Gäste', preis: 750,
    text: 'Vollausbau mit Seitentürmen und Laser, live gefahren auf GrandMA3. Für Hallen, Festzelte und große Flächen.',
    rig: { trav: 600, koepfe: 12, sunbars: 6, tubes: 6, tuerme: true, laser: true, leute: 18 },
    sicht: 1120,
    daten: [['Fläche','ab 300 m²'],['Traverse','12 m + 2 Türme'],['Movingheads','12'],['Sunbars','6'],['LED-Schläuche','6'],['Laser','inklusive'],['Crew','2 Personen']]
  }
];

/* ---------- Kommt später: Fotograf, Videograf ---------- */
const BALD = [
  { name: 'Fotograf',  text: 'Kommt als Nächstes dazu.' },
  { name: 'Videograf', text: 'Kommt als Nächstes dazu.' }
];
