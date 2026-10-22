// Vortex — interacciones de la web.
// La página se ve completa aunque este archivo no cargue: las animaciones solo se activan si corre.
document.documentElement.classList.add('js');
const reduce = document.documentElement.classList.contains('reduce-motion'); // sistema + preferencia guardada
const finePointer = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
let introSeen = document.documentElement.classList.contains('intro-seen');
try { sessionStorage.setItem('vx-intro', '1'); } catch (e) { /* almacenamiento bloqueado */ }
const introDelay = introSeen || reduce ? 0 : 900;

/* ---------- menú ---------- */
const nav = document.querySelector('.nav');
const burger = document.querySelector('.burger');
if (burger && nav) {
  const setOpen = open => { nav.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); };
  burger.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
}

/* ---------- pestañas con indicador que se desliza ---------- */
const tablist = document.querySelector('.tabs');
const tabs = tablist ? [...tablist.querySelectorAll('[role="tab"]')] : [];
const ink = tablist && tablist.querySelector('.tab-ink');
function moveInk(btn) {
  if (!ink || !btn) return;
  // la píldora toma el tamaño real de la pestaña (sin estirar los bordes redondeados)
  ink.style.width = btn.offsetWidth + 'px';
  ink.style.height = btn.offsetHeight + 'px';
  ink.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
  // en pantallas chicas las pestañas se desplazan: llevar la elegida a la vista
  const l = btn.offsetLeft - 12, rgt = btn.offsetLeft + btn.offsetWidth + 12;
  if (l < tablist.scrollLeft) tablist.scrollTo({ left: l, behavior: 'smooth' });
  else if (rgt > tablist.scrollLeft + tablist.clientWidth) tablist.scrollTo({ left: rgt - tablist.clientWidth, behavior: 'smooth' });
}
function selectTab(btn, focus) {
  tabs.forEach(b => { const on = b === btn; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
  document.querySelectorAll('.panel').forEach(p => { p.hidden = p.id !== btn.dataset.tab; });
  moveInk(btn);
  if (focus) btn.focus();
}
tabs.forEach((btn, i) => {
  btn.addEventListener('click', () => selectTab(btn));
  btn.addEventListener('keydown', e => {
    const k = { ArrowRight: 1, ArrowLeft: -1, Home: -i, End: tabs.length - 1 - i }[e.key];
    if (k !== undefined && (k || e.key === 'Home' || e.key === 'End')) { e.preventDefault(); selectTab(tabs[(i + k + tabs.length) % tabs.length], true); }
  });
});
const syncInk = () => moveInk(tabs.find(b => b.getAttribute('aria-selected') === 'true'));
addEventListener('resize', syncInk);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncInk);
syncInk();

/* ---------- contadores (el HTML ya trae el valor final) ---------- */
const fmt = (v, d) => v.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });
function count(el, delay = 0) {
  if (el.dataset.done) return;
  el.dataset.done = '1';
  const end = parseFloat(el.dataset.count), d = +el.dataset.dec || 0;
  if (reduce || isNaN(end)) return;
  setTimeout(() => {
    const t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 1300); el.textContent = fmt(end * (1 - Math.pow(1 - k, 3)), d); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    setTimeout(() => { el.textContent = fmt(end, d); }, 1500); // por si la pestaña queda en segundo plano
  }, delay);
}

/* ---------- tablero animado ---------- */
function startBoard(board) {
  if (board.classList.contains('on')) return;
  const go = () => {
    board.classList.add('on');
    const v = board.querySelector('.vnum');
    if (v) {
      if (reduce) { v.textContent = '380'; } else {
        setTimeout(() => { const t0 = performance.now(); const step = t => { const k = Math.min(1, (t - t0) / 900); v.textContent = Math.round(380 * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); setTimeout(() => { v.textContent = '380'; }, 1100); }, 1300);
      }
    }
    setTimeout(() => board.classList.add('live'), reduce ? 0 : 3800);
  };
  setTimeout(go, reduce ? 0 : introDelay + 500);
}

/* ---------- aparición al hacer scroll ---------- */
const pending = new Set(document.querySelectorAll('.r, .r-lines, .cable-band, [data-count]'));
function reveal(el) {
  if (el.matches('.r, .r-lines, .cable-band')) { el.classList.add('in'); setTimeout(() => el.classList.add('settled'), 1600); }
  if (el.matches('[data-count]')) count(el, el.closest('.hero, .kpis') ? introDelay + 400 : 200);
  if (el.matches('.panel-art')) startBoard(el.querySelector('.board'));
  pending.delete(el);
}
function check() {
  const limit = innerHeight * 0.9;
  pending.forEach(el => { if (el.getBoundingClientRect().top < limit) reveal(el); }); // también lo que ya quedó arriba
}
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  pending.forEach(el => io.observe(el));
}
// respaldo por si el navegador no avisa: revisa hasta que todo se haya mostrado
const timer = setInterval(() => { check(); if (!pending.size) clearInterval(timer); }, 600);
addEventListener('load', check);
check();

/* ---------- menú que se achica, sección activa y profundidad de los números ---------- */
const nums = [...document.querySelectorAll('[data-parallax]')];
const links = [...document.querySelectorAll('.nav nav a[href^="#"]')];
const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
let ticking = false;
function onScroll() {
  ticking = false;
  if (nav) nav.classList.toggle('scrolled', scrollY > 40);
  if (!reduce) nums.forEach(n => { const r = n.getBoundingClientRect(); const c = r.top + r.height / 2 - innerHeight / 2; n.style.transform = `translateY(${Math.max(-16, Math.min(16, c * -0.06)).toFixed(1)}px)`; });
  let cur = null; secs.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = s; });
  links.forEach(a => a.classList.toggle('active', !!cur && a.getAttribute('href') === '#' + cur.id));
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* ---------- transición al ir a la presentación ---------- */
const wipe = document.querySelector('.page-wipe');
document.querySelectorAll('a[data-wipe]').forEach(a => a.addEventListener('click', e => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || !wipe) return;
  e.preventDefault();
  wipe.classList.add('go');
  try { sessionStorage.setItem('vx-wipe', '1'); } catch (err) { /* sin almacenamiento */ }
  setTimeout(() => { location.href = a.href; }, reduce ? 150 : 560);
}));
addEventListener('pageshow', () => { if (wipe) wipe.classList.remove('go'); });

/* ---------- relieve suave de las tarjetas con el mouse ---------- */
if (finePointer && !reduce) {
  document.querySelectorAll('.svc, .team .shell, .plan').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/* ---------- formulario (demostrativo: no envía datos a ningún servidor) ---------- */
const form = document.getElementById('form');
if (form) form.addEventListener('submit', e => {
  e.preventDefault();
  const msg = form.querySelector('.form-msg');
  if (!form.nombre.value.trim() || !form.email.value || !form.email.checkValidity()) { msg.textContent = 'Completá nombre y un email válido.'; return; }
  msg.textContent = `¡Gracias, ${form.nombre.value.trim()}! Te contactaremos a la brevedad.`;
  form.reset();
});

/* ================= v5: logo, títulos, plano por capas e imágenes en movimiento ================= */
/* títulos que se arman palabra por palabra */
document.querySelectorAll('.split-words').forEach(h => {
  if (h.dataset.split) return; h.dataset.split = '1';
  const words = h.textContent.trim().split(/\s+/);
  h.setAttribute('aria-label', h.textContent.trim());
  h.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><span style="--wi:${i}">${w}</span></span>`).join(' ');
});

/* logo: se dibuja y después queda "vivo" */
function startLogo(el) {
  if (el.classList.contains('draw')) return;
  setTimeout(() => {
    el.classList.add('draw');
    setTimeout(() => el.classList.add('live'), reduce ? 0 : 2600);
  }, reduce ? 0 : introDelay + 200);
}

/* plano: se dibuja capa por capa y se puede resaltar un circuito */
const plano = document.querySelector('.plano');
if (plano) {
  const items = [...plano.querySelectorAll('.plano-svg line, .plano-svg path, .plano-svg circle, .plano-svg text')];
  const btns = [...plano.querySelectorAll('.lg')];
  btns.forEach(b => b.addEventListener('click', () => {
    const layer = b.dataset.layer;
    btns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    items.forEach(it => it.classList.toggle('dim', !!layer && !it.classList.contains(layer)));
  }));
}

/* engancha el logo y el plano a la aparición por scroll ya existente */
const baseReveal = reveal;
reveal = function (el) {
  baseReveal(el);
  if (el.matches('.logo-art')) startLogo(el);
  if (el.matches('.plano')) setTimeout(() => el.classList.add('drawn'), reduce ? 0 : 250);
};
// lo que ya había aparecido antes de este bloque
document.querySelectorAll('.logo-art.in').forEach(startLogo);
document.querySelectorAll('.plano.in').forEach(el => el.classList.add('drawn'));
check();

/* imágenes con un leve desplazamiento al hacer scroll (profundidad) */
const parImgs = [...document.querySelectorAll('.split .core > img, .gallery img, .logo-card img')];
parImgs.forEach(i => i.classList.add('par'));
if (!reduce) {
  let pTick = false;
  const runPar = () => {
    pTick = false;
    parImgs.forEach(img => {
      const r = img.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const c = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      img.style.translate = `0 ${(c * -18).toFixed(1)}px`;
    });
  };
  addEventListener('scroll', () => { if (!pTick) { pTick = true; requestAnimationFrame(runPar); } }, { passive: true });
  runPar();
}

/* aviso: el sistema pide reducir movimiento → opción de activar las animaciones (queda guardado) */
(function () {
  var d = document.documentElement, pref = null;
  try { pref = localStorage.getItem('vx-motion'); } catch (e) {}
  if (!d.classList.contains('reduce-motion') || pref === 'off') return;
  var c = document.createElement('div');
  c.className = 'motion-chip'; c.setAttribute('role', 'status');
  c.innerHTML = '<span>Tu equipo tiene las animaciones reducidas.</span><button type="button" class="mc-on">Activar animaciones</button><button type="button" class="mc-x" aria-label="Cerrar aviso">×</button>';
  document.body.appendChild(c);
  c.querySelector('.mc-on').addEventListener('click', function () { try { localStorage.setItem('vx-motion', 'on'); } catch (e) {} location.reload(); });
  c.querySelector('.mc-x').addEventListener('click', function () { try { localStorage.setItem('vx-motion', 'off'); } catch (e) {} c.remove(); });
})();

/* respaldo: el telón de entrada se retira aunque la animación no llegue a correr */
setTimeout(() => { const c = document.querySelector('.curtain'); if (c) c.style.display = 'none'; }, introSeen ? 0 : 2000);

/* v7 delight: cada toque cierra un circuito */
(function () {
  var reduce = document.documentElement.classList.contains('reduce-motion');
  // botones: destello que recorre el botón al apretarlo
  document.addEventListener('pointerdown', function (e) {
    var b = e.target.closest && e.target.closest('.btn');
    if (!b || reduce) return;
    b.classList.remove('zap'); void b.offsetWidth; b.classList.add('zap');
    setTimeout(function () { b.classList.remove('zap'); }, 700);
  });
  // referencias del plano: pulso en el punto de color
  document.querySelectorAll('.lg').forEach(function (l) {
    l.addEventListener('click', function () { if (reduce) return; l.classList.remove('zapd'); void l.offsetWidth; l.classList.add('zapd'); });
  });
  // números: destello cuando terminan de contar
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { var b = en.target; io.unobserve(b); setTimeout(function () { b.classList.add('done'); }, 1700); } });
  }, { threshold: .6 }) : null;
  if (io) document.querySelectorAll('.kpi b').forEach(function (b) { io.observe(b); });
  // formulario: tilde dibujado al enviar bien, sacudida si falta algo
  var form = document.getElementById('form');
  if (form) form.addEventListener('submit', function () {
    var msg = form.querySelector('.form-msg');
    setTimeout(function () {
      if (/Gracias/.test(msg.textContent)) {
        msg.classList.remove('bad');
        msg.innerHTML = '<svg class="ok-tick" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path pathLength="1" d="M4 12.5 9.5 18 20 6"/></svg>' + msg.textContent.replace(/[<>&]/g, '');
      } else { msg.classList.remove('bad'); void msg.offsetWidth; msg.classList.add('bad'); }
    }, 0);
  });
})();

/* lupa sobre el plano: con el mouse sigue el cursor; en el celular, mantener apretado y mover */
(function () {
  var Z = 4, S = 230;
  function init() {
    document.querySelectorAll('.plano-svg').forEach(function (svg) {
      var host = svg.parentElement;
      if (host.classList.contains('lupa-host')) return;
      host.classList.add('lupa-host');
      var lens = document.createElement('div');
      lens.className = 'lupa'; lens.setAttribute('aria-hidden', 'true');
      host.appendChild(lens);
      var clone = null, timer = null, touching = false;
      function fresh() { if (clone) { clone.remove(); clone = null; } }
      function show(px, py, ly) {
        var hr = host.getBoundingClientRect(), r = svg.getBoundingClientRect();
        var k = hr.width / host.offsetWidth || 1;               // escala de la diapositiva
        var x = (px - r.left) / k, y = (py - r.top) / k, w = r.width / k, h = r.height / k;
        if (x < 0 || y < 0 || x > w || y > h) { hide(); return; }
        if (!clone) { clone = svg.cloneNode(true); clone.removeAttribute('id'); clone.classList.add('lupa-svg'); lens.appendChild(clone); }
        clone.style.width = w * Z + 'px'; clone.style.height = h * Z + 'px';
        clone.style.transform = 'translate(' + (S / 2 - x * Z) + 'px,' + (S / 2 - y * Z) + 'px)';
        lens.style.left = ((px - hr.left) / k - S / 2) + 'px';
        lens.style.top = (((ly === undefined ? py : ly) - hr.top) / k - S / 2) + 'px';
        lens.classList.add('on');
      }
      function hide() { lens.classList.remove('on'); }
      host.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') fresh(); });
      host.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' || e.pointerType === 'pen') show(e.clientX, e.clientY); });
      host.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') hide(); });
      host.addEventListener('touchstart', function (e) {
        var t = e.touches[0]; fresh();
        timer = setTimeout(function () { touching = true; show(t.clientX, t.clientY, t.clientY - 140); }, 260);
      }, { passive: true });
      host.addEventListener('touchmove', function (e) {
        if (!touching) { clearTimeout(timer); return; }
        var t = e.touches[0]; e.preventDefault(); show(t.clientX, t.clientY, t.clientY - 140);
      }, { passive: false });
      host.addEventListener('touchend', function () { clearTimeout(timer); touching = false; hide(); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
