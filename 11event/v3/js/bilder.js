/* ==================================================================
   BILDER — flach gezeichnete Motive statt Fotos.

   Solange keine echten Aufnahmen da sind, zeichnen wir. Das bleibt
   ehrlich (niemand hält es für ein Foto) und passt zur Bühne im
   Konfigurator, die ebenfalls flach ist.

   Jedes Motiv nimmt eine Palette entgegen, damit dasselbe Bild in
   allen drei Welten anders aussieht.
   ================================================================== */

const PALETTEN = {
  wedding:   { grund:'#F3EBE0', tief:'#E3D5C3', ton:'#B08D57', ton2:'#D69B93', dunkel:'#3B322A', hell:'#FFFBF5' },
  corporate: { grund:'#E7EDF5', tief:'#D2DCEA', ton:'#2563EB', ton2:'#0EA5E9', dunkel:'#1E293B', hell:'#FFFFFF' },
  private:   { grund:'#14121C', tief:'#1D1930', ton:'#8B5CF6', ton2:'#22D3EE', dunkel:'#07070C', hell:'#F2F1F6' },
  wahl:      { grund:'#131318', tief:'#1B1B23', ton:'#E8955A', ton2:'#C9A35A', dunkel:'#0A0A0C', hell:'#F4F4F6' }
};

const pal = (welt) => PALETTEN[welt] || PALETTEN.private;

/* Ein Rahmen mit Himmel und Boden — die Grundlage aller Motive */
function buehneRahmen(p, inhalt, boden = 74) {
  return `<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="160" height="100" fill="${p.grund}"/>
    <rect y="${boden}" width="160" height="${100 - boden}" fill="${p.tief}"/>
    ${inhalt}
  </svg>`;
}

const MOTIVE = {

  /* Traverse mit Strahlen — das Kernbild */
  buehne(p) {
    let strahlen = '', lampen = '';
    for (let i = 0; i < 6; i++) {
      const x = 26 + i * 21.6;
      strahlen += `<polygon points="${x},22 ${x - 13},74 ${x + 13},74"
                     fill="${i % 2 ? p.ton2 : p.ton}" opacity=".30"/>`;
      lampen += `<rect x="${x - 3}" y="17" width="6" height="6" rx="1.5" fill="${p.dunkel}"/>`;
    }
    return buehneRahmen(p, `
      ${strahlen}
      <rect x="14" y="13" width="132" height="4" fill="${p.dunkel}"/>
      ${lampen}
      <rect x="58" y="58" width="44" height="16" rx="2" fill="${p.dunkel}"/>
      <circle cx="80" cy="52" r="7" fill="${p.dunkel}"/>`);
  },

  /* Tanzfläche voller Leute */
  tanz(p) {
    let leute = '';
    for (let i = 0; i < 11; i++) {
      const x = 10 + i * 14 + ((i * 7) % 5);
      const h = 22 + ((i * 13) % 8);
      const arme = i % 3 === 0;
      leute += `<circle cx="${x}" cy="${76 - h}" r="4.4" fill="${p.dunkel}"/>
                <rect x="${x - 5}" y="${80 - h}" width="10" height="${h}" rx="4" fill="${p.dunkel}"/>`;
      if (arme) leute += `<path d="M ${x - 5} ${80 - h + 4} L ${x - 11} ${72 - h}
                                   M ${x + 5} ${80 - h + 4} L ${x + 11} ${71 - h}"
                            stroke="${p.dunkel}" stroke-width="2.6" stroke-linecap="round"/>`;
    }
    return buehneRahmen(p, `
      <polygon points="80,6 30,74 130,74" fill="${p.ton}" opacity=".26"/>
      <polygon points="48,6 14,74 76,74" fill="${p.ton2}" opacity=".18"/>
      <polygon points="112,6 86,74 148,74" fill="${p.ton2}" opacity=".18"/>
      ${leute}`, 80);
  },

  /* Zwei Menschen nebeneinander */
  paar(p) {
    return buehneRahmen(p, `
      <circle cx="112" cy="30" r="26" fill="${p.ton}" opacity=".2"/>
      <circle cx="66" cy="34" r="8" fill="${p.dunkel}"/>
      <path d="M 54 74 L 54 50 Q 54 42 66 42 Q 78 42 78 50 L 78 74 Z" fill="${p.dunkel}"/>
      <circle cx="92" cy="32" r="8.5" fill="${p.dunkel}"/>
      <path d="M 79 74 L 79 48 Q 79 40 92 40 Q 105 40 105 48 L 105 74 Z" fill="${p.dunkel}"/>
      <path d="M 92 40 L 92 74" stroke="${p.grund}" stroke-width="1.2" opacity=".35"/>`);
  },

  /* Tafel von oben-schräg */
  tisch(p) {
    let gedeck = '';
    for (let i = 0; i < 5; i++) {
      const x = 24 + i * 28;
      gedeck += `<circle cx="${x}" cy="48" r="6" fill="${p.hell}" opacity=".9"/>
                 <rect x="${x - 1.2}" y="34" width="2.4" height="9" rx="1.2" fill="${p.ton}"/>`;
    }
    return buehneRahmen(p, `
      <rect x="10" y="44" width="140" height="30" rx="2" fill="${p.hell}" opacity=".75"/>
      ${gedeck}
      <rect x="10" y="42" width="140" height="3" fill="${p.ton}" opacity=".5"/>`);
  },

  /* Leerer Raum vor dem Aufbau */
  raum(p) {
    return buehneRahmen(p, `
      <rect x="18" y="18" width="124" height="56" fill="${p.tief}" opacity=".6"/>
      <path d="M 18 18 L 44 34 L 44 74 M 142 18 L 116 34 L 116 74 M 44 34 L 116 34"
            stroke="${p.dunkel}" stroke-width="1.6" fill="none" opacity=".55"/>
      <rect x="66" y="46" width="28" height="28" fill="${p.ton}" opacity=".3"/>`);
  },

  /* Nahaufnahme */
  detail(p) {
    return buehneRahmen(p, `
      <circle cx="80" cy="44" r="24" fill="none" stroke="${p.ton}" stroke-width="3"/>
      <circle cx="80" cy="44" r="12" fill="${p.ton}" opacity=".35"/>
      <circle cx="58" cy="26" r="5" fill="${p.ton2}" opacity=".7"/>
      <circle cx="104" cy="62" r="7" fill="${p.ton2}" opacity=".5"/>`, 88);
  },

  /* Portrait */
  portrait(p) {
    return buehneRahmen(p, `
      <circle cx="80" cy="34" r="18" fill="${p.ton}" opacity=".22"/>
      <circle cx="80" cy="36" r="13" fill="${p.dunkel}"/>
      <path d="M 54 88 L 54 68 Q 54 54 80 54 Q 106 54 106 68 L 106 88 Z" fill="${p.dunkel}"/>`, 88);
  },

  /* Kamera / Objektiv */
  kamera(p) {
    return buehneRahmen(p, `
      <rect x="40" y="28" width="80" height="46" rx="6" fill="${p.dunkel}"/>
      <rect x="66" y="20" width="28" height="10" rx="3" fill="${p.dunkel}"/>
      <circle cx="80" cy="51" r="17" fill="${p.grund}"/>
      <circle cx="80" cy="51" r="11" fill="${p.ton}" opacity=".8"/>
      <circle cx="74" cy="45" r="3.5" fill="${p.hell}" opacity=".8"/>
      <rect x="100" y="34" width="12" height="7" rx="2" fill="${p.ton2}"/>`, 82);
  },

  /* LED-Wand */
  led(p) {
    let raster = '';
    for (let y = 0; y < 4; y++)
      for (let x = 0; x < 8; x++)
        raster += `<rect x="${22 + x * 14.6}" y="${16 + y * 12.4}" width="13.4" height="11.2"
                     fill="${(x + y) % 3 === 0 ? p.ton : p.ton2}" opacity="${0.25 + ((x * y) % 4) * 0.14}"/>`;
    return buehneRahmen(p, `
      <rect x="20" y="14" width="120" height="52" fill="${p.dunkel}"/>
      ${raster}
      <rect x="20" y="66" width="120" height="4" fill="${p.dunkel}"/>`);
  },

  /* Plattenspieler */
  dj(p) {
    return buehneRahmen(p, `
      <circle cx="46" cy="46" r="20" fill="${p.dunkel}"/>
      <circle cx="46" cy="46" r="7" fill="${p.ton}"/>
      <circle cx="114" cy="46" r="20" fill="${p.dunkel}"/>
      <circle cx="114" cy="46" r="7" fill="${p.ton}"/>
      <rect x="70" y="34" width="20" height="30" rx="3" fill="${p.dunkel}"/>
      <rect x="74" y="40" width="4" height="16" rx="2" fill="${p.ton2}"/>
      <rect x="82" y="40" width="4" height="16" rx="2" fill="${p.ton2}"/>`, 74);
  },

  /* Blumen / Deko */
  deko(p) {
    let b = '';
    for (let i = 0; i < 7; i++) {
      const x = 22 + i * 19, y = 30 + Math.sin(i) * 7;
      b += `<circle cx="${x}" cy="${y}" r="6" fill="${p.ton2}" opacity=".85"/>
            <ellipse cx="${x - 9}" cy="${y + 5}" rx="7" ry="3.6" fill="${p.ton}" opacity=".6"
              transform="rotate(-20 ${x - 9} ${y + 5})"/>`;
    }
    return buehneRahmen(p, `
      <path d="M 14 18 Q 80 42 146 18" stroke="${p.ton}" stroke-width="2.4" fill="none" opacity=".7"/>
      ${b}
      <rect x="66" y="56" width="28" height="18" rx="2" fill="${p.dunkel}"/>`);
  }
};

/* Öffentlich: bild('tanz','wedding') → SVG-Text */
function bild(motiv, welt) {
  const f = MOTIVE[motiv] || MOTIVE.buehne;
  return f(pal(welt));
}
