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
function bibliothekBauen() {
  const ziel = $('#bibliothek');
  if (!ziel) return;

  ziel.innerHTML = kategorienFuer(WELT_ID).map(k => {
    const liste = leistungen(k.id, WELT_ID);
    return `
      <section class="gruppe" id="${k.id}">
        <div class="gruppe__kopf">
          <div>
            <span class="hut">${k.name}</span>
            <h2>${k.frage}</h2>
          </div>
          <p>${k.kurz}</p>
        </div>
        <div class="raster raster--${liste.length >= 3 ? '3' : '2'}">
          ${liste.map(l => karteLeistung(l)).join('')}
        </div>
      </section>`;
  }).join('');
}

function karteLeistung(l) {
  const person = l.kat === 'dj' || l.kat === 'foto' || l.kat === 'film';
  return `
    <a class="karte kommt" href="service.html?id=${l.id}">
      ${person ? `
        <div class="kopfzeile">
          <span class="zeichen">${kuerzel(l.name)}</span>
          <span><b>${l.name}</b><small>${l.stil || ''}</small></span>
        </div>`
      : `<span class="bild">${bild(KAT_MOTIV[l.kat] || 'buehne', WELT_ID)}</span>
         <h3>${l.name}${l.zusatz ? ` <span class="leise" style="font-weight:400">· ${l.zusatz}</span>` : ''}</h3>`}
      <p>${l.kurz}</p>
      <span class="karte__pfeil">
        <span class="preisz" style="font-size:19px">${preisText(l)}</span>
        <span style="float:right">Ansehen →</span>
      </span>
    </a>`;
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
            <div class="held__knoepfe" style="justify-content:flex-start;margin-top:22px">
              <a class="knopf knopf--voll" href="konfigurator.html?w=${l.id}">In den Konfigurator</a>
            </div>
            <p class="fein" style="margin-top:12px">
              Öffnet den Konfigurator mit ${l.name} bereits ausgewählt.
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
}

/* Standbild der Bühne auf der Landingpage */
function vorschauBauen() {
  const svg = $('#vorschau');
  if (!svg || typeof Szene === 'undefined') return;

  setzeWeltFarben(WELT_ID);
  const szene = new Szene(svg, WELT.flaeche);
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
