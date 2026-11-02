/* =========================================================
   ODC · Cuando las Máquinas aprenden a escuchar
   core.js · carga las pantallas, navegación, menú, avatar y
   componentes compartidos (desplegables y temas).

   CÓMO FUNCIONA LA CARGA
   Cada pantalla tiene su propio archivo:
     html/<id>.html   css/<id>.css   js/<id>.js
   Para agregar, quitar o reordenar pantallas, solo edita la lista PANTALLAS.
   ========================================================= */

const PANTALLAS = [
  "portada",       // Inicio
  "rea",           // Resultado esperado de aprendizaje y población objetivo
  "introduccion",
  "historia",
  "problematica",
  "modulo1",
  "modulo2",
  "modulo3",
  "modulo4",
  "modulo5",
  "modulo6",
  "prueba",        // Prueba de conocimientos
  "conclusion",
  "referencias"    // Referencias y créditos
];

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

  function setFeedback(box, text, tone) {
    if (!box) return;
    box.textContent = text || "";
    box.classList.remove("is-ok", "is-bad");
    if (tone === true) box.classList.add("is-ok");
    if (tone === false) box.classList.add("is-bad");
  }

  // Utilidades para los archivos js/<pantalla>.js
  window.ODC = { $, $$, setFeedback, LOREM, PANTALLAS };

  const holder = $("#screens");
  const progressBar = $("#progressBar");
  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");
  const helpBtn = $("#helpBtn");
  let screens = [];
  let current = 0;

  /* ---------- carga de archivos ---------- */
  function loadCss(href) {
    return new Promise((resolve) => {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      l.onload = l.onerror = () => resolve();
      document.head.appendChild(l);
    });
  }
  function loadJs(src) {
    return new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = () => resolve();
      s.onerror = () => { console.warn("No se pudo cargar", src); resolve(); };
      document.body.appendChild(s);
    });
  }
  function showLoadError(err) {
    holder.innerHTML = `<div class="screen"><div class="panel"><h2 class="title-bar" style="margin-bottom:.8rem">No se pudieron cargar las pantallas</h2>
      <p>Cada pantalla se carga desde su propio archivo, por eso el sitio debe abrirse desde un servidor y no con doble clic sobre <strong>index.html</strong>.</p>
      <ul class="rich" style="margin-top:.8rem">
        <li>En Visual Studio Code: instala la extensión <strong>Live Server</strong> y usa «Go Live».</li>
        <li>Con Python: en la carpeta del sitio ejecuta <strong>python -m http.server</strong> y abre <strong>http://localhost:8000</strong>.</li>
        <li>O publícalo en GitHub Pages u otro hosting.</li>
      </ul><p style="margin-top:.8rem;font-size:.85rem">Detalle técnico: ${String(err.message || err)}</p></div></div>`;
  }

  async function cargar() {
    try {
      const textos = await Promise.all(PANTALLAS.map((id) =>
        fetch(`html/${id}.html`).then((r) => {
          if (!r.ok) throw new Error(`html/${id}.html (${r.status})`);
          return r.text();
        })
      ));
      holder.innerHTML = textos.join("\n");
    } catch (err) { showLoadError(err); return; }

    await Promise.all(PANTALLAS.map((id) => loadCss(`css/${id}.css`)));
    for (const id of PANTALLAS) await loadJs(`js/${id}.js`);

    screens = PANTALLAS.map((id) => $(`#${id}`));
    buildMenu();
    const fromHash = (location.hash.match(/^#\/([\w-]+)$/) || [])[1];
    const start = PANTALLAS.indexOf(fromHash);
    show(start >= 0 ? start : 0, { focus: false });
  }

  /* ---------- menú ---------- */
  function buildMenu() {
    const grid = $("#menuGrid");
    grid.innerHTML = "";
    screens.forEach((s, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "menu-btn";
      b.dataset.go = s.id;
      b.textContent = s.dataset.menu || s.dataset.label;
      grid.appendChild(b);
    });
  }

  /* ---------- navegación ---------- */
  function show(i, { focus = true } = {}) {
    i = Math.min(Math.max(i, 0), screens.length - 1);
    resetAvatars();
    screens.forEach((s, j) => { s.hidden = j !== i; });
    current = i;
    const scr = screens[i];

    progressBar.style.width = `${((i + 1) / screens.length) * 100}%`;
    prevBtn.hidden = i === 0;
    nextBtn.hidden = i === screens.length - 1;
    helpBtn.hidden = !scr.dataset.help;
    $$(".menu-btn").forEach((b) => b.classList.toggle("is-current", b.dataset.go === scr.id));
    document.title = `${scr.dataset.label} | Cuando las Máquinas aprenden a escuchar`;
    const h = `#/${scr.id}`;
    if (location.hash !== h) history.replaceState(null, "", h);
    closeDialogs();
    window.scrollTo({ top: 0, behavior: "auto" });
    if (focus) $("#main").focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent("odc:screen", { detail: { id: scr.id } }));
  }
  const goId = (id) => { const i = PANTALLAS.indexOf(id); if (i >= 0) show(i); };

  document.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go) goId(go.dataset.go);
  });
  prevBtn.addEventListener("click", () => show(current - 1));
  nextBtn.addEventListener("click", () => show(current + 1));
  $("#topBtn").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, select, textarea") || document.querySelector("dialog[open]")) return;
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "ArrowLeft") show(current - 1);
  });

  /* ---------- ventanas emergentes ---------- */
  function closeDialogs() { $$("dialog[open]").forEach((d) => d.close()); }
  $("#menuBtn").addEventListener("click", () => $("#menuDlg").showModal());
  helpBtn.addEventListener("click", () => {
    $("#helpText").textContent = screens[current].dataset.help;
    $("#helpDlg").showModal();
  });
  document.addEventListener("click", (e) => {
    const hint = e.target.closest("[data-hint]");
    if (hint) { $("#hintText").textContent = hint.dataset.hint; $("#hintDlg").showModal(); }
    if (e.target.closest("[data-close]")) closeDialogs();
    if (e.target.tagName === "DIALOG") e.target.close();
  });

  /* ---------- avatar (embed de HeyGen) ---------- */
  function resetAvatars() {
    $$(".avatar").forEach((a) => {
      const stage = $(".avatar-stage", a);
      $$("iframe, .avatar-note", stage).forEach((n) => n.remove());
      $(".avatar-ph", stage).hidden = false;
    });
  }
  function playAvatar(a) {
    const stage = $(".avatar-stage", a);
    const url = (a.dataset.video || "").trim();
    $$("iframe, .avatar-note", stage).forEach((n) => n.remove());
    const ph = $(".avatar-ph", stage);
    if (!/^https?:\/\//i.test(url)) {
      const note = document.createElement("div");
      note.className = "avatar-ph avatar-note";
      note.innerHTML = "<span>insertar link</span>";
      stage.appendChild(note);
      return;
    }
    ph.hidden = true;
    const f = document.createElement("iframe");
    f.src = url;
    f.title = "Video del avatar";
    f.allow = "encrypted-media; fullscreen; autoplay";
    f.allowFullscreen = true;
    f.referrerPolicy = "strict-origin-when-cross-origin";
    stage.appendChild(f);
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-avatar]");
    if (b) playAvatar(b.closest(".avatar")); // «Repetir» vuelve a cargar el video desde el inicio
  });

  /* ---------- componentes compartidos ---------- */
  // Desplegables (se abren dentro del mismo cuadro)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".exp-btn, .stage-btn");
    if (!btn) return;
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    btn.nextElementSibling.hidden = open;
    btn.parentElement.classList.toggle("is-open", !open);
  });
  // Temas (el título se abre en otro cuadro)
  document.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-topic] .tab");
    if (!tab) return;
    const topic = tab.closest("[data-topic]");
    const tabs = $$(".tab", topic);
    const panels = $$(".topic-panel", topic);
    const i = tabs.indexOf(tab);
    tabs.forEach((t, j) => t.setAttribute("aria-selected", String(i === j)));
    panels.forEach((p, j) => { p.hidden = i !== j; });
    $(".topic-empty", topic).hidden = true;
  });

  cargar();
})();
