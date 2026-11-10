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

## Qué definimos

- 8 circuitos de 220 V y 6 máquinas de 380 V.
- Un tablero principal (T.P.: seccionador 4P 100 A, general GE G64C63, descargador y salida G64C25 al T.S. Oficina) y dos seccionales: T.S. Oficina y T.S. Taller, los dos con seccionador de entrada. En el T.S. Taller las máquinas tienen una térmica GE G64C50 con bobina de disparo (paradas de emergencia de pared) y el diferencial BPC463. Los tres gabinetes son de doble aislación (esquema TT).
- El mando de cada máquina es un arranque directo: ver los topográficos de `automatizacion/esquemas/` (motor monofásico y trifásico). `planos/tablero.maquinas.esim` es la versión vieja del simulador.
