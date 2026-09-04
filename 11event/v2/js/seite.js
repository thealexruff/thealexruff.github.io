/* ==================================================================
   SEITE — das bisschen Verhalten, das die Landingpages brauchen.
   ================================================================== */

(() => {
  const $  = (s, w = document) => w.querySelector(s);
  const $$ = (s, w = document) => [...w.querySelectorAll(s)];

  /* ---------- Menü auf dem Handy ---------- */
  const knopf = $('#menue'), lade = $('#schublade');
  if (knopf && lade) {
    knopf.addEventListener('click', () => {
      const auf = lade.dataset.offen !== 'true';
      lade.dataset.offen = String(auf);
      knopf.setAttribute('aria-expanded', String(auf));
    });
    $$('a', lade).forEach(a => a.addEventListener('click', () => {
      lade.dataset.offen = 'false';
      knopf.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- Beim Scrollen einblenden ---------- */
  const kommt = $$('.kommt');
  if (kommt.length && 'IntersectionObserver' in window
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const beob = new IntersectionObserver((eintraege) => {
      eintraege.forEach((e, i) => {
        if (!e.isIntersecting) return;
        setTimeout(() => e.target.classList.add('da'), (i % 4) * 70);
        beob.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    kommt.forEach(e => beob.observe(e));
  } else {
    kommt.forEach(e => e.classList.add('da'));
  }

  /* ---------- Jahreszahl im Fuß ---------- */
  $$('[data-jahr]').forEach(e => { e.textContent = new Date().getFullYear(); });

  /* ---------- Standbild der Bühne ----------
     Nutzt dieselbe Szene wie der Konfigurator, nur ohne Bedienung:
     ein Blick auf das, was hinter dem Link wartet. */
  const bild = $('#vorschau');
  if (bild && typeof Szene !== 'undefined') {
    const welt = document.body.dataset.welt || 'party';
    setzeWeltFarben(welt);
    const szene = new Szene(bild);
    const stage = STAGE.find(s => s.id === 'stage-L');
    const skin  = SKINS.find(s => s.id === (welt === 'hochzeit' ? 'skin-bluete' : 'skin-mainstage'));
    szene.baueDjs([DJS[0]], 0);
    szene.baueRig({
      stage, skin,
      foto: FOTO[0],
      film: FILM[0]
    });
    const rahmen = () => szene.setzeKamera(
      szene.rahmen(stage.sicht + skin.hoehe + 90, 0, -194, 0.44, 700), true);
    rahmen();
    window.addEventListener('resize', rahmen);
  }

  /* ---------- Partner filtern ---------- */
  const filter = $('#filter');
  if (filter) {
    filter.addEventListener('click', (e) => {
      const b = e.target.closest('[data-fach]');
      if (!b) return;
      const fach = b.dataset.fach;
      $$('#filter button').forEach(x =>
        x.setAttribute('aria-pressed', String(x.dataset.fach === fach)));
      $$('#partner [data-fach]').forEach(k => {
        k.hidden = fach !== 'alle' && k.dataset.fach !== fach;
      });
    });
  }
})();
