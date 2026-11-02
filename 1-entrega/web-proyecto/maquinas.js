/* Vortex · Máquinas del taller: luz que sigue al mouse, visor 3D / despiece y trazado del plano */
(function () {
  var root = document.getElementById('maquinas');
  if (!root) return;
  var reduce = document.documentElement.classList.contains('reduce-motion');
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* la luz de cada tarjeta sigue al puntero */
  if (fine) root.querySelectorAll('[data-mq]').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* selector diseño 3D / despiece */
  var sw = root.querySelector('.mq-switch'), ink = sw.querySelector('.tfs-ink');
  var tabs = [].slice.call(sw.querySelectorAll('[role="tab"]'));
  var sheet = root.querySelector('.mq-sheet'), plotted = false, busy = null;
  function moveInk() {
    var on = tabs.find(function (b) { return b.getAttribute('aria-selected') === 'true'; });
    ink.style.width = on.offsetWidth + 'px'; ink.style.transform = 'translateX(' + (on.offsetLeft - 4) + 'px)';
  }
  function plot() {
    if (plotted || reduce) return; plotted = true;
    var go = function () { sheet.style.setProperty('--w', sheet.offsetWidth + 'px'); sheet.classList.add('plotting'); };
    var img = sheet.querySelector('img');
    if (img.complete) go(); else img.addEventListener('load', go, { once: true });
  }
  function select(btn, focus) {
    var cur = tabs.find(function (b) { return b.getAttribute('aria-selected') === 'true'; });
    if (focus) btn.focus();
    if (cur === btn) return;
    tabs.forEach(function (b) { var on = b === btn; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    moveInk();
    var next = document.getElementById(btn.getAttribute('aria-controls')), prev = document.getElementById(cur.getAttribute('aria-controls'));
    clearTimeout(busy);
    var show = function () {
      prev.hidden = true; prev.classList.remove('leave', 'enter');
      next.hidden = false; next.classList.remove('enter'); void next.offsetWidth; next.classList.add('enter');
      if (next.contains(sheet)) plot();
    };
    if (reduce) show(); else { prev.classList.add('leave'); busy = setTimeout(show, 180); }
  }
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { select(b); });
    b.addEventListener('keydown', function (e) {
      var k = { ArrowRight: 1, ArrowLeft: -1, Home: -i, End: tabs.length - 1 - i }[e.key];
      if (k !== undefined) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
    });
  });
  addEventListener('resize', moveInk);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveInk);
  moveInk();

  /* los botones de la tarjeta de la lijadora llevan al visor con la vista elegida */
  root.querySelectorAll('[data-go]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = document.getElementById('mq-viewer');
      v.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      setTimeout(function () { select(document.getElementById(b.getAttribute('data-go'))); }, reduce ? 0 : 420);
    });
  });

  /* miniaturas del modelo: la imagen principal cambia con un fundido */
  var main = document.getElementById('mq-main'), cap = document.getElementById('mq-cap'), swapT = null;
  root.querySelectorAll('.mq-thumbs button').forEach(function (b, _, all) {
    b.addEventListener('click', function () {
      if (b.getAttribute('aria-pressed') === 'true') return;
      all.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      var src = b.getAttribute('data-src'), txt = b.getAttribute('data-cap');
      var put = function () { main.src = src; main.alt = txt + ' de la lijadora en SolidWorks'; cap.textContent = txt; main.classList.remove('swap'); };
      clearTimeout(swapT);
      if (reduce) return put();
      main.classList.add('swap');
      swapT = setTimeout(function () { var im = new Image(); im.onload = im.onerror = put; im.src = src; }, 160);
    });
  });
})();
