/* Vortex · Tableros seccionales y unifilar: selector, volteo multifilar/topográfico, lupa y banda trifásica */
(function () {
  var root = document.getElementById('tableros');
  if (!root) return;
  var reduce = document.documentElement.classList.contains('reduce-motion');

  /* banda trifásica: se dibuja cuando entra en pantalla */
  var band = document.querySelector('.phase-band');
  if (band) {
    if (reduce || !('IntersectionObserver' in window)) band.classList.add('in');
    else {
      var bo = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting || e.boundingClientRect.top < 0) { band.classList.add('in'); bo.disconnect(); } }); }, { rootMargin: '0px 0px -15% 0px' });
      bo.observe(band);
    }
  }

  /* contador: cuenta desde 0 hasta el número de protecciones */
  function count(el) {
    var to = +el.getAttribute('data-to');
    if (reduce) { el.textContent = to; return; }
    var t0 = performance.now();
    (function step(t) { var k = Math.min(1, (t - t0) / 700); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(t0);
  }

  /* selector de tableros con tinta que viaja y una chispa que la recorre */
  var bar = root.querySelector('.tb-bar'), ink = bar.querySelector('.tb-ink');
  var tabs = [].slice.call(bar.querySelectorAll('[role="tab"]'));
  function moveInk(btn, spark) {
    ink.style.width = btn.offsetWidth + 'px'; ink.style.height = btn.offsetHeight + 'px';
    ink.style.transform = 'translate(' + btn.offsetLeft + 'px,' + btn.offsetTop + 'px)';
    if (spark && !reduce) { ink.classList.remove('go'); void ink.offsetWidth; ink.classList.add('go'); }
    var l = btn.offsetLeft - bar.scrollLeft, r = l + btn.offsetWidth;
    if (l < 0 || r > bar.clientWidth) bar.scrollTo({ left: btn.offsetLeft - 12, behavior: reduce ? 'auto' : 'smooth' });
  }
  var busy = null;
  function select(btn, focus) {
    var cur = tabs.find(function (b) { return b.getAttribute('aria-selected') === 'true'; });
    if (focus) btn.focus();
    if (cur === btn) return;
    tabs.forEach(function (b) { var on = b === btn; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    moveInk(btn, true);
    var next = document.getElementById(btn.getAttribute('aria-controls'));
    var prev = cur && document.getElementById(cur.getAttribute('aria-controls'));
    clearTimeout(busy);
    root.querySelectorAll('.tb-view').forEach(function (v) { if (v !== prev && v !== next) { v.hidden = true; v.classList.remove('enter', 'leave'); } });
    var show = function () {
      if (prev) { prev.hidden = true; prev.classList.remove('leave', 'enter'); }
      next.hidden = false; next.classList.remove('enter'); void next.offsetWidth; next.classList.add('enter');
      var c = next.querySelector('.tb-count b'); if (c) count(c);
      syncFace(next);
    };
    if (prev && !reduce) { prev.classList.add('leave'); busy = setTimeout(show, 220); } else show();
  }
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { select(b); });
    b.addEventListener('keydown', function (e) {
      var k = { ArrowRight: 1, ArrowLeft: -1, Home: -i, End: tabs.length - 1 - i }[e.key];
      if (k !== undefined) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
    });
  });
  var sync = function () { var t = tabs.find(function (b) { return b.getAttribute('aria-selected') === 'true'; }); if (t) moveInk(t, false); };
  addEventListener('resize', function () { sync(); root.querySelectorAll('.tb-view:not([hidden])').forEach(syncFace); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
  sync();

  /* el contador del primer tablero arranca cuando la sección aparece */
  var first = root.querySelector('.tb-view.is-on .tb-count b');
  if (first && 'IntersectionObserver' in window && !reduce) {
    first.textContent = '0';
    var co = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { count(first); co.disconnect(); } }); }, { rootMargin: '0px 0px -20% 0px' });
    co.observe(first);
  }

  /* volteo multifilar / topográfico (la puerta del gabinete) */
  function syncFace(view) {
    var g = view.querySelector('.tb-face-switch'); if (!g) return;
    var on = g.querySelector('[aria-pressed="true"]'), fi = g.querySelector('.tfs-ink');
    fi.style.width = on.offsetWidth + 'px'; fi.style.transform = 'translateX(' + (on.offsetLeft - 4) + 'px)';
  }
  root.querySelectorAll('.tb-face-switch').forEach(function (g) {
    var flip = g.nextElementSibling;
    g.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.getAttribute('aria-pressed') === 'true') return;
        g.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        var back = b.getAttribute('data-face') === '1';
        flip.classList.toggle('flipped', back);
        flip.querySelector('.front').setAttribute('aria-hidden', String(back));
        flip.querySelector('.back').setAttribute('aria-hidden', String(!back));
        if (!reduce) { flip.classList.remove('shine'); void flip.offsetWidth; flip.classList.add('shine'); }
        syncFace(g.closest('.tb-view'));
      });
    });
  });
  root.querySelectorAll('.tb-view:not([hidden])').forEach(syncFace);

  /* lupa: una copia ampliada de la imagen sigue al mouse, con un leve retardo que la hace fluida */
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.querySelectorAll('.tb-zoom').forEach(function (box) {
    var img = box.querySelector('img'); if (!img) return;
    var lens = document.createElement('div'); lens.className = 'tb-lens'; lens.setAttribute('aria-hidden', 'true'); box.appendChild(lens);
    var tx = 0, ty = 0, cx = 0, cy = 0, ts = 0.9, cs = 0.9, raf = 0, first = true;
    function frame() {
      var k = reduce || first ? 1 : 0.28;
      cx += (tx - cx) * k; cy += (ty - cy) * k; cs += (ts - cs) * (reduce ? 1 : 0.22); first = false;
      lens.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0) scale(' + cs.toFixed(3) + ')';
      if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3 || Math.abs(ts - cs) > 0.002) raf = requestAnimationFrame(frame); else raf = 0;
    }
    var kick = function () { if (!raf) raf = requestAnimationFrame(frame); };
    box.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch' || box.getAttribute('aria-hidden') === 'true') return;
      var r = img.getBoundingClientRect(), br = box.getBoundingClientRect(), S = lens.offsetWidth || 210;
      var nw = img.naturalWidth, nh = img.naturalHeight; if (!nw) return;
      var sc = Math.min(r.width / nw, r.height / nh), w = nw * sc, h = nh * sc, ox = (r.width - w) / 2, oy = (r.height - h) / 2;
      var x = e.clientX - r.left - ox, y = e.clientY - r.top - oy;
      if (x < 0 || y < 0 || x > w || y > h) { lens.classList.remove('on'); ts = 0.9; kick(); return; }
      var z = Math.max(2.4, Math.min(5, 1.4 / sc));
      lens.style.backgroundImage = 'url("' + img.currentSrc + '")';
      lens.style.backgroundSize = (w * z) + 'px ' + (h * z) + 'px';
      lens.style.backgroundPosition = (S / 2 - x * z) + 'px ' + (S / 2 - y * z) + 'px';
      tx = e.clientX - br.left - S / 2; ty = e.clientY - br.top - S / 2;
      if (!lens.classList.contains('on')) { first = true; lens.classList.add('on'); }
      ts = 1; kick();
    });
    box.addEventListener('pointerleave', function () { lens.classList.remove('on'); ts = 0.9; kick(); });
  });

  /* el dibujo se inclina apenas hacia el mouse (resorte suave) */
  if (fine && !reduce) root.querySelectorAll('.tb-media').forEach(function (m) {
    var flip = m.querySelector('.tb-flip'); if (!flip) return;
    var rx = 0, ry = 0, gx = 0, gy = 0, raf = 0;
    function frame() {
      rx += (gx - rx) * 0.12; ry += (gy - ry) * 0.12;
      flip.style.transform = 'perspective(1400px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      if (Math.abs(gx - rx) > 0.01 || Math.abs(gy - ry) > 0.01) raf = requestAnimationFrame(frame); else raf = 0;
    }
    m.addEventListener('pointermove', function (e) {
      var r = flip.getBoundingClientRect(); if (!r.width) return;
      gy = ((e.clientX - r.left) / r.width - 0.5) * 5; gx = -((e.clientY - r.top) / r.height - 0.5) * 4;
      if (!raf) raf = requestAnimationFrame(frame);
    });
    m.addEventListener('pointerleave', function () { gx = 0; gy = 0; if (!raf) raf = requestAnimationFrame(frame); });
  });
})();
