/* ==================================================================
   SEITE — baut Landingpage, Bibliothek und Detailseite.

   Alle drei lesen aus katalog.js. Wer dort eine Leistung einträgt,
   sieht sie sofort überall — auch im Konfigurator.
   ================================================================== */

const $  = (s, w = document) => w.querySelector(s);
const $$ = (s, w = document) => [...w.querySelectorAll(s)];

const WELT_ID = document.body.dataset.welt;
const WELT    = WELTEN[WELT_ID];

const euro = (n) => new Intl.NumberFormat('de-DE', {
  style:'currency', currency:'EUR', maximumFractionDigits:0
}).format(n);
const preisText = (l) => l.inklusive ? 'inklusive'
  : euro(l.preis) + (l.einheit ? ` <small>/ ${l.einheit}</small>` : '');

const kuerzel = (name) =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

/* Motiv je Kategorie */
const KAT_MOTIV = { dj:'dj', stage:'buehne', led:'led', skin:'deko', foto:'kamera', film:'kamera' };

/* ==================================================================
   Kopf und Fuß — überall gleich, nur die Adressen wechseln
   ================================================================== */
function navBauen() {
  const hier = location.pathname.split('/').pop() || 'index.html';
  const punkte = [
    ['index.html',    'Überblick'],
    ['services.html', 'Leistungen'],
    ['konfigurator.html', 'Konfigurator']
  ];
  const links = punkte.map(([h, t]) =>
    `<a href="${h}"${h === hier ? ' aria-current="page"' : ''}>${t}</a>`).join('');

  const kopf = $('#kopf');
  if (kopf) kopf.innerHTML = `
    <div class="kopf__inner">
      <a class="marke" href="index.html" aria-label="11EVENT">
        <svg class="marke__11" viewBox="0 0 455 790" aria-hidden="true"><path d="M0 43H200V790H90V163H0Z"/><path d="M245 0H455V790H335V118H245Z"/></svg>
        <span class="marke__wort">EVENT</span>
      </a>
      <nav class="kopf__nav">${links}</nav>
      <div class="kopf__rechts">
        <a class="knopf knopf--leer knopf--klein kopf__welt" href="../">Anlass wechseln</a>
        <a class="knopf knopf--voll knopf--klein" href="konfigurator.html">Zusammenstellen</a>
        <button class="menue" id="menue" type="button" aria-expanded="false" aria-controls="schublade" aria-label="Menü">
          <span><i></i><i></i><i></i></span>
        </button>
      </div>
    </div>
    <div class="schublade" id="schublade" data-offen="false"><div>
      <div class="schublade__inner">${links}<a href="../">Anlass wechseln</a></div>
    </div></div>`;

  const fuss = $('#fuss');
  if (fuss) fuss.innerHTML = `
    <div class="fuss__inner">
      <div style="display:flex;gap:14px;align-items:flex-start">
        <img class="kachel" src="../img/logo-11event.png" alt="11EVENT" width="60" loading="lazy">
        <div>
          <a class="marke" href="index.html" aria-label="11EVENT">
            <svg class="marke__11" viewBox="0 0 455 790" aria-hidden="true"><path d="M0 43H200V790H90V163H0Z"/><path d="M245 0H455V790H335V118H245Z"/></svg>
            <span class="marke__wort">EVENT</span>
          </a>
          <p class="fein" style="margin-top:10px;max-width:26ch">
            Licht, Musik und Bilder für ${WELT.name.toLowerCase() === 'hochzeit' ? 'euren Tag' : 'euren Abend'}.
          </p>
        </div>
      </div>
      <nav class="fuss__links">
        <a href="index.html">Überblick</a>
        <a href="services.html">Leistungen</a>
        <a href="konfigurator.html">Konfigurator</a>
        <a href="../">Anderer Anlass</a>
      </nav>
      <div class="fuss__recht">
        <a href="mailto:${KONTAKT_MAIL}">${KONTAKT_MAIL}</a>
        <p class="fein" style="margin-top:8px">© <span data-jahr></span> 11EVENT · Impressum folgt</p>
      </div>
    </div>`;
}

/* ==================================================================
   Landingpage
   ================================================================== */
function landingBauen() {
  const ziel = $('#landing');
  if (!ziel) return;
  const kats = kategorienFuer(WELT_ID);

  ziel.innerHTML = `
    <section class="held">
      <div class="glut" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="held__inner">
        <span class="pille">${WELT.zeile} · Licht · DJ · Foto · Video</span>
        <h1>${WELT.kopf}</h1>
        <p class="held__text">${WELT.unter}</p>
        <div class="held__knoepfe">
          <a class="knopf knopf--voll" href="konfigurator.html">Zusammenstellen</a>
          <a class="knopf knopf--leer" href="services.html">Leistungen ansehen</a>
        </div>
        <div class="held__zahlen">
          ${WELT.zahlen.map(([b, t]) => `<div><b>${b}</b><span>${t}</span></div>`).join('')}
        </div>
      </div>
    </section>

    <section class="bahn bahn--linie bahn--grund">
      <div class="bahn__inner">
        <span class="hut">Was wir mitbringen</span>
        <h2>${kats.length} Gewerke, ein Aufbau</h2>
        <p class="bahn__text">
          Jedes davon könnt ihr einzeln buchen. Zusammen ergibt es einen Abend,
          bei dem sich niemand um Schnittstellen kümmern muss.
        </p>
        <div class="raster raster--3">
          ${kats.map(k => `
            <a class="karte kommt" href="services.html#${k.id}">
              <span class="bild">${bild(KAT_MOTIV[k.id] || 'buehne', WELT_ID)}</span>
              <h3>${k.name}</h3>
              <p>${k.kurz}</p>
              <span class="karte__pfeil">${leistungen(k.id, WELT_ID).length} ${k.mehrzahl} ansehen →</span>
            </a>`).join('')}
        </div>
      </div>
    </section>

    <section class="bahn bahn--linie">
      <div class="bahn__inner">
        <span class="hut">Die Fläche</span>
        <h2>So sieht es aus, bevor es steht</h2>
        <p class="bahn__text">
          Keine Illustration, sondern derselbe Aufbau, den ihr im Konfigurator
          selbst zusammenschiebt.
        </p>
        <div class="vorschau kommt">
          <svg id="vorschau" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"
               role="img" aria-label="Vorschau einer aufgebauten Bühne"></svg>
          <div class="vorschau__band">
            <p id="vorschauText"></p>
            <a class="knopf knopf--voll knopf--klein" href="konfigurator.html">Selbst zusammenstellen</a>
          </div>
        </div>
      </div>
    </section>

    <section class="bahn bahn--linie bahn--grund">
      <div class="bahn__inner">
        <div class="ruf">
          <div class="glut" aria-hidden="true"><i></i><i></i><i></i></div>
          <div style="position:relative;z-index:1">
            <h2>${WELT.ruf}</h2>
            <p>${WELT.rufText}</p>
            <div class="held__knoepfe">
              <a class="knopf knopf--voll" href="konfigurator.html">Konfigurator öffnen</a>
              <a class="knopf knopf--leer" href="services.html">Erst mal stöbern</a>
            </div>
          </div>
        </div>
      </div>
    </section>`;
}

/* ==================================================================
   Bibliothek
   ================================================================== */
let gruppeJetzt = null;

function bibliothekBauen() {
  const ziel = $('#bibliothek');
  if (!ziel) return;

  const kats = kategorienFuer(WELT_ID);
  gruppeJetzt = gruppeJetzt || (location.hash.slice(1).split('/')[0]) || kats[0].id;
  if (!kats.some(k => k.id === gruppeJetzt)) gruppeJetzt = kats[0].id;

  ziel.innerHTML = `
    <div class="waehler" id="waehler">
      ${kats.map(k => `
        <button type="button" data-gruppe="${k.id}" aria-pressed="${k.id === gruppeJetzt}">
          ${k.name}<small>${leistungen(k.id, WELT_ID).length}</small>
        </button>`).join('')}
    </div>
    <div id="gruppe"></div>`;

  gruppeZeichnen();
}

function gruppeZeichnen() {
  const k = kategorie(gruppeJetzt);
  const liste = leistungen(k.id, WELT_ID);
  const ziel = $('#gruppe');
  if (!ziel) return;

  ziel.innerHTML = `
    <div class="gruppe__kopf">
      <div><span class="hut">${k.name}</span><h2>${k.frage}</h2></div>
      <p>${k.kurz}</p>
    </div>
    <div class="raster raster--${liste.length >= 3 ? '3' : '2'}">
      ${liste.map(l => karteLeistung(l)).join('')}
    </div>`;
  korbKnoepfe();
}

function karteLeistung(l) {
  const person = ['dj','foto','film'].includes(l.kat);
  return `
    <article class="karte kommt da">
      <button class="karte__flaeche" type="button" data-zeigen="${l.id}"
              aria-label="${l.name} ansehen">
        ${person ? `
          <span class="kopfzeile">
            <span class="zeichen">${kuerzel(l.name)}</span>
            <span><b>${l.name}</b><small>${l.stil || ''}</small></span>
          </span>`
        : `<span class="bild">${bild(KAT_MOTIV[l.kat] || 'buehne', WELT_ID)}</span>
           <h3>${l.name}${l.zusatz ? ` <span class="leise" style="font-weight:400">· ${l.zusatz}</span>` : ''}</h3>`}
        <span class="karte__satz">${l.kurz}</span>
      </button>
      <div class="karte__aktion">
        <span class="preisz" style="font-size:19px">${preisText(l)}</span>
        ${l.inklusive ? '<span class="fein">immer dabei</span>'
          : `<button class="knopf knopf--klein" type="button" data-korb="${l.id}"></button>`}
      </div>
    </article>`;
}

/* ==================================================================
   Detailseite
   ================================================================== */
function detailBauen() {
  const ziel = $('#detail');
  if (!ziel) return;

  const id = new URLSearchParams(location.search).get('id');
  const l  = leistung(id);

  if (!l || !gilt(l, WELT_ID)) {
    ziel.innerHTML = `
      <section class="bahn"><div class="bahn__inner" style="text-align:center">
        <h2>Diese Leistung gibt es hier nicht</h2>
        <p class="bahn__text" style="margin-left:auto;margin-right:auto">
          Womöglich gehört sie zu einem anderen Anlass.
        </p>
        <div class="held__knoepfe"><a class="knopf knopf--voll" href="services.html">Zur Bibliothek</a></div>
      </div></section>`;
    return;
  }

  const k = kategorie(l.kat);
  const person = ['dj','foto','film'].includes(l.kat);
  document.title = `${l.name} — 11EVENT`;

  ziel.innerHTML = `
    <section class="held" style="padding-bottom:36px">
      <div class="glut" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="held__inner">
        <span class="pille">${k.name}</span>
        <h1>${l.name}</h1>
        <p class="held__text">${l.stil || l.zusatz || ''}</p>
      </div>
    </section>

    <section class="bahn" style="padding-top:0">
      <div class="bahn__inner">
        <div class="raster raster--2" style="align-items:start">
          <div class="karte">
            ${person ? `<div class="kopfzeile">
                <span class="zeichen">${kuerzel(l.name)}</span>
                <span><b>${l.name}</b><small>${k.name}</small></span>
              </div>`
              : `<span class="bild">${bild(KAT_MOTIV[l.kat] || 'buehne', WELT_ID)}</span>`}
            <p style="font-size:15.5px">${l.lang}</p>
            <dl class="daten">
              ${(l.fakten || []).map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}
            </dl>
          </div>

          <div class="karte">
            <span class="hut">Preis</span>
            <p class="preisz">${preisText(l)}</p>
            <p class="fein">Alle Preise inklusive Anfahrt im Umkreis von 50 km. Unverbindlich.</p>
            ${(l.links || []).filter(x => x.url).length ? `
              <ul class="liste">
                ${(l.links || []).filter(x => x.url).map(x =>
                  `<li><a href="${x.url}" target="_blank" rel="noopener noreferrer">${x.titel} ↗</a></li>`).join('')}
              </ul>` : ''}
            <div style="margin-top:22px">
              ${l.inklusive
                ? '<p class="fein">Gehört zur Grundausstattung und ist immer dabei.</p>'
                : `<button class="knopf knopf--voll" type="button" data-korb="${l.id}" style="width:100%"></button>`}
            </div>
            <p class="fein" style="margin-top:12px">
              Bleibt gespeichert — im Konfigurator ist alles schon ausgewählt.
            </p>
          </div>
        </div>

        ${l.portfolio ? `
          <div style="margin-top:44px">
            <span class="hut">Arbeitsproben</span>
            <h2>Was dabei herauskommt</h2>
            <div class="portfolio">
              ${l.portfolio.map(s => `
                <figure class="stueck kommt" style="margin:0">
                  ${bild(s.motiv, WELT_ID)}
                  <figcaption class="stueck__text"><b>${s.titel}</b><small>${s.text}</small></figcaption>
                </figure>`).join('')}
            </div>
            <p class="fein" style="margin-top:14px">
              Gezeichnete Platzhalter — echte Bildstrecken folgen.
            </p>
          </div>` : ''}

        <div style="margin-top:44px">
          <a class="knopf knopf--leer" href="services.html#${l.kat}">← Alle ${k.mehrzahl}</a>
        </div>
      </div>
    </section>`;
}

/* ==================================================================
   Kleinkram
   ================================================================== */
/* ==================================================================
   Vorschau einer Leistung — volle Seite, ohne die Seite zu verlassen.
   Man kann darin weiterblättern, ohne zurückzuspringen.
   ================================================================== */
function vorschauOeffnen(id) {
  const l = leistung(id);
  if (!l || !gilt(l, WELT_ID)) return;
  const liste = leistungen(l.kat, WELT_ID);
  const i = liste.findIndex(x => x.id === l.id);
  const k = kategorie(l.kat);
  const person = ['dj','foto','film'].includes(l.kat);

  const blatt = $('#vorschauBlatt');
  blatt.innerHTML = `
    <div class="voll__leiste">
      <button class="voll__zu" type="button" data-zu aria-label="Schließen">
        <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <span class="voll__zaehler">${k.name} · ${i + 1} von ${liste.length}</span>
      <span class="voll__pfeile">
        <button type="button" data-blaettern="${i - 1}" ${i === 0 ? 'disabled' : ''} aria-label="Vorheriges">
          <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button type="button" data-blaettern="${i + 1}" ${i === liste.length - 1 ? 'disabled' : ''} aria-label="Nächstes">
          <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </span>
    </div>

    <div class="voll__inhalt">
      <div class="voll__kopf">
        <span class="hut">${k.name}</span>
        <h1>${l.name}</h1>
        <p class="held__text" style="margin-top:10px">${l.stil || l.zusatz || ''}</p>
      </div>

      <div class="raster raster--2" style="align-items:start;margin-top:28px">
        <div class="karte">
          ${person ? `<div class="kopfzeile">
              <span class="zeichen">${kuerzel(l.name)}</span>
              <span><b>${l.name}</b><small>${k.name}</small></span></div>`
            : `<span class="bild">${bild(KAT_MOTIV[l.kat] || 'buehne', WELT_ID)}</span>`}
          <p style="font-size:15.5px">${l.lang}</p>
          <dl class="daten">
            ${(l.fakten || []).map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}
          </dl>
        </div>
        <div class="karte">
          <span class="hut">Preis</span>
          <p class="preisz">${preisText(l)}</p>
          <p class="fein">Alle Preise inklusive Anfahrt im Umkreis von 50 km. Unverbindlich.</p>
          ${(l.links || []).filter(x => x.url).length ? `<ul class="liste">
            ${(l.links || []).filter(x => x.url).map(x =>
              `<li><a href="${x.url}" target="_blank" rel="noopener noreferrer">${x.titel} ↗</a></li>`).join('')}
          </ul>` : ''}
          <div style="margin-top:22px">
            ${l.inklusive
              ? '<p class="fein">Gehört zur Grundausstattung und ist immer dabei.</p>'
              : `<button class="knopf knopf--voll" type="button" data-korb="${l.id}" style="width:100%"></button>`}
          </div>
        </div>
      </div>

      ${l.portfolio ? `
        <div style="margin-top:40px">
          <span class="hut">Arbeitsproben</span>
          <h2>Was dabei herauskommt</h2>
          <div class="portfolio">
            ${l.portfolio.map(p => `
              <figure class="stueck" style="margin:0">
                ${bild(p.motiv, WELT_ID)}
                <figcaption class="stueck__text"><b>${p.titel}</b><small>${p.text}</small></figcaption>
              </figure>`).join('')}
          </div>
          <p class="fein" style="margin-top:14px">Gezeichnete Platzhalter — echte Bildstrecken folgen.</p>
        </div>` : ''}
    </div>`;

  blatt.dataset.offen = 'true';
  blatt.scrollTop = 0;
  document.body.classList.add('voll-offen');
  history.replaceState(null, '', `#${l.kat}/${l.id}`);
  korbKnoepfe();
}

function vorschauSchliessen() {
  const blatt = $('#vorschauBlatt');
  if (!blatt) return;
  blatt.dataset.offen = 'false';
  document.body.classList.remove('voll-offen');
  history.replaceState(null, '', `#${gruppeJetzt}`);
}

/* ==================================================================
   Korb — Knöpfe beschriften und die Leiste unten mitführen
   ================================================================== */
function korbKnoepfe() {
  $$('[data-korb]').forEach(b => {
    const drin = Korb.drin(WELT_ID, b.dataset.korb);
    b.textContent = drin ? 'Im Korb ✓' : 'Hinzufügen';
    b.classList.toggle('knopf--voll', !drin);
    b.classList.toggle('knopf--leer', drin);
    b.setAttribute('aria-pressed', String(drin));
  });
  korbLeiste();
}

function korbLeiste() {
  const bar = $('#korbBar');
  if (!bar) return;
  const p = Korb.posten(WELT_ID);
  bar.hidden = p.length === 0;
  if (!p.length) return;
  $('#korbBarText').textContent =
    `${p.length} ${p.length === 1 ? 'Position' : 'Positionen'} · ${euro(Korb.summe(WELT_ID))}`;

  /* Die Auswahl hängt zusätzlich am Link. Das macht ihn verschickbar
     und rettet die Übergabe, falls der Browser eine alte Seite hält. */
  const code = Korb.codieren(Korb.laden(WELT_ID));
  $('#korbBarLink').href = 'konfigurator.html' + (code ? `?korb=${code}` : '');
}

function verhalten() {
  const knopf = $('#menue'), lade = $('#schublade');
  if (knopf && lade) {
    knopf.addEventListener('click', () => {
      const auf = lade.dataset.offen !== 'true';
      lade.dataset.offen = String(auf);
      knopf.setAttribute('aria-expanded', String(auf));
    });
  }

  const kommt = $$('.kommt');
  if (kommt.length && 'IntersectionObserver' in window
      && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const beob = new IntersectionObserver((es) => {
      es.forEach((e, i) => {
        if (!e.isIntersecting) return;
        setTimeout(() => e.target.classList.add('da'), (i % 4) * 70);
        beob.unobserve(e.target);
      });
    }, { rootMargin:'0px 0px -10% 0px' });
    kommt.forEach(e => beob.observe(e));
  } else kommt.forEach(e => e.classList.add('da'));

  $$('[data-jahr]').forEach(e => { e.textContent = new Date().getFullYear(); });

  /* Ein Klick-Zuständiger für Bibliothek und Vorschau */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-gruppe],[data-zeigen],[data-blaettern],[data-korb],[data-zu]');
    if (!t) return;

    if (t.dataset.gruppe) {
      gruppeJetzt = t.dataset.gruppe;
      $$('#waehler button').forEach(b =>
        b.setAttribute('aria-pressed', String(b.dataset.gruppe === gruppeJetzt)));
      gruppeZeichnen();
      history.replaceState(null, '', `#${gruppeJetzt}`);
    }
    else if (t.dataset.zeigen) vorschauOeffnen(t.dataset.zeigen);
    else if (t.dataset.blaettern !== undefined) {
      const liste = leistungen(gruppeJetzt, WELT_ID);
      const n = +t.dataset.blaettern;
      if (liste[n]) vorschauOeffnen(liste[n].id);
    }
    else if (t.dataset.korb) { Korb.umschalten(WELT_ID, t.dataset.korb); korbKnoepfe(); }
    else if (t.hasAttribute('data-zu')) vorschauSchliessen();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') vorschauSchliessen();
  });

  /* Direkt aufgerufener Anker: #kategorie/leistung */
  const [g, id] = location.hash.slice(1).split('/');
  if (id) vorschauOeffnen(id);
  korbKnoepfe();
}

/* Standbild der Bühne auf der Landingpage */
function vorschauBauen() {
  const svg = $('#vorschau');
  if (!svg || typeof Szene === 'undefined') return;

  setzeWeltFarben(WELT_ID);
  const kasten = svg.closest('.vorschau');
  if (kasten) kasten.style.background = WELT.szene.wand;
  const szene = new Szene(svg);
  const stage = leistungen('stage', WELT_ID).at(-1);
  const skin  = leistungen('skin',  WELT_ID).at(-1);
  const led   = leistungen('led',   WELT_ID).at(-1);
  const foto  = leistungen('foto',  WELT_ID)[0];
  const film  = leistungen('film',  WELT_ID)[0];

  szene.baueDjs([leistungen('dj', WELT_ID)[0]], 0);
  szene.baueRig({ stage, skin, led, foto, film });

  const t = $('#vorschauText');
  if (t) t.textContent = [stage.name, skin.name, led && led.led ? led.name : null, 'Foto', 'Video']
    .filter(Boolean).join(' · ');

  const rahmen = () => szene.setzeKamera(
    szene.rahmen(stage.sicht + (skin.hoehe || 0) + 90, 0, -194, 0.44, 700), true);
  rahmen();
  addEventListener('resize', rahmen);
}

navBauen();
landingBauen();
bibliothekBauen();
detailBauen();
vorschauBauen();
verhalten();
