/* introduccion · actividad de verdadero o falso */
(function () {
  const { $, $$ } = ODC;
  const act = $('#introduccion [data-act="tf"]');
  $$(".tf", act).forEach((row) => {
    $$(".opt", row).forEach((btn) => btn.addEventListener("click", () => {
      const ok = btn.dataset.v === row.dataset.answer;
      $$(".opt", row).forEach((b) => { b.disabled = true; });
      btn.classList.add(ok ? "is-correct" : "is-wrong");
      if (!ok) $(`.opt[data-v="${row.dataset.answer}"]`, row).classList.add("is-correct");
      const res = $(".tf-res", row);
      res.hidden = false;
      res.className = `tf-res ${ok ? "is-ok" : "is-bad"}`;
      res.innerHTML = `<strong>Respuesta:</strong> ${row.dataset.label}. <strong>Por qué:</strong> ${row.dataset.why}`;
    }));
  });
  $("[data-reset]", act).addEventListener("click", () => {
    $$(".tf", act).forEach((row) => {
      $$(".opt", row).forEach((b) => { b.disabled = false; b.classList.remove("is-correct", "is-wrong"); });
      $(".tf-res", row).hidden = true;
    });
  });
})();
