/* problematica · actividad de selección múltiple (muestra la respuesta correcta) */
(function () {
  const { $, $$ } = ODC;
  const act = $('#problematica [data-act="mcq"]');
  $$(".mcq", act).forEach((q) => {
    $$(".opt", q).forEach((btn) => btn.addEventListener("click", () => {
      const ok = btn.dataset.ok === "1";
      $$(".opt", q).forEach((b) => { b.disabled = true; if (b.dataset.ok === "1") b.classList.add("is-correct"); });
      if (!ok) btn.classList.add("is-wrong");
      const res = $(".tf-res", q);
      res.hidden = false;
      res.className = `tf-res ${ok ? "is-ok" : "is-bad"}`;
      res.textContent = ok ? "Respuesta correcta." : "Respuesta incorrecta. La respuesta correcta es la marcada en verde.";
    }));
  });
  $("[data-reset]", act).addEventListener("click", () => {
    $$(".mcq", act).forEach((q) => {
      $$(".opt", q).forEach((b) => { b.disabled = false; b.classList.remove("is-correct", "is-wrong"); });
      $(".tf-res", q).hidden = true;
    });
  });
})();
