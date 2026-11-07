/* Fondos y animaciones de Vortex. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement, reduce = root.classList.contains('reduce-motion');
  var hero = doc.querySelector('.hero'), heroCanvas = doc.querySelector('.hero-field'), main = doc.querySelector('main');
  var dpr = Math.min(window.devicePixelRatio || 1, 2), scrollQueued = false, hidden = doc.hidden, canvases = [], observers = [];
  function setupCanvas(canvas, painter) {
    if (!canvas || !canvas.getContext) return null;
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    var state = { canvas: canvas, ctx: ctx, width: 0, height: 0, visible: false, frame: 0, painter: painter, params: 0 };
    function draw(now) { if (!state.width || !state.height) return; ctx.clearRect(0, 0, state.width, state.height); painter(ctx, state.width, state.height, now, state.params, reduce); }
    function size() { var r = canvas.getBoundingClientRect(); if (!r.width || !r.height) return; state.width = r.width; state.height = r.height; dpr = Math.min(window.devicePixelRatio || 1, 2); canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw(0); }
    function animate() { if (state.frame || reduce || hidden || !state.visible) return; var loop = function (now) { state.frame = 0; if (!state.visible || hidden) return; draw(now); state.frame = requestAnimationFrame(loop); }; state.frame = requestAnimationFrame(loop); }
    state.animate = animate;
    if ('ResizeObserver' in window) { var ro = new ResizeObserver(size); ro.observe(canvas); observers.push(ro); } else size();
    if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { state.visible = e.isIntersecting; if (state.visible) animate(); else if (state.frame) { cancelAnimationFrame(state.frame); state.frame = 0; } }); }); io.observe(canvas); observers.push(io); } else { state.visible = true; animate(); }
    canvases.push(state); return state;
  }
  function paintHero(ctx, w, h, now, strength) {
    var t = reduce ? 0 : now / 1000, alpha = .85 + .15 * Math.max(0, Math.min(1, strength));
    ctx.save(); ctx.globalAlpha = alpha;
    [[.12,.18,.36,.12,0],[.72,.2,.42,.11,1],[.5,.53,.34,.1,2],[.18,.68,.35,.13,3],[.84,.72,.38,.11,4],[.52,.3,.32,.1,5]].forEach(function (a) {
      var x = (a[0] + Math.sin(t * (2 * Math.PI / (15 + a[4] * 1.7)) + a[4]) * .055) * w, y = (a[1] + Math.cos(t * (2 * Math.PI / (19 + a[4])) + a[4] * 2) * .045) * h;
      var rad = w * (.30 + (a[2] - .32) * 1.5), g = ctx.createRadialGradient(x, y, 0, x, y, rad), c = a[4] === 5 ? '227,155,45' : '59,130,214';
      g.addColorStop(0, 'rgba(' + c + ',' + a[3] + ')'); g.addColorStop(1, 'rgba(' + c + ',0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    });
    ['139,90,43','26,26,26','192,57,43'].forEach(function (c, p) { ctx.beginPath(); var base = h * .73 + p * 12; for (var x = 0; x <= w; x += 4) { var y = base + Math.sin(x / w * Math.PI * 4 + t * .22 + p * Math.PI * 2 / 3) * 12; if (!x) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.strokeStyle = 'rgba(' + c + ',.22)'; ctx.lineWidth = 1.4; ctx.stroke(); });
    ctx.restore();
  }
  var heroState = setupCanvas(heroCanvas, paintHero);
  /* Frase animada en la primera entrada. */
  var phrase = doc.querySelector('.frase'), phraseText = phrase && phrase.querySelector('.frase-txt');
  if (phrase && phraseText) {
    var walker = doc.createTreeWalker(phraseText, NodeFilter.SHOW_TEXT, null), textNodes = [], node;
    while ((node = walker.nextNode())) textNodes.push(node);
    var count = 0;
    textNodes.forEach(function (textNode) {
      var frag = doc.createDocumentFragment(), parts = textNode.nodeValue.split(/(\s+)/);
      parts.forEach(function (part) { if (!part) return; if (/^\s+$/.test(part)) frag.appendChild(doc.createTextNode(part)); else { var span = doc.createElement('span'); span.className = 'frase-word'; span.style.setProperty('--word', count++); span.textContent = part; frag.appendChild(span); } });
      textNode.parentNode.replaceChild(frag, textNode);
    });
    var em = phraseText.querySelector('em');
    if (em) { var er = em.getBoundingClientRect(); phraseText.style.setProperty('--spark-distance', Math.max(0, er.width - 6) + 'px'); }
    if (reduce) { phrase.classList.add('is-in'); phraseText.classList.add('is-animated'); }
    else if ('IntersectionObserver' in window) { var phraseIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { phrase.classList.add('is-in'); phraseText.classList.add('is-animated'); phraseIO.disconnect(); } }); }, { threshold: .35 }); phraseIO.observe(phrase); }
    else { phrase.classList.add('is-in'); phraseText.classList.add('is-animated'); }
  }
  /* La línea de los títulos y los números se activa una vez. */
  if (!reduce && 'IntersectionObserver' in window) {
    var detailIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { if (e.target.matches('.sec-head h2')) e.target.style.setProperty('--heading-width', e.target.getBoundingClientRect().width + 'px'); e.target.classList.add('in'); detailIO.unobserve(e.target); } }); }, { threshold: .2 });
    doc.querySelectorAll('.sec-head h2, .eyebrow').forEach(function (el) { detailIO.observe(el); });
  }
  if (!reduce && 'MutationObserver' in window) doc.querySelectorAll('.kpi').forEach(function (card) {
    var mo = new MutationObserver(function () { if (card.classList.contains('in')) { window.setTimeout(function () { var number = card.querySelector('b[data-count]'); if (number) number.classList.add('count-flashed'); }, 1600); mo.disconnect(); } }); mo.observe(card, { attributes: true, attributeFilter: ['class'] });
  });
  /* Cable SVG y nodos de sección. */
  var journey = null, livePath = null, journeyLength = 0, nodes = [];
  function setupJourney() {
    if (!main || journey || !doc.createElementNS) return;
    journey = doc.createElementNS('http://www.w3.org/2000/svg', 'svg'); journey.setAttribute('class', 'journey'); journey.setAttribute('aria-hidden', 'true');
    var back = doc.createElementNS(journey.namespaceURI, 'path'); livePath = doc.createElementNS(journey.namespaceURI, 'path'); livePath.setAttribute('class', 'journey-live'); journey.appendChild(back); journey.appendChild(livePath); main.insertBefore(journey, main.firstChild);
    doc.querySelectorAll('main section h2').forEach(function (heading) { var circle = doc.createElementNS(journey.namespaceURI, 'circle'); circle.setAttribute('r', '2.5'); journey.appendChild(circle); nodes.push({ heading: heading, circle: circle, y: 0 }); });
    function measure() { var height = main.scrollHeight, d = 'M9 0'; for (var y = 80, i = 0; y < height; y += 160, i++) d += ' Q' + (i % 2 ? 13 : 5) + ' ' + (y - 80) + ' 9 ' + y; d += ' L9 ' + height; journey.setAttribute('viewBox', '0 0 18 ' + height); journey.setAttribute('preserveAspectRatio', 'none'); journey.style.height = height + 'px'; back.setAttribute('d', d); livePath.setAttribute('d', d); journeyLength = livePath.getTotalLength(); livePath.style.strokeDasharray = journeyLength; livePath.style.strokeDashoffset = journeyLength; nodes.forEach(function (n) { var r = n.heading.getBoundingClientRect(); n.y = r.top + scrollY - main.getBoundingClientRect().top; n.circle.setAttribute('cx', '9'); n.circle.setAttribute('cy', n.y); }); }
    if ('ResizeObserver' in window) { var ro = new ResizeObserver(measure); ro.observe(main); observers.push(ro); } measure();
  }
  setupJourney();
  function onScroll() { scrollQueued = false; var y = scrollY;
    if (hero && heroState) { var r = hero.getBoundingClientRect(), strength = Math.max(0, Math.min(1, (innerHeight - r.top) / Math.max(1, r.height))); heroCanvas.style.opacity = String(Math.max(0, Math.min(1, r.bottom / innerHeight))); heroState.params = strength; if (!reduce && heroState.visible) { heroState.ctx.clearRect(0,0,heroState.width,heroState.height); paintHero(heroState.ctx, heroState.width, heroState.height, performance.now(), strength); } }
    if (journey && livePath && journeyLength) { var top = main.getBoundingClientRect().top + y, tip = y + innerHeight / 2 - top, f = Math.max(0, Math.min(1, tip / main.scrollHeight)); livePath.style.strokeDashoffset = String(journeyLength * (1 - f)); nodes.forEach(function (n) { n.circle.classList.toggle('passed', n.y <= tip); }); }
  }
  window.addEventListener('scroll', function () { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScroll); } }, { passive: true }); onScroll();
  doc.addEventListener('visibilitychange', function () { hidden = doc.hidden; canvases.forEach(function (s) { if (hidden && s.frame) { cancelAnimationFrame(s.frame); s.frame = 0; } else if (!hidden && s.visible && !reduce) s.animate(); }); });
  /* Corrige el destino de los enlaces internos tras cargas tardías. */
  doc.querySelectorAll('a[href^="#"]').forEach(function (a) { var id = a.getAttribute('href'); if (id.length < 2) return; a.addEventListener('click', function () { var target; try { target = doc.querySelector(id); } catch (e) { return; } if (!target) return; var tries = 0, timer = 0, hasEnd = 'onscrollend' in window; function fix() { clearTimeout(timer); var margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0, off = target.getBoundingClientRect().top - margin; if (Math.abs(off) > 4 && tries++ < 4) { window.scrollTo({ top: window.scrollY + off, behavior: reduce ? 'auto' : 'smooth' }); timer = setTimeout(fix, 1200); } else if (hasEnd) window.removeEventListener('scrollend', fix); } if (hasEnd) window.addEventListener('scrollend', fix); timer = setTimeout(fix, 1600); }); });
})();
