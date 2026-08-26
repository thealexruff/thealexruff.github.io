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

function boden(halb) {
  const b = halb + 900;          /* großzügig, damit die Ränder nie ausfransen */
  return `
    <rect x="${-b}" y="-1800" width="${b * 2}" height="1800" fill="#101219"/>
    <rect x="${-b}" y="0" width="${b * 2}" height="900" fill="#171A22"/>
    <rect x="${-b}" y="0" width="${b * 2}" height="5" fill="#252A36"/>`;
}

function traverse(halb) {
  const w = halb * 2;
  /* Zickzack exakt einpassen, damit nichts übersteht */
  const n = Math.max(2, Math.round(w / 46));
  const step = w / n;
  let zacken = '';
  for (let i = 0; i < n; i++) {
    const x = -halb + i * step;
    zacken += `<path d="M ${x.toFixed(1)} ${TRAV_Y + 6} L ${(x + step / 2).toFixed(1)} ${TRAV_Y + 24} L ${(x + step).toFixed(1)} ${TRAV_Y + 6}"
                 stroke="#2E3444" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  }
  return `
    <g class="baut" style="--v:0">
      <rect x="${-halb}" y="${TRAV_Y}" width="${w}" height="8" rx="4" fill="#3A4152"/>
      ${zacken}
      <rect x="${-halb}" y="${TRAV_Y + 22}" width="${w}" height="8" rx="4" fill="#3A4152"/>
    </g>`;
}

function tuerme(halb) {
  const t = (x) => `
    <g class="baut" style="--v:1">
      <rect x="${x - 13}" y="${TRAV_Y}" width="26" height="${-TRAV_Y}" rx="6" fill="#2E3444"/>
      <rect x="${x - 26}" y="-30" width="52" height="30" rx="6" fill="#3A4152"/>
    </g>`;
  return t(-halb) + t(halb);
}

/* Movinghead mit flachem Strahl */
function kopf(x, farbe, i) {
  const pivot = TRAV_Y + 30;
  const lang  = -pivot;                 /* bis zum Boden */
  const dauer = (5.5 + (i % 4) * 1.3).toFixed(1);
  const start = (i % 5) * -1.7;
  return `
  <g class="baut" style="--v:${2 + i * 0.06}">
   <g transform="translate(${x} ${pivot})">
    <g>
      ${anim({ type:'rotate', values:'-16;16;-16', dur:`${dauer}s`, begin:`${start}s`,
               calcMode:'spline', keyTimes:'0;0.5;1',
               keySplines:'0.45 0 0.55 1;0.45 0 0.55 1' })}
      <polygon points="0,26 -78,${lang} 78,${lang}" fill="${farbe}" opacity=".16"/>
      <polygon points="0,26 -26,${lang} 26,${lang}" fill="${farbe}" opacity=".22"/>
      <rect x="-13" y="-6" width="26" height="16" rx="4" fill="#2A3040"/>
      <path d="M -15 8 L 15 8 L 11 40 L -11 40 Z" fill="#353C4D"/>
      <ellipse cx="0" cy="40" rx="11" ry="5" fill="${farbe}"/>
    </g>
   </g>
  </g>`;
}

/* Sunbar am Boden, Fächer nach oben */
function sunbar(x, farbe, i) {
  return `
  <g class="baut baut--unten" style="--v:${1.2 + i * 0.08}">
   <g transform="translate(${x} 0)">
    <polygon points="-40,-18 40,-18 0,-430" fill="${farbe}" opacity=".16">
      ${animAttr({ attributeName:'opacity', values:'.07;.2;.07',
                   dur:`${(3.2 + i * 0.7).toFixed(1)}s`, begin:`${-i * 0.9}s` })}
    </polygon>
    <rect x="-40" y="-22" width="80" height="22" rx="5" fill="#242A36"/>
    <rect x="-34" y="-17" width="68" height="12" rx="6" fill="${farbe}"/>
   </g>
  </g>`;
}

/* LED-Schlauch, senkrecht */
function tube(x, farbe, i) {
  return `
  <g class="baut" style="--v:${1.6 + i * 0.08}">
    <rect x="${x - 22}" y="-440" width="44" height="380" rx="22" fill="${farbe}" opacity=".10"/>
    <rect x="${x - 6}"  y="-440" width="12" height="380" rx="6"  fill="${farbe}" opacity=".85">
      ${animAttr({ attributeName:'opacity', values:'.35;.9;.35',
                   dur:`${(2.4 + i * 0.5).toFixed(1)}s`, begin:`${-i * 0.6}s` })}
    </rect>
  </g>`;
}

function laser(halb) {
  let linien = '';
  for (let i = 0; i < 11; i++) {
    const x = -halb - 120 + (i * (halb + 120) * 2) / 10;
    linien += `<line x1="0" y1="${TRAV_Y - 8}" x2="${x}" y2="-30"
                 stroke="#3FC9D6" stroke-width="2.5" opacity=".3">
                 ${animAttr({ attributeName:'opacity', values:'.05;.4;.05',
                              dur:'2.8s', begin:`${-i * 0.22}s` })}
               </line>`;
  }
  return `<g class="baut" style="--v:2.4">${linien}</g>`;
}

/* Publikum, flache Silhouetten vor allem anderen */
function publikum(anzahl, halb) {
  let g = '';
  for (let i = 0; i < anzahl; i++) {
    const t = anzahl === 1 ? 0.5 : i / (anzahl - 1);
    const x = -halb - 90 + t * (halb + 90) * 2;
    const versatz = ((i * 37) % 11) - 5;           /* leicht unregelmäßig */
    const y = 112 + ((i * 23) % 5) * 12;
    const sk = (0.52 + ((i * 17) % 4) * 0.07).toFixed(2);
    const dauer = (1.5 + ((i * 13) % 6) * 0.22).toFixed(2);
    g += `
    <g class="baut baut--unten" style="--v:${2.6 + i * 0.05}">
     <g transform="translate(${x + versatz} ${y}) scale(${sk})">
      <g>
        ${anim({ type:'translate', values:'0 0;0 -16;0 0', dur:`${dauer}s`,
                 begin:`${-i * 0.31}s`, calcMode:'spline', keyTimes:'0;0.5;1',
                 keySplines:'0.4 0 0.6 1;0.4 0 0.6 1' })}
        <circle cx="0" cy="-236" r="34" fill="#07080C"/>
        <path d="M -46 0 L -46 -178 Q -46 -206 0 -206 Q 46 -206 46 -178 L 46 0 Z" fill="#07080C"/>
        ${i % 3 === 0
          ? `<path d="M -44 -180 L -74 -258" stroke="#07080C" stroke-width="22" stroke-linecap="round"/>
             <path d="M 44 -180 L 76 -262" stroke="#07080C" stroke-width="22" stroke-linecap="round"/>`
          : `<path d="M -44 -180 L -68 -96" stroke="#07080C" stroke-width="22" stroke-linecap="round"/>
             <path d="M 44 -180 L 68 -96" stroke="#07080C" stroke-width="22" stroke-linecap="round"/>`}
      </g>
     </g>
    </g>`;
  }
  return g;
}

/* ==================================================================
   SZENE
   ================================================================== */

class Szene {
  constructor(svg) {
    this.svg = svg;
    this.svg.innerHTML =
      `<g id="lHinten"></g><g id="lDjs"></g><g id="lVorne"></g>`;
    this.lHinten = svg.querySelector('#lHinten');
    this.lDjs    = svg.querySelector('#lDjs');
    this.lVorne  = svg.querySelector('#lVorne');

    this.kamera = { x: -320, y: -440, w: 640, h: 540 };
    this.ziel   = { ...this.kamera };
    this.laeuft = false;
  }

  /* ---------- Kamera ---------- */
  setzeKamera(box, sofort = false) {
    this.ziel = { x: box[0], y: box[1], w: box[2], h: box[3] };
    if (sofort || RUHIG) {
      this.kamera = { ...this.ziel };
      this.schreibeKamera();
      return;
    }
    if (!this.laeuft) {
      this.laeuft = true;
      requestAnimationFrame(() => this.schritt());
    }
  }

  schritt() {
    const k = this.kamera, z = this.ziel;
    const f = 0.12;
    let fertig = true;
    for (const s of ['x', 'y', 'w', 'h']) {
      const d = z[s] - k[s];
      if (Math.abs(d) > 0.4) { fertig = false; k[s] += d * f; }
      else k[s] = z[s];
    }
    this.schreibeKamera();
    if (fertig) this.laeuft = false;
    else requestAnimationFrame(() => this.schritt());
  }

  schreibeKamera() {
    const k = this.kamera;
    this.svg.setAttribute('viewBox',
      `${k.x.toFixed(1)} ${k.y.toFixed(1)} ${k.w.toFixed(1)} ${k.h.toFixed(1)}`);
  }

  /* Kamera direkt versetzen (beim Wischen) */
  schiebe(x) {
    this.kamera.x = x; this.ziel.x = x;
    this.schreibeKamera();
  }

  weltProPixel() {
    return this.kamera.w / (this.svg.clientWidth || 1);
  }

  /* ---------- DJ-Karussell ---------- */
  baueDjs(liste) {
    this.lDjs.innerHTML = liste.map((dj, i) => `
      <g class="dj" data-id="${dj.id}" transform="translate(${i * DJ_LUECKE} 0)">
        <g>${figur(dj)}${pult(dj.look)}</g>
      </g>`).join('');
    const w = liste.length * DJ_LUECKE + 2800;
    this.lHinten.innerHTML = `
      <rect x="-1400" y="-1800" width="${w}" height="1800" fill="#101219"/>
      <rect x="-1400" y="0" width="${w}" height="900" fill="#171A22"/>
      <rect x="-1400" y="0" width="${w}" height="5" fill="#252A36"/>`;
  }

  djX(i) { return i * DJ_LUECKE; }

  /* Rahmen aus der Fläche berechnen, statt fester viewBox.
     Der Maßstab kommt aus der Höhe — dadurch füllt die Szene das Bild
     immer ganz aus und wächst sichtbar mit der Auswahl. In der Breite
     wird gezeigt, was hineinpasst; auf schmalen Handys läuft ein großes
     Rig bewusst über den Rand hinaus. */
  rahmen(hSicht, mitteX = 0, mitteY = -194, anteil = 0.52, hMin = 700) {
    const cw = this.svg.clientWidth  || 640;
    const ch = this.svg.clientHeight || 540;

    /* Grundmaßstab aus der Höhe: die Szene füllt das Bild und wächst
       sichtbar mit der Auswahl. */
    let massstab = ch / hSicht;

    /* Auf breiten, flachen Flächen (Desktop) sonst zu viel Leerraum
       links und rechts — dann näher heran. */
    massstab = Math.max(massstab, cw / (hSicht * 1.9));

    /* Aber nie so nah, dass Traverse oder Publikum wegfallen. */
    if (ch / massstab < hMin) massstab = ch / hMin;

    const w = cw / massstab;
    const h = ch / massstab;
    return [mitteX - w / 2, mitteY - h * anteil, w, h];
  }

  rahmenFuerDj(i) {
    return this.rahmen(500, this.djX(i), -170, 0.52, 470);
  }

  /* Nicht gewählte DJs entfernen, gewählten in die Mitte holen */
  waehleDj(index) {
    const gruppen = [...this.lDjs.querySelectorAll('.dj')];
    gruppen.forEach((g, i) => {
      if (i === index) {
        g.setAttribute('transform', 'translate(0 0)');
      } else {
        g.remove();
      }
    });
  }

  /* ---------- Rig aufbauen ---------- */
  baueRig(licht) {
    if (!licht) {
      this.lHinten.innerHTML = boden(200);
      this.lVorne.innerHTML  = '';
      return;
    }
    const r = licht.rig;
    const teile = [boden(r.trav)];

    /* LED-Schläuche ganz hinten */
    for (let i = 0; i < r.tubes; i++) {
      const t = r.tubes === 1 ? 0.5 : i / (r.tubes - 1);
      const x = -r.trav * 0.82 + t * r.trav * 1.64;
      teile.push(tube(x, STRAHLFARBEN[(i + 1) % STRAHLFARBEN.length], i));
    }

    /* Sunbars */
    for (let i = 0; i < r.sunbars; i++) {
      const t = r.sunbars === 1 ? 0.5 : i / (r.sunbars - 1);
      const x = -r.trav * 0.86 + t * r.trav * 1.72;
      teile.push(sunbar(x, STRAHLFARBEN[i % STRAHLFARBEN.length], i));
    }

    if (r.tuerme) teile.push(tuerme(r.trav));
    teile.push(traverse(r.trav));

    /* Movingheads */
    for (let i = 0; i < r.koepfe; i++) {
      const t = (i + 0.5) / r.koepfe;
      const x = -r.trav + t * r.trav * 2;
      teile.push(kopf(x, STRAHLFARBEN[i % STRAHLFARBEN.length], i));
    }

    if (r.laser) teile.push(laser(r.trav));

    this.lHinten.innerHTML = teile.join('');
    this.lVorne.innerHTML  = publikum(r.leute, r.trav);
  }
}
