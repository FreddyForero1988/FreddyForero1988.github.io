/* modulo1 · etapas de la red neuronal (marcar cada etapa como realizada) */
(function () {
  const { $, $$, setFeedback, LOREM } = ODC;
  const FEEDBACK = { ok: LOREM };                 // EDITAR: mensaje al completar las 4 etapas
  const act = $('#modulo1 [data-act="stages"]');
  const boxes = $$(".stage-done", act);
  const fb = $(".feedback", act);
  function update() {
    boxes.forEach((c) => c.closest(".stage").classList.toggle("is-done", c.checked));
    const all = boxes.every((c) => c.checked);
    setFeedback(fb, all ? FEEDBACK.ok : "", all ? true : null);
  }
  boxes.forEach((c) => c.addEventListener("change", update));
  $("[data-reset]", act).addEventListener("click", () => { boxes.forEach((c) => { c.checked = false; }); update(); });
})();
