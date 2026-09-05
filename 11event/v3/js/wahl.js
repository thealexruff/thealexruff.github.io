/* ==================================================================
   WAHL — die Eingangsseite. Drei Karten, ein Klick, dann weiter in
   die passende Welt. Bewusst schlicht: hier soll niemand hängen.
   ================================================================== */

(() => {
  const SAETZE = {
    wedding:   'Weiß, warm und ohne Bass im Bauch — bis der Abend kippt und die Tanzfläche voll wird.',
    corporate: 'Bühne, Licht und LED-Wand für Konferenzen, Jubiläen und Abende mit Programm.',
    private:   'Geburtstag, Sommerfest, Rohbau-Rave. Laut, dunkel und richtig gebaut.'
  };
  const MOTIV = { wedding:'deko', corporate:'led', private:'tanz' };

  const bahn   = document.getElementById('karussell');
  const punkte = document.getElementById('wahlpunkte');
  if (!bahn) return;

  bahn.innerHTML = WELT_REIHE.map(id => {
    const w = WELTEN[id];
    return `
      <a class="welt" role="listitem" data-fuer="${id}" href="${w.ordner}/">
        <span class="welt__probe">${bild(MOTIV[id], id)}</span>
        <span class="welt__text">
          <span class="welt__name">${w.name}</span>
          <span class="welt__satz">${SAETZE[id]}</span>
          <span class="welt__mehr">
            Ansehen
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </span>
      </a>`;
  }).join('');

  /* Punkte zeigen an, wo man im Karussell steht */
  punkte.innerHTML = WELT_REIHE.map((id, i) =>
    `<button type="button" data-zu="${i}" aria-current="${i === 0}"
             aria-label="${WELTEN[id].name}"></button>`).join('');

  const karten = [...bahn.querySelectorAll('.welt')];

  punkte.addEventListener('click', (e) => {
    const b = e.target.closest('[data-zu]');
    if (b) karten[+b.dataset.zu].scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
  });

  if ('IntersectionObserver' in window) {
    const beob = new IntersectionObserver((eintraege) => {
      eintraege.forEach(e => {
        if (!e.isIntersecting) return;
        const i = karten.indexOf(e.target);
        [...punkte.children].forEach((p, j) => p.setAttribute('aria-current', String(i === j)));
      });
    }, { root: bahn, threshold: 0.6 });
    karten.forEach(k => beob.observe(k));
  }

  document.querySelectorAll('[data-jahr]').forEach(e => {
    e.textContent = new Date().getFullYear();
  });

  /* ----------------------------------------------------------------
     Anlass wechseln: liegt in einer anderen Welt schon etwas im Korb,
     fragen wir, statt heimlich zu löschen oder heimlich zu übernehmen.
     ---------------------------------------------------------------- */
  const dialog = document.getElementById('uebernahme');

  bahn.addEventListener('click', (e) => {
    const karte = e.target.closest('.welt');
    if (!karte || !dialog) return;
    const ziel = karte.dataset.fuer;

    /* Hat das Ziel schon etwas, wird nichts angefasst. */
    if (Object.keys(Korb.laden(ziel)).length) return;

    const quellen = Korb.volleWelten(ziel);
    if (!quellen.length) return;

    /* Zuletzt benutzte Welt bevorzugen */
    const von = quellen.includes(Korb.letzteWelt()) ? Korb.letzteWelt() : quellen[0];
    const { neu, weg } = Korb.passend(von, ziel);
    const anzahl = Object.keys(neu).length;

    e.preventDefault();
    dialog.dataset.von  = von;
    dialog.dataset.nach = ziel;
    dialog.dataset.url  = karte.getAttribute('href');

    document.getElementById('uebernahmeText').innerHTML =
      `Ihr habt schon eine Auswahl für <b>${WELTEN[von].name}</b>. `
      + (anzahl
          ? `Davon ${anzahl === 1 ? 'passt einer' : `passen ${anzahl}`} auch zu ${WELTEN[ziel].name}.`
          : `Davon passt nichts zu ${WELTEN[ziel].name}.`);

    document.getElementById('uebernahmeListe').innerHTML =
      Object.values(neu).map(id => `<li>${leistung(id).name}</li>`).join('')
      + weg.map(l => `<li class="faellt-weg">${l.name} <small>gibt es dort nicht</small></li>`).join('');

    document.getElementById('uebernahmeJa').hidden = anzahl === 0;
    dialog.dataset.offen = 'true';
  });

  if (dialog) {
    dialog.addEventListener('click', (e) => {
      const b = e.target.closest('[data-tun]');
      if (!b && e.target !== dialog) return;
      const tun = b ? b.dataset.tun : 'ab';

      if (tun === 'uebernehmen') {
        Korb.uebernehmen(dialog.dataset.von, dialog.dataset.nach);
        location.href = dialog.dataset.url;
      } else if (tun === 'neu') {
        Korb.speichern(dialog.dataset.nach, {});
        location.href = dialog.dataset.url;
      } else {
        dialog.dataset.offen = 'false';
      }
    });
  }
})();
