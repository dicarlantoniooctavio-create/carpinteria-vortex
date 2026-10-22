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
- El recorrido debe coincidir con la distribución en planta ya definida en [`instalacion-electrica/planos`](../instalacion-electrica/planos) e [`iluminacion/planos`](../iluminacion/planos).

## Pendiente / Notas

- [ ] Definir tipo de canalización (embutida en pared, a la vista, bandeja aérea) según cómo sea el taller.
- [ ] Verificar la normativa/tabla de referencia que estén usando para el diámetro de caño.
