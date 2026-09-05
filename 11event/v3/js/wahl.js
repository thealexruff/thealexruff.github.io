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
})();
