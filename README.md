# Vortex · Instalación eléctrica de una carpintería

Proyecto final: la instalación eléctrica de un taller de carpintería de 311 m² cubiertos, hecha por la empresa Vortex.

**Página web del proyecto:** https://dicarlantoniooctavio-create.github.io/carpinteria-vortex/PRINCIPAL/04_Web/index.html

**Página de la empresa:** https://dicarlantoniooctavio-create.github.io/carpinteria-vortex/PRINCIPAL/08_Web_Empresa/index.html

## Qué hay en cada carpeta

| Carpeta | Contenido |
|---|---|
| `PRINCIPAL/04_Web/` | La página web del proyecto |
| `PRINCIPAL/08_Web_Empresa/` | La página web de la empresa |
| `PRINCIPAL/05_Presentacion/` | Presentación animada (abrir el `.html` en el navegador) |
| `PRINCIPAL/02_Informe_Integrador/` | Informe técnico en PDF y Word |
| `PRINCIPAL/06_Planillas/` | Planillas de cálculo (Excel) |
| `PRINCIPAL/01_Proyecto_Organizado/` | Planos, cálculos y tableros (multifilares, topográficos y unifilar) |
| `PRINCIPAL/07_Video_Vortex_15s/` | Video de presentación de 15 s |
| `tableros.electricos/` | Unifilar y multifilar del equipo (AutoCAD), topográficos de CADe SIMU (tableros y automatismo) |
| `planos/` | Plano del local y unifilar en AutoCAD |
| `excels.important/` | Planillas originales del equipo |
| `3D.chonchons.beta/` | Modelo 3D de la lijadora de banda: versión nueva en FreeCAD (`freecad/`) y la primera en SolidWorks (`Solid/`) |

## Datos principales

- Alimentación 3 × 380 / 220 V + N, cable 4 × 25 mm²; en el T.P., seccionador 4P 100 A, general GE G64C63 (4P 63 A) y la salida GE G64C25 al T.S. Oficina. Esquema TT: jabalina a la barra de tierra del T.P. (40 Ω o menos) y tableros de doble aislación.
- **T.S. Oficina** (línea 5 × 6 mm², entrada por seccionador): TUE1 aire en R; IUG1 y TUG1 en S.
- **T.S. Taller** (línea 4 × 25 mm² + PE 16 mm², entrada por seccionador 4P 63 A): TUE2 compresor en R; IUG2 y TUG2 en S; IUG3 y TUE3 (herramientas de 2.000 W o más) en T; seis máquinas de 380 V detrás de una térmica GE G64C50 y un diferencial 4P 63 A, cada una con su térmica 4P.
- Fases (compresor 1 + dos máquinas a la vez): R 57,51 A · S 52,98 A · T 52,06 A. DPMS 35.711 VA.
- Presupuesto: USD 16.918,34 con IVA (precios de referencia).
