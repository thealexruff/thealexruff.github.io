/* ==================================================================
   LISTEN — die Karten auf den Landingpages kommen aus data.js.
   So steht jeder Preis nur an einer Stelle.
   ================================================================== */

const euroKurz = (n) => new Intl.NumberFormat('de-DE', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0
}).format(n);

function paketKarte(p, hervor) {
  return `
    <article class="karte paket kommt${hervor ? ' paket--hebt' : ''}">
      <span class="hut">${p.zusatz}</span>
      <h3>Stage ${p.name}</h3>
      <p class="paket__preis">
        ${p.inklusive ? 'inklusive' : euroKurz(p.preis)}
        <small>· ${p.gaeste}</small>
      </p>
      <p>${p.text}</p>
      <ul>${p.daten.map(([k, v]) => `<li>${k}: ${v}</li>`).join('')}</ul>
    </article>`;
}

function personKarte(p, rolle, klasse) {
  const kuerzel = p.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return `
    <article class="karte person kommt">
      <div class="person__kopf">
        <span class="person__zeichen ${klasse}">${kuerzel}</span>
        <span>
          <span class="person__name">${p.name}</span>
          <span class="person__rolle">${rolle}</span>
        </span>
      </div>
      <p>${p.text}</p>
      <div class="person__fuss">
        <span class="person__preis">${euroKurz(p.preis)}<small> / ${p.einheit || 'Abend'}</small></span>
        <a class="knopf knopf--leer knopf--klein" href="${KONF}">Auswählen</a>
      </div>
    </article>`;
}

function partnerKarte(p) {
  return `
    <article class="karte person kommt" data-fach="${p.fach}">
      <div class="person__kopf">
        <span class="person__zeichen">${p.kuerzel}</span>
        <span>
          <span class="person__name">${p.name}</span>
          <span class="person__rolle">${PARTNER_FACH[p.fach]}</span>
        </span>
      </div>
      <p>${p.text}</p>
      ${p.url ? `<div class="person__fuss"><span></span>
        <a class="knopf knopf--leer knopf--klein" href="${p.url}" target="_blank" rel="noopener noreferrer">Zur Website ↗</a>
      </div>` : ''}
    </article>`;
}

/* Wohin die "Auswählen"-Knöpfe zeigen — je nach Welt */
const KONF = (document.body.dataset.welt === 'hochzeit')
  ? 'konfigurator.html?welt=hochzeit' : 'konfigurator.html';

(() => {
  const setz = (id, html) => { const e = document.getElementById(id); if (e) e.innerHTML = html; };

  setz('pakete-liste', STAGE.map((p, i) => paketKarte(p, i === 1)).join(''));
  setz('djs-liste',    DJS.map(d => personKarte(d, 'DJ', '')).join(''));
  setz('crew-liste',
    FOTO.map(p => personKarte(p, 'Fotograf:in', 'person__zeichen--foto')).join('') +
    FILM.map(p => personKarte(p, 'Videograf:in', 'person__zeichen--film')).join(''));
  setz('partner', PARTNER.map(partnerKarte).join(''));
})();
