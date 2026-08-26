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
  { id: 'licht',   label: 'Licht' },
  { id: 'anfrage', label: 'Anfrage' }
];

const zustand = {
  schritt: 0,
  karussell: true,     /* steht die DJ-Auswahl gerade offen? */
  djIndex: 0,          /* welcher DJ gerade in der Mitte steht */
  dj: null,            /* gewählte id */
  licht: null,         /* nie leer, sobald ein DJ steht — S ist immer dabei */
  details: { dj: false, licht: false },   /* aufgeklappte Detailblöcke */
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
  const li = LICHT.find(l => l.id === zustand.licht);
  if (li) p.push({
    art: 'licht', titel: `Eventlicht ${li.name}`,
    unter: `${li.zusatz} · ${li.gaeste}`,
    preis: li.preis,
    fest: !!li.inklusive          /* S lässt sich nicht entfernen */
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
    const fertig = (i === 0 && zustand.dj) || (i === 1 && zustand.licht);
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

const erreichbar = () => (zustand.dj ? 2 : 0);

/* ------------------------------------------------------------------
   Auswahlbereich
   ------------------------------------------------------------------ */
function wahlZeichnen() {
  const w = $('#wahl');
  const s = SCHRITTE[zustand.schritt].id;

  if (s === 'dj')      w.innerHTML = wahlDj();
  if (s === 'licht')   w.innerHTML = wahlLicht();
  if (s === 'anfrage') w.innerHTML = wahlAnfrage();

  $('#szeneNav').hidden      = !zustand.karussell;
  $('#wischhinweis').hidden  = !zustand.karussell;
  $('#klang').dataset.sichtbar = String(zustand.karussell);
}

function wahlDj() {
  const dj = DJS[zustand.djIndex];
  const gewaehlt = zustand.dj === dj.id;
  return `
    <div class="karte karte--dj">
      <div class="karte__kopf">
        <div>
          <span class="hut">DJ · ${zustand.djIndex + 1} von ${DJS.length}</span>
          <h1 class="karte__titel">${dj.name}</h1>
          <p class="karte__stil">${dj.stil}</p>
        </div>
        <div class="preis">${euro(dj.preis)}</div>
      </div>
      <div class="karte__fuss">
        <button class="knopf knopf--voll" type="button" data-dj="${dj.id}">
          ${gewaehlt ? `Weiter mit ${dj.name}` : `${dj.name} auswählen`}
        </button>
      </div>

      <button class="mehr" type="button" data-details="dj" aria-expanded="${zustand.details.dj}">
        <span>Über ${dj.name}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      ${zustand.details.dj ? `<div class="mehr__inhalt"><p class="karte__text">${dj.text}</p></div>` : ''}
    </div>`;
}

function wahlLicht() {
  const gew = LICHT.find(l => l.id === zustand.licht) || LICHT[0];
  return `
    <div class="karte">
      <div class="karte__kopf">
        <div>
          <span class="hut">Eventlicht</span>
          <h1 class="karte__titel">Wie groß ist der Raum?</h1>
        </div>
      </div>

      <div class="groessen">
        ${LICHT.map(l => `
          <button class="groesse" type="button" data-licht="${l.id}"
                  aria-pressed="${zustand.licht === l.id}">
            <b>${l.name}</b>
            <small>${l.gaeste.replace(' Gäste','')}</small>
            <span>${l.inklusive ? 'inklusive' : euro(l.preis)}</span>
          </button>`).join('')}
      </div>

      <button class="mehr" type="button" data-details="licht" aria-expanded="${zustand.details.licht}">
        <span>Was ist dabei?</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>

      ${zustand.details.licht ? `
        <div class="mehr__inhalt">
          <p class="karte__text">${gew.text}</p>
          <dl class="daten">
            ${gew.daten.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
          </dl>
        </div>` : ''}

      <div class="karte__fuss karte__fuss--reihe">
        <button class="knopf knopf--leer" type="button" data-zurueck="0">Zurück</button>
        <button class="knopf knopf--voll" type="button" data-weiter="2">Weiter</button>
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
        <button class="knopf knopf--leer" type="button" data-zurueck="1">Zurück</button>
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
  const li = LICHT.find(l => l.id === zustand.licht);
  szene.setzeKamera(li ? szene.rahmen(li.sicht) : szene.rahmen(560, 0, -180, 0.52, 540), sofort);
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
  /* Beim Blättern den Track mitziehen. Lief schon etwas, läuft es weiter. */
  if (wechsel) Klang.zeigen(DJS[neu], Klang.spieltGerade());
}

/* DJ festlegen: Karussell klappt zusammen, das Rig baut sich
   um den Gewählten herum wieder auf. */
function waehleDj(id) {
  const i = DJS.findIndex(d => d.id === id);
  zustand.dj = id;
  zustand.djIndex = i;
  zustand.karussell = false;
  if (!zustand.licht) zustand.licht = LICHT[0].id;   /* S ist immer dabei */

  szene.waehleDj(i);
  szene.baueRig(LICHT.find(l => l.id === zustand.licht));

  Klang.zeigen(DJS[i], true);                        /* jetzt läuft die Musik */

  zustand.schritt = 1;
  zeichnen();
}

/* Zurück zur DJ-Auswahl — die bereits gewählte Größe bleibt erhalten. */
function karussellOeffnen() {
  if (zustand.karussell) { zeichnen(); return; }   /* steht schon offen */
  zustand.karussell = true;
  szene.baueDjs(DJS);
  szene.lVorne.innerHTML = '';
  punkteZeichnen();
  zeichnen();
}

function schrittSetzen(n) {
  zustand.schritt = n;
  if (n === 0) karussellOeffnen();
  else zeichnen();
}

/* Es gibt kein "kein Licht" — S ist die Grundausstattung,
   M und L sind Ausbaustufen davon. */
function waehleLicht(id) {
  if (zustand.licht === id) return;
  zustand.licht = id;
  szene.baueRig(LICHT.find(l => l.id === id));
  zeichnen();
}

function entferne(art) {
  if (art === 'licht') {
    waehleLicht(LICHT[0].id);          /* zurück auf die Grundausstattung */
  }
  if (art === 'dj') {
    zustand.dj = null;
    zustand.licht = null;
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
  const t = e.target.closest('[data-dj],[data-licht],[data-weiter],[data-zurueck],[data-schritt],[data-punkt],[data-weg],[data-details],#senden');
  if (!t) return;

  if (t.dataset.dj)            waehleDj(t.dataset.dj);
  else if (t.dataset.licht)    waehleLicht(t.dataset.licht);
  else if (t.dataset.weiter)   schrittSetzen(+t.dataset.weiter);
  else if (t.dataset.zurueck)  schrittSetzen(+t.dataset.zurueck);
  else if (t.dataset.schritt)  schrittSetzen(+t.dataset.schritt);
  else if (t.dataset.punkt)    zuDj(+t.dataset.punkt);
  else if (t.dataset.details)  { const k = t.dataset.details; zustand.details[k] = !zustand.details[k]; wahlZeichnen(); }
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

window.addEventListener('resize', () => szeneAktualisieren(true));

/* ------------------------------------------------------------------
   Start
   ------------------------------------------------------------------ */
szene.baueDjs(DJS);
punkteZeichnen();
zeichnen(true);
Klang.zeigen(DJS[0], false);   /* vorladen, aber noch still */
tonZeichnen();
