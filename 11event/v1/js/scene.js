/* ==================================================================
   SZENE — alles, was auf der Fläche gezeichnet wird.
   Flat Design: Vollflächen, keine Verläufe, wenige Farben.

   Weltkoordinaten:  Boden = y 0,  oben = negativ.
   Eine Figur steht mit den Füßen auf y 0 und ist rund 350 hoch.
   ================================================================== */

const SVGNS = 'http://www.w3.org/2000/svg';

const RUHIG = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const STRAHLFARBEN = ['#F9A163', '#2645C9', '#E0559B', '#3FC9D6'];

const TRAV_Y   = -520;   /* Unterkante Traverse   */
const DJ_LUECKE = 900;   /* Abstand der DJs im Karussell */

/* ---------- kleine Helfer ---------- */
const el = (name, attr = {}, kinder = '') => {
  const a = Object.entries(attr)
    .map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<${name} ${a}>${kinder}</${name}>`;
};

/* SMIL-Animation, wird bei "weniger Bewegung" weggelassen */
function anim(attr) {
  if (RUHIG) return '';
  const a = Object.entries(attr).map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<animateTransform attributeName="transform" repeatCount="indefinite" ${a}/>`;
}
function animAttr(attr) {
  if (RUHIG) return '';
  const a = Object.entries(attr).map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<animate repeatCount="indefinite" ${a}/>`;
}

/* ==================================================================
   FIGUREN
   ================================================================== */

/* Arm: Schulter → Ellbogen → Hand. Ärmel in Shirtfarbe, Unterarm Haut. */
function arm(p, L) {
  const [s, e, h] = p;
  return `
    <path d="M ${s[0]} ${s[1]} L ${e[0]} ${e[1]}" stroke="${L.shirt}" stroke-width="27" stroke-linecap="round" fill="none"/>
    <path d="M ${e[0]} ${e[1]} L ${h[0]} ${h[1]}" stroke="${L.haut}" stroke-width="21" stroke-linecap="round" fill="none"/>
    <circle cx="${h[0]}" cy="${h[1]}" r="12.5" fill="${L.haut}"/>`;
}

function kopfhoerer(L) {
  return `
    <path d="M -46 -300 Q -46 -348 0 -348 Q 46 -348 46 -300"
          stroke="#3A4152" stroke-width="12" fill="none" stroke-linecap="round"/>
    <rect x="-58" y="-308" width="22" height="38" rx="11" fill="#232937"/>
    <rect x="36"  y="-308" width="22" height="38" rx="11" fill="#232937"/>
    <rect x="-53" y="-302" width="8"  height="26" rx="4"  fill="${L.akzent}"/>
    <rect x="45"  y="-302" width="8"  height="26" rx="4"  fill="${L.akzent}"/>`;
}

function figur(dj) {
  const L = dj.look;
  const s = [];

  /* Schatten am Boden */
  s.push(`<ellipse cx="0" cy="2" rx="84" ry="13" fill="#000" opacity=".4"/>`);

  /* Beine + Schuhe */
  s.push(`<rect x="-38" y="-134" width="28" height="134" rx="7" fill="${L.hose}"/>`);
  s.push(`<rect x="10"  y="-134" width="28" height="134" rx="7" fill="${L.hose}"/>`);
  s.push(`<rect x="-46" y="-17"  width="40" height="17"  rx="8" fill="${L.schuh}"/>`);
  s.push(`<rect x="6"   y="-17"  width="40" height="17"  rx="8" fill="${L.schuh}"/>`);

  /* Oberkörper */
  s.push(`<rect x="-50" y="-242" width="100" height="118" rx="19" fill="${L.shirt}"/>`);
  if (dj.typ === 'muetze') {
    s.push(`<rect x="-16" y="-242" width="32" height="70" rx="6" fill="${L.akzent}" opacity=".9"/>`);
  }

  /* Arme */
  if (dj.pose === 'hoch') {
    s.push(arm([[-44,-226],[-78,-176],[-104,-146]], L));
    s.push(arm([[ 44,-226],[ 78,-292],[ 92,-352]], L));
  } else if (dj.pose === 'monitor') {
    /* Hand am Ohrmuschel — die klassische DJ-Haltung */
    s.push(arm([[-44,-226],[-80,-180],[-106,-150]], L));
    s.push(arm([[ 44,-226],[ 78,-258],[ 54,-296]], L));
  } else {
    s.push(arm([[-44,-226],[-82,-186],[-104,-150]], L));
    s.push(arm([[ 44,-226],[ 82,-186],[ 104,-150]], L));
  }

  /* Haare hinten */
  if (dj.typ === 'lang') {
    s.push(`<rect x="-56" y="-320" width="30" height="130" rx="15" fill="${L.haar}"/>`);
    s.push(`<rect x="26"  y="-320" width="30" height="130" rx="15" fill="${L.haar}"/>`);
    s.push(`<circle cx="0" cy="-296" r="47" fill="${L.haar}"/>`);
  } else if (dj.typ === 'kurz') {
    s.push(`<circle cx="0" cy="-296" r="45" fill="${L.haar}"/>`);
  }

  /* Hals + Kopf */
  s.push(`<rect x="-14" y="-256" width="28" height="26" fill="${L.haut}"/>`);
  s.push(`<circle cx="0" cy="-292" r="41" fill="${L.haut}"/>`);

  /* Bart */
  if (dj.bart) {
    s.push(`<path d="M -41 -292 A 41 41 0 0 0 41 -292
                     C 38 -279 23 -270 0 -270 C -23 -270 -38 -279 -41 -292 Z" fill="${L.haar}"/>`);
  }

  /* Gesicht */
  if (dj.brille) {
    s.push(`<rect x="-35" y="-303" width="70" height="21" rx="9" fill="#0E1016"/>`);
    s.push(`<rect x="-35" y="-298" width="70" height="5" fill="${L.akzent}" opacity=".85"/>`);
  } else {
    s.push(`<circle cx="-14" cy="-298" r="4.6" fill="#20242F"/>`);
    s.push(`<circle cx="14"  cy="-298" r="4.6" fill="#20242F"/>`);
    s.push(`<path d="M -9 -281 Q 0 -274 9 -281" stroke="#20242F" stroke-width="4"
                  fill="none" stroke-linecap="round"/>`);
  }

  /* Haare vorne */
  if (dj.typ === 'kurz') {
    s.push(`<path d="M -41 -292 A 41 41 0 0 1 41 -292 L 41 -314 Q 20 -308 0 -312 Q -20 -308 -41 -314 Z" fill="${L.haar}"/>`);
  } else if (dj.typ === 'lang') {
    s.push(`<path d="M -41 -292 A 41 41 0 0 1 41 -292 L 41 -312 Q 6 -304 -8 -312 Q -22 -306 -41 -312 Z" fill="${L.haar}"/>`);
  } else {
    s.push(`<path d="M -43 -302 A 43 43 0 0 1 43 -302 Z" fill="#2E3444"/>`);
    s.push(`<rect x="-47" y="-316" width="94" height="15" rx="7" fill="${L.akzent}"/>`);
  }

  s.push(kopfhoerer(L));
  return s.join('');
}

/* Kopf-Ausschnitt derselben Figur — dient als Porträt im Aufklapper,
   solange es kein echtes Foto gibt. */
function portraetSVG(dj) {
  return `<svg viewBox="-68 -350 136 136" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="0" cy="-282" r="68" fill="${dj.look.akzent}" opacity=".16"/>
    <g>${figur(dj)}</g>
  </svg>`;
}

/* DJ-Pult, steht vor der Figur */
function pult(L) {
  return `
    <circle cx="-96" cy="-156" r="35" fill="#1B1F29"/>
    <circle cx="-96" cy="-156" r="13" fill="${L.akzent}"/>
    <circle cx="96"  cy="-156" r="35" fill="#1B1F29"/>
    <circle cx="96"  cy="-156" r="13" fill="${L.akzent}"/>
    <rect x="-32" y="-182" width="64" height="36" rx="6" fill="#1B1F29"/>
    <rect x="-22" y="-174" width="7" height="20" rx="3.5" fill="${L.akzent}"/>
    <rect x="-6"  y="-174" width="7" height="20" rx="3.5" fill="#3E4657"/>
    <rect x="10"  y="-174" width="7" height="20" rx="3.5" fill="${L.akzent}"/>
    <rect x="-176" y="-150" width="352" height="16" rx="8" fill="#262B37"/>
    <rect x="-168" y="-140" width="336" height="140" rx="6" fill="#171A22"/>
    <rect x="-14" y="-96" width="9" height="46" rx="4.5" fill="#F9A163"/>
    <rect x="5"   y="-96" width="9" height="46" rx="4.5" fill="#F9A163"/>`;
}

/* ==================================================================
   RIG-TEILE
   ================================================================== */

/* Jedes Rig-Teil hat einen festen Schlüssel. Beim Wechsel der Größe
   wird abgeglichen statt neu gebaut: was bleibt, bleibt stehen;
   was dazukommt, plopt auf; was wegfällt, verschwindet.
   Darum sind alle Positionen aus festen Rastern abgeleitet. */

const SEG        = 45;    /* Breite eines Traversenstücks */
const TRAV_HOCH  = 30;    /* Bauhöhe der Traverse         */

/* Plätze wachsen von der Mitte nach außen: Platz k liegt immer dort,
   wo er lag, egal wie viele dazukommen. */
function platz(k, ersterAbstand, luecke) {
  const seite = k % 2 ? 1 : -1;
  return seite * (ersterAbstand + Math.floor(k / 2) * luecke);
}

/* ---------- Traverse: ein Stück ---------- */
function travStueck() {
  let zack = '';
  zack += `<path d="M 0 6 L ${SEG / 2} ${TRAV_HOCH - 6} L ${SEG} 6"
             stroke="#2E3444" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  return `
    <rect x="0" y="0" width="${SEG + 0.5}" height="8" fill="#3A4152"/>
    ${zack}
    <rect x="0" y="${TRAV_HOCH - 8}" width="${SEG + 0.5}" height="8" fill="#3A4152"/>`;
}

function turmStueck() {
  return `
    <rect x="-13" y="0" width="26" height="${-TRAV_Y}" rx="6" fill="#2E3444"/>
    <rect x="-26" y="${-TRAV_Y - 30}" width="52" height="30" rx="6" fill="#3A4152"/>`;
}

/* ---------- Movinghead mit Strahl ---------- */
function kopfStueck(farbe, i) {
  const lang  = TRAV_Y * -1 - TRAV_HOCH;      /* bis zum Boden */
  const dauer = (5.5 + (i % 4) * 1.3).toFixed(1);
  const start = (i % 5) * -1.7;
  return `
    <g>
      ${anim({ type:'rotate', values:'-16;16;-16', dur:`${dauer}s`, begin:`${start}s`,
               calcMode:'spline', keyTimes:'0;0.5;1',
               keySplines:'0.45 0 0.55 1;0.45 0 0.55 1' })}
      <g class="strahl">
        <polygon points="0,26 -78,${lang} 78,${lang}" fill="${farbe}" opacity=".16"/>
        <polygon points="0,26 -26,${lang} 26,${lang}" fill="${farbe}" opacity=".22"/>
      </g>
      <rect x="-13" y="-6" width="26" height="16" rx="4" fill="#2A3040"/>
      <path d="M -15 8 L 15 8 L 11 40 L -11 40 Z" fill="#353C4D"/>
      <ellipse cx="0" cy="40" rx="11" ry="5" fill="${farbe}"/>
    </g>`;
}

function sunbarStueck(farbe, i) {
  return `
    <polygon class="strahl" points="-40,-18 40,-18 0,-430" fill="${farbe}" opacity=".16">
      ${animAttr({ attributeName:'opacity', values:'.07;.2;.07',
                   dur:`${(3.2 + i * 0.7).toFixed(1)}s`, begin:`${-i * 0.9}s` })}
    </polygon>
    <rect x="-40" y="-22" width="80" height="22" rx="5" fill="#242A36"/>
    <rect x="-34" y="-17" width="68" height="12" rx="6" fill="${farbe}"/>`;
}

function tubeStueck(farbe, i) {
  return `
    <rect class="strahl" x="-22" y="-440" width="44" height="380" rx="22" fill="${farbe}" opacity=".10"/>
    <rect x="-6" y="-440" width="12" height="380" rx="6" fill="${farbe}" opacity=".85">
      ${animAttr({ attributeName:'opacity', values:'.35;.9;.35',
                   dur:`${(2.4 + i * 0.5).toFixed(1)}s`, begin:`${-i * 0.6}s` })}
    </rect>`;
}

function laserStueck(halb) {
  let linien = '';
  for (let i = 0; i < 11; i++) {
    const x = -halb - 120 + (i * (halb + 120) * 2) / 10;
    linien += `<line x1="0" y1="-8" x2="${x}" y2="${-TRAV_Y - 30}"
                 stroke="#3FC9D6" stroke-width="2.5" opacity=".3">
                 ${animAttr({ attributeName:'opacity', values:'.05;.4;.05',
                              dur:'2.8s', begin:`${-i * 0.22}s` })}
               </line>`;
  }
  return `<g class="strahl">${linien}</g>`;
}

/* ---------- Publikum ---------- */
function menschStueck(i, skalierung) {
  const dauer = (1.5 + ((i * 13) % 6) * 0.22).toFixed(2);
  const arme = i % 3 === 0
    ? `<path d="M -44 -180 L -74 -258" stroke="#07080C" stroke-width="22" stroke-linecap="round"/>
       <path d="M 44 -180 L 76 -262" stroke="#07080C" stroke-width="22" stroke-linecap="round"/>`
    : `<path d="M -44 -180 L -68 -96" stroke="#07080C" stroke-width="22" stroke-linecap="round"/>
       <path d="M 44 -180 L 68 -96" stroke="#07080C" stroke-width="22" stroke-linecap="round"/>`;
  return `
    <g transform="scale(${skalierung})">
      <g>
        ${anim({ type:'translate', values:'0 0;0 -16;0 0', dur:`${dauer}s`,
                 begin:`${-i * 0.31}s`, calcMode:'spline', keyTimes:'0;0.5;1',
                 keySplines:'0.4 0 0.6 1;0.4 0 0.6 1' })}
        <circle cx="0" cy="-236" r="34" fill="#07080C"/>
        <path d="M -46 0 L -46 -178 Q -46 -206 0 -206 Q 46 -206 46 -178 L 46 0 Z" fill="#07080C"/>
        ${arme}
      </g>
    </g>`;
}

/* ==================================================================
   SKINS — Deko, die sich um das Rig legt.
   Auch hier: feste Schlüssel, damit ein Größenwechsel nur ergänzt.
   ================================================================== */

const GRUEN  = ['#3E6B43', '#4F8351', '#2F5537'];
const BLUETE = ['#F3E4D2', '#E9C7C0', '#F9A163'];

/* ---------- Blüten: Girlande unter einem Traversenstück ---------- */
function girlande(idx) {
  const g = GRUEN[Math.abs(idx) % 3];
  const b = BLUETE[Math.abs(idx * 2) % 3];
  let blaetter = '';
  for (let i = 0; i < 5; i++) {
    const t = (i + 0.5) / 5;
    const x = t * SEG;
    const y = 30 + Math.sin(t * Math.PI) * 26;
    blaetter += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="7.5" ry="4.6"
                   fill="${GRUEN[i % 3]}" transform="rotate(${i % 2 ? 24 : -24} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }
  const bx = SEG / 2, by = 30 + 26;
  return `
    <path d="M 0 30 Q ${SEG / 2} ${30 + 34} ${SEG} 30"
          stroke="${g}" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${blaetter}
    <g transform="translate(${bx} ${by})">
      ${[0, 72, 144, 216, 288].map(a =>
        `<ellipse cx="0" cy="-5.4" rx="3.5" ry="5.4" fill="${b}" transform="rotate(${a})"/>`).join('')}
      <circle cx="0" cy="0" r="2.6" fill="#F9A163"/>
    </g>
    <circle cx="${(SEG * 0.18).toFixed(1)}" cy="${(30 + 20).toFixed(1)}" r="3" fill="#FFE2B8" opacity=".9"/>
    <circle cx="${(SEG * 0.82).toFixed(1)}" cy="${(30 + 20).toFixed(1)}" r="3" fill="#FFE2B8" opacity=".9"/>`;
}

/* Blumensäule neben dem Pult */
function saeule(seite) {
  let busch = '';
  const punkte = [[0,-30,34],[-26,-14,26],[26,-16,26],[-12,-58,25],[16,-56,23],[0,-82,19]];
  punkte.forEach((p, i) => {
    busch += `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="${GRUEN[i % 3]}"/>`;
  });
  let blueten = '';
  [[-20,-40],[18,-34],[-4,-72],[26,-62],[-28,-16]].forEach((p, i) => {
    blueten += `<circle cx="${p[0]}" cy="${p[1]}" r="8" fill="${BLUETE[i % 3]}"/>
                <circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#C9803A"/>`;
  });
  return `
    <path d="M -26 0 L 26 0 L 18 -84 L -18 -84 Z" fill="#2B303C"/>
    <rect x="-32" y="-92" width="64" height="14" rx="6" fill="#39404F"/>
    <g transform="translate(0 -92)">${busch}${blueten}</g>`;
}

/* Grüner Bogen hinter dem Pult */
function bogen(halb) {
  const r = Math.min(halb - 40, 420);
  let blatt = '';
  for (let i = 0; i <= 22; i++) {
    const a = Math.PI * (i / 22);
    const x = -Math.cos(a) * r, y = -Math.sin(a) * r;
    blatt += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="15" ry="8"
                fill="${GRUEN[i % 3]}" transform="rotate(${(a * 180 / Math.PI - 90).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    if (i % 4 === 1) blatt += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7.5" fill="${BLUETE[i % 3]}"/>`;
  }
  return `<path d="M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0" stroke="#33553A"
            stroke-width="7" fill="none"/>${blatt}`;
}

/* ---------- Mainstage ---------- */

/* Winkelportal an einer Seite */
function portal(seite) {
  const s = seite;                        /* -1 links, 1 rechts */
  const h = -TRAV_Y + 60;
  return `
    <g transform="scale(${s} 1)">
      <path d="M 0 0 L 0 ${-h} L 58 ${-h} L 124 ${-h + 108} L 124 ${-h + 218}
               L 80 ${-h + 132} L 80 0 Z" fill="#222B3F"/>
      <path d="M 0 ${-h} L 58 ${-h} L 124 ${-h + 108} L 124 ${-h + 146}
               L 52 ${-h + 26} L 0 ${-h + 26} Z" fill="#2645C9"/>
      <path d="M 8 ${-h + 40} L 46 ${-h + 40} L 46 ${-h + 56} L 8 ${-h + 56} Z" fill="#F9A163"/>
      <path d="M 8 ${-h + 70} L 46 ${-h + 70} L 46 ${-h + 84} L 8 ${-h + 84} Z" fill="#F9A163" opacity=".55"/>
      <rect x="16" y="${-h + 218}" width="58" height="${h - 218}" fill="#1A2130"/>
    </g>`;
}

/* Ein Feld der gestuften Panelwand */
function panel(k) {
  const hoehen = [190, 260, 320, 260, 190];
  const h = hoehen[(k + 2) % 5] || 220;
  const farben = ['#1E2740', '#22305A', '#1A2136'];
  let streifen = '';
  for (let i = 0; i < 4; i++) {
    streifen += `<rect x="-34" y="${-h + 26 + i * (h - 52) / 4}" width="68" height="7" rx="3.5"
                   fill="${i % 2 ? '#2645C9' : '#3FC9D6'}" opacity=".${i % 2 ? '75' : '5'}">
                   ${animAttr({ attributeName:'opacity', values:'.2;.8;.2',
                                dur:`${(2 + i * 0.6).toFixed(1)}s`, begin:`${-k * 0.4 - i * 0.3}s` })}
                 </rect>`;
  }
  return `
    <rect x="-40" y="${-h}" width="80" height="${h}" rx="6" fill="${farben[Math.abs(k) % 3]}"/>
    ${streifen}`;
}

/* Finne, steht auf der Traverse */
function finne(k) {
  const h = 120 + (Math.abs(k) % 2) * 40;
  return `
    <path d="M -26 0 L 26 0 L 10 ${-h} L -10 ${-h} Z" fill="#1B2233"/>
    <path d="M -16 -14 L 16 -14 L 7 ${-h + 16} L -7 ${-h + 16} Z" fill="#2645C9"/>
    <circle cx="0" cy="${-h + 8}" r="6" fill="#F9A163"/>`;
}

/* Krone über der Mitte */
function krone(halb) {
  const b = Math.min(halb * 0.78, 340);
  return `
    <path d="M ${-b} 0 L ${-b * 0.62} -78 L ${-b * 0.2} -112 L 0 -126 L ${b * 0.2} -112
             L ${b * 0.62} -78 L ${b} 0 L ${b * 0.72} 0 L ${b * 0.42} -62
             L 0 -92 L ${-b * 0.42} -62 L ${-b * 0.72} 0 Z" fill="#212A42"/>
    <path d="M ${-b * 0.62} -78 L ${-b * 0.2} -112 L 0 -126 L ${b * 0.2} -112 L ${b * 0.62} -78
             L ${b * 0.52} -70 L 0 -108 L ${-b * 0.52} -70 Z" fill="#F9A163"/>`;
}

/* ==================================================================
   SZENE
   ================================================================== */

class Szene {
  constructor(svg) {
    this.svg = svg;
    this.svg.innerHTML =
      `<g id="lBoden"></g><g id="lRig"></g><g id="lDjs"></g><g id="lVorne"></g>`;
    this.lBoden = svg.querySelector('#lBoden');
    this.lRig   = svg.querySelector('#lRig');
    this.lDjs   = svg.querySelector('#lDjs');
    this.lVorne = svg.querySelector('#lVorne');

    /* Boden und Rückwand einmal und riesig — dann muss nie wieder
       daran gerührt werden, egal wie weit die Kamera herausfährt. */
    this.lBoden.innerHTML = `
      <rect x="-6000" y="-4000" width="12000" height="4000" fill="#101219"/>
      <rect x="-6000" y="0" width="12000" height="3000" fill="#171A22"/>
      <rect x="-6000" y="0" width="12000" height="5" fill="#252A36"/>`;

    this.teile = new Map();     /* Schlüssel -> <g class="teil"> */
    this.basis = 0;             /* welcher DJ steht im Karussell bei x = 0 */

    this.kamera = { x: -320, y: -440, w: 640, h: 540 };
    this.ziel   = { ...this.kamera };
    this.von    = { ...this.kamera };
    this.t0     = 0;
    this.dauer  = 850;
    this.laeuft = false;
  }

  /* ---------- Kamera ---------- */
  setzeKamera(box, sofort = false, dauer = 850) {
    this.ziel = { x: box[0], y: box[1], w: box[2], h: box[3] };
    if (sofort || RUHIG) {
      this.kamera = { ...this.ziel };
      this.laeuft = false;
      this.schreibeKamera();
      return;
    }
    this.von   = { ...this.kamera };
    this.t0    = performance.now();
    this.dauer = dauer;
    if (!this.laeuft) {
      this.laeuft = true;
      requestAnimationFrame((t) => this.schritt(t));
    }
  }

  schritt(jetzt) {
    if (!this.laeuft) return;
    const p = Math.min(1, (jetzt - this.t0) / this.dauer);
    const e = 1 - Math.pow(1 - p, 3);
    for (const k of ['x', 'y', 'w', 'h']) {
      this.kamera[k] = this.von[k] + (this.ziel[k] - this.von[k]) * e;
    }
    this.schreibeKamera();
    if (p < 1) requestAnimationFrame((t) => this.schritt(t));
    else this.laeuft = false;
  }

  schreibeKamera() {
    const k = this.kamera;
    this.svg.setAttribute('viewBox',
      `${k.x.toFixed(1)} ${k.y.toFixed(1)} ${k.w.toFixed(1)} ${k.h.toFixed(1)}`);
  }

  schiebe(x) {
    this.laeuft = false;
    this.kamera.x = x; this.ziel.x = x;
    this.schreibeKamera();
  }

  weltProPixel() { return this.kamera.w / (this.svg.clientWidth || 1); }

  /* ---------- DJ-Karussell ----------
     mitte = der DJ, der bei x = 0 stehen soll. Dadurch bleibt beim
     Zurückgehen derselbe DJ im Bild und die Kamera schwenkt nicht. */
  baueDjs(liste, mitte = 0) {
    this.basis = mitte;
    this.lDjs.innerHTML = liste.map((dj, i) => `
      <g class="dj" data-id="${dj.id}" transform="translate(${(i - mitte) * DJ_LUECKE} 0)">
        <g>${figur(dj)}${pult(dj.look)}</g>
      </g>`).join('');
  }

  djX(i) { return (i - this.basis) * DJ_LUECKE; }

  rahmenFuerDj(i) {
    return this.rahmen(500, this.djX(i), -170, 0.52, 470);
  }

  /* Gewählten in die Mitte, Rest raus */
  waehleDj(index) {
    [...this.lDjs.querySelectorAll('.dj')].forEach((g, i) => {
      if (i === index) g.setAttribute('transform', 'translate(0 0)');
      else g.remove();
    });
    this.basis = index;
  }

  rahmen(hSicht, mitteX = 0, mitteY = -194, anteil = 0.52, hMin = 700) {
    const cw = this.svg.clientWidth  || 640;
    const ch = this.svg.clientHeight || 540;
    let massstab = ch / hSicht;
    massstab = Math.max(massstab, cw / (hSicht * 1.9));
    if (ch / massstab < hMin) massstab = ch / hMin;
    const w = cw / massstab;
    const h = ch / massstab;
    return [mitteX - w / 2, mitteY - h * anteil, w, h];
  }

  /* ==================================================================
     Rig und Deko — abgleichen statt neu bauen
     ================================================================== */

  /* Baut die Wunschliste: Schlüssel -> Bauteil */
  static plan(stage, skin) {
    const wunsch = new Map();
    if (!stage) return wunsch;

    const r    = stage.rig;
    const halb = (r.segmente * SEG) / 2;
    const setz = (key, ebene, x, y, html, art) =>
      wunsch.set(key, { ebene, x, y, html, art });

    /* Traverse in Stücken — S ist die Mitte von M, M die Mitte von L */
    const von = -r.segmente / 2;
    for (let s = von; s < von + r.segmente; s++) {
      setz(`trav${s}`, 'rig', s * SEG, TRAV_Y, travStueck(), 'trav');
    }

    if (r.tuerme) {
      setz('turmL', 'rig', -halb, TRAV_Y, turmStueck(), 'turm');
      setz('turmR', 'rig',  halb, TRAV_Y, turmStueck(), 'turm');
    }

    /* Lampen sitzen auf festen Plätzen — vorhandene rücken nie */
    for (let k = 0; k < r.koepfe; k++) {
      setz(`kopf${k}`, 'rig', platz(k, 45, 90), TRAV_Y + TRAV_HOCH,
           kopfStueck(STRAHLFARBEN[k % 4], k), 'kopf');
    }
    for (let k = 0; k < r.sunbars; k++) {
      setz(`sun${k}`, 'rig', platz(k, 110, 170), 0,
           sunbarStueck(STRAHLFARBEN[k % 4], k), 'sun');
    }
    for (let k = 0; k < r.tubes; k++) {
      setz(`tube${k}`, 'rig', platz(k, 200, 150), 0,
           tubeStueck(STRAHLFARBEN[(k + 1) % 4], k), 'tube');
    }
    if (r.laser) setz('laser', 'rig', 0, TRAV_Y, laserStueck(halb), 'laser');

    /* Publikum verteilt sich über die Breite und rückt beim Wachsen
       auseinander — es bleibt aber dasselbe Publikum. */
    const reihen = Math.ceil(r.leute / 2);
    for (let k = 0; k < r.leute; k++) {
      const seite = k % 2 ? 1 : -1;
      const rang  = Math.floor(k / 2);
      const x = seite * ((rang + 0.5) / reihen) * (halb + 90) + (((k * 37) % 17) - 8);
      const y = 112 + ((k * 23) % 5) * 12;
      const sk = (0.52 + ((k * 17) % 4) * 0.07).toFixed(2);
      setz(`mensch${k}`, 'vorne', Math.round(x), y, menschStueck(k, sk), 'mensch');
    }

    /* ---------- Deko ---------- */
    if (skin && skin.id === 'skin-bluete') {
      for (let s = von; s < von + r.segmente; s++) {
        setz(`deko-gir${s}`, 'rig', s * SEG, TRAV_Y, girlande(s), 'deko');
      }
      setz('deko-bogen', 'rig', 0, -10, bogen(halb), 'deko');
      setz('deko-saeuleL', 'rig', -250, 0, saeule(-1), 'deko');
      setz('deko-saeuleR', 'rig',  250, 0, saeule(1),  'deko');
      /* Ab dem Saal kommt ein zweites Paar dazu, das mit der Breite wandert */
      if (r.segmente >= 16) {
        setz('deko-saeule2L', 'rig', -(halb - 40), 0, saeule(-1), 'deko');
        setz('deko-saeule2R', 'rig',  (halb - 40), 0, saeule(1),  'deko');
      }
    }

    if (skin && skin.id === 'skin-mainstage') {
      setz('deko-portalL', 'rig', -halb - 30, 0, portal(-1), 'deko');
      setz('deko-portalR', 'rig',  halb + 30, 0, portal(1),  'deko');
      for (let k = -2; k <= 2; k++) {
        setz(`deko-panel${k}`, 'rig', k * 88, -6, panel(k), 'deko');
      }
      /* Finnen sitzen auf jedem vierten Traversenstück */
      for (let s = von; s < von + r.segmente; s += 4) {
        setz(`deko-fin${s}`, 'rig', s * SEG + SEG / 2, TRAV_Y, finne(s), 'deko');
      }
      setz('deko-krone', 'rig', 0, TRAV_Y - 6, krone(halb), 'deko');
    }

    return wunsch;
  }

  baueRig(stage, skin) {
    this.abgleichen(Szene.plan(stage, skin));
  }

  rigAbbauen() { this.abgleichen(new Map()); }

  /* Der eigentliche Abgleich */
  abgleichen(wunsch) {
    /* Was nicht mehr gebraucht wird, geht raus */
    for (const [key, g] of [...this.teile]) {
      if (!wunsch.has(key)) {
        this.teile.delete(key);
        const innen = g.firstElementChild;
        if (RUHIG) { g.remove(); continue; }
        innen.setAttribute('class', 'raus');
        setTimeout(() => g.remove(), 280);
      }
    }

    /* Verzögerung nur für das, was wirklich neu ist */
    const BASIS = { trav:0.02, turm:0.10, tube:0.16, sun:0.18, kopf:0.12,
                    laser:0.62, deko:0.24, mensch:0.32 };
    const SCHRITT = { trav:0.012, turm:0.05, tube:0.04, sun:0.04, kopf:0.035,
                      laser:0, deko:0.03, mensch:0.025 };
    const zaehler = {};

    for (const [key, def] of wunsch) {
      const da = this.teile.get(key);
      if (da) {
        /* bleibt stehen — rückt höchstens an seinen neuen Platz */
        da.setAttribute('transform', `translate(${def.x} ${def.y})`);
        continue;
      }
      const n = (zaehler[def.art] = (zaehler[def.art] || 0) + 1) - 1;
      const v = ((BASIS[def.art] || 0.2) + n * (SCHRITT[def.art] || 0.03)).toFixed(3);

      const g = document.createElementNS(SVGNS, 'g');
      g.setAttribute('class', 'teil');
      g.setAttribute('transform', `translate(${def.x} ${def.y})`);
      g.style.setProperty('--v', v);
      g.innerHTML = `<g class="einbau">${def.html}</g>`;
      (def.ebene === 'vorne' ? this.lVorne : this.lRig).appendChild(g);
      this.teile.set(key, g);
    }
  }
}
