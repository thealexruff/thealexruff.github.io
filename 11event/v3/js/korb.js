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
    merkeWelt(welt);
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

  /* ---------- Übergabe per Adresse ----------
     Damit die Auswahl auch dann ankommt, wenn der Browser eine alte
     Seite im Speicher hat — und damit man einen Link verschicken kann. */
  function codieren(wahl) {
    const teile = Object.entries(wahl).filter(([, v]) => v).map(([, v]) => v);
    return teile.length ? encodeURIComponent(teile.join(',')) : '';
  }

  function ausAdresse(welt) {
    const roh = new URLSearchParams(location.search).get('korb');
    if (!roh) return null;
    const wahl = {};
    roh.split(',').forEach(id => {
      const l = leistung(id.trim());
      if (l && gilt(l, welt)) wahl[l.kat] = l.id;
    });
    return Object.keys(wahl).length ? wahl : null;
  }

  /* ---------- Welt wechseln ---------- */
  const ZULETZT = '11event.zuletzt';
  function merkeWelt(welt) { try { localStorage.setItem(ZULETZT, welt); } catch {} }
  function letzteWelt()    { try { return localStorage.getItem(ZULETZT); } catch { return null; } }

  /* Welche Welt hat überhaupt etwas im Korb? */
  function volleWelten(ausser) {
    return Object.keys(WELTEN).filter(w => w !== ausser && Object.keys(laden(w)).length);
  }

  /* Was davon lässt sich mitnehmen? DJs und Leute meistens, welt-eigene
     Sachen wie die LED-Wand oder Blumen-Deko nicht. */
  function passend(von, nach) {
    const alt = laden(von), neu = {}, weg = [];
    Object.values(alt).forEach(id => {
      const l = leistung(id);
      if (!l) return;
      if (gilt(l, nach) && kategorienFuer(nach).some(k => k.id === l.kat)) neu[l.kat] = id;
      else weg.push(l);
    });
    return { neu, weg };
  }

  function uebernehmen(von, nach) {
    const { neu } = passend(von, nach);
    speichern(nach, neu);
    return neu;
  }

  function posten(welt) {
    return Object.values(laden(welt)).map(leistung).filter(Boolean);
  }
  const summe = (welt) => posten(welt).reduce((s, l) => s + l.preis, 0);

  /* Wer sich für Änderungen interessiert, meldet sich hier an */
  let hoerer = [];
  const melden = () => hoerer.forEach(f => f());
  const beiAenderung = (f) => hoerer.push(f);

  return { laden, speichern, umschalten, drin, posten, summe, beiAenderung,
           codieren, ausAdresse, merkeWelt, letzteWelt, volleWelten, passend, uebernehmen };
})();
