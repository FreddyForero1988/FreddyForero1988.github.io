/* modulo6 · actividad de preferencia (no tiene respuestas correctas) */
(function () {
  const { $, $$, setFeedback, LOREM } = ODC;
  const FEEDBACK = { ok: LOREM };                 // EDITAR: mensaje al elegir una opción en cada fila
  const act = $('#modulo6 [data-act="pref"]');
  const rows = $$(".pref", act);
  const fb = $(".feedback", act);
  function update() {
    const done = rows.every((r) => $(".opt.is-selected", r));
    setFeedback(fb, done ? FEEDBACK.ok : "", done ? true : null);
  }
  rows.forEach((r) => $$(".opt", r).forEach((b) => b.addEventListener("click", () => {
    $$(".opt", r).forEach((o) => o.classList.toggle("is-selected", o === b));
    update();
  })));
  $("[data-reset]", act).addEventListener("click", () => { $$(".opt", act).forEach((o) => o.classList.remove("is-selected")); update(); });
})();
