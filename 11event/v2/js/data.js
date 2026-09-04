/* ==================================================================
   INHALTE — hier pflegst du Namen, Preise, Texte und das Aussehen
   der Figuren. Sonst nichts anfassen.
   ================================================================== */

const KONTAKT_MAIL = 'info@11event.de';

/* ------------------------------------------------------------------
   ZWEI WELTEN
   Dieselbe Technik, zwei Anlässe. Was sich unterscheidet, steht hier —
   alles andere teilen sich beide Seiten.
   ------------------------------------------------------------------ */
const WELTEN = {
  party: {
    id: 'party',
    label: 'Party',
    andere: { label: 'Hochzeit', zeichen: '💍', url: 'hochzeit.html' },
    start: 'index.html',
    /* Farben der Lichtstrahlen — kalt und bunt */
    strahlen: ['#A855F7', '#EC4899', '#22D3EE', '#FBBF24'],
    anrede: 'Euer Abend'
  },
  hochzeit: {
    id: 'hochzeit',
    label: 'Hochzeit',
    andere: { label: 'Party', zeichen: '🔊', url: 'index.html' },
    start: 'hochzeit.html',
    /* warm, gold, kein Neon */
    strahlen: ['#FBBF24', '#CD8F88', '#E8C7A0', '#C9A35A'],
    anrede: 'Euer Tag'
  }
};

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

/* ---------- 4. Fotograf:innen ----------
   Optional — anders als Stage und Skin darf hier auch nichts stehen. */
const FOTO = [
  {
    id: 'foto-nora', name: 'Nora Vogt', preis: 590, einheit: 'Tag',
    stil: 'Reportage · dokumentarisch',
    text: 'Fängt die leisen Zwischenmomente ein, nicht nur die gestellten Bilder.',
    lang: 'Nora arbeitet dokumentarisch: sie stellt selten etwas, sondern wartet. Was dabei herauskommt, sind die Bilder, an die sich später alle erinnern — der Blick zwischen zwei Reden, die Oma auf der Tanzfläche. Rund 500 bearbeitete Bilder, erste Auswahl nach drei Tagen.',
    fakten: [['Dabei seit','2016'],['Bilder','ca. 500'],['Vorschau','nach 3 Tagen'],['Zweitkamera','auf Wunsch']],
    links: [{ titel: 'Bildstrecke', url: '' }],
    kamera: 'foto',
    look: { haut:'#F0C09B', haar:'#3A2A1E', shirt:'#EC4899', hose:'#20242F', schuh:'#0D0F14', akzent:'#FBBF24' }
  },
  {
    id: 'foto-elias', name: 'Elias Brandt', preis: 550, einheit: 'Tag',
    stil: 'Klar · Licht & Komposition',
    text: 'Moderne Bildsprache mit Fokus auf Licht und Aufbau. Stark auch auf der Tanzfläche.',
    lang: 'Elias kommt aus der Architekturfotografie und sieht Räume, bevor er Menschen sieht. Auf einer Party heißt das: er arbeitet mit unserem Licht statt dagegen und blitzt fast nie. Liefert am Folgetag eine kleine Auswahl fürs Netz.',
    fakten: [['Dabei seit','2019'],['Bilder','ca. 400'],['Vorschau','am Folgetag'],['Blitz','nur wenn nötig']],
    links: [{ titel: 'Bildstrecke', url: '' }],
    kamera: 'foto',
    look: { haut:'#C98A63', haar:'#14161C', shirt:'#22D3EE', hose:'#1E222C', schuh:'#0D0F14', akzent:'#A855F7' }
  }
];

/* ---------- 5. Videograf:innen ---------- */
const FILM = [
  {
    id: 'film-sara', name: 'Sara Keller', preis: 890, einheit: 'Tag',
    stil: 'Kurzfilm · eine Kamera',
    text: 'Erzählt eure Feier als kurzen Film — vom ersten Blick bis zur letzten Tanzfläche.',
    lang: 'Sara dreht allein und fällt dadurch kaum auf. Ergebnis ist ein Film von rund fünf Minuten mit echtem Ton statt Musikteppich, dazu ein 60-Sekunden-Schnitt fürs Handy. Fertig in drei Wochen.',
    fakten: [['Dabei seit','2018'],['Länge','ca. 5 Minuten'],['Dazu','Teaser fürs Handy'],['Fertig in','3 Wochen']],
    links: [{ titel: 'Showreel', url: '' }],
    kamera: 'film',
    look: { haut:'#E5A97C', haar:'#8A4B24', shirt:'#A855F7', hose:'#171A22', schuh:'#0D0F14', akzent:'#22D3EE' }
  },
  {
    id: 'film-jonas', name: 'Jonas Reiter', preis: 950, einheit: 'Tag',
    stil: 'Cinematisch · Drohne',
    text: 'Zwei Kameras, Drohne und sauberer Ton — ruhig, nie aufdringlich.',
    lang: 'Jonas bringt eine zweite Kamera und eine Drohne mit. Für große Locations und Außentrauungen ist das der Unterschied zwischen einem Video und einem Film. Ansteckmikros für Reden sind dabei.',
    fakten: [['Dabei seit','2015'],['Kameras','2 + Drohne'],['Ton','Ansteckmikros'],['Fertig in','4 Wochen']],
    links: [{ titel: 'Showreel', url: '' }],
    kamera: 'film',
    look: { haut:'#C98A63', haar:'#1B1F2B', shirt:'#FBBF24', hose:'#1E222C', schuh:'#0D0F14', akzent:'#EC4899' }
  }
];

/* ---------- Partner (nur in der Hochzeitswelt) ---------- */
const PARTNER_FACH = {
  planner: 'Hochzeitsplaner:in',
  redner:  'Trauredner:in',
  blumen:  'Blumenausstatter',
  raum:    'Raumausstatter'
};

const PARTNER = [
  { id:'planner-anna', fach:'planner', name:'Anna Reimers Weddings', kuerzel:'AR', url:'',
    text:'Plant eure Hochzeit von der ersten Idee bis zum letzten Tanz – organisiert, ruhig und mit Liebe zum Detail.' },
  { id:'planner-hochzeitswerk', fach:'planner', name:'Hochzeitswerk Studio', kuerzel:'HW', url:'',
    text:'Full-Service-Planung für Paare, die sich auf den Tag statt auf die Logistik konzentrieren wollen.' },
  { id:'redner-tom', fach:'redner', name:'Tom Vogel', kuerzel:'TV', url:'',
    text:'Freie Trauungen mit persönlichen Geschichten statt Floskeln – emotional, humorvoll, nie kitschig.' },
  { id:'redner-mara', fach:'redner', name:'Mara Lindqvist', kuerzel:'ML', url:'',
    text:'Zweisprachige Traureden für internationale Paare und Familien.' },
  { id:'blumen-bluetenwerk', fach:'blumen', name:'Blütenwerk', kuerzel:'BW', url:'',
    text:'Florale Konzepte von der Brautstraußschleife bis zur Traubogen-Installation, saisonal und regional.' },
  { id:'blumen-feldblume', fach:'blumen', name:'Feldblume Floristik', kuerzel:'FF', url:'',
    text:'Wilde, natürliche Blumenarrangements für Boho- und Gartenhochzeiten.' },
  { id:'raum-kerzenlicht', fach:'raum', name:'Kerzenlicht Manufaktur', kuerzel:'KM', url:'',
    text:'Kerzen, Deko und Lichtkonzepte für Tafeln und Zeremonien – warm und stimmungsvoll.' },
  { id:'raum-tafelgold', fach:'raum', name:'Tafelgold Raumausstattung', kuerzel:'TG', url:'',
    text:'Tischwäsche, Möblierung und Lounge-Setups für Zeremonie, Dinner und Party.' }
];
