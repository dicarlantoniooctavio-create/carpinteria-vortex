# Tuberías (Canalizaciones)

Diseño de las canalizaciones por donde corren los conductores eléctricos: qué tipo de caño se usa, por dónde pasa y cómo se distribuye desde el tablero hasta cada máquina, boca de luz y tomacorriente.

## Contenido a subir

- **`planos/`**
  - Plano de recorrido de cañerías en planta (trazado desde el tablero hacia cada punto: máquinas, luminarias, tomas).
  - Detalle de cruces, cajas de paso/derivación y bajadas.
- `memoria-tuberias.md`:
  - Tipo de canalización elegida y por qué (caño metálico rígido/semipesado — típico en talleres por golpes y vibración de máquinas — caño corrugado embutido, bandeja portacables, etc.).
  - Diámetro de caño según cantidad y sección de los conductores que pasan por dentro (hay tablas de relación conductores/diámetro de caño en la normativa).
  - Ubicación de cajas de paso y derivación.

## Relación con otras carpetas

- La cantidad y sección de conductores que definen el diámetro de caño salen de [`instalacion-electrica/calculos`](../instalacion-electrica/calculos).
- El recorrido debe coincidir con la distribución en planta ya definida en [`instalacion-electrica/planos`](../instalacion-electrica/planos) (la iluminación está en el mismo plano, capas IUG).

## Qué definimos

- Caño de acero semipesado para negocio, oficina y tomas del frente; bandeja perforada galvanizada de 150 × 50 mm por la izquierda del taller, con una T hacia las luces.
- Ocupación máxima del 35 % de la sección del caño (AEA 90364-7-771). Caños RS19 como mínimo; la bandeja de 150 × 50 mm queda al 30,4 % en el tramo más cargado (hoja Cañerías de las planillas).
