/* ==================================================================
   KLANG — ein einziger SoundCloud-Player für die ganze Seite.

   Wichtig: der <iframe> wird nie im Baum verschoben und nie neu
   erzeugt — nur seine Adresse wechselt. Dadurch läuft die Musik
   weiter, wenn man von der DJ-Auswahl zum Licht und zur Anfrage geht.

   Stumm ist ein Schalter, kein Zustand des Players: solange stumm
   an ist, startet nichts von allein.
   ================================================================== */

const Klang = (() => {
  const rahmen = document.getElementById('scFrame');

  let widget = null;
  let dj = null;
  let stumm = false;
  let sollSpielen = false;
  let spielt = false;
  let melder = () => {};

  const adresse = (set, auto) =>
    'https://w.soundcloud.com/player/?url=' + encodeURIComponent(set) +
    '&color=%23F9A163' +
    '&auto_play=' + (auto ? 'true' : 'false') +
    '&hide_related=true&show_comments=false&show_user=true' +
    '&show_reposts=false&show_teaser=false&visual=true';

  function binden() {
    if (!window.SC || !SC.Widget) return;
    widget = SC.Widget(rahmen);
    widget.bind(SC.Widget.Events.READY, () => {
      widget.bind(SC.Widget.Events.PLAY,   () => { spielt = true;  melder(); });
      widget.bind(SC.Widget.Events.PAUSE,  () => { spielt = false; melder(); });
      widget.bind(SC.Widget.Events.FINISH, () => { spielt = false; melder(); });
      if (sollSpielen && !stumm) widget.play();
    });
  }

  /* Manche Browser schlucken ein play() aus dem Elternfenster.
     Läuft nach kurzer Zeit nichts, laden wir den Player einfach
     mit auto_play neu — das kommt durch. */
  function anstupsen() {
    if (!widget) return;
    widget.play();
    setTimeout(() => {
      if (!widget || stumm || !dj) return;
      widget.isPaused((pausiert) => {
        if (pausiert && !stumm && dj) {
          sollSpielen = true;
          rahmen.src = adresse(dj.set, true);
          binden();
        }
      });
    }, 700);
  }

  return {
    /* Wird beim Durchsehen und beim Auswählen gerufen.
       spielen = true heißt: jetzt losspielen (außer es ist stumm). */
    zeigen(neuerDj, spielen = false) {
      if (!neuerDj || !neuerDj.set) return;
      const start = spielen && !stumm;

      if (dj && dj.id === neuerDj.id) {
        if (start) anstupsen();
        return;
      }

      dj = neuerDj;
      sollSpielen = start;
      spielt = false;
      rahmen.src = adresse(neuerDj.set, start);
      binden();
      melder();
    },

    stummSchalten(an) {
      stumm = an;
      if (an) {
        if (widget) widget.pause();
        spielt = false;
      } else if (widget && dj) {
        anstupsen();
      }
      melder();
    },

    beiAenderung(fn) { melder = fn; },
    istStumm: () => stumm,
    spieltGerade: () => spielt,
    aktuellerDj: () => dj
  };
})();
