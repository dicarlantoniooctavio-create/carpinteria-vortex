/* Vortex — web de la empresa: aparición, contadores, línea de trabajo, condiciones, cookies y formulario */
(function () {
  var d = document.documentElement, reduce = d.classList.contains('reduce-motion');
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* títulos palabra por palabra */
  document.querySelectorAll('.split').forEach(function (h) {
    var t = h.textContent.trim(); h.setAttribute('aria-label', t);
    h.innerHTML = t.split(/\s+/).map(function (w, i) { return '<span class="w" aria-hidden="true"><span style="--wi:' + i + '">' + w + '</span></span>'; }).join(' ');
  });

  /* contadores (el HTML ya trae el valor final) */
  function count(el) {
    var to = +el.getAttribute('data-count'), sep = el.hasAttribute('data-sep');
    var f = function (v) { return sep ? Math.round(v).toLocaleString('es-AR') : String(Math.round(v)); };
    if (reduce) { el.textContent = f(to); return; }
    var t0 = performance.now();
    (function step(t) { var k = Math.min(1, (t - t0) / 1100); el.textContent = f(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(t0);
  }

  /* aparición al entrar en pantalla */
  var seal = document.querySelector('.seal');
  function reveal(el) {
    el.classList.add('in');
    el.querySelectorAll('[data-count]').forEach(count);
    if (el.matches('[data-count]')) count(el);
    if (el === seal) setTimeout(function () { seal.classList.add('live'); }, reduce ? 0 : 2800);
  }
  var targets = document.querySelectorAll('.r, .split');
  if (reduce || !('IntersectionObserver' in window)) targets.forEach(reveal);
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* el sello sigue al mouse con un resorte suave */
  var disc = document.querySelector('.seal-disc');
  if (disc && fine && !reduce) {
    var rx = 0, ry = 0, gx = 0, gy = 0, raf = 0;
    var frame = function () {
      rx += (gx - rx) * 0.1; ry += (gy - ry) * 0.1;
      disc.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      raf = (Math.abs(gx - rx) > 0.01 || Math.abs(gy - ry) > 0.01) ? requestAnimationFrame(frame) : 0;
    };
    document.querySelector('.hero').addEventListener('pointermove', function (e) {
      if (!seal.classList.contains('live')) return;
      var r = disc.getBoundingClientRect();
      gy = ((e.clientX - r.left) / r.width - 0.5) * 10; gx = -((e.clientY - r.top) / r.height - 0.5) * 10;
      if (!raf) raf = requestAnimationFrame(frame);
    });
    document.querySelector('.hero').addEventListener('pointerleave', function () { gx = gy = 0; if (!raf) raf = requestAnimationFrame(frame); });
  }

  /* línea de trabajo: se llena con el scroll y prende cada paso */
  var steps = document.querySelector('.steps'), items = [].slice.call(document.querySelectorAll('.step'));
  function fill() {
    if (!steps) return;
    var r = steps.getBoundingClientRect(), mid = innerHeight * 0.6;
    var p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
    steps.style.setProperty('--fill', p.toFixed(3));
    items.forEach(function (s) { var t = s.getBoundingClientRect().top; s.classList.toggle('lit', t < mid); });
  }
  addEventListener('scroll', fill, { passive: true }); fill();

  /* menú: sección activa y menú del celular */
  var links = [].slice.call(document.querySelectorAll('.nav nav a[href^="#"]'));
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  addEventListener('scroll', function () {
    var y = innerHeight * 0.35, cur = -1;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < y) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('active', i === cur); });
  }, { passive: true });
  var burger = document.querySelector('.burger'), menu = document.getElementById('menu');
  burger.addEventListener('click', function () { var o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', String(o)); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });

  /* condiciones: el texto se abre al pasar el mouse (en el celular, al tocar) */
  document.querySelectorAll('.term').forEach(function (t) {
    var pinned = false, timer = 0;
    t.querySelector('summary').addEventListener('click', function () { pinned = !t.open; });
    if (!fine) return;
    t.addEventListener('mouseenter', function () { clearTimeout(timer); timer = setTimeout(function () { t.open = true; }, 90); });
    t.addEventListener('mouseleave', function () { clearTimeout(timer); if (!pinned) t.open = false; });
  });

  /* cookies: el mapa de Google solo se carga si se aceptan */
  var KEY = 'vx-cookies', box = document.querySelector('.cookies'), map = document.querySelector('.map');
  var get = function () { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  var save = function (v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} };
  function loadMap() {
    if (!map || map.querySelector('iframe')) return;
    var f = document.createElement('iframe');
    f.title = 'Mapa del Parque Industrial de Marcos Paz'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    f.src = map.getAttribute('data-src'); f.addEventListener('load', function () { f.classList.add('ok'); });
    map.appendChild(f); var off = map.querySelector('.map-off'); if (off) off.remove();
  }
  function apply(v) { if (v && v.maps) loadMap(); }
  var pref = get();
  if (pref) apply(pref); else setTimeout(function () { box.hidden = false; }, reduce ? 0 : 1200);
  box.querySelector('.ck-yes').addEventListener('click', function () {
    var opts = box.querySelector('.ck-opts'), maps = opts.hidden ? true : box.querySelector('.ck-maps').checked;
    var v = { necesarias: true, maps: maps }; save(v); apply(v); box.hidden = true;
  });
  box.querySelector('.ck-no').addEventListener('click', function () { save({ necesarias: true, maps: false }); box.hidden = true; });
  box.querySelector('.ck-cfg').addEventListener('click', function () { var o = box.querySelector('.ck-opts'); o.hidden = !o.hidden; box.querySelector('.ck-yes').textContent = o.hidden ? 'Aceptar' : 'Guardar'; });
  document.querySelectorAll('.cookie-open').forEach(function (b) { b.addEventListener('click', function () { var p = get(); box.querySelector('.ck-maps').checked = !!(p && p.maps); box.hidden = false; }); });
  if (map) map.addEventListener('click', function (e) {
    if (!e.target.closest('.map-on')) return;
    var v = get() || { necesarias: true }; v.maps = true; save(v); loadMap(); box.hidden = true;
  });

  /* formulario */
  var form = document.getElementById('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = form.querySelector('.form-msg'); msg.classList.remove('bad');
    if (!form.nombre.value.trim() || !form.email.value || !form.email.checkValidity()) { void msg.offsetWidth; msg.classList.add('bad'); msg.textContent = 'Completá tu nombre y un email válido.'; return; }
    var tipo = form.querySelector('[name="tipo"]:checked').value;
    msg.textContent = '¡Gracias, ' + form.nombre.value.trim() + '! Recibimos tu solicitud de ' + tipo.toLowerCase() + '. Te contactamos a la brevedad.';
    form.reset();
  });
})();
