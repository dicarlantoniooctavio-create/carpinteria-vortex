# Entrega final — Carpintería Industrial (Vortex)

Página pública (GitHub Pages): https://dicarlantoniooctavio-create.github.io/carpinteria-vortex/
Repositorio: https://github.com/dicarlantoniooctavio-create/carpinteria-vortex

| Carpeta | Contenido |
|---|---|
| `01_Proyecto_Organizado/` | Archivos del proyecto ordenados por área (copias; los originales no se tocaron). En `instalacion-electrica/tableros/` están los tableros nuevos |
| `02_Informe_Integrador/` | **Informe técnico** (`Informe_Carpinteria_Vortex.docx` + .pdf, 28 páginas) |
| `03_Empresa/` | **Perfil corporativo de Vortex** (.docx + .pdf), organigrama e isologo |
| `04_Web/` | **Página web**: plano eléctrico por capas con lupa, fases, unifilar, circuitos, máquinas de 380 V, la sección «Tableros seccionales y unifilar», presupuesto y archivos descargables (`archivos/`). Abrir `index.html` |
| `05_Presentacion/` | **Presentación** `Presentacion_Carpinteria_Vortex.html` (37 diapositivas). ← → avanzar, O vista general, F pantalla completa, M índice |
| `06_Planillas/` | **Planillas en Excel**: `Planillas_Carpinteria_Vortex.xlsx` y `Secciones_y_Circuitos_Vortex.xlsx` |
| `07_Video_Vortex_15s/` | Video de 15 s (HyperFrames) |

## Tableros (`01_Proyecto_Organizado/instalacion-electrica/tableros/`)

| Archivo | Qué es |
|---|---|
| `Multifilar.ofice.cad` | Multifilar del Seccional Oficina para CADe SIMU. Es el `Multifilar.ofice.barbu` del equipo con la extensión corregida (y `IGU1` corregido a `IUG1`) |
| `Multifilar.maquinas.cad` | Multifilar del Seccional Máquinas (copia del archivo del equipo). **Pendiente:** IUG2 e IUG3 pasan de 4 A a 10 A |
| `Unifilar.dwg` | El unifilar del equipo en AutoCAD, con la tabla actualizada, IUG2 e IUG3 en 10 A y sin el disyuntor 4P de entrada de la oficina ni la térmica de grupo de las máquinas |
| `imagenes/` | Imágenes sacadas de los archivos: capturas de CADe SIMU y el ploteo del unifilar de AutoCAD |

Los topográficos de los dos tableros están armados en CADe SIMU (`04_Web/archivos/Topografico_Oficina.cad` y `Topografico_Maquinas.cad`) con los mismos aparatos que el unifilar.

## Datos principales

- Alimentación 3 × 380 / 220 V + N: cable 4 × 35 mm² + PE 16 mm², interruptor general 4P 80 A.
- **Seccional Oficina:** TUE1 aire (R, 16 A), IUG1 (S, 4 A), TUG1 oficina + frente (S, 16 A), térmica de entrada 4P 25 A, un disyuntor 2P 25 A 30 mA en R y en S.
- **Seccional Máquinas:** línea 4 × 25 mm² + PE 16 mm² con térmica de entrada 4P 63 A; TUE2 compresor (R, 16 A), IUG2 (S, 10 A), IUG3 y TUG3 (T, 10 A y 16 A), un disyuntor por fase (el de T de 40 A); las máquinas detrás de un disyuntor 4P 63 A 30 mA, cada una con su térmica 4P de 10 o 16 A, que alimenta el tablero propio de cada una.
- **Protecciones:** catálogo GE. Térmicas G60 curva C 6 kA (G62 bipolares, G64 tetrapolares) y diferenciales BPC 30 mA; el general de 80 A es GE Hti104C080 (10 kA), porque la G60 llega hasta 63 A. Entradas de los tableros: G64C25 (oficina) y G64C63 (taller).
- Máquinas 380 V (planilla de máquinas): lijadora 7,89 A y combinada 8,60 A en triángulo; escuadradora 4,85 A, tupí 5 A, sierra sin fin 4,95 A y compresor 1 8,5 A en estrella → 39,79 A por fase. Todas con cable 4 × 2,5 mm².
- Iluminación: IUG1 9 bocas (1,38 A, térmica 4 A); IUG2 9 campanas de 100 W (4,09 A) e IUG3 10 campanas (4,55 A), con térmica GE G62C10 de 10 A.
- Fases con todo andando: **R 53,26 A · S 59,81 A · T 58,89 A**.
- Potencia instalada 37,34 kW · demandada 31,64 kW · superficie 312 m² (grado superior).
- Presupuesto recomendado: USD 13.071,36 (materiales USD 7.118,80). Precios de referencia: confirmar con proveedores.

## Animaciones

Si Windows tiene apagado *Configuración > Accesibilidad > Efectos visuales > Efectos de animación*, la web y la presentación se muestran casi quietas. En ese caso aparece abajo a la izquierda el botón **Activar animaciones**.
