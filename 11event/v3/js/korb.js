/* ==================================================================
   KORB — was ausgewählt ist, überlebt den Seitenwechsel.

   Gespeichert wird pro Welt, weil eine Hochzeit und ein Firmenevent
   nichts miteinander zu tun haben. Form: { kategorie: leistungsId }
   — dieselbe Form, die der Konfigurator ohnehin führt.
   ================================================================== */

const Korb = (() => {
  const schluessel = (welt) => `11event.korb.${welt}`;

  function laden(welt) {
    try {
      const roh = JSON.parse(localStorage.getItem(schluessel(welt)) || '{}');
      /* Nur behalten, was es noch gibt und was in dieser Welt gilt —
         sonst hängt nach einer Katalogänderung eine Leiche im Korb. */
      const sauber = {};
      Object.entries(roh).forEach(([kat, id]) => {
        const l = leistung(id);
        if (l && l.kat === kat && gilt(l, welt)) sauber[kat] = id;
      });
      return sauber;
    } catch { return {}; }
  }

  function speichern(welt, wahl) {
    try {
      const raus = {};
      Object.entries(wahl).forEach(([k, v]) => { if (v) raus[k] = v; });
      localStorage.setItem(schluessel(welt), JSON.stringify(raus));
    } catch { /* privater Modus: dann eben nicht */ }
    melden();
  }

  function umschalten(welt, id) {
    const l = leistung(id);
    if (!l) return null;
    const wahl = laden(welt);
    wahl[l.kat] = (wahl[l.kat] === id) ? null : id;
    speichern(welt, wahl);
    return wahl[l.kat];
  }

  function drin(welt, id) { return laden(welt)[leistung(id)?.kat] === id; }

  function posten(welt) {
    return Object.values(laden(welt)).map(leistung).filter(Boolean);
  }
  const summe = (welt) => posten(welt).reduce((s, l) => s + l.preis, 0);

  /* Wer sich für Änderungen interessiert, meldet sich hier an */
  let hoerer = [];
  const melden = () => hoerer.forEach(f => f());
  const beiAenderung = (f) => hoerer.push(f);

  return { laden, speichern, umschalten, drin, posten, summe, beiAenderung };
})();
