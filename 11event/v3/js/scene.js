/* ==================================================================
   SZENE — alles, was auf der Fläche gezeichnet wird.
   Flat Design: Vollflächen, keine Verläufe, wenige Farben.

   Weltkoordinaten:  Boden = y 0,  oben = negativ.
   Eine Figur steht mit den Füßen auf y 0 und ist rund 350 hoch.
   ================================================================== */

const SVGNS = 'http://www.w3.org/2000/svg';

const RUHIG = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Farben der Lichtstrahlen. Hängt an der Welt: Party bunt, Hochzeit warm. */
let STRAHLFARBEN = WELTEN.private.strahlen;

/* Materialfarben der Bühne. Bei Hochzeiten ist der Saal hell — dann
   arbeitet das Licht als warme Fläche statt als Strahl im Dunkeln. */
let F = WELTEN.private.szene;

function setzeWeltFarben(welt) {
  const w = WELTEN[welt] || WELTEN.private;
  STRAHLFARBEN = w.strahlen;
  F = w.szene;
}

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
  s.push(`<ellipse cx="0" cy="2" rx="84" ry="13" fill="#000" opacity="${F.strahlBreit > .2 ? .12 : .4}"/>`);

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
    <circle cx="-96" cy="-156" r="35" fill="${F.pultTief}"/>
    <circle cx="-96" cy="-156" r="13" fill="${L.akzent}"/>
    <circle cx="96"  cy="-156" r="35" fill="${F.pultTief}"/>
    <circle cx="96"  cy="-156" r="13" fill="${L.akzent}"/>
    <rect x="-32" y="-182" width="64" height="36" rx="6" fill="${F.pultTief}"/>
    <rect x="-22" y="-174" width="7" height="20" rx="3.5" fill="${L.akzent}"/>
    <rect x="-6"  y="-174" width="7" height="20" rx="3.5" fill="#3E4657"/>
    <rect x="10"  y="-174" width="7" height="20" rx="3.5" fill="${L.akzent}"/>
    <rect x="-176" y="-150" width="352" height="16" rx="8" fill="${F.pultTief}"/>
    <rect x="-168" y="-140" width="336" height="140" rx="6" fill="${F.pult}"/>
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
             stroke="${F.metallHell}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  return `
    <rect x="0" y="0" width="${SEG + 0.5}" height="8" fill="${F.metall}"/>
    ${zack}
    <rect x="0" y="${TRAV_HOCH - 8}" width="${SEG + 0.5}" height="8" fill="${F.metall}"/>`;
}

function turmStueck() {
  return `
    <rect x="-13" y="0" width="26" height="${-TRAV_Y}" rx="6" fill="${F.metallHell}"/>
    <rect x="-26" y="${-TRAV_Y - 30}" width="52" height="30" rx="6" fill="${F.metall}"/>`;
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
        <polygon points="0,26 -78,${lang} 78,${lang}" fill="${farbe}" opacity="${F.strahlBreit}"/>
        <polygon points="0,26 -26,${lang} 26,${lang}" fill="${farbe}" opacity="${F.strahlKern}"/>
      </g>
      <rect x="-13" y="-6" width="26" height="16" rx="4" fill="${F.dunkel}"/>
      <path d="M -15 8 L 15 8 L 11 40 L -11 40 Z" fill="${F.metall}"/>
      <ellipse cx="0" cy="40" rx="11" ry="5" fill="${farbe}"/>
    </g>`;
}

function sunbarStueck(farbe, i) {
  return `
    <polygon class="strahl" points="-40,-18 40,-18 0,-430" fill="${farbe}" opacity="${F.strahlBreit}">
      ${animAttr({ attributeName:'opacity', values:`${(F.strahlBreit*0.45).toFixed(2)};${(F.strahlBreit*1.3).toFixed(2)};${(F.strahlBreit*0.45).toFixed(2)}`,
                   dur:`${(3.2 + i * 0.7).toFixed(1)}s`, begin:`${-i * 0.9}s` })}
    </polygon>
    <rect x="-40" y="-22" width="80" height="22" rx="5" fill="${F.dunkel}"/>
    <rect x="-34" y="-17" width="68" height="12" rx="6" fill="${farbe}"/>`;
}

function tubeStueck(farbe, i) {
  return `
    <rect class="strahl" x="-22" y="-440" width="44" height="380" rx="22" fill="${farbe}" opacity="${(F.strahlBreit*0.7).toFixed(2)}"/>
    <rect x="-6" y="-440" width="12" height="380" rx="6" fill="${farbe}" opacity="${F.tube}">
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

/* ---------- Fotograf:in und Videograf:in ----------
   Stehen am Rand der Fläche und schauen zur Bühne. Bewusst kleiner
   als der DJ — sie gehören dazu, sind aber nicht der Mittelpunkt. */
function kameraFigur(p, blick) {
  const L = p.look;
  const film = p.kamera === 'film';
  const s = [];

  s.push(`<ellipse cx="0" cy="2" rx="62" ry="10" fill="#000" opacity="${F.strahlBreit > .2 ? .12 : .38}"/>`);
  s.push(`<rect x="-30" y="-118" width="24" height="118" rx="6" fill="${L.hose}"/>`);
  s.push(`<rect x="8"   y="-118" width="24" height="118" rx="6" fill="${L.hose}"/>`);
  s.push(`<rect x="-37" y="-15" width="34" height="15" rx="7" fill="${L.schuh}"/>`);
  s.push(`<rect x="5"   y="-15" width="34" height="15" rx="7" fill="${L.schuh}"/>`);
  s.push(`<rect x="-42" y="-214" width="84" height="102" rx="16" fill="${L.shirt}"/>`);

  /* Haare hinten, Kopf */
  s.push(`<circle cx="0" cy="-258" r="39" fill="${L.haar}"/>`);
  s.push(`<rect x="-11" y="-226" width="22" height="20" fill="${L.haut}"/>`);
  s.push(`<circle cx="0" cy="-256" r="35" fill="${L.haut}"/>`);
  s.push(`<path d="M -35 -256 A 35 35 0 0 1 35 -256 L 35 -273 Q 16 -268 0 -272 Q -16 -268 -35 -273 Z" fill="${L.haar}"/>`);

  if (film) {
    /* Kamera auf dem Gimbal, vor der Brust */
    s.push(arm([[-38,-200],[-58,-166],[-40,-142]], L));
    s.push(arm([[ 38,-200],[ 58,-166],[ 40,-142]], L));
    s.push(`<rect x="-6" y="-150" width="12" height="44" rx="6" fill="#2A3040"/>`);
    s.push(`<rect x="-34" y="-152" width="68" height="12" rx="6" fill="#353C4D"/>`);
    s.push(`<rect x="-30" y="-196" width="60" height="44" rx="8" fill="#20242F"/>`);
    s.push(`<circle cx="-2" cy="-174" r="15" fill="#12151C"/>`);
    s.push(`<circle cx="-2" cy="-174" r="7" fill="${L.akzent}"/>`);
    s.push(`<rect x="26" y="-192" width="20" height="26" rx="4" fill="#2E3444"/>`);
    s.push(`<circle cx="24" cy="-198" r="4" fill="#EF4444">
              ${animAttr({ attributeName:'opacity', values:'1;.15;1', dur:'1.8s', begin:'0s' })}
            </circle>`);
  } else {
    /* Fotoapparat am Auge */
    s.push(arm([[-38,-200],[-62,-232],[-34,-252]], L));
    s.push(arm([[ 38,-200],[ 62,-232],[ 34,-252]], L));
    s.push(`<rect x="-32" y="-278" width="64" height="42" rx="8" fill="#20242F"/>`);
    s.push(`<rect x="-14" y="-286" width="26" height="10" rx="3" fill="#2E3444"/>`);
    s.push(`<circle cx="0" cy="-257" r="17" fill="#12151C"/>`);
    s.push(`<circle cx="0" cy="-257" r="8" fill="${L.akzent}"/>`);
    s.push(`<rect x="18" y="-274" width="12" height="9" rx="2" fill="#F5F4F8" opacity=".85">
              ${animAttr({ attributeName:'opacity', values:'.15;1;.15', dur:'3.4s', begin:'-1s' })}
            </rect>`);
  }

  /* Riemen */
  s.push(`<path d="M -40 -206 Q 0 -186 40 -206" stroke="${L.akzent}" stroke-width="7"
            fill="none" stroke-linecap="round" opacity=".9"/>`);

  return `<g transform="scale(${blick} 1)">${s.join('')}</g>`;
}

/* ---------- Publikum ---------- */
function menschStueck(i, skalierung) {
  const dauer = (1.5 + ((i * 13) % 6) * 0.22).toFixed(2);
  const arme = i % 3 === 0
    ? `<path d="M -44 -180 L -74 -258" stroke="${F.publikum}" stroke-width="22" stroke-linecap="round"/>
       <path d="M 44 -180 L 76 -262" stroke="${F.publikum}" stroke-width="22" stroke-linecap="round"/>`
    : `<path d="M -44 -180 L -68 -96" stroke="${F.publikum}" stroke-width="22" stroke-linecap="round"/>
       <path d="M 44 -180 L 68 -96" stroke="${F.publikum}" stroke-width="22" stroke-linecap="round"/>`;
  return `
    <g transform="scale(${skalierung})">
      <g>
        ${anim({ type:'translate', values:'0 0;0 -16;0 0', dur:`${dauer}s`,
                 begin:`${-i * 0.31}s`, calcMode:'spline', keyTimes:'0;0.5;1',
                 keySplines:'0.4 0 0.6 1;0.4 0 0.6 1' })}
        <circle cx="0" cy="-236" r="34" fill="${F.publikum}"/>
        <path d="M -46 0 L -46 -178 Q -46 -206 0 -206 Q 46 -206 46 -178 L 46 0 Z" fill="${F.publikum}"/>
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

/* ---------- Kerzenschein (Hochzeit) ---------- */

/* Stoffbahn, hängt an einem Traversenstück */
function bahnStoff(idx) {
  const t = ['#F0E4D2', '#E7D7C2', '#F6EDE0'][Math.abs(idx) % 3];
  const lang = 210 + (Math.abs(idx) % 3) * 34;
  return `
    <path d="M 0 26 L ${SEG} 26 L ${SEG - 5} ${lang} Q ${SEG / 2} ${lang + 24} 5 ${lang} Z"
          fill="${t}" opacity=".82"/>
    <path d="M ${SEG * 0.35} 26 L ${SEG * 0.3} ${lang - 10}" stroke="#D8C6AC"
          stroke-width="2" opacity=".7" fill="none"/>
    <circle cx="${SEG / 2}" cy="${lang + 14}" r="4" fill="#FFE9C0" opacity=".9">
      ${animAttr({ attributeName:'opacity', values:'.45;1;.45',
                   dur:`${(2.6 + (Math.abs(idx) % 4) * 0.5).toFixed(1)}s`,
                   begin:`${-idx * 0.4}s` })}
    </circle>`;
}

/* Kerzenständer, drei Höhen */
function kerzen(k) {
  const hoehen = [150, 210, 176];
  const h = hoehen[Math.abs(k) % 3];
  let flammen = '';
  for (let i = 0; i < 3; i++) {
    const x = (i - 1) * 17, y = -h - 14 - (i === 1 ? 12 : 0);
    flammen += `
      <rect x="${x - 4}" y="${y}" width="8" height="26" rx="3" fill="#F6EDE0"/>
      <ellipse cx="${x}" cy="${y - 6}" rx="4" ry="7" fill="#FFD489">
        ${animAttr({ attributeName:'opacity', values:'.6;1;.6',
                     dur:`${(1.6 + i * 0.4).toFixed(1)}s`, begin:`${-k * 0.3 - i * 0.2}s` })}
      </ellipse>`;
  }
  return `
    <path d="M -22 0 L 22 0 L 12 -18 L -12 -18 Z" fill="#8A7A5E"/>
    <rect x="-4" y="${-h}" width="8" height="${h - 16}" fill="#8A7A5E"/>
    <rect x="-26" y="${-h - 8}" width="52" height="9" rx="4" fill="#A08D6B"/>
    ${flammen}`;
}

/* ---------- Portal und Markenfläche (Corporate) ---------- */

function portalKante(seite) {
  const h = -TRAV_Y + 40;
  return `
    <g transform="scale(${seite} 1)">
      <rect x="0" y="${-h}" width="86" height="${h}" fill="#1B2432"/>
      <rect x="0" y="${-h}" width="86" height="10" fill="#2F3D52"/>
      <rect x="14" y="${-h + 40}" width="58" height="4" rx="2" fill="#2563EB" opacity=".75"/>
      <rect x="14" y="${-h + 56}" width="34" height="4" rx="2" fill="#2563EB" opacity=".35"/>
    </g>`;
}

/* Obere Blende, ein Stück je Traversenabschnitt */
function blende(idx) {
  return `<rect x="0" y="-34" width="${SEG + 0.5}" height="34"
            fill="${idx % 2 ? '#1E293B' : '#22303F'}"/>`;
}

/* Bedruckter Spannrahmen */
function markenFeld(k) {
  const h = 250;
  return `
    <rect x="-78" y="${-h}" width="156" height="${h}" rx="3" fill="#F8FAFC" opacity=".93"/>
    <rect x="-78" y="${-h}" width="156" height="${h}" rx="3" fill="none"
          stroke="#CBD5E1" stroke-width="2"/>
    <rect x="-52" y="${-h + 54}" width="104" height="10" rx="5" fill="#2563EB" opacity=".9"/>
    <rect x="-40" y="${-h + 78}" width="80" height="7" rx="3.5" fill="#94A3B8" opacity=".8"/>
    <rect x="-30" y="${-h + 150}" width="60" height="60" rx="4" fill="#2563EB" opacity=".14"/>
    <path d="M -14 ${-h + 190} L 0 ${-h + 168} L 14 ${-h + 190} Z" fill="#2563EB" opacity=".55"/>`;
}

/* ---------- Neon (Private) ---------- */

/* Ein Stück des umlaufenden Leuchtrahmens */
function neonKante(idx) {
  const f = idx % 2 ? '#22D3EE' : '#A78BFA';
  return `<rect x="0" y="-12" width="${SEG + 0.5}" height="7" rx="3.5" fill="${f}" opacity=".9">
            ${animAttr({ attributeName:'opacity', values:'.35;1;.35',
                         dur:'3.4s', begin:`${-idx * 0.18}s` })}
          </rect>`;
}

/* Senkrechte Röhre */
function neonRohr(k) {
  const f = k % 2 ? '#EC4899' : '#22D3EE';
  const h = 300 + (Math.abs(k) % 3) * 70;
  return `
    <rect x="-16" y="${-h}" width="32" height="${h}" rx="16" fill="${f}" opacity=".12"/>
    <rect x="-5" y="${-h}" width="10" height="${h}" rx="5" fill="${f}" opacity=".9">
      ${animAttr({ attributeName:'opacity', values:'.3;1;.3',
                   dur:`${(2.2 + (Math.abs(k) % 4) * 0.6).toFixed(1)}s`,
                   begin:`${-k * 0.5}s` })}
    </rect>`;
}

/* ---------- LED-Wand (Corporate) ---------- */
function ledModul(mw, mh, r, c, spalten, zeilen) {
  /* Aus den Modulen setzt sich ein grobes Bild zusammen — eine helle
     Fläche in der Mitte, außen dunkler. Sieht nach Inhalt aus, ohne
     etwas zu behaupten. */
  const t = (c + 0.5) / spalten, u = (r + 0.5) / zeilen;
  const nah = Math.abs(t - 0.5) * 1.6 + Math.abs(u - 0.42) * 1.2;
  const hell = nah < 0.55;
  const f = hell ? '#2F6FE4' : '#0E1728';
  const o = hell ? Math.max(0.25, 0.95 - nah) : 0.9;
  return `
    <rect x="0" y="0" width="${mw - 1}" height="${mh - 1}" fill="#080D16"/>
    <rect x="0" y="0" width="${mw - 1}" height="${mh - 1}" fill="${f}" opacity="${o.toFixed(2)}">
      ${animAttr({ attributeName:'opacity',
                   values:`${(o * 0.72).toFixed(2)};${o.toFixed(2)};${(o * 0.72).toFixed(2)}`,
                   dur:`${(4 + ((r + c) % 5) * 0.8).toFixed(1)}s`,
                   begin:`${-(r * spalten + c) * 0.13}s` })}
    </rect>`;
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
  constructor(svg, grundfarbe = '#07070C') {
    this.svg = svg;
    /* lTiefe hält alles, was bei Fokus unscharf wird.
       lFokus liegt davor und bleibt scharf. */
    this.svg.innerHTML =
      `<g id="lBoden"></g>
       <g id="lTiefe"><g id="lRig"></g><g id="lDjs"></g><g id="lVorne"></g></g>
       <g id="lFokus"></g>`;
    this.lBoden = svg.querySelector('#lBoden');
    this.lTiefe = svg.querySelector('#lTiefe');
    this.lRig   = svg.querySelector('#lRig');
    this.lDjs   = svg.querySelector('#lDjs');
    this.lVorne = svg.querySelector('#lVorne');
    this.lFokus = svg.querySelector('#lFokus');
    this.grund  = grundfarbe;

    /* Boden und Rückwand einmal und riesig — dann muss nie wieder
       daran gerührt werden, egal wie weit die Kamera herausfährt. */
    this.lBoden.innerHTML = `
      <rect x="-6000" y="-4000" width="12000" height="4000" fill="${F.wand}"/>
      <rect x="-6000" y="0" width="12000" height="3000" fill="${F.boden}"/>
      <rect x="-6000" y="0" width="12000" height="5" fill="${F.kante}"/>`;

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
  static plan(auswahl) {
    const { stage, skin, led, foto, film } = auswahl;
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

    /* Fotograf:in und Videograf:in stehen seitlich vor der Bühne.
       Der Abstand wächst nur zum Teil mit — so bleiben sie auch bei
       Stage L im Bild, statt an den Rand zu rutschen. */
    const crewX = 220 + halb * 0.45;
    if (foto && !auswahl.fokus) setz('foto', 'rig', -crewX, 40,
                   `<g transform="scale(.72)">${kameraFigur(foto, 1)}</g>`, 'crew');
    if (film && !auswahl.fokus) setz('film', 'rig',  crewX, 40,
                   `<g transform="scale(.72)">${kameraFigur(film, -1)}</g>`, 'crew');

    /* ---------- Deko ---------- */
    const deko = skin && skin.deko;

    if (deko === 'blueten') {
      for (let s2 = von; s2 < von + r.segmente; s2++)
        setz(`deko-gir${s2}`, 'rig', s2 * SEG, TRAV_Y, girlande(s2), 'deko');
      setz('deko-bogen', 'rig', 0, -10, bogen(halb), 'deko');
      setz('deko-saeuleL', 'rig', -250, 0, saeule(-1), 'deko');
      setz('deko-saeuleR', 'rig',  250, 0, saeule(1),  'deko');
      if (r.segmente >= 16) {
        setz('deko-saeule2L', 'rig', -(halb - 40), 0, saeule(-1), 'deko');
        setz('deko-saeule2R', 'rig',  (halb - 40), 0, saeule(1),  'deko');
      }
    }

    if (deko === 'kerzen') {
      for (let s2 = von; s2 < von + r.segmente; s2 += 2)
        setz(`deko-stoff${s2}`, 'rig', s2 * SEG, TRAV_Y, bahnStoff(s2), 'deko');
      const paare = r.segmente >= 24 ? 3 : r.segmente >= 16 ? 2 : 1;
      for (let k = 0; k < paare * 2; k++)
        setz(`deko-kerze${k}`, 'rig', platz(k, 240, 190), 0, kerzen(k), 'deko');
    }

    if (deko === 'portal' || deko === 'marke') {
      setz('deko-portalL', 'rig', -halb - 4, 0, portalKante(-1), 'deko');
      setz('deko-portalR', 'rig',  halb + 4, 0, portalKante(1),  'deko');
      for (let s2 = von; s2 < von + r.segmente; s2++)
        setz(`deko-blende${s2}`, 'rig', s2 * SEG, TRAV_Y, blende(s2), 'deko');
    }
    if (deko === 'marke' && !(led && led.led)) {
      const felder = r.segmente >= 24 ? 5 : 3;
      for (let k = 0; k < felder; k++)
        setz(`deko-marke${k}`, 'rig', (k - (felder - 1) / 2) * 170, -6, markenFeld(k), 'deko');
    }

    if (deko === 'neon') {
      for (let s2 = von; s2 < von + r.segmente; s2++)
        setz(`deko-kante${s2}`, 'rig', s2 * SEG, TRAV_Y, neonKante(s2), 'deko');
      const rohre = Math.min(10, Math.round(r.segmente / 2.6));
      for (let k = 0; k < rohre; k++)
        setz(`deko-rohr${k}`, 'rig', platz(k, 150, 130), -30, neonRohr(k), 'deko');
    }

    if (deko === 'mainstage') {
      setz('deko-portalL', 'rig', -halb - 30, 0, portal(-1), 'deko');
      setz('deko-portalR', 'rig',  halb + 30, 0, portal(1),  'deko');
      for (let k = -2; k <= 2; k++)
        setz(`deko-panel${k}`, 'rig', k * 88, -6, panel(k), 'deko');
      for (let s2 = von; s2 < von + r.segmente; s2 += 4)
        setz(`deko-fin${s2}`, 'rig', s2 * SEG + SEG / 2, TRAV_Y, finne(s2), 'deko');
      setz('deko-krone', 'rig', 0, TRAV_Y - 6, krone(halb), 'deko');
    }

    /* ---------- LED-Wand (Corporate) ---------- */
    if (led && led.led) {
      const L = led.led;
      const [spalten, zeilen] = L.module;
      const mw = L.breite / spalten, mh = L.hoehe / zeilen;
      /* Rahmen zuerst, dann Modul für Modul — dadurch baut sie sich
         beim Wechsel Kachel für Kachel auf. */
      setz('ledrahmen', 'rig', 0, L.unten,
           `<rect x="${-L.breite / 2 - 6}" y="${-L.hoehe - 6}" width="${L.breite + 12}"
                  height="${L.hoehe + 12}" rx="4" fill="#0A0F1A"/>`, 'led');
      for (let r = 0; r < zeilen; r++) {
        for (let c = 0; c < spalten; c++) {
          setz(`led${r}-${c}`, 'rig',
               -L.breite / 2 + c * mw, L.unten - L.hoehe + (r + 1) * mh,
               ledModul(mw, mh, r, c, spalten, zeilen), 'led');
        }
      }
    }

    return wunsch;
  }

  baueRig(auswahl) {
    this.abgleichen(Szene.plan(auswahl));
  }

  /* ---------- Fokus ----------
     Im Foto- und Videoschritt tritt die Person nach vorn, während die
     Bühne dahinter unscharf wird und weiterläuft. Der Weichzeichner
     sitzt auf der ganzen Tiefenebene — die SMIL-Animationen laufen
     darin einfach weiter. */
  setzeFokus(leute) {
    const an = leute && leute.length;
    this.lTiefe.classList.toggle('unscharf', !!an);

    if (!an) { this.lFokus.innerHTML = ''; this.fokusVorher = []; return; }

    /* Wer schon stand, bleibt stehen; wer neu dazukommt, schiebt sich
       von außen ins Bild. */
    const vorher = this.fokusVorher || [];
    const zweit  = leute.length > 1;

    /* Allein: sehr nah, Oberkörper aufwärts. Zu zweit: einen Schritt
       zurück, damit beide hineinpassen. */
    const gross   = zweit ? 2.15 : 2.75;
    const tiefe   = zweit ? 300  : 430;      /* wie weit die Beine unten rauslaufen */
    const abstand = zweit ? 235  : 0;

    this.lFokus.innerHTML = leute.map((p, i) => {
      const x   = (i - (leute.length - 1) / 2) * abstand * 2;
      const neu = !vorher.includes(p.id);
      const von = x >= 0 ? 1 : -1;           /* aus welcher Richtung er kommt */
      return `<g transform="translate(${Math.round(x)} ${tiefe})">
                <g class="fokusfigur ${neu ? 'schiebt' : ''}"
                   style="--seite:${von};--v:${(i * 0.06).toFixed(2)}">
                  <g transform="scale(${gross})">${kameraFigur(p, i === 0 ? 1 : -1)}</g>
                </g>
              </g>`;
    }).join('');

    this.fokusVorher = leute.map(p => p.id);
  }

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
                    laser:0.62, led:0.06, deko:0.24, crew:0.28, mensch:0.32 };
    const SCHRITT = { trav:0.012, turm:0.05, tube:0.04, sun:0.04, kopf:0.035,
                      laser:0, led:0.007, deko:0.03, crew:0.08, mensch:0.025 };
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
