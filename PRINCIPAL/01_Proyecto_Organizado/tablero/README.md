# Tablero Eléctrico

Diseño del tablero general (y seccionales si corresponde) que alimenta a toda la carpintería: máquinas, iluminación y tomacorrientes.

## Contenido a subir

- **`planos/`**
  - Plano unifilar del tablero (interruptor general, térmicas/diferenciales por circuito).
  - Distribución física dentro del gabinete (dónde va cada elemento).
- `memoria-tablero.md`:
  - Interruptor termomagnético general (calibre según la potencia total instalada — sale de `instalacion-electrica/`).
  - Interruptor diferencial (protección de personas).
  - Una llave térmica por circuito: una o más para máquinas (fuerza motriz), una para iluminación, una para tomas de uso general.
  - Marca/modelo de referencia de los elementos elegidos (Schneider, ABB, Siemens, etc. — lo que usen de referencia).

## Relación con otras carpetas

- Las corrientes y calibres salen del cálculo en [`instalacion-electrica/calculos`](../instalacion-electrica/calculos).
- El circuito de mando de la máquina automatizada (contactor, pulsadores) se conecta a través de una de las llaves térmicas de este tablero — documentarlo en [`automatizacion/`](../automatizacion).

## Pendiente / Notas

- [ ] Definir cantidad de circuitos totales (depende de cuántas máquinas y zonas tenga la carpintería).
- [ ] Elegir si el tablero es solo general o si hay tableros seccionales por sector.
