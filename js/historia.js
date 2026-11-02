/* historia · ordenar los momentos con los botones subir / bajar */
(function () {
  const { $, $$, setFeedback, LOREM } = ODC;
  const FEEDBACK = { ok: LOREM };                 // EDITAR: mensaje de éxito
  const act = $('#historia [data-act="order"]');
  const list = $(".order-list", act);
  const initial = $$(".order-item", list);
  const box = $(".feedback", act);

  function check() {
    const ok = $$(".order-item", list).every((it, i) => Number(it.dataset.step) === i + 1);
    list.classList.toggle("is-done", ok);
    $$(".icon-btn", list).forEach((b) => { b.disabled = ok; });
    setFeedback(box, ok ? FEEDBACK.ok : "", ok ? true : null);
  }
  list.addEventListener("click", (e) => {
    const b = e.target.closest("[data-move]");
    if (!b) return;
    const it = b.closest(".order-item");
    if (b.dataset.move === "up" && it.previousElementSibling) list.insertBefore(it, it.previousElementSibling);
    if (b.dataset.move === "down" && it.nextElementSibling) list.insertBefore(it.nextElementSibling, it);
    b.focus();
    check();
  });
  $("[data-reset]", act).addEventListener("click", () => { initial.forEach((it) => list.appendChild(it)); check(); });
})();
