(function () {
  'use strict';
  var doc = document, html = doc.documentElement;
  html.classList.add('js');
  var reduce = html.classList.contains('reduce-motion');
  var deck = doc.getElementById('deck');
  if (!deck) return;
  var slides = Array.prototype.slice.call(deck.querySelectorAll('.slide'));
  var active = -1, serial = 0, overview = null, returnFocus = null;
  var fmt = function (v, d) { return v.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d }); };
  function count(el) {
    if (el.dataset.deckCounted) return;
    el.dataset.deckCounted = '1';
    var end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0;
    if (isNaN(end)) return;
    if (reduce) { el.textContent = fmt(end, dec); return; }
    var start = performance.now();
    function step(t) { var k = Math.min(1, (t - start) / 1300); el.textContent = fmt(end * (1 - Math.pow(1 - k, 3)), dec); if (k < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
    setTimeout(function () { el.textContent = fmt(end, dec); }, 1500);
  }
  function splitTitles(root) {
    root.querySelectorAll('.split-words').forEach(function (h) {
      if (h.dataset.split) return;
      var label = h.textContent.trim(), words = label.split(/\s+/);
      h.dataset.split = '1'; h.setAttribute('aria-label', label);
      h.innerHTML = words.map(function (word, i) { return '<span class="w" aria-hidden="true"><span style="--wi:' + i + '">' + word + '</span></span>'; }).join(' ');
    });
  }
  slides.forEach(function (s) { s.style.display = 'none'; splitTitles(s); });
  var ui = doc.createElement('div'); ui.className = 'deck-ui'; ui.innerHTML = '<div class="deck-progress" aria-hidden="true"><i></i></div><p class="deck-part"></p><nav class="deck-nav" aria-label="Controles de presentación"><button type="button" class="deck-prev" aria-label="Diapositiva anterior"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button><span class="deck-count"><b>1</b><span> / ' + slides.length + '</span></span><button type="button" class="deck-next" aria-label="Diapositiva siguiente"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button><button type="button" class="deck-grid" aria-label="Ver todas las diapositivas"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/></svg></button><button type="button" class="deck-full" aria-label="Pantalla completa"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4"/></svg></button></nav></div>';
  doc.body.appendChild(ui);
  var part = ui.querySelector('.deck-part'), number = ui.querySelector('.deck-count b'), progress = ui.querySelector('.deck-progress i');
  function activateOnce(s) {
    if (s.dataset.visited) return;
    s.dataset.visited = '1';
    s.querySelectorAll('.r, .r-lines, .cable-band').forEach(function (el) { el.classList.add('in'); setTimeout(function () { el.classList.add('settled'); }, 1600); });
    s.querySelectorAll('[data-count]').forEach(count);
    s.querySelectorAll('.logo-art').forEach(function (el) { el.classList.add('draw'); setTimeout(function () { el.classList.add('live'); }, reduce ? 0 : 2600); });
    s.querySelectorAll('.plano').forEach(function (el) { setTimeout(function () { el.classList.add('drawn'); }, reduce ? 0 : 250); });
    s.querySelectorAll('.kpi b').forEach(function (el) { setTimeout(function () { el.classList.add('done'); }, reduce ? 0 : 1700); });
  }
  function afterChange(s) {
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      window.dispatchEvent(new Event('resize'));
      var frase = s.querySelector('.frase-txt'), em = frase && frase.querySelector('em');
      if (frase && em) frase.style.setProperty('--spark-distance', Math.max(0, em.getBoundingClientRect().width - 6) + 'px');
    }); });
  }
  function go(index, direction, updateHash) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    if (index === active) return;
    var old = active >= 0 ? slides[active] : null, next = slides[index], token = ++serial;
    var focused = old && old.contains(doc.activeElement);
    if (old) {
      old.classList.remove('is-entering'); old.classList.add('is-leaving'); old.style.display = 'block';
      setTimeout(function () { if (old !== slides[active]) { old.classList.remove('is-leaving', 'is-entering'); old.style.display = 'none'; } }, 200);
    }
    active = index;
    next.style.display = 'block'; next.classList.remove('is-leaving'); next.classList.add('is-active');
    if (!reduce) { next.classList.remove('is-entering'); void next.offsetWidth; next.classList.add('is-entering'); }
    slides.forEach(function (s, i) { if (i !== index) s.classList.remove('is-active'); });
    activateOnce(next); number.textContent = String(index + 1); part.textContent = index === 0 ? '' : (next.dataset.part || '');
    progress.style.transform = 'scaleX(' + ((index + 1) / slides.length) + ')';
    if (updateHash !== false) { try { history.replaceState(null, '', '#' + (index + 1)); } catch (e) {} }
    if (focused) { if (!next.hasAttribute('tabindex')) next.setAttribute('tabindex', '-1'); try { next.focus({ preventScroll: true }); } catch (e) { next.focus(); } }
    afterChange(next);
  }
  function hashIndex() { var n = parseInt(location.hash.slice(1), 10); return n >= 1 && n <= slides.length ? n - 1 : 0; }
  go(hashIndex(), 1, false);
  window.addEventListener('hashchange', function () { go(hashIndex(), hashIndex() >= active ? 1 : -1, false); });
  ui.querySelector('.deck-prev').addEventListener('click', function () { go(active - 1, -1); });
  ui.querySelector('.deck-next').addEventListener('click', function () { go(active + 1, 1); });
  function closeOverview() { if (!overview) return; overview.classList.remove('open'); var layer = overview; overview = null; setTimeout(function () { layer.remove(); if (returnFocus) returnFocus.focus(); }, 220); }
  function openOverview(trigger) {
    if (overview) return;
    returnFocus = trigger || ui.querySelector('.deck-grid');
    var layer = doc.createElement('div'); layer.className = 'deck-overview'; layer.setAttribute('role', 'dialog'); layer.setAttribute('aria-label', 'Todas las diapositivas'); layer.setAttribute('aria-modal', 'true');
    var grid = doc.createElement('div'); grid.className = 'deck-overview-grid';
    slides.forEach(function (s, i) { var b = doc.createElement('button'); b.type = 'button'; b.className = 'deck-card' + (i === active ? ' current' : ''); b.innerHTML = '<strong>' + (i + 1) + '</strong><small></small><span></span>'; b.querySelector('small').textContent = s.dataset.part || 'Inicio'; b.querySelector('span').textContent = s.dataset.title || ''; b.addEventListener('click', function () { closeOverview(); go(i, i >= active ? 1 : -1); }); grid.appendChild(b); });
    layer.appendChild(grid); doc.body.appendChild(layer); overview = layer; requestAnimationFrame(function () { layer.classList.add('open'); grid.querySelector('.current').focus(); });
    layer.addEventListener('keydown', function (e) { var items = Array.prototype.slice.call(grid.querySelectorAll('button')), at = items.indexOf(doc.activeElement); if (e.key === 'Tab') { e.preventDefault(); items[(at + (e.shiftKey ? items.length - 1 : 1)) % items.length].focus(); } if (e.key === 'Escape') { e.preventDefault(); closeOverview(); } });
  }
  ui.querySelector('.deck-grid').addEventListener('click', function (e) { openOverview(e.currentTarget); });
  ui.querySelector('.deck-full').addEventListener('click', function () { try { if (doc.fullscreenElement) doc.exitFullscreen(); else html.requestFullscreen(); } catch (e) {} });
  doc.addEventListener('keydown', function (e) {
    if (overview) { if (e.key === 'Escape') { e.preventDefault(); closeOverview(); } return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target, tag = t && t.tagName, ignored = /^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (t && t.closest && (t.closest('[role="tab"]') || t.closest('button.lg')));
    if (ignored || (e.key === ' ' && tag === 'BUTTON')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(active + 1, 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(active - 1, -1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0, -1); }
    else if (e.key === 'End') { e.preventDefault(); go(slides.length - 1, 1); }
    else if (e.key.toLowerCase() === 'o') openOverview(ui.querySelector('.deck-grid'));
    else if (e.key.toLowerCase() === 'f') { try { if (doc.fullscreenElement) doc.exitFullscreen(); else html.requestFullscreen(); } catch (err) {} }
  });
  var touch = null, excluded = 'model-viewer, .mq-giro, .tb-zoom, .lupa-host, .table-wrap, .tb-bar, .d3-tabs, .tabs';
  deck.addEventListener('touchstart', function (e) { if (e.touches.length !== 1) { touch = null; return; } touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now(), blocked: !!(e.target.closest && e.target.closest(excluded)) }; }, { passive: true });
  deck.addEventListener('touchend', function (e) { if (!touch || touch.blocked || !e.changedTouches.length) return; var dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y; if (Date.now() - touch.t < 600 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(active + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); touch = null; }, { passive: true });
  /* El plano conserva el cambio de capas de la web. */
  doc.querySelectorAll('.plano').forEach(function (plano) { var items = Array.prototype.slice.call(plano.querySelectorAll('.plano-svg line, .plano-svg path, .plano-svg circle, .plano-svg text')); plano.querySelectorAll('.lg').forEach(function (b) { b.addEventListener('click', function () { var layer = b.dataset.layer; plano.querySelectorAll('.lg').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); items.forEach(function (it) { it.classList.toggle('dim', !!layer && !it.classList.contains(layer)); }); if (!reduce) { b.classList.remove('zapd'); void b.offsetWidth; b.classList.add('zapd'); } }); }); });
  /* Lupa del plano. */
  (function () { var Z = 4, S = 230; doc.querySelectorAll('.plano-svg').forEach(function (svg) { var host = svg.parentElement; if (!host || host.classList.contains('lupa-host')) return; host.classList.add('lupa-host'); var lens = doc.createElement('div'); lens.className = 'lupa'; lens.setAttribute('aria-hidden', 'true'); host.appendChild(lens); var clone = null, sx = 0, sy = 0; function fresh() { if (clone) { clone.remove(); clone = null; } } function hide() { lens.classList.remove('on'); } function show(px, py, ly) { var hr = host.getBoundingClientRect(), r = svg.getBoundingClientRect(), k = hr.width / host.offsetWidth || 1, x = (px-r.left)/k, y=(py-r.top)/k, w=r.width/k, h=r.height/k; if (x<0||y<0||x>w||y>h) { hide(); return; } if (!clone) { clone=svg.cloneNode(true); clone.removeAttribute('id'); clone.classList.add('lupa-svg'); lens.appendChild(clone); } clone.style.width=w*Z+'px'; clone.style.height=h*Z+'px'; clone.style.transform='translate('+(S/2-x*Z)+'px,'+(S/2-y*Z)+'px)'; lens.style.left=((px-hr.left)/k-S/2)+'px'; lens.style.top=(((ly===undefined?py:ly)-hr.top)/k-S/2)+'px'; lens.classList.add('on'); } host.addEventListener('pointerenter',function(e){if(e.pointerType!=='touch')fresh();}); host.addEventListener('pointermove',function(e){if(e.pointerType==='mouse'||e.pointerType==='pen')show(e.clientX,e.clientY);}); host.addEventListener('pointerleave',function(e){if(e.pointerType!=='touch')hide();}); host.addEventListener('touchstart',function(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY;fresh();},{passive:true}); host.addEventListener('touchmove',function(e){if(!e.touches.length)return;var t=e.touches[0];if(Math.hypot(t.clientX-sx,t.clientY-sy)>8)show(t.clientX,t.clientY,t.clientY);},{passive:true}); host.addEventListener('touchend',hide,{passive:true}); }); })();
  doc.addEventListener('pointerdown', function (e) { var b = e.target.closest && e.target.closest('.btn'); if (!b || reduce) return; b.classList.remove('zap'); void b.offsetWidth; b.classList.add('zap'); setTimeout(function () { b.classList.remove('zap'); }, 700); });
  try { if (reduce && localStorage.getItem('vx-motion') !== 'off') { var chip = doc.createElement('div'); chip.className = 'motion-chip'; chip.setAttribute('role', 'status'); chip.innerHTML = '<span>Tu equipo tiene las animaciones reducidas.</span><button type="button" class="mc-on">Activar animaciones</button><button type="button" class="mc-x" aria-label="Cerrar aviso">×</button>'; doc.body.appendChild(chip); chip.querySelector('.mc-on').addEventListener('click', function () { try { localStorage.setItem('vx-motion', 'on'); } catch (e) {} location.reload(); }); chip.querySelector('.mc-x').addEventListener('click', function () { try { localStorage.setItem('vx-motion', 'off'); } catch (e) {} chip.remove(); }); } } catch (e) {}
})();
