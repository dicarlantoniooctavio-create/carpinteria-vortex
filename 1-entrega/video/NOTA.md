# Vortex — Reel 15 s (HyperFrames)

**Video final:** `renders/Vortex_Reel_15s.mp4` — 1920×1080, 30 fps, 15,00 s. Audio: solo efectos de sonido, sin música (para volver a ponerla: `WITH_MUSIC = true` en `tools/mix_audio.mjs`).

## Qué hay en la carpeta
- `index.html` — la composición completa (10 escenas, una sola línea de tiempo GSAP pausada).
- `assets/logo.png` (original) y `assets/logo-clean.png` (mismo logo sin el fondo gris claro, para la tarjeta blanca).
- `assets/fonts/` — Archivo, Instrument Serif itálica y JetBrains Mono, locales (el render no cae a fuentes del sistema).
- `assets/vendor/hf-motion-blur.js` — blur de movimiento del registro de HyperFrames (componente `motion-blur`).
- `assets/audio/music_vortex.wav` — música original en el estilo de "Big Talk" de SOFY (pop británico relajado y juguetón): guitarra a contratiempo, bajo que camina, pandereta, silbido como melodía y vientos. No copia la canción. 150 BPM, compuesta por código: `node tools/music_vortex.mjs`. El drop cae en el estallido del logo (4,98 s) y el golpe final en el pulso ámbar (14,38 s). La versión anterior (anuncio con marimba) quedó en `tools/music_vortex_v1_anuncio.mjs`.
- `assets/sfx/` — efectos de la librería de media-use (Pixabay, ver CREDITS.md). `assets/audio/vortex_mix.wav` — mezcla final: `node tools/mix_audio.mjs`.
- `BRIEF.md` — el pedido resumido.

## Qué se hizo
- Guion y tiempos tal cual el prompt; solo los textos del guion.
- Datos reales en los gráficos: 380 V entre R y S (web: "380 V en tres fases R, S y T y neutro"), nombres de circuitos de la web (IUG1–3, TUG1, TUE1) y disyuntor 30 mA.
- Cortina azul de marca como transición (con borde ámbar = energía), wipe azul que arrastra el logo a la salida del reveal.
- Logo reveal: tres hilos R/S/T en espiral → punto de luz → pausa de 4 frames → destello + una onda → push-in → tarjeta blanca donde el logo se dibuja como en la web (primero los dos anillos, después las dos líneas que forman los eslabones, y un destello ámbar que las recorre) → V O R T E X (tracking 0,35 → 0,18 em) → pistas de circuito que se apagan.
- HUD como la referencia: esquinas en L, timecode mono, etiqueta de escena y barra de progreso.
- Verificación: `hyperframes check` sin errores (contraste 69/69 AA), 2 rondas de capturas.

## Qué cambiaría con más tiempo
- Pasar a 60 fps (duplica el tiempo de render; hoy está en 30).
- Dividir `index.html` en subcomposiciones por escena (el lint lo sugiere; hoy es un solo archivo de ~700 líneas).
- Música de catálogo con instrumentos reales (pide instalar e iniciar sesión en el CLI de HeyGen); la actual es sintetizada.
- En AUTOMATISMO el rotor tapa un poco el rótulo "M 3~" dentro del motor; lo sacaría afuera del círculo.
- Dibujar el plano de la hoja "TODO DOCUMENTADO" a partir del plano real de AutoCAD en vez de un esquema genérico.
