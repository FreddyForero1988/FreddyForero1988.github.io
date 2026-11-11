/* modulo5 · identificar la fuente de cada sonido */
(function () {
  const { $, $$, setFeedback, LOREM_5_ok, LOREM_5_bad } = ODC;
  const FEEDBACK = { ok: LOREM_5_ok, bad: LOREM_5_bad };     // EDITAR: retroalimentación

  /* EDITAR: letra correcta (A–F) de cada sonido, en orden. Mientras haya valores null,
     «Verificar» avisa que faltan y no califica. Ejemplo: ["A", "C", "B", "D", "E", "F"] */
  const RESPUESTAS = ["F", "E", "A", "B", "C", "D"];

  /* EDITAR: los audios se ponen en html/modulo5.html (data-src de cada .audio-slot),
     por ejemplo data-src="assets/audio/sonido1.mp3" */
  const act = $('#modulo5 [data-act="sounds"]');
  const rows = $$(".sound", act);
  const fb = $(".feedback", act);
  let sonando = null;

  rows.forEach((row) => {
    const slot = $(".audio-slot", row);
    const note = $(".audio-note", slot);
    let audio = null;
    $(".btn-play", slot).addEventListener("click", () => {
      const src = (slot.dataset.src || "").trim();
      if (!src || src === "insertar audio") { note.hidden = false; return; }
      note.hidden = true;
      if (sonando && sonando !== audio) sonando.pause();
      if (!audio) audio = new Audio(src);
      audio.currentTime = 0;
      audio.play();
      sonando = audio;
    });
  });
  $("[data-check]", act).addEventListener("click", () => {
    if (rows.some((r) => !$("select", r).value)) { setFeedback(fb, "Elige una fuente para cada sonido antes de verificar.", false); return; }
    if (RESPUESTAS.some((a) => a === null)) {
      setFeedback(fb, "Las respuestas correctas aún no están configuradas (RESPUESTAS en js/modulo5.js).", null); return;
    }
    let good = 0;
    rows.forEach((r, i) => {
      const ok = $("select", r).value === RESPUESTAS[i];
      r.classList.toggle("is-correct", ok);
      r.classList.toggle("is-wrong", !ok);
      if (ok) good += 1;
    });
    const all = good === rows.length;
    setFeedback(fb, `${all ? FEEDBACK.ok : FEEDBACK.bad} (${good} de ${rows.length} correctas)`, all);
  });
  $("[data-reset]", act).addEventListener("click", () => {
    rows.forEach((r) => { $("select", r).value = ""; r.classList.remove("is-correct", "is-wrong"); });
    setFeedback(fb, "", null);
  });
})();
