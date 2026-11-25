/* Vortex · Presentación: el mapa de Google de «Dónde nos ubicamos» se carga al llegar a esa diapositiva */
(function () {
  'use strict';
  var slide = document.getElementById('ubicacion'); if (!slide) return;
  var frame = slide.querySelector('iframe[data-src]'); if (!frame) return;
  function load() {
    if (frame.getAttribute('src') || !navigator.onLine) return;
    frame.addEventListener('load', function () { frame.classList.add('ok'); });
    frame.setAttribute('src', frame.getAttribute('data-src'));
  }
  if (slide.classList.contains('is-active')) load();
  new MutationObserver(function () { if (slide.classList.contains('is-active')) load(); }).observe(slide, { attributes: true, attributeFilter: ['class'] });
  addEventListener('online', function () { if (slide.classList.contains('is-active')) load(); });
})();
