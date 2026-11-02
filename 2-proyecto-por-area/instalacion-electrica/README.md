# Instalación Eléctrica

Diseño de la instalación eléctrica de la carpintería: alimentación general, tablero seccional, circuitos de fuerza motriz (máquinas) y circuitos de tomacorrientes/iluminación.

## Contenido a subir

- **`calculos/`**
  - Cálculo de potencia instalada (suma de todas las máquinas + iluminación + tomas de uso general).
  - Cálculo de la corriente nominal y de arranque de cada máquina (importante para el motor de la máquina que están automatizando).
  - Selección de conductores (sección de cable según corriente y caída de tensión).
  - Selección de protecciones (térmicas, disyuntores diferenciales, fusibles).
  - Puesta a tierra.
- **`planos/`**
  - Plano unifilar del tablero general.
  - Plano de distribución en planta (dónde va cada máquina, tablero, bocas de luz y tomas).
  - Diagrama de circuitos por sector (fuerza motriz / iluminación / tomas).

## Formato sugerido

- Planos: PDF o DWG exportado a PDF para visualizar sin AutoCAD.
- Cálculos: se puede armar en Excel/Sheets y subir también un resumen en `memoria-calculo.md` con las fórmulas usadas y los resultados finales (así cualquiera del equipo entiende el criterio sin abrir el Excel).

## Qué definimos

- Alimentación trifásica 3 × 380 / 220 V + N, con cable 4 × 35 mm² del medidor al Seccional Oficina.
- Las seis máquinas del taller son trifásicas: cada una tiene su tablero con contactor, guardamotor y parada de emergencia.
- Protecciones del catálogo GE (G60, BPC y Hti para los generales de 80 A). Detalle en el informe y en `tableros/Unifilar.dwg`.
