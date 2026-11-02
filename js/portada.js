/* portada · espectrograma animado de fondo.
   Dibuja columnas de «sonido» que se desplazan: tonos suaves y, de vez en cuando,
   un impulso breve (línea vertical amarilla), como un ruido impulsivo. */
(function () {
  const { $ } = ODC;
  const root = $("#portada");
  const canvas = $(".hero-canvas", root);
  if (!canvas) return;
  const W = 220, H = 60;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let t = 0, impulse = 0, timer = null;

  function color(e) { // e: 0..1  → verde oscuro → verde neón → amarillo
    if (e < 0.05) return null;
    let r, g, b;
    if (e < 0.6) { const k = e / 0.6; r = 10 + 20 * k; g = 70 + 150 * k; b = 50 + 40 * k; }
    else { const k = (e - 0.6) / 0.4; r = 30 + 225 * k; g = 220 + 0 * k - 8 * k; b = 90 - 90 * k; }
    return `rgba(${r | 0},${g | 0},${b | 0},${Math.min(1, e * 1.25).toFixed(2)})`;
  }
  function column() {
    ctx.drawImage(canvas, -1, 0);               // desplaza todo una columna a la izquierda
    ctx.clearRect(W - 1, 0, 1, H);
    t += 1;
    if (impulse === 0 && Math.random() < 0.012) impulse = 2 + (Math.random() * 2 | 0);
    for (let y = 0; y < H; y++) {
      const f = 1 - y / H;                       // 0 = frecuencia alta, 1 = baja
      let e = Math.exp(-(1 - f) * 3.2) * 0.55;   // energía baja que decae hacia agudos
      const r1 = 0.30 + 0.12 * Math.sin(t * 0.045), r2 = 0.62 + 0.14 * Math.sin(t * 0.027 + 2);
      e += 0.55 * Math.exp(-Math.pow((f - r1) / 0.035, 2));
      e += 0.38 * Math.exp(-Math.pow((f - r2) / 0.05, 2));
      e += Math.random() * 0.12;
      if (impulse > 0) e = Math.max(e, 0.85 + Math.random() * 0.15 - (1 - f) * 0.25);
      const c = color(Math.min(e, 1));
      if (c) { ctx.fillStyle = c; ctx.fillRect(W - 1, y, 1, 1); }
    }
    if (impulse > 0) impulse -= 1;
  }
  function start() { if (reduce || timer) return; timer = setInterval(column, 70); }
  function stop() { clearInterval(timer); timer = null; }

  for (let i = 0; i < W; i++) column();          // relleno inicial (también sirve de imagen fija)
  document.addEventListener("odc:screen", (e) => (e.detail.id === "portada" ? start() : stop()));
})();
