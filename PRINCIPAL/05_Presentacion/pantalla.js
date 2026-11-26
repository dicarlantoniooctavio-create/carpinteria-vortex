/* Vortex · Presentación: botón para ver en pantalla completa los topográficos, el unifilar y el multifilar */
(function () {
  'use strict';
  var doc = document;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5"/><path d="M20 9V4h-5"/><path d="M4 15v5h5"/><path d="M20 15v5h-5"/></svg>';
  var open = null, back = null;

  function close() {
    if (!open) return;
    var o = open; open = null;
    o.classList.remove('on');
    setTimeout(function () { o.remove(); }, reduce ? 0 : 180);
    doc.body.style.overflow = '';
    if (back && back.isConnected) back.focus({ preventScroll: true });
  }

  function lupa(stage, img) {
    if (!fine) return;
    var lens = doc.createElement('div'); lens.className = 'pc-lens'; lens.setAttribute('aria-hidden', 'true'); stage.appendChild(lens);
    stage.addEventListener('pointermove', function (e) {
      var r = img.getBoundingClientRect(), sr = stage.getBoundingClientRect(), S = lens.offsetWidth || 260;
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height || !img.naturalWidth) { lens.classList.remove('on'); return; }
      var z = Math.max(2, Math.min(4, 1.6 * img.naturalWidth / r.width));
      lens.style.backgroundImage = 'url("' + (img.currentSrc || img.src) + '")';
      lens.style.backgroundSize = (r.width * z) + 'px ' + (r.height * z) + 'px';
      lens.style.backgroundPosition = (S / 2 - x * z) + 'px ' + (S / 2 - y * z) + 'px';
      lens.style.transform = 'translate3d(' + (e.clientX - sr.left - S / 2) + 'px,' + (e.clientY - sr.top - S / 2) + 'px,0)';
      lens.classList.add('on');
    });
    stage.addEventListener('pointerleave', function () { lens.classList.remove('on'); });
  }

  function show(img, title, btn) {
    if (open) return;
    back = btn;
    var o = doc.createElement('div'); o.className = 'pc-full';
    o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', title + ' en pantalla completa');
    var bar = doc.createElement('div'); bar.className = 'pc-bar';
    var h = doc.createElement('p'); h.className = 'pc-title'; h.textContent = title;
    var hint = doc.createElement('p'); hint.className = 'pc-hint'; hint.textContent = fine ? 'Pasá el mouse para usar la lupa · Esc para salir' : 'Pellizcá para ampliar';
    var x = doc.createElement('button'); x.type = 'button'; x.className = 'pc-close'; x.innerHTML = '<span>Cerrar</span> <b aria-hidden="true">×</b>'; x.addEventListener('click', close);
    bar.appendChild(h); bar.appendChild(hint); bar.appendChild(x);
    var stage = doc.createElement('div'); stage.className = 'pc-stage';
    var big = doc.createElement('img'); big.src = img.currentSrc || img.src; big.alt = img.alt; big.draggable = false;
    stage.appendChild(big); lupa(stage, big);
    o.appendChild(bar); o.appendChild(stage);
    o.addEventListener('click', function (e) { if (e.target === o || e.target === stage) close(); });
    open = o; doc.body.style.overflow = 'hidden'; doc.body.appendChild(o);
    requestAnimationFrame(function () { o.classList.add('on'); });
    x.focus({ preventScroll: true });
  }

  /* con la vista abierta, el teclado no cambia de diapositiva: Esc cierra y Tab queda en el botón */
  window.addEventListener('keydown', function (e) {
    if (!open) return;
    e.stopPropagation();
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') { e.preventDefault(); open.querySelector('.pc-close').focus({ preventScroll: true }); }
    else if (e.key !== 'Enter') e.preventDefault();
  }, true);

  function titulo(box) {
    var view = box.closest('.tb-view'), fig = box.closest('.am-fig');
    if (fig) { var t = fig.querySelector('.am-tag'); if (t) return t.textContent.trim(); }
    if (view) { var h3 = view.querySelector('.tb-info h3') || (box.closest('.slide') && box.closest('.slide').querySelector('h2')); if (h3) return h3.textContent.replace(/\s+/g, ' ').trim(); }
    return 'Dibujo';
  }

  doc.querySelectorAll('.slide.s-tb .tb-zoom, .slide.s-auto .am-zoom').forEach(function (box) {
    var img = box.querySelector('img'); if (!img) return;
    var name = titulo(box);
    var b = doc.createElement('button'); b.type = 'button'; b.className = 'pc-btn';
    b.innerHTML = ICON + '<span>Pantalla completa</span>';
    b.setAttribute('aria-label', 'Ver ' + name + ' en pantalla completa');
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); show(img, name, b); });
    b.addEventListener('pointermove', function (e) { e.stopPropagation(); });
    box.appendChild(b);
  });
})();
