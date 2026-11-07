/* Interacciones de máquinas y diseño 3D. */
(function () {
  'use strict';
  var doc = document, root = doc.getElementById('maquinas');
  var reduce = doc.documentElement.classList.contains('reduce-motion') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (root && fine) root.querySelectorAll('[data-mq]').forEach(function (card) {
    card.addEventListener('pointermove', function (e) { var r = card.getBoundingClientRect(); card.style.setProperty('--mx', (e.clientX - r.left) + 'px'); card.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
  });
  /* El ploteo queda pendiente hasta abrir una lámina visible. */
  function plot(sheet) {
    if (!sheet || sheet.dataset.plotted || reduce || sheet.hidden || !sheet.getClientRects().length) return;
    sheet.dataset.plotted = '1';
    var go = function () { sheet.style.setProperty('--w', sheet.offsetWidth + 'px'); sheet.classList.add('plotting'); };
    var img = sheet.querySelector('img'); if (!img || img.complete) go(); else img.addEventListener('load', go, { once: true });
  }
  var sheets = Array.prototype.slice.call(doc.querySelectorAll('#diseno3d .mq-sheet'));
  var plotIO = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { if (entry.isIntersecting) { plot(entry.target); if (entry.target.dataset.plotted) plotIO.unobserve(entry.target); } });
  }, { threshold: .25 }) : null;
  if (plotIO) sheets.forEach(function (sheet) { plotIO.observe(sheet); });
  function plotIfVisible(panel) { var sheet = panel && panel.querySelector('.mq-sheet'); if (!sheet) return; if (plotIO) plotIO.observe(sheet); else if (sheet.getBoundingClientRect().bottom > 0 && sheet.getBoundingClientRect().top < innerHeight) plot(sheet); }
  /* Visor 3D: carga el modelo al acercarse a su panel. */
  var giroOn = false;
  function giro(box) {
    if (giroOn || !box) return; giroOn = true;
    var loader = doc.createElement('script'); loader.type = 'module'; loader.src = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js'; doc.head.appendChild(loader);
    var viewer = doc.createElement('model-viewer'); viewer.setAttribute('src', box.getAttribute('data-src')); viewer.setAttribute('alt', 'Modelo 3D de la lijadora de banda: arrastrá para girarlo'); viewer.setAttribute('camera-controls', ''); viewer.setAttribute('touch-action', 'pan-y'); viewer.setAttribute('camera-orbit', '-35deg 70deg auto'); viewer.setAttribute('shadow-intensity', '0.8'); viewer.setAttribute('exposure', '1.1'); viewer.setAttribute('interaction-prompt', 'none');
    if (!reduce) { viewer.setAttribute('auto-rotate', ''); viewer.setAttribute('auto-rotate-delay', '1500'); viewer.setAttribute('rotation-per-second', '18deg'); }
    var hint = doc.createElement('span'); hint.className = 'mq-giro-hint'; hint.textContent = 'Arrastrá para girar';
    viewer.addEventListener('load', function () { var wait = box.querySelector('.mq-giro-wait'); if (wait) wait.remove(); });
    viewer.addEventListener('error', function () { var wait = box.querySelector('.mq-giro-wait'); if (wait) wait.textContent = 'No se pudo cargar el modelo 3D.'; });
    viewer.addEventListener('pointerdown', function () { box.classList.add('touched'); }, { once: true }); viewer.addEventListener('dblclick', function () { viewer.cameraOrbit = '-35deg 70deg auto'; viewer.fieldOfView = 'auto'; }); box.appendChild(viewer); box.appendChild(hint);
  }
  var giroBox = doc.getElementById('d3-giro');
  if (giroBox) { if ('IntersectionObserver' in window) { var giroIO = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { giro(giroBox); giroIO.disconnect(); } }); }, { rootMargin: '300px 0px' }); giroIO.observe(giroBox); } else giro(giroBox); }
  /* Pestañas accesibles del diseño 3D. */
  var tablist = doc.querySelector('.d3-tabs'), tabs = tablist ? Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]')) : [];
  var ink = tablist && tablist.querySelector('.d3-ink'), panels = tabs.map(function (tab) { return doc.getElementById(tab.getAttribute('aria-controls')); });
  function moveInk(tab) { if (!ink || !tab) return; var a = tablist.getBoundingClientRect(), b = tab.getBoundingClientRect(); ink.style.setProperty('--ink-x', (b.left - a.left) + 'px'); ink.style.setProperty('--ink-width', b.width + 'px'); }
  function select(tab, focus) {
    if (!tab || tabs.indexOf(tab) < 0) return;
    var panel = doc.getElementById(tab.getAttribute('aria-controls'));
    tabs.forEach(function (item) { var selected = item === tab; item.setAttribute('aria-selected', selected ? 'true' : 'false'); item.tabIndex = selected ? 0 : -1; });
    panels.forEach(function (item) { if (!item || item === panel || item.hidden) return; item.classList.remove('is-on'); item.classList.add('is-leaving'); window.setTimeout(function () { if (item !== doc.getElementById((tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tab).getAttribute('aria-controls'))) item.hidden = true; item.classList.remove('is-leaving'); }, reduce ? 0 : 160); });
    if (panel) { panel.hidden = false; panel.classList.remove('is-leaving'); void panel.offsetWidth; panel.classList.add('is-on'); plotIfVisible(panel); }
    moveInk(tab); if (focus) tab.focus();
  }
  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) { var i = tabs.indexOf(tab), next = null; if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length]; else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length]; else if (e.key === 'Home') next = tabs[0]; else if (e.key === 'End') next = tabs[tabs.length - 1]; if (next) { e.preventDefault(); select(next, true); } });
    });
    var active = tabs.filter(function (tab) { return tab.getAttribute('aria-selected') === 'true'; })[0] || tabs[0]; select(active, false);
    window.addEventListener('resize', function () { moveInk(tabs.filter(function (tab) { return tab.getAttribute('aria-selected') === 'true'; })[0]); }, { passive: true });
  }
  /* Los enlaces desde la tarjeta abren su pestaña destino. */
  doc.querySelectorAll('a[data-d3]').forEach(function (link) { link.addEventListener('click', function () { var tab = doc.getElementById(link.getAttribute('data-d3')); if (tab) select(tab, false); }); });
})();
