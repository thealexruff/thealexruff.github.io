/* ==================================================================
   APP — der Konfigurator.

   Die Schritte stehen nicht hier, sondern in katalog.js. Wer dort
   eine Kategorie oder eine Leistung einträgt, bekommt sie hier
   automatisch — inklusive Aufbau auf der Fläche.
   ================================================================== */

const $  = (s, w = document) => w.querySelector(s);
const $$ = (s, w = document) => [...w.querySelectorAll(s)];

const WELT_ID = document.body.dataset.welt;
const WELT    = WELTEN[WELT_ID];
setzeWeltFarben(WELT_ID);

const euro = (n) => new Intl.NumberFormat('de-DE', {
  style:'currency', currency:'EUR', maximumFractionDigits:0
}).format(n);
const preisText = (n) => (n === 0 ? 'inklusive' : euro(n));

/* Schritte: alle Kategorien dieser Welt, dann die Anfrage */
const KATS = kategorienFuer(WELT_ID);
const SCHRITTE = [
  ...KATS.map(k => ({ id:k.id, label:k.label, kat:k })),
  { id:'anfrage', label:'Anfrage' }
];
const LETZTER = SCHRITTE.length - 1;

/* Beim DJ wird geblättert, bei Foto und Video auch — nur eben durch
   Menschen statt durch Auflegende. */
const artVon = (i) => (SCHRITTE[i].kat ? SCHRITTE[i].kat.schritt : 'anfrage');
const imDjSchritt = () => artVon(zustand.schritt) === 'karussell';
const imFokusSchritt = () => artVon(zustand.schritt) === 'fokus';

/* ------------------------------------------------------------------
   Zustand
   ------------------------------------------------------------------ */
const zustand = {
  schritt: 0,
  djIndex: 0,
  blick: {},        /* Foto/Video: welche Person gerade gezeigt wird */
  wahl: {},         /* Kategorie -> Leistungs-id */
  details: {},
  formular: { name:'', mail:'', datum:'', ort:'', gaeste:'', text:'' }
};

/* Jede Änderung wandert sofort in den Korb — auch beim Verlassen
   der Seite bleibt so alles stehen. */
function merken() { Korb.speichern(WELT_ID, zustand.wahl); }

/* Pflichtkategorien starten auf ihrer ersten (kostenlosen) Stufe */
function grundausstattung() {
  KATS.forEach(k => {
    if (k.pflicht && !zustand.wahl[k.id]) {
      const erste = leistungen(k.id, WELT_ID)[0];
      if (erste) zustand.wahl[k.id] = erste.id;
    }
  });
}

/* Die Fläche nimmt den Grundton der Welt an — bei Hochzeiten hell. */
$('#buehne').style.background = WELT.szene.wand;
const szene = new Szene($('#szene'));
const djListe = () => leistungen('dj', WELT_ID);

/* ------------------------------------------------------------------
   Warenkorb
   ------------------------------------------------------------------ */
function posten() {
  return KATS.map(k => {
    const l = leistung(zustand.wahl[k.id]);
    if (!l) return null;
    return {
      art: k.id, titel: l.name,
      unter: l.stil || `${k.name}${l.zusatz ? ' · ' + l.zusatz : ''}`,
      preis: l.preis, fest: !!l.inklusive
    };
  }).filter(Boolean);
}
const gesamt = () => posten().reduce((s, p) => s + p.preis, 0);

function korbZeichnen() {
  const p = posten(), summe = gesamt();
  $('#korbSumme').textContent  = euro(summe);
  $('#korbGesamt').textContent = euro(summe);
  $('#korbLabel').textContent  = p.length === 0 ? 'Noch nichts gewählt'
    : `${p.length} ${p.length === 1 ? 'Position' : 'Positionen'}`;
  $('#korbLeer').hidden = p.length > 0;
  $('#zurAnfrage').disabled = p.length === 0;

  $('#posten').innerHTML = p.map(x => `
    <li class="posten__zeile">
      <span class="posten__punkt posten__punkt--${x.art}"></span>
      <span class="posten__text"><b>${x.titel}</b><small>${x.unter}</small></span>
      <span class="posten__preis${x.preis === 0 ? ' posten__preis--frei' : ''}">${preisText(x.preis)}</span>
      ${x.fest ? '<span class="posten__weg posten__weg--leer" aria-hidden="true"></span>'
        : `<button class="posten__weg" type="button" data-weg="${x.art}" aria-label="${x.titel} entfernen">
             <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
           </button>`}
    </li>`).join('');
}

/* ------------------------------------------------------------------
   Schrittleiste
   ------------------------------------------------------------------ */
const erreichbar = () => (zustand.wahl.dj ? LETZTER : 0);

/* Punkte statt Nummern: der aktuelle Schritt wird zur Pille mit
   Beschriftung, alle anderen bleiben Punkte auf gleicher Höhe.
   Beim Zeigen verrät jeder Punkt, wofür er steht. */
function schrittleiste() {
  $('#schritte').innerHTML = SCHRITTE.map((s, i) => {
    const fertig = s.kat && !!zustand.wahl[s.kat.id];
    const aktiv  = i === zustand.schritt;
    return `<li>
      <button type="button" class="schritt" data-schritt="${i}"
              ${i <= erreichbar() ? '' : 'disabled'}
              aria-current="${aktiv ? 'step' : 'false'}"
              aria-label="${s.label}"
              data-titel="${s.label}"
              data-fertig="${fertig}">
        <span class="schritt__label">${s.label}</span>
      </button></li>`;
  }).join('');
}

/* ------------------------------------------------------------------
   Auswahlkarten
   ------------------------------------------------------------------ */

/* Ein Haken sagt deutlicher als eine Farbe, dass etwas dabei ist. */
const HAKEN = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5.2 5.2L20 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const dabeiMarke = (an, wort = 'Gewählt') =>
  an ? `<span class="dabei">${HAKEN}${wort}</span>` : '';
function wahlZeichnen() {
  const s = SCHRITTE[zustand.schritt];
  const artDj = s.kat && s.kat.schritt === 'karussell';

  djKarteZeichnen();
  $('#djBlock').dataset.offen = String(!!artDj);

  $('#wahl').innerHTML =
    !s.kat            ? wahlAnfrage()
    : s.kat.schritt === 'stufen' ? wahlStufen(s.kat)
    : s.kat.schritt === 'fokus'  ? wahlLeute(s.kat)
    : '';

  $('#szeneNav').hidden     = !(artDj || imFokusSchritt());
  $('#wischhinweis').hidden = !artDj;
  navPunkte();
  scrollPruefen();
}

function scrollPruefen() {
  requestAnimationFrame(() => {
    const noetig = document.documentElement.scrollHeight > innerHeight + 2;
    document.body.dataset.scroll = String(noetig);
    if (!noetig) scrollTo(0, 0);
  });
}

/* ---------- DJ ---------- */
function djKarteZeichnen() {
  const liste = djListe();
  const dj = liste[zustand.djIndex];
  if (!dj) return;
  const gewaehlt = zustand.wahl.dj === dj.id;

  $('#djHut').innerHTML = `DJ · ${zustand.djIndex + 1} von ${liste.length}`
    + dabeiMarke(gewaehlt, 'Gebucht');
  $('#djBlock').querySelector('.karte').dataset.gewaehlt = String(gewaehlt);
  $('#djName').textContent  = dj.name;
  $('#djStil').textContent  = dj.stil;
  $('#djPreis').textContent = euro(dj.preis);
  $('#djWaehlen').textContent = gewaehlt ? `Weiter mit ${dj.name}` : `${dj.name} auswählen`;
  $('#djWaehlen').dataset.dj  = dj.id;
  $('#djMehrText').textContent = `Über ${dj.name}`;
  $('#djFoto').innerHTML  = portraetSVG(dj);
  $('#djText').textContent = dj.lang;
  $('#djFakten').innerHTML = (dj.fakten || [])
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  $('#djLinks').innerHTML = (dj.links || []).filter(l => l.url).map(l =>
    `<li><a class="link" href="${l.url}" target="_blank" rel="noopener noreferrer">${l.titel}
       <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
     </a></li>`).join('');
  $('#djInfo').dataset.offen = String(!!zustand.details.dj);
  $('#djMehr').setAttribute('aria-expanded', String(!!zustand.details.dj));
}

/* ---------- Stufen (Licht, LED, Bühnenbild) ---------- */
function wahlStufen(k) {
  const liste = leistungen(k.id, WELT_ID);
  const gew   = leistung(zustand.wahl[k.id]) || liste[0];
  const offen = !!zustand.details[k.id];
  const i     = SCHRITTE.findIndex(s => s.id === k.id);

  return `
    <div class="karte">
      <div class="karte__kopf">
        <div>
          <span class="hut">${k.name}${dabeiMarke(!!gew && !gew.inklusive)}</span>
          <h1 class="karte__titel">${k.frage}</h1>
        </div>
        ${weiterKnopf(i)}
      </div>

      <div class="groessen">
        ${liste.map(l => `
          <button class="groesse" type="button" data-stufe="${k.id}" data-id="${l.id}"
                  aria-pressed="${zustand.wahl[k.id] === l.id}">
            <b>${l.stufe}</b>
            <small>${l.groesse}</small>
            <span class="groesse__preis">
              <span class="groesse__haken" aria-hidden="true">${HAKEN}</span>
              ${l.inklusive ? 'inklusive' : euro(l.preis)}
            </span>
          </button>`).join('')}
      </div>

      <button class="mehr" type="button" data-details="${k.id}" aria-expanded="${offen}">
        <span>Was ist dabei?</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      ${offen ? `<div class="mehr__inhalt">
          <p class="karte__text">${gew.lang}</p>
          <dl class="daten">${gew.fakten.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>
          <p class="fein" style="margin-top:10px">
            <a href="service.html?id=${gew.id}">Ganze Seite zu ${gew.name} →</a></p>
        </div>` : ''}

    </div>`;
}

/* Ein Knopf oben rechts führt weiter — zurück geht es über die Punkte. */
function weiterKnopf(i) {
  if (i >= LETZTER) return '';
  return `<button class="weiter" type="button" data-weiter="${i + 1}">
      ${i + 1 === LETZTER ? 'Zur Anfrage' : 'Weiter'}
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>`;
}

/* ---------- Fokus (Foto, Video) ---------- */
function wahlLeute(k) {
  const liste = leistungen(k.id, WELT_ID);
  const blick = liste[zustand.blick[k.id] || 0];
  const gew   = leistung(zustand.wahl[k.id]);
  const offen = !!zustand.details[k.id];
  const i     = SCHRITTE.findIndex(s => s.id === k.id);
  const dran  = gew && blick && gew.id === blick.id;

  return `
    <div class="karte" data-gewaehlt="${!!dran}">
      <div class="karte__kopf">
        <div>
          <span class="hut">${k.name} · ${(zustand.blick[k.id] || 0) + 1} von ${liste.length}${dabeiMarke(dran, 'Gebucht')}</span>
          <h1 class="karte__titel">${blick.name}</h1>
          <p class="karte__stil">${blick.stil}</p>
          <p class="karte__preiszeile">${euro(blick.preis)}<small> / ${blick.einheit}</small></p>
        </div>
        ${weiterKnopf(i)}
      </div>

      <div class="karte__fuss">
        <button class="knopf ${dran ? 'knopf--dabei' : 'knopf--voll'}" type="button"
                data-person="${k.id}" data-id="${blick.id}" aria-pressed="${!!dran}">
          ${dran ? `${HAKEN} Dabei — wieder abwählen` : `${blick.name} dazunehmen`}
        </button>
      </div>

      <button class="mehr" type="button" data-details="${k.id}" aria-expanded="${offen}">
        <span>Über ${blick.name}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      ${offen ? `<div class="mehr__inhalt">
          <p class="karte__text">${blick.lang}</p>
          <dl class="daten">${blick.fakten.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>
          <p class="fein" style="margin-top:10px">
            <a href="service.html?id=${blick.id}">Arbeitsproben ansehen →</a></p>
        </div>` : ''}

    </div>`;
}

/* ---------- Anfrage ---------- */
function wahlAnfrage() {
  const f = zustand.formular;
  return `
    <div class="karte">
      <div class="karte__kopf"><div>
        <span class="hut">Anfrage</span>
        <h1 class="karte__titel">Fast fertig.</h1>
      </div></div>
      <div class="felder">
        <label class="feld"><span>Name</span><input id="f-name" type="text" autocomplete="name" value="${f.name}"></label>
        <label class="feld"><span>E-Mail</span><input id="f-mail" type="email" autocomplete="email" value="${f.mail}"></label>
        <label class="feld"><span>Datum</span><input id="f-datum" type="date" value="${f.datum}"></label>
        <label class="feld"><span>Ort oder Location</span><input id="f-ort" type="text" value="${f.ort}"></label>
        <label class="feld"><span>Wie viele Gäste?</span><input id="f-gaeste" type="text" inputmode="numeric" value="${f.gaeste}"></label>
        <label class="feld feld--breit"><span>Was sollen wir wissen?</span><textarea id="f-text" rows="3">${f.text}</textarea></label>
      </div>
      <div class="karte__fuss">
        <button class="knopf knopf--voll" type="button" id="senden">Anfrage schicken</button>
      </div>
      <p class="fein" style="margin-top:12px">
        Öffnet euer Mailprogramm mit der fertigen Zusammenstellung. Es wird nichts automatisch verschickt.
      </p>
    </div>`;
}

/* ------------------------------------------------------------------
   Szene
   ------------------------------------------------------------------ */

/* Wer im Fokusschritt vorn steht: die Person, die man gerade ansieht,
   plus die aus der anderen Kategorie, die schon gebucht ist. Die
   Reihenfolge hängt an der Rolle, nicht am Schritt — nur so bleibt
   die Fotografin stehen, während der Videograf hereinkommt. */
function fokusRollen() {
  const s = SCHRITTE[zustand.schritt];
  if (!imFokusSchritt()) return [];
  return KATS.filter(k => k.schritt === 'fokus').map(k => {
    const person = k.id === s.kat.id
      ? leistungen(k.id, WELT_ID)[zustand.blick[k.id] || 0]
      : leistung(zustand.wahl[k.id]);
    return person ? { rolle:k.id, person } : null;
  }).filter(Boolean);
}

function rigNeu() {
  const s = SCHRITTE[zustand.schritt];
  const imFokus = s.kat && s.kat.schritt === 'fokus';

  szene.baueRig({
    stage: leistung(zustand.wahl.stage),
    skin:  leistung(zustand.wahl.skin),
    led:   leistung(zustand.wahl.led),
    foto:  leistung(zustand.wahl.foto),
    film:  leistung(zustand.wahl.film),
    fokus: imFokus
  });

  if (!imFokus) { szene.setzeFokus(null); return; }

  /* Im Fokusschritt steht die gerade gezeigte Person vorn — dazu, wer
     aus der anderen Kategorie schon gebucht ist. Die Reihenfolge hängt
     an der Rolle, nicht am Schritt: Foto steht immer auf derselben
     Seite wie vorher, Video auf seiner. Nur so kann der eine stehen
     bleiben, während der andere hereinkommt. */
  szene.setzeFokus(fokusRollen());
}

function szeneAktualisieren(sofort = false) {
  const st = leistung(zustand.wahl.stage);
  const sk = leistung(zustand.wahl.skin);
  const imFokus = imFokusSchritt();

  /* Solange noch nichts steht, ist die Kamera nah am DJ. Sobald eine
     Bühne gewählt ist, bleibt sie auch beim DJ-Wechsel im Bild. */
  if (!st) { szene.setzeKamera(szene.rahmenDj(), sofort); return; }

  if (imFokus) {
    /* Nah dran: die Person füllt das Bild, die Bühne steht unscharf
       dahinter. Sobald zwei vorn stehen, einen Schritt zurück — und
       zwar nach derselben Regel, nach der die Szene sie hinstellt. */
    const zweit = fokusRollen().length > 1;
    szene.setzeKamera(szene.rahmen(zweit ? 1040 : 860, 0, zweit ? -190 : -170, 0.5, 420), sofort);
    return;
  }
  const sicht = st.sicht + (sk && sk.hoehe ? sk.hoehe : 0);
  szene.setzeKamera(szene.rahmen(sicht, 0, -194, 0.52, 700), sofort);
}

/* ------------------------------------------------------------------
   Aktionen
   ------------------------------------------------------------------ */
function zeichnen(sofort = false) {
  schrittleiste(); wahlZeichnen(); korbZeichnen(); szeneAktualisieren(sofort);
}

function navPunkte() {
  const s = SCHRITTE[zustand.schritt];
  const imFokus = imFokusSchritt();
  const liste = imFokus ? leistungen(s.kat.id, WELT_ID) : djListe();
  const jetzt = imFokus ? (zustand.blick[s.kat.id] || 0) : zustand.djIndex;

  const gebucht = (l) => imFokus ? zustand.wahl[s.kat.id] === l.id
                                 : zustand.wahl.dj === l.id;
  $('#punkte').innerHTML = liste.map((l, i) =>
    `<button class="punkt" type="button" data-punkt="${i}"
             aria-label="${l.name}" data-gebucht="${gebucht(l)}"
             aria-current="${i === jetzt}"></button>`).join('');
  $('#pfeilLinks').disabled  = jetzt === 0;
  $('#pfeilRechts').disabled = jetzt === liste.length - 1;
}

/* Blättern — im DJ-Schritt durch die DJs, im Fokus durch die Leute */
function blaettern(i) {
  const s = SCHRITTE[zustand.schritt];

  if (imFokusSchritt()) {
    const liste = leistungen(s.kat.id, WELT_ID);
    zustand.blick[s.kat.id] = Math.max(0, Math.min(liste.length - 1, i));
    wahlZeichnen(); rigNeu();
    return;
  }
  const liste = djListe();
  const neu = Math.max(0, Math.min(liste.length - 1, i));
  const wechsel = neu !== zustand.djIndex;
  const richtung = neu > zustand.djIndex ? 1 : -1;
  zustand.djIndex = neu;
  /* Der DJ wird an Ort und Stelle getauscht — die Bühne bleibt stehen */
  szene.ziehe(0);
  if (wechsel) szene.zeigeDj(neu, richtung);
  navPunkte(); wahlZeichnen();
  if (wechsel) Klang.zeigen(liste[neu], true);
}

function waehleDj(id) {
  const liste = djListe();
  const i = liste.findIndex(d => d.id === id);
  const neu = zustand.wahl.dj !== id;
  zustand.wahl.dj = id;
  zustand.djIndex = i;
  grundausstattung();
  merken();
  /* Beim allerersten Mal fährt die Kamera aus der Nahaufnahme heraus,
     während die Traverse hereinfliegt. Steht die Bühne schon, bleibt
     sie einfach stehen — dann wird nur weitergegangen. */
  zustand.schritt = 1;
  rigNeu();
  if (neu) Klang.zeigen(liste[i], true);
  zeichnen();
}

function schrittSetzen(n) {
  zustand.schritt = Math.max(0, Math.min(LETZTER, n));
  szene.ziehe(0);
  rigNeu();
  zeichnen();
}

function waehleStufe(kat, id) {
  if (zustand.wahl[kat] === id) return;
  zustand.wahl[kat] = id;
  merken(); rigNeu(); zeichnen();
}

function waehlePerson(kat, id) {
  zustand.wahl[kat] = (zustand.wahl[kat] === id) ? null : id;
  merken(); rigNeu(); zeichnen();
}

function entferne(art) {
  const k = kategorie(art);
  if (!k) return;
  if (art === 'dj') {
    zustand.wahl = {};
    merken();
    schrittSetzen(0);
  } else if (k.pflicht) {
    waehleStufe(art, leistungen(art, WELT_ID)[0].id);
  } else {
    waehlePerson(art, null);
  }
}

/* ------------------------------------------------------------------
   Warenkorb auf/zu
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
  const text = [
    'Hallo 11EVENT,', '',
    `wir planen: ${WELT.name}.`, '',
    'Zusammenstellung:',
    ...posten().map(p => `- ${p.titel} (${p.unter}): ${preisText(p.preis)}`),
    '', `Gesamt: ${euro(gesamt())}`, '',
    `Name: ${f.name}`, `E-Mail: ${f.mail}`, `Datum: ${f.datum}`,
    `Ort: ${f.ort}`, `Gäste: ${f.gaeste}`, '', f.text, '', 'Viele Grüße'
  ].join('\n');

  location.href = `mailto:${KONTAKT_MAIL}`
    + `?subject=${encodeURIComponent(`Anfrage ${WELT.name}`)}`
    + `&body=${encodeURIComponent(text)}`;
}

/* ------------------------------------------------------------------
   Ereignisse
   ------------------------------------------------------------------ */
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-dj],[data-weiter],[data-zurueck],[data-schritt],'
    + '[data-punkt],[data-weg],[data-details],[data-stufe],[data-person],#djMehr,#senden');
  if (!t) return;

  if (t.dataset.dj)            waehleDj(t.dataset.dj);
  else if (t.dataset.stufe)    waehleStufe(t.dataset.stufe, t.dataset.id);
  else if (t.dataset.person)   waehlePerson(t.dataset.person, t.dataset.id);
  else if (t.dataset.weiter)   schrittSetzen(+t.dataset.weiter);
  else if (t.dataset.zurueck)  schrittSetzen(+t.dataset.zurueck);
  else if (t.dataset.schritt)  schrittSetzen(+t.dataset.schritt);
  else if (t.dataset.punkt)    blaettern(+t.dataset.punkt);
  else if (t.dataset.weg)      entferne(t.dataset.weg);
  else if (t.id === 'djMehr')  { zustand.details.dj = !zustand.details.dj; djKarteZeichnen(); scrollPruefen(); }
  else if (t.dataset.details)  { const k = t.dataset.details; zustand.details[k] = !zustand.details[k]; wahlZeichnen(); }
  else if (t.id === 'senden')  anfrageSenden();
});

document.addEventListener('input', (e) => {
  const m = { 'f-name':'name','f-mail':'mail','f-datum':'datum',
              'f-ort':'ort','f-gaeste':'gaeste','f-text':'text' };
  if (m[e.target.id]) zustand.formular[m[e.target.id]] = e.target.value;
});

$('#pfeilLinks').addEventListener('click',  () => blaettern(aktuellerBlick() - 1));
$('#pfeilRechts').addEventListener('click', () => blaettern(aktuellerBlick() + 1));
function aktuellerBlick() {
  const s = SCHRITTE[zustand.schritt];
  return (s.kat && s.kat.schritt === 'fokus')
    ? (zustand.blick[s.kat.id] || 0) : zustand.djIndex;
}

$('#korbLeiste').addEventListener('click', () => korbUmschalten());
$('#korbSchleier').addEventListener('click', () => korbUmschalten(false));
$('#zurAnfrage').addEventListener('click', () => { korbUmschalten(false); schrittSetzen(LETZTER); });

document.addEventListener('keydown', (e) => {
  if ($('#szeneNav').hidden) return;
  if (e.key === 'ArrowLeft')  blaettern(aktuellerBlick() - 1);
  if (e.key === 'ArrowRight') blaettern(aktuellerBlick() + 1);
});

/* ---------- Ton ---------- */
function tonZeichnen() {
  const k = $('#ton'), aus = Klang.istStumm();
  k.dataset.aus = String(aus);
  k.dataset.laeuft = String(Klang.spieltGerade());
  k.setAttribute('aria-pressed', String(aus));
  k.setAttribute('aria-label', aus ? 'Ton einschalten' : 'Ton ausschalten');
}
Klang.beiAenderung(tonZeichnen);
$('#ton').addEventListener('click', () => { Klang.stummSchalten(!Klang.istStumm()); tonZeichnen(); });

/* ---------- Wischen ---------- */
(function wischen() {
  const svg = $('#szene');
  let aktiv = false, startX = 0, bewegt = 0, richtung = 0;

  svg.addEventListener('pointerdown', (e) => {
    if (!imDjSchritt()) return;
    aktiv = true; bewegt = 0; richtung = 0; startX = e.clientX;
    svg.setPointerCapture(e.pointerId); svg.classList.add('greift');
  });
  svg.addEventListener('pointermove', (e) => {
    if (!aktiv) return;
    const dx = e.clientX - startX;
    bewegt = Math.abs(dx); richtung = Math.sign(dx);
    /* Nur der DJ folgt dem Finger — die Bühne drumherum steht still.
       Am Anfang und am Ende der Reihe zieht es zäher. */
    const rand = (richtung > 0 && zustand.djIndex === 0)
              || (richtung < 0 && zustand.djIndex === djListe().length - 1);
    szene.ziehe(dx * szene.weltProPixel() * (rand ? 0.28 : 0.8));
  });
  const los = () => {
    if (!aktiv) return;
    aktiv = false; svg.classList.remove('greift');
    const schwelle = (svg.clientWidth || 320) * 0.12;
    if (bewegt > schwelle) blaettern(zustand.djIndex - richtung);
    else szene.ziehe(0);
  };
  svg.addEventListener('pointerup', los);
  svg.addEventListener('pointercancel', los);
})();

addEventListener('resize', () => { szeneAktualisieren(true); scrollPruefen(); });
$$('.klapp').forEach(k => k.addEventListener('transitionend', scrollPruefen));
addEventListener('load', scrollPruefen);
if (document.fonts) document.fonts.ready.then(scrollPruefen);

/* ------------------------------------------------------------------
   Start
   ------------------------------------------------------------------ */
$('#markeLink').href = 'index.html';
$('#raus').href = 'index.html';
$('#korbTitel').textContent = WELT.anrede;

/* Was in der Bibliothek eingesammelt wurde, steht hier bereit —
   aus dem Speicher, und falls vorhanden zusätzlich aus der Adresse. */
zustand.wahl = Korb.laden(WELT_ID);
const ausLink = Korb.ausAdresse(WELT_ID);
if (ausLink) { zustand.wahl = { ...zustand.wahl, ...ausLink }; merken(); }

/* Angefangen wird immer beim DJ — auch mit vollem Korb. Wer schon
   etwas gewählt hat, sieht es auf jedem Schritt bereits markiert und
   bestätigt es einfach mit Weiter. */
zustandAufAuswahlStellen();

function zustandAufAuswahlStellen() {
  if (zustand.wahl.dj) {
    const i = djListe().findIndex(d => d.id === zustand.wahl.dj);
    if (i >= 0) zustand.djIndex = i;
  }
  /* Foto und Video öffnen auf der Person, die schon gebucht ist,
     statt immer bei der ersten. */
  KATS.filter(k => k.schritt === 'fokus').forEach(k => {
    const i = leistungen(k.id, WELT_ID).findIndex(l => l.id === zustand.wahl[k.id]);
    if (i >= 0) zustand.blick[k.id] = i;
  });
  zustand.schritt = 0;
  szene.baueDjs(djListe(), zustand.djIndex);
  /* Was schon im Korb liegt, steht von Anfang an auf der Fläche */
  rigNeu();
}

navPunkte();
zeichnen(true);
Klang.zeigen(djListe()[zustand.djIndex], false);
tonZeichnen();
