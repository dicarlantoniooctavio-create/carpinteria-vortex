# Entrega final — Carpintería Industrial (Vortex)

Página pública (GitHub Pages): https://dicarlantoniooctavio-create.github.io/carpinteria-vortex/
Repositorio: https://github.com/dicarlantoniooctavio-create/carpinteria-vortex

| Carpeta | Contenido |
|---|---|
| `01_Proyecto_Organizado/` | Archivos del proyecto ordenados por área (copias; los originales no se tocaron). En `instalacion-electrica/tableros/` están los tableros nuevos |
| `02_Informe_Integrador/` | **Informe técnico** (`Informe_Carpinteria_Vortex.docx` + .pdf, 26 páginas) |
| `03_Empresa/` | **Perfil corporativo de Vortex** (.docx + .pdf), organigrama e isologo |
| `04_Web/` | **Página web**: plano eléctrico por capas con lupa, fases, unifilar, circuitos, máquinas de 380 V, la sección «Tableros seccionales y unifilar», presupuesto y archivos descargables (`archivos/`). Abrir `index.html` |
| `05_Presentacion/` | **Presentación** `Presentacion_Carpinteria_Vortex.html` (38 diapositivas). ← → avanzar, O vista general, F pantalla completa, M índice |
| `06_Planillas/` | **Planillas en Excel**: `Planillas_Carpinteria_Vortex.xlsx` y `Secciones_y_Circuitos_Vortex.xlsx` |
| `07_Video_Vortex_15s/` | Video de 15 s (HyperFrames) |

## Tableros (`01_Proyecto_Organizado/instalacion-electrica/tableros/`)

| Archivo | Qué es |
|---|---|
| `Multifilar.ofice.cad` | Multifilar del Seccional Oficina para CADe SIMU. Es el `Multifilar.ofice.barbu` del equipo con la extensión corregida (y `IGU1` corregido a `IUG1`) |
| `Multifilar.maquinas.cad` | Multifilar del Seccional Máquinas (copia del archivo del equipo) |
| `Unifilar.dwg` | El unifilar del equipo en AutoCAD, con la tabla actualizada y el diferencial de TUE1 en fase R |
| `imagenes/` | Imágenes sacadas de los archivos: capturas de CADe SIMU y el ploteo del unifilar de AutoCAD |

El topográfico de cada tablero está en preparación.

## Datos principales

- Alimentación 3 × 380 / 220 V + N: cable 4 × 35 mm² + PE 16 mm², interruptor general 4P 80 A.
- **Seccional Oficina:** TUG2 (R, 16 A), IUG1 (S, 4 A), TUG1 (S, 16 A), un disyuntor 2P 25 A 30 mA en R y en S, salida 4P 80 A al Seccional Máquinas (4 × 35 mm²).
- **Seccional Máquinas:** TUE1 (R, 16 A), IUG2 (S, 4 A), IUG3 y TUG3 (T, 4 A y 16 A), un disyuntor por fase; grupo de máquinas con térmica 4P 50 A + disyuntor 4P 63 A 30 mA y una térmica 4P de 10 o 16 A por máquina, que alimenta el tablero propio de cada una.
- Máquinas 380 V (amperaje más alto de la placa): lijadora 7,89 A, combinada 8,60 A, escuadradora 8,39 A, tupí 10 A, sierra sin fin 8,5 A, compresor 1 6,12 A → 49,50 A por fase.
- Fases con todo andando: **R 72,97 A · S 67,44 A · T 66,32 A**.
- Potencia instalada 32,65 kW · demandada 29,15 kW · superficie 312 m² (grado superior).
- Presupuesto recomendado: USD 13.269,67 (materiales USD 7.226,80). Precios de referencia: confirmar con proveedores.

## Animaciones

Si Windows tiene apagado *Configuración > Accesibilidad > Efectos visuales > Efectos de animación*, la web y la presentación se muestran casi quietas. En ese caso aparece abajo a la izquierda el botón **Activar animaciones**.
