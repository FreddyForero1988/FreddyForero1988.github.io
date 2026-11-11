/* modulo4 · completar las oraciones digitando el número (respuesta en data-answer de cada casilla) */
(function () {
  const { $, $$, setFeedback, LOREM_4_ok, LOREM_4_bad } = ODC;
  const FEEDBACK = { ok: LOREM_4_ok, bad: LOREM_4_bad };     // EDITAR: retroalimentación
  const act = $('#modulo4 [data-act="fill"]');
  const inputs = $$(".fill-in", act);
  const fb = $(".feedback", act);
  inputs.forEach((i) => i.addEventListener("input", () => i.classList.remove("is-correct", "is-wrong")));
  $("[data-check]", act).addEventListener("click", () => {
    if (inputs.some((i) => i.value.trim() === "")) { setFeedback(fb, "Completa todos los espacios antes de verificar.", false); return; }
    let good = 0;
    inputs.forEach((i) => {
      const ok = Number(i.value) === Number(i.dataset.answer);
      i.classList.toggle("is-correct", ok);
      i.classList.toggle("is-wrong", !ok);
      if (ok) good += 1;
    });
    const all = good === inputs.length;
    setFeedback(fb, `${all ? FEEDBACK.ok : FEEDBACK.bad} (${good} de ${inputs.length} correctas)`, all);
  });
  $("[data-reset]", act).addEventListener("click", () => {
    inputs.forEach((i) => { i.value = ""; i.classList.remove("is-correct", "is-wrong"); });
    setFeedback(fb, "", null);
  });
})();
