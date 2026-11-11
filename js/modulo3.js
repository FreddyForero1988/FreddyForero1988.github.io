/* modulo3 · ruido impulsivo: sí o no (la respuesta correcta está en data-answer de cada fila) */
(function () {
  const { $, $$, setFeedback, LOREM_3_ok, LOREM_3_bad } = ODC;
  const FEEDBACK = { ok: LOREM_3_ok, bad: LOREM_3_bad };     // EDITAR: retroalimentación
  const act = $('#modulo3 [data-act="yn"]');
  const rows = $$(".yn", act);
  const fb = $(".feedback", act);
  rows.forEach((r) => $$(".opt", r).forEach((b) => b.addEventListener("click", () => {
    $$(".opt", r).forEach((o) => o.classList.remove("is-selected", "is-correct", "is-wrong"));
    b.classList.add("is-selected");
    setFeedback(fb, "", null);
  })));
  $("[data-check]", act).addEventListener("click", () => {
    if (rows.some((r) => !$(".opt.is-selected, .opt.is-correct, .opt.is-wrong", r))) {
      setFeedback(fb, "Responde todas las filas antes de verificar.", false); return;
    }
    let good = 0;
    rows.forEach((r) => {
      const chosen = $$(".opt", r).find((o) => o.classList.contains("is-selected") || o.classList.contains("is-correct") || o.classList.contains("is-wrong"));
      const ok = chosen.dataset.v === r.dataset.answer;
      chosen.classList.remove("is-selected", "is-correct", "is-wrong");
      chosen.classList.add(ok ? "is-correct" : "is-wrong");
      if (ok) good += 1;
    });
    const all = good === rows.length;
    setFeedback(fb, `${all ? FEEDBACK.ok : FEEDBACK.bad} (${good} de ${rows.length} correctas)`, all);
  });
  $("[data-reset]", act).addEventListener("click", () => {
    $$(".opt", act).forEach((o) => o.classList.remove("is-selected", "is-correct", "is-wrong"));
    setFeedback(fb, "", null);
  });
})();
