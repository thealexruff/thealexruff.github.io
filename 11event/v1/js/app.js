/* ==================================================================
   APP — Zustand, Schritte, Warenkorb.
   ================================================================== */

const $  = (s, w = document) => w.querySelector(s);
const $$ = (s, w = document) => [...w.querySelectorAll(s)];

const euro = (n) => new Intl.NumberFormat('de-DE', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0
}).format(n);

/* Was nichts kostet, steht auch nicht als "0 €" da. */
const preisText = (n) => (n === 0 ? 'inklusive' : euro(n));

const SCHRITTE = [
  { id: 'dj',      label: 'DJ' },
  { id: 'stage',   label: 'Stage' },
  { id: 'skin',    label: 'Skin' },
  { id: 'anfrage', label: 'Anfrage' }
];

const zustand = {
  schritt: 0,
  karussell: true,     /* steht die DJ-Auswahl gerade offen? */
  djIndex: 0,          /* welcher DJ gerade in der Mitte steht */
  dj: null,            /* gewählte id */
  stage: null,         /* nie leer, sobald ein DJ steht — S ist immer dabei */
  skin: null,          /* dito — Pur ist immer dabei */
  details: { dj: false, stage: false, skin: false },
  formular: { name: '', mail: '', datum: '', ort: '', gaeste: '', text: '' }
};

const szene = new Szene($('#szene'));

/* ------------------------------------------------------------------
   Warenkorb
   ------------------------------------------------------------------ */
function posten() {
  const p = [];
  const dj = DJS.find(d => d.id === zustand.dj);
  if (dj) p.push({ art: 'dj', titel: dj.name, unter: `DJ · ${dj.stil}`, preis: dj.preis });
  const st = STAGE.find(l => l.id === zustand.stage);
  if (st) p.push({
    art: 'stage', titel: `Stage ${st.name}`,
    unter: `${st.zusatz} · ${st.gaeste}`,
    preis: st.preis,
    fest: !!st.inklusive          /* S lässt sich nicht entfernen */
  });
  const sk = SKINS.find(l => l.id === zustand.skin);
  if (sk) p.push({
    art: 'skin', titel: `Skin ${sk.name}`,
    unter: sk.zusatz,
    preis: sk.preis,
    fest: !!sk.inklusive
  });
  return p;
}

const gesamt = () => posten().reduce((s, p) => s + p.preis, 0);

function korbZeichnen() {
  const p = posten();
  const summe = gesamt();

  $('#korbSumme').textContent  = euro(summe);
  $('#korbGesamt').textContent = euro(summe);
  $('#korbLabel').textContent  = p.length === 0
    ? 'Noch nichts gewählt'
    : `${p.length} ${p.length === 1 ? 'Position' : 'Positionen'}`;

  $('#korbLeer').hidden  = p.length > 0;
  $('#zurAnfrage').disabled = p.length === 0;

  $('#posten').innerHTML = p.map(x => `
    <li class="posten__zeile">
      <span class="posten__punkt posten__punkt--${x.art}"></span>
      <span class="posten__text">
        <b>${x.titel}</b>
        <small>${x.unter}</small>
      </span>
      <span class="posten__preis ${x.preis === 0 ? 'posten__preis--frei' : ''}">${preisText(x.preis)}</span>
      ${x.fest
        ? '<span class="posten__weg posten__weg--leer" aria-hidden="true"></span>'
        : `<button class="posten__weg" type="button" data-weg="${x.art}" aria-label="${x.titel} entfernen">
             <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
           </button>`}
    </li>`).join('');
}

/* ------------------------------------------------------------------
   Schrittleiste
   ------------------------------------------------------------------ */
function schrittleiste() {
  $('#schritte').innerHTML = SCHRITTE.map((s, i) => {
    const fertig = (i === 0 && zustand.dj) || (i === 1 && zustand.stage)
                || (i === 2 && zustand.skin);
    const aktiv  = i === zustand.schritt;
    const offen  = i <= erreichbar();
    return `<li>
      <button type="button" class="schritt" data-schritt="${i}"
              ${offen ? '' : 'disabled'}
              aria-current="${aktiv ? 'step' : 'false'}"
              data-fertig="${fertig ? 'true' : 'false'}">
        <span class="schritt__nr">${fertig ? '✓' : i + 1}</span>
        <span class="schritt__label">${s.label}</span>
      </button>
    </li>`;
  }).join('');
}

const erreichbar = () => (zustand.dj ? SCHRITTE.length - 1 : 0);

/* ------------------------------------------------------------------
   Auswahlbereich
   ------------------------------------------------------------------ */
function wahlZeichnen() {
  const s = SCHRITTE[zustand.schritt].id;

  djKarteZeichnen();
  $('#djBlock').dataset.offen = String(s === 'dj');

  $('#wahl').innerHTML =
    s === 'stage'   ? wahlStufen(STAGE, 'stage', 'Stage', 'Wie groß ist der Raum?') :
    s === 'skin'    ? wahlStufen(SKINS, 'skin',  'Skin',  'Wie soll es aussehen?') :
    s === 'anfrage' ? wahlAnfrage() : '';

  $('#szeneNav').hidden     = !zustand.karussell;
  $('#wischhinweis').hidden = !zustand.karussell;
  scrollPruefen();
}

/* Gescrollt wird nur, wenn der Inhalt wirklich über das Bild hinausgeht. */
function scrollPruefen() {
  requestAnimationFrame(() => {
    const noetig = document.documentElement.scrollHeight > window.innerHeight + 2;
    document.body.dataset.scroll = String(noetig);
    if (!noetig) window.scrollTo(0, 0);
  });
}

/* Die DJ-Karte wird befüllt, nicht ersetzt — im Aufklapper steckt der
   Player, und der darf beim Neuzeichnen nicht verloren gehen. */
function djKarteZeichnen() {
  const dj = DJS[zustand.djIndex];
  const gewaehlt = zustand.dj === dj.id;

  $('#djHut').textContent   = `DJ · ${zustand.djIndex + 1} von ${DJS.length}`;
  $('#djName').textContent  = dj.name;
  $('#djStil').textContent  = dj.stil;
  $('#djPreis').textContent = euro(dj.preis);
  $('#djWaehlen').textContent = gewaehlt ? `Weiter mit ${dj.name}` : `${dj.name} auswählen`;
  $('#djWaehlen').dataset.dj  = dj.id;
  $('#djMehrText').textContent = `Über ${dj.name}`;

  $('#djFoto').innerHTML = dj.foto
    ? `<img src="${dj.foto}" alt="${dj.name}" loading="lazy">`
    : portraetSVG(dj);

  $('#djText').textContent = dj.lang || dj.text;

  /* einspaltig — zweispaltig brechen die Werte unschön um */
  $('#djFakten').innerHTML = (dj.fakten || [])
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');

  $('#djLinks').innerHTML = (dj.links || [])
    .filter(l => l.url)
    .map(l => `<li><a class="link" href="${l.url}" target="_blank" rel="noopener noreferrer">
         ${l.titel}
         <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
       </a></li>`).join('');

  $('#djInfo').dataset.offen = String(zustand.details.dj);
  $('#djMehr').setAttribute('aria-expanded', String(zustand.details.dj));
}

/* Stage und Skin sehen gleich aus: drei Stufen, Details hinter einem
   Schalter. Darum eine Vorlage für beide. */
function wahlStufen(liste, feld, hut, frage) {
  const gew = liste.find(l => l.id === zustand[feld]) || liste[0];
  const offen = zustand.details[feld];
  const zurueck = SCHRITTE.findIndex(s => s.id === feld) - 1;
  const weiter  = SCHRITTE.findIndex(s => s.id === feld) + 1;

  return `
    <div class="karte">
      <div class="karte__kopf">
        <div>
          <span class="hut">${hut}</span>
          <h1 class="karte__titel">${frage}</h1>
        </div>
      </div>

      <div class="groessen">
        ${liste.map(l => `
          <button class="groesse" type="button" data-stufe="${feld}" data-id="${l.id}"
                  aria-pressed="${zustand[feld] === l.id}">
            <b>${l.name}</b>
            <small>${l.gaeste.replace(' Gäste','')}</small>
            <span>${l.inklusive ? 'inklusive' : euro(l.preis)}</span>
          </button>`).join('')}
      </div>

      <button class="mehr" type="button" data-details="${feld}" aria-expanded="${offen}">
        <span>Was ist dabei?</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>

      ${offen ? `
        <div class="mehr__inhalt">
          <p class="karte__text">${gew.text}</p>
          <dl class="daten">
            ${gew.daten.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
          </dl>
        </div>` : ''}

      <div class="karte__fuss karte__fuss--reihe">
        <button class="knopf knopf--leer" type="button" data-zurueck="${zurueck}">Zurück</button>
        <button class="knopf knopf--voll" type="button" data-weiter="${weiter}">Weiter</button>
      </div>
    </div>`;
}

function wahlAnfrage() {
  const f = zustand.formular;
  return `
    <div class="karte">
      <div class="karte__kopf">
        <div>
          <span class="hut">Anfrage</span>
          <h1 class="karte__titel">Fast fertig.</h1>
        </div>
      </div>

      <div class="felder">
        <label class="feld"><span>Name</span><input id="f-name" type="text" autocomplete="name" value="${f.name}"></label>
        <label class="feld"><span>E-Mail</span><input id="f-mail" type="email" autocomplete="email" value="${f.mail}"></label>
        <label class="feld"><span>Datum</span><input id="f-datum" type="date" value="${f.datum}"></label>
        <label class="feld"><span>Ort oder Location</span><input id="f-ort" type="text" value="${f.ort}"></label>
        <label class="feld"><span>Wie viele Gäste?</span><input id="f-gaeste" type="text" inputmode="numeric" value="${f.gaeste}"></label>
        <label class="feld feld--breit"><span>Was sollen wir wissen?</span><textarea id="f-text" rows="3">${f.text}</textarea></label>
      </div>

      <div class="bald">
        ${BALD.map(b => `<div class="bald__karte"><b>${b.name}</b><small>${b.text}</small></div>`).join('')}
      </div>

      <div class="karte__fuss karte__fuss--reihe">
        <button class="knopf knopf--leer" type="button" data-zurueck="${SCHRITTE.length - 2}">Zurück</button>
        <button class="knopf knopf--voll" type="button" id="senden">Anfrage schicken</button>
      </div>
      <p class="fein">Öffnet dein Mailprogramm mit der fertigen Zusammenstellung. Es wird nichts automatisch verschickt.</p>
    </div>`;
}

/* ------------------------------------------------------------------
   Szene je Schritt
   ------------------------------------------------------------------ */
function szeneAktualisieren(sofort = false) {
  if (zustand.karussell) {
    szene.setzeKamera(szene.rahmenFuerDj(zustand.djIndex), sofort);
    return;
  }
  const st = STAGE.find(l => l.id === zustand.stage);
  const sk = SKINS.find(l => l.id === zustand.skin);
  /* Deko baut nach oben — dafür fährt die Kamera etwas weiter heraus. */
  const sicht = st ? st.sicht + (sk ? sk.hoehe : 0) : 560;
  szene.setzeKamera(szene.rahmen(sicht, 0, -194, 0.52, st ? 700 : 540), sofort);
}

function rigNeu() {
  szene.baueRig(STAGE.find(l => l.id === zustand.stage),
                SKINS.find(l => l.id === zustand.skin));
}

/* ------------------------------------------------------------------
   Aktionen
   ------------------------------------------------------------------ */
function zeichnen(sofort = false) {
  schrittleiste();
  wahlZeichnen();
  korbZeichnen();
  szeneAktualisieren(sofort);
}

function zuDj(i) {
  const neu = Math.max(0, Math.min(DJS.length - 1, i));
  const wechsel = neu !== zustand.djIndex;
  zustand.djIndex = neu;
  punkteZeichnen();
  wahlZeichnen();
  szeneAktualisieren();
  /* Beim Blättern läuft der neue Mix sofort los — außer es ist stumm. */
  if (wechsel) Klang.zeigen(DJS[neu], true);
}

/* DJ festlegen: Karussell klappt zusammen, das Rig baut sich
   um den Gewählten herum wieder auf. */
function waehleDj(id) {
  const i = DJS.findIndex(d => d.id === id);
  zustand.dj = id;
  zustand.djIndex = i;
  zustand.karussell = false;
  if (!zustand.stage) zustand.stage = STAGE[0].id;   /* S ist immer dabei */
  if (!zustand.skin)  zustand.skin  = SKINS[0].id;   /* Pur ebenso */

  /* Den Gewählten in die Mitte setzen und die Kamera im selben Bild
     mitziehen — sichtbar passiert dabei nichts. Danach fährt die
     Kamera nur noch heraus, ohne seitlichen Schwenk. */
  szene.waehleDj(i);
  szene.setzeKamera(szene.rahmen(500, 0, -170, 0.52, 470), true);

  rigNeu();
  Klang.zeigen(DJS[i], true);

  zustand.schritt = 1;
  zeichnen();
}

/* Zurück zur DJ-Auswahl — die bereits gewählte Größe bleibt erhalten. */
/* Zurück zur DJ-Auswahl: die Bühne wird um den DJ herum abgebaut,
   die Kamera fährt wieder heran. Der DJ bleibt dabei stehen — die
   anderen beiden werden links und rechts neben ihm neu aufgebaut,
   damit nichts seitlich wegschwenkt. */
function karussellOeffnen() {
  if (zustand.karussell) { zeichnen(); return; }
  zustand.karussell = true;
  szene.rigAbbauen();
  szene.baueDjs(DJS, zustand.djIndex);
  punkteZeichnen();
  zeichnen();
}

function schrittSetzen(n) {
  zustand.schritt = n;
  if (n === 0) karussellOeffnen();
  else zeichnen();
}

/* Es gibt kein "gar nichts" — S bzw. Pur sind die Grundausstattung,
   alles andere baut darauf auf. */
function waehleStufe(feld, id) {
  if (zustand[feld] === id) return;
  zustand[feld] = id;
  rigNeu();
  zeichnen();
}

function entferne(art) {
  if (art === 'stage') waehleStufe('stage', STAGE[0].id);
  if (art === 'skin')  waehleStufe('skin',  SKINS[0].id);
  if (art === 'dj') {
    zustand.dj = null;
    zustand.stage = null;
    zustand.skin = null;
    schrittSetzen(0);
  }
}

function punkteZeichnen() {
  $('#punkte').innerHTML = DJS.map((d, i) =>
    `<button class="punkt" type="button" data-punkt="${i}"
             aria-label="${d.name}" aria-current="${i === zustand.djIndex}"></button>`).join('');
  $('#pfeilLinks').disabled  = zustand.djIndex === 0;
  $('#pfeilRechts').disabled = zustand.djIndex === DJS.length - 1;
}

/* ------------------------------------------------------------------
   Warenkorb auf/zu (mobil)
   ------------------------------------------------------------------ */
function korbUmschalten(auf) {
  const k = $('#korb');
  const offen = auf ?? k.dataset.offen !== 'true';
  k.dataset.offen = String(offen);
  $('#korbLeiste').setAttribute('aria-expanded', String(offen));
  $('#korbSchleier').hidden = !offen;
}

/* ------------------------------------------------------------------
   Mail
   ------------------------------------------------------------------ */
function anfrageSenden() {
  const f = zustand.formular;
  const zeilen = posten().map(p => `- ${p.titel} (${p.unter}): ${euro(p.preis)}`);
  const text = [
    'Hallo 11event,',
    '',
    'ich hätte gern folgendes Paket:',
    ...zeilen,
    '',
    `Gesamt: ${euro(gesamt())}`,
    '',
    `Name: ${f.name}`,
    `E-Mail: ${f.mail}`,
    `Datum: ${f.datum}`,
    `Ort: ${f.ort}`,
    `Gäste: ${f.gaeste}`,
    '',
    f.text,
    '',
    'Viele Grüße'
  ].join('\n');

  const url = `mailto:${KONTAKT_MAIL}?subject=${encodeURIComponent('Anfrage über den Konfigurator')}&body=${encodeURIComponent(text)}`;
  window.location.href = url;
}

/* ------------------------------------------------------------------
   Ereignisse
   ------------------------------------------------------------------ */
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-dj],[data-weiter],[data-zurueck],[data-schritt],[data-punkt],[data-weg],[data-details],[data-stufe],#djMehr,#senden');
  if (!t) return;

  if (t.dataset.dj)            waehleDj(t.dataset.dj);
  else if (t.dataset.stufe)    waehleStufe(t.dataset.stufe, t.dataset.id);
  else if (t.dataset.weiter)   schrittSetzen(+t.dataset.weiter);
  else if (t.dataset.zurueck)  schrittSetzen(+t.dataset.zurueck);
  else if (t.dataset.schritt)  schrittSetzen(+t.dataset.schritt);
  else if (t.dataset.punkt)    zuDj(+t.dataset.punkt);
  else if (t.dataset.details)  { const k = t.dataset.details; zustand.details[k] = !zustand.details[k]; wahlZeichnen(); }
  else if (t.id === 'djMehr')  { zustand.details.dj = !zustand.details.dj; djKarteZeichnen(); scrollPruefen(); }
  else if (t.dataset.weg)      entferne(t.dataset.weg);
  else if (t.id === 'senden')  anfrageSenden();
});

document.addEventListener('input', (e) => {
  const m = { 'f-name':'name', 'f-mail':'mail', 'f-datum':'datum',
              'f-ort':'ort', 'f-gaeste':'gaeste', 'f-text':'text' };
  if (m[e.target.id]) zustand.formular[m[e.target.id]] = e.target.value;
});

/* ---------- Ton ---------- */
function tonZeichnen() {
  const k = $('#ton');
  const aus = Klang.istStumm();
  k.dataset.aus = String(aus);
  k.dataset.laeuft = String(Klang.spieltGerade());
  k.setAttribute('aria-pressed', String(aus));
  k.setAttribute('aria-label', aus ? 'Ton einschalten' : 'Ton ausschalten');
}
Klang.beiAenderung(tonZeichnen);
$('#ton').addEventListener('click', () => {
  Klang.stummSchalten(!Klang.istStumm());
  tonZeichnen();
});

$('#pfeilLinks').addEventListener('click',  () => zuDj(zustand.djIndex - 1));
$('#pfeilRechts').addEventListener('click', () => zuDj(zustand.djIndex + 1));
$('#korbLeiste').addEventListener('click',  () => korbUmschalten());
$('#korbSchleier').addEventListener('click', () => korbUmschalten(false));
$('#zurAnfrage').addEventListener('click', () => {
  korbUmschalten(false); schrittSetzen(2);
});

document.addEventListener('keydown', (e) => {
  if (!zustand.karussell) return;
  if (e.key === 'ArrowLeft')  zuDj(zustand.djIndex - 1);
  if (e.key === 'ArrowRight') zuDj(zustand.djIndex + 1);
});

/* ---------- Wischen durch die DJs ---------- */
(function wischen() {
  const svg = $('#szene');
  let aktiv = false, startX = 0, startKamera = 0, bewegt = 0, richtung = 0;

  svg.addEventListener('pointerdown', (e) => {
    if (!zustand.karussell) return;
    aktiv = true; bewegt = 0;
    startX = e.clientX;
    startKamera = szene.kamera.x;
    svg.setPointerCapture(e.pointerId);
    svg.classList.add('greift');
  });

  svg.addEventListener('pointermove', (e) => {
    if (!aktiv) return;
    const dx = e.clientX - startX;
    bewegt = Math.abs(dx);
    richtung = Math.sign(dx);
    const grenze = DJ_LUECKE * 0.55;
    const halb = szene.kamera.w / 2;
    let x = startKamera - dx * szene.weltProPixel();
    const min = szene.djX(0) - halb - grenze;
    const max = szene.djX(DJS.length - 1) - halb + grenze;
    szene.schiebe(Math.max(min, Math.min(max, x)));
  });

  const los = () => {
    if (!aktiv) return;
    aktiv = false;
    svg.classList.remove('greift');
    /* Kurzes Wischen reicht: ab einem Achtel der Breite geht es
       einen DJ weiter, sonst schnappt es zurück. */
    const schwelle = (svg.clientWidth || 320) * 0.12;
    zuDj(bewegt > schwelle ? zustand.djIndex - richtung : zustand.djIndex);
  };
  svg.addEventListener('pointerup', los);
  svg.addEventListener('pointercancel', los);
})();

window.addEventListener('resize', () => { szeneAktualisieren(true); scrollPruefen(); });
$$('.klapp').forEach(k => k.addEventListener('transitionend', scrollPruefen));
/* Erst wenn die Schrift steht, stimmen die Höhen. */
window.addEventListener('load', scrollPruefen);
if (document.fonts) document.fonts.ready.then(scrollPruefen);

/* ------------------------------------------------------------------
   Start
   ------------------------------------------------------------------ */
szene.baueDjs(DJS);
punkteZeichnen();
zeichnen(true);
Klang.zeigen(DJS[0], false);   /* vorladen, aber noch still */
tonZeichnen();
