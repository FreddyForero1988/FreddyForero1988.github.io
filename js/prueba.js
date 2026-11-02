/* prueba · prueba de conocimientos (10 preguntas, aprueba con 8) */
(function () {
  const { $, $$, setFeedback, LOREM } = ODC;
  const PASS_SCORE = 8;
  const FEEDBACK = {                              // EDITAR: retroalimentación
    perQuestion: { ok: LOREM, bad: LOREM },       // inmediata, después de responder cada pregunta
    final: { approved: LOREM, failed: LOREM }     // al pulsar «Ver Resultados»
  };
  /* La respuesta correcta de cada pregunta está en data-answer de cada .quiz-q (0 = primera opción) */

  const root = $("#quiz");
  const qs = $$(".quiz-q", root);
  const box = $("#quizFeedback");

  qs.forEach((q) => q.addEventListener("change", (e) => {
    if (!e.target.matches('input[type="radio"]')) return;
    const right = Number(q.dataset.answer);
    const ok = Number(e.target.value) === right;
    $$(".q-opt", q).forEach((l, j) => { $("input", l).disabled = true; l.classList.toggle("is-correct", j === right); });
    if (!ok) e.target.closest(".q-opt").classList.add("is-wrong");
    q.dataset.result = ok ? "1" : "0";
    const res = $(".q-res", q);
    res.hidden = false;
    res.textContent = ok ? FEEDBACK.perQuestion.ok : FEEDBACK.perQuestion.bad;
    q.closest(".expander").classList.add(ok ? "is-answered" : "is-bad");
  }));

  $("#quizResults").addEventListener("click", () => {
    const pending = qs.filter((q) => q.dataset.result === undefined).length;
    if (pending) { setFeedback(box, `Te faltan ${pending} pregunta(s) por responder.`, false); return; }
    const score = qs.filter((q) => q.dataset.result === "1").length;
    const passed = score >= PASS_SCORE;
    setFeedback(box, `Obtuviste ${score} de ${qs.length} respuestas correctas. ${passed ? FEEDBACK.final.approved : FEEDBACK.final.failed}`, passed);
  });
  $("#quizRetry").addEventListener("click", () => {
    qs.forEach((q) => {
      delete q.dataset.result;
      $$(".q-opt", q).forEach((l) => { l.classList.remove("is-correct", "is-wrong"); const i = $("input", l); i.checked = false; i.disabled = false; });
      $(".q-res", q).hidden = true;
      q.closest(".expander").classList.remove("is-answered", "is-bad");
    });
    setFeedback(box, "", null);
  });
})();
