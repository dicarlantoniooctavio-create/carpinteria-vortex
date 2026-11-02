# Vortex · Instalación eléctrica de una carpintería

Proyecto final: la instalación eléctrica de un taller de carpintería de 312 m², hecha por la empresa Vortex.

- **Web del proyecto:** https://dicarlantoniooctavio-create.github.io/carpinteria-vortex/1-entrega/web-proyecto/index.html
- **Web de la empresa:** https://dicarlantoniooctavio-create.github.io/carpinteria-vortex/1-entrega/web-empresa/index.html
- **Presentación:** https://dicarlantoniooctavio-create.github.io/carpinteria-vortex/1-entrega/presentacion/Presentacion_Carpinteria_Vortex.html

Los links viejos (los de `PRINCIPAL/...`) siguen andando: redirigen solos a los nuevos.

## Cómo está ordenado

| Carpeta | Para qué sirve |
|---|---|
| [`1-entrega/`](1-entrega/) | **Lo que se presenta:** webs, presentación, informe, perfil de la empresa, planillas y video. Si buscás la versión final de algo, está acá |
| [`2-proyecto-por-area/`](2-proyecto-por-area/) | El trabajo separado por área (instalación eléctrica, tablero, iluminación, cañerías, 3D, automatización), con un README por área |
| [`3-originales-del-equipo/`](3-originales-del-equipo/) | Los archivos tal como los hizo el equipo (planos, planillas, tableros y el modelo 3D en sus carpetas originales). Sirven de respaldo |
| [`PRINCIPAL/`](PRINCIPAL/) | Carpeta vieja: solo tiene las redirecciones de los links anteriores |

**¿Cuál es la versión buena?** Cuando un archivo está en varias carpetas, la versión al día es la de `1-entrega/` (y la de `1-entrega/web-proyecto/archivos/` para los descargables). Las de `3-originales-del-equipo/` son las primeras versiones.

## Todos los archivos

```
carpinteria-vortex/
├── README.md                       ← esta guía
├── index.html                      ← abre la web del proyecto (GitHub Pages)
├── robots.txt, sitemap.xml         ← para buscadores
├── .nojekyll, .gitignore           ← configuración de GitHub Pages y de Git
│
├── 1-entrega/                      ══ LO QUE SE PRESENTA ══
│   ├── README.md                   ← qué hay en cada carpeta y los datos principales
│   ├── Vortex_Web.zip              ← web + presentación para abrir sin internet
│   │
│   ├── web-proyecto/               ← página web del proyecto (abrir index.html)
│   │   ├── index.html
│   │   ├── styles.css
│   │   ├── script.js               ← menú, contadores, plano por capas y lupa
│   │   ├── tableros.js             ← sección de tableros (selector, volteo, lupa)
│   │   ├── maquinas.js             ← sección de máquinas (visor 3D y despiece)
│   │   ├── img/
│   │   │   ├── logo.png
│   │   │   ├── despiece_lijadora.png, ensamble.finalchonchon.cut.png
│   │   │   ├── motor.trifa.choco.png, correa.real.png, pieza12soporte_rollo.png
│   │   │   ├── pieza8_rueda_delantera.png, pieza_4_sopor.motor.png
│   │   │   ├── tableros/           ← multifilar_oficina.png, multifilar_maquinas.png,
│   │   │   │                          topografico_oficina.png, topografico_maquinas.png,
│   │   │   │                          tablero_automatismo.png, unifilar.png
│   │   │   └── (sin usar en la web)  bandeja_perforada.jpg, bandeja_rejilla.jpg,
│   │   │                             caja.jpg, canos.jpg, plano_equipo.png, topo.png
│   │   └── archivos/               ← lo que se descarga desde la web
│   │       ├── Informe_Carpinteria_Vortex.pdf
│   │       ├── Perfil_Corporativo_Vortex.pdf
│   │       ├── Planillas_Carpinteria_Vortex.xlsx
│   │       ├── Secciones_y_Circuitos_Vortex.xlsx
│   │       ├── Plano_Carpinteria.dwg               ← plano eléctrico del taller (AutoCAD)
│   │       ├── Unifilar.dwg                        ← unifilar actualizado (AutoCAD)
│   │       ├── Multifilar_Seccional_Oficina.cad    ← CADe SIMU
│   │       ├── Multifilar_Seccional_Maquinas.cad   ← CADe SIMU
│   │       ├── Topografico_Seccional_Oficina.cad   ← CADe SIMU
│   │       ├── Topografico_Seccional_Maquinas.cad  ← CADe SIMU
│   │       ├── Tablero_Maquina_Mando_y_Potencia.cad← mando y potencia de una máquina (CADe SIMU)
│   │       ├── Tablero_Maquina.esim                ← tablero de una máquina (simulador)
│   │       ├── Despiece_Lijadora.dwg
│   │       └── Despiece_Lijadora.pdf
│   │
│   ├── web-empresa/                ← página web de Vortex (abrir index.html)
│   │   ├── index.html, empresa.css, empresa.js
│   │   ├── img/                    ← logo.png, organigrama.png
│   │   └── archivos/               ← Terminos_y_Condiciones_Vortex.pdf
│   │
│   ├── presentacion/
│   │   └── Presentacion_Carpinteria_Vortex.html   ← 37 diapositivas (← → avanzar, O, F, M)
│   │
│   ├── informe/
│   │   ├── Informe_Carpinteria_Vortex.docx        ← el Word para editar
│   │   └── Informe_Carpinteria_Vortex.pdf
│   │
│   ├── perfil-empresa/
│   │   ├── Perfil_Corporativo_Vortex.docx
│   │   ├── Perfil_Corporativo_Vortex.pdf
│   │   ├── isologo_vortex.png
│   │   └── organigrama.png
│   │
│   ├── planillas/
│   │   ├── Planillas_Carpinteria_Vortex.xlsx      ← IUG, TUG, TUE, cañerías y cómputo/presupuesto
│   │   ├── Secciones_y_Circuitos_Vortex.xlsx      ← fases, cables, máquinas, superficie
│   │   └── Funcionamiento_Maquinas.docx
│   │
│   └── video/                      ← video de 15 s hecho con HyperFrames
│       ├── renders/Vortex_Reel_15s.mp4            ← EL VIDEO FINAL
│       ├── renders/capturas/       ← 10 cuadros del video + hoja_contacto.jpg
│       ├── index.html              ← la animación (fuente del video)
│       ├── NOTA.md, BRIEF.md       ← qué se hizo y el pedido
│       ├── package.json, hyperframes.json, hyperframes.lock.json, meta.json
│       ├── compositions/components/ ← grain-overlay.html, motion-blur.html
│       ├── tools/                  ← mix_audio.mjs, music_vortex.mjs, music_vortex_v1_anuncio.mjs
│       └── assets/
│           ├── logo.png, logo-clean.png
│           ├── audio/              ← music_vortex.wav, vortex_mix.wav
│           ├── fonts/              ← Archivo, Instrument Serif, JetBrains Mono (.woff2)
│           ├── sfx/                ← click, click-soft, impact-bass-1, ping, sparkle,
│           │                          whoosh, whoosh-short, whoosh-cinematic (.mp3) + CREDITS.md
│           └── vendor/hf-motion-blur.js
│
├── 2-proyecto-por-area/            ══ EL TRABAJO POR ÁREA ══
│   ├── README.md                   ← presentación del proyecto, equipo y áreas
│   ├── LICENSE                     ← MIT
│   ├── empresa/
│   │   ├── README.md               ← quiénes somos, equipo, misión y visión
│   │   ├── Logo-Vortex.jpg
│   │   └── Logo-Vortex_copia.jpg   ← copia (antes Logo-TKVK.jpg)
│   ├── instalacion-electrica/
│   │   ├── README.md
│   │   ├── calculos/
│   │   │   ├── Planillas_Carpinteria_Vortex.xlsx  ← copia de la de 1-entrega/planillas
│   │   │   ├── Calculo_Superficie.xlsx
│   │   │   ├── Calculos_Maquinas.xlsx
│   │   │   └── Herramientas_de_mano.ods
│   │   ├── planos/
│   │   │   ├── Plano_Carpinteria_TUG3.dwg         ← el plano usado en la web (= Plano_Carpinteria.dwg)
│   │   │   ├── Plano_Carpinteria_con_maquinas.dwg
│   │   │   ├── Plano_Carpinteria_equipo.dwg       ← versión del equipo
│   │   │   └── Plano_Carpinteria_equipo_vista.png
│   │   └── tableros/
│   │       ├── Unifilar.dwg                       ← = 1-entrega/web-proyecto/archivos/Unifilar.dwg
│   │       ├── Multifilar_Seccional_Oficina.cad
│   │       ├── Multifilar_Seccional_Maquinas.cad
│   │       └── imagenes/           ← multifilar_oficina.png, multifilar_maquinas.png,
│   │                                  tablero_automatismo.png, unifilar.png
│   ├── tablero/
│   │   ├── README.md
│   │   └── planos/Tablero_Maquina.esim
│   ├── tuberias/README.md          ← caños, bandeja y ocupación
│   ├── iluminacion/README.md       ← campanas, paneles y circuitos IUG
│   ├── automatizacion/
│   │   ├── README.md               ← mando y potencia del arranque directo
│   │   └── esquemas/
│   │       ├── Tablero_Maquina_Mando_y_Potencia.cad
│   │       ├── CircutoDeMando.png, Circuitodepotencia.png
│   │       └── Topográfico.png
│   ├── modelado-3d/
│   │   ├── README.md               ← lijadora de banda: 17 piezas + 2 ensambles
│   │   ├── ensamble/               ← ensamble.finalchonchon.cut.SLDASM, motor.trifa.choco.SLDASM
│   │   ├── piezas/                 ← 17 .SLDPRT: pieza 1 base, pieza 2 travesaño inferior (y x2),
│   │   │                              pieza 4 sopor.motor, pieza5, pieza6x1, pieza6x2(7),
│   │   │                              pieza8 rueda delantera, pieza9 rueda trasera,
│   │   │                              pieza10 eje delantero, pieza11 eje trasero,
│   │   │                              pieza12soporte rollo, pieza13 placa inclinacion,
│   │   │                              eje.dosruedas, correa.real, correa.chocomelli,
│   │   │                              correa.real.chocomelli
│   │   ├── renders/                ← una imagen .png por pieza y ensamble (19)
│   │   └── planos/                 ← Despiece_Lijadora.dwg, Despiece_Lijadora.pdf, despiece_lijadora.png
│   ├── docs/
│   │   ├── README.md
│   │   ├── cronograma.md           ← tareas, responsables y estado
│   │   ├── memoria-descriptiva.md  ← plantilla (sin completar)
│   │   └── Informe_Carpinteria_Vortex.pdf          ← copia del informe
│   └── referencias/
│       ├── recursos/README.md      ← layout, dimensiones y datos de la instalación
│       └── fotos/                  ← CircutoDeMando.png, Circuitodepotencia.png,
│                                      Topográfico.png, Logo-Vortex.jpg
│
├── 3-originales-del-equipo/        ══ LOS ARCHIVOS COMO LOS HIZO EL EQUIPO ══
│   ├── planos/
│   │   ├── Plano_Carpinteria_original.dwg         ← antes "CHONCHON S CARPINTERIA.dwg"
│   │   ├── Plano_Carpinteria_original.mht         ← el mismo plano para ver en el navegador
│   │   └── Unifilar_original.dwg
│   ├── planillas/
│   │   ├── CADAcircuito.ods        ← amperaje y fase de cada circuito
│   │   ├── Calculo_Superficie.xlsx
│   │   ├── Calculos_Cables.xlsx    ← transcripción de las hojas a mano
│   │   ├── Calculos_Maquinas.xlsx
│   │   └── Herramientas_de_mano.ods
│   ├── tableros-electricos/
│   │   ├── Multifilar_Seccional_Oficina.cad
│   │   ├── Multifilar_Seccional_Maquinas.cad
│   │   ├── Topografico_Seccional_Oficina.cad      ← antes "Topograficooficina" (sin extensión)
│   │   ├── Topografico_Seccional_Maquinas.cad     ← antes "SECCIONALMAQUINAS" (sin extensión)
│   │   ├── Tablero_Maquina_Mando_y_Potencia.cad
│   │   ├── Tablero_Maquina.esim
│   │   └── Unifilar_version_tableros.dwg
│   └── modelo-3d-lijadora/         ← SolidWorks en sus carpetas originales (no renombrar:
│       │                              los ensambles buscan las piezas por estas rutas)
│       ├── ensamble/ensamble.finalchonchon.cut.SLDASM
│       ├── motor/motor.trifa.choco.SLDASM
│       ├── correa/                 ← correa.real, correa.chocomelli, correa.real.chocomelli
│       ├── ejes/eje.dosruedas.SLDPRT
│       └── pieza 1/, pieza2y3/, pieza4/, pieza5/, pieza6y7/, pieza8/, pieza9/,
│           pieza10/, pieza11/, pieza12/, pieza13/   ← una pieza .SLDPRT en cada una
│
└── PRINCIPAL/                      ══ CARPETA VIEJA (solo redirecciones) ══
    ├── README.md
    ├── 04_Web/index.html                          → 1-entrega/web-proyecto/
    ├── 05_Presentacion/Presentacion_Carpinteria_Vortex.html → 1-entrega/presentacion/
    └── 08_Web_Empresa/index.html                  → 1-entrega/web-empresa/
```

## Nombres que cambiaron

| Antes | Ahora |
|---|---|
| `PRINCIPAL/04_Web/` | `1-entrega/web-proyecto/` |
| `PRINCIPAL/08_Web_Empresa/` | `1-entrega/web-empresa/` |
| `PRINCIPAL/05_Presentacion/` | `1-entrega/presentacion/` |
| `PRINCIPAL/02_Informe_Integrador/` | `1-entrega/informe/` |
| `PRINCIPAL/03_Empresa/` | `1-entrega/perfil-empresa/` |
| `PRINCIPAL/06_Planillas/` | `1-entrega/planillas/` |
| `PRINCIPAL/07_Video_Vortex_15s/` | `1-entrega/video/` |
| `PRINCIPAL/01_Proyecto_Organizado/` | `2-proyecto-por-area/` |
| `3D.chonchons.beta/` | `3-originales-del-equipo/modelo-3d-lijadora/` |
| `excels.important/` | `3-originales-del-equipo/planillas/` |
| `planos/` | `3-originales-del-equipo/planos/` |
| `tableros.electricos/` | `3-originales-del-equipo/tableros-electricos/` |
| `Multifilar.ofice.cad` / `Multifilar.maquinas.cad` | `Multifilar_Seccional_Oficina.cad` / `Multifilar_Seccional_Maquinas.cad` |
| `Topograficooficina`, `SECCIONALMAQUINAS`, `Topografico_Oficina.cad`, `Topografico_Maquinas.cad` | `Topografico_Seccional_Oficina.cad` / `Topografico_Seccional_Maquinas.cad` |
| `topografico_chonchonscut.cad` | `Tablero_Maquina_Mando_y_Potencia.cad` |
| `tablero.maquinas.esim` | `Tablero_Maquina.esim` |
| `CHONCHON S CARPINTERIA.*` | `Plano_Carpinteria_original.*` / `Plano_Carpinteria_equipo.*` |
| `CalculosDeLaMaquinasDeLaCarpinteria (1).xlsx` | `Calculos_Maquinas.xlsx` |
| `Herramientas de mano.instalacion.ods` | `Herramientas_de_mano.ods` |
| `CalculoDeSuperficie.xlsx` | `Calculo_Superficie.xlsx` |
| `FUNCIONAMIENTO MAQUINAS.docx` | `Funcionamiento_Maquinas.docx` |
| `Logo-TKVK.jpg` | `Logo-Vortex.jpg` / `Logo-Vortex_copia.jpg` |

## Datos principales

- Alimentación 3 × 380 / 220 V + N, cable 4 × 35 mm², general 4P 80 A.
- Dos tableros: **Seccional Oficina** (TUG2 en R; IUG1 y TUG1 en S) y **Seccional Máquinas** (TUE1 en R; IUG2 en S; IUG3 y TUG3 en T; una térmica 4P por máquina).
- Iluminación: IUG2 e IUG3 con térmica de 10 A (campanas LED de 100 W).
- Fases con todo andando: R 78,33 A · S 74,88 A · T 73,96 A.
- Más detalle en [`1-entrega/README.md`](1-entrega/README.md).

## Pendiente

- El informe (Word/PDF), `Unifilar.dwg` y el multifilar del Seccional Máquinas todavía muestran IUG2 e IUG3 con 4 A: van de 10 A.
