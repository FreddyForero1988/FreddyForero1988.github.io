/* modulo2 · arrastrar y soltar (o tocar un concepto y luego la categoría) */
(function () {
  const { $, $$, setFeedback, LOREM_2_ok, LOREM_2_bad } = ODC;
  const FEEDBACK = { ok: LOREM_2_ok, bad: LOREM_2_bad };     // EDITAR: retroalimentación
  const act = $('#modulo2 [data-act="dnd"]');
  const pool = $("[data-pool]", act);
  const chips = $$(".chip", act);
  const zones = [pool, ...$$(".cat", act)];
  const fb = $(".feedback", act);
  const dropOf = (z) => (z === pool ? pool : $(".cat-drop", z));
  const zoneOf = (c) => c.closest(".cat") || pool;
  let selected = null, dragged = null;

  const clearMarks = () => chips.forEach((c) => c.classList.remove("is-correct", "is-wrong", "is-selected"));
  function place(chip, zone) { dropOf(zone).appendChild(chip); clearMarks(); selected = null; setFeedback(fb, "", null); }

  chips.forEach((c) => {
    c.addEventListener("click", () => {
      if (selected && selected !== c && zoneOf(selected) !== zoneOf(c)) { place(selected, zoneOf(c)); return; }
      clearMarks();
      selected = selected === c ? null : c;
      if (selected) c.classList.add("is-selected");
    });
    c.addEventListener("dragstart", (e) => { dragged = c; e.dataTransfer.setData("text/plain", c.dataset.id); });
    c.addEventListener("dragend", () => { dragged = null; zones.forEach((z) => z.classList.remove("is-over")); });
  });
  zones.forEach((z) => {
    z.addEventListener("dragover", (e) => { e.preventDefault(); z.classList.add("is-over"); });
    z.addEventListener("dragleave", () => z.classList.remove("is-over"));
    z.addEventListener("drop", (e) => { e.preventDefault(); z.classList.remove("is-over"); if (dragged) place(dragged, z); });
    z.addEventListener("click", (e) => { if (selected && !e.target.closest(".chip")) place(selected, z); });
    z.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && selected && !e.target.closest(".chip")) { e.preventDefault(); place(selected, z); }
    });
  });

  $("[data-check]", act).addEventListener("click", () => {
    const unplaced = chips.filter((c) => c.parentElement === pool).length;
    if (unplaced) { setFeedback(fb, `Te faltan ${unplaced} concepto(s) por ubicar.`, false); return; }
    let good = 0;
    chips.forEach((c) => {
      const ok = c.closest(".cat").dataset.cat === c.dataset.cat;   // la categoría correcta está en data-cat del concepto
      c.classList.toggle("is-correct", ok);
      c.classList.toggle("is-wrong", !ok);
      if (ok) good += 1;
    });
    const all = good === chips.length;
    setFeedback(fb, `${all ? FEEDBACK.ok : FEEDBACK.bad} (${good} de ${chips.length} correctos)`, all);
  });
  $("[data-reset]", act).addEventListener("click", () => {
    chips.forEach((c) => pool.appendChild(c));
    clearMarks(); selected = null; setFeedback(fb, "", null);
  });
})();
