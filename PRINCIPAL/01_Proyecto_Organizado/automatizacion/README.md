# Automatización de Máquinas

[![CADe SIMU](https://img.shields.io/badge/CADe_SIMU-Automatismos-0057B7?style=for-the-badge)](https://cade-simu.com/)

Lógica de mando y control de la máquina: arranque directo de un motor trifásico con enclavamiento, mediante contactor comandado por pulsadores de marcha y paro, más protección térmica.

## Archivos 

| Archivo | Contenido | Estado |
|---|---|---|
| `Automatismo.cad` (CADe SIMU) | Esquema de **mando** (circuito de control) y **potencia** (circuito de fuerza) del arranque directo. [Ver](https://github.com/Tpskevin13/carpinteria/releases/tag/Automatismo)|  Revisado y correcto |
| `Topografico.cad` (CADe SIMU) | Vista topográfica: disposición física de los componentes en el tablero.  [Ver](https://github.com/Tpskevin13/carpinteria/releases/tag/Topografico) |  Revisado y correcto |


> Los `.cad` son archivos de proyecto de CADe SIMU. Las imágenes exportadas (BMP/PNG) permiten que cualquiera vea el esquema sin instalar el programa.

## Circuito de mando (control)

- **`-Q`**: guardamotor/disyuntor — protección del circuito de mando.
- **`-E`**: contacto NC del relé térmico/guardamotor — corta el circuito si el motor se sobrecarga.
- **`-P`**: botón de **paro** (NC), en serie.
- **`-S`**: botón de **marcha** (NA), en paralelo con el contacto auxiliar 13-14 de `-K` (enclavamiento/retención: una vez que arranca, se mantiene solo aunque se suelte el botón).
- **`-K`**: bobina del contactor (A1-A2).

Orden de la lógica: protección → paro → marcha con enclavamiento → bobina. Correcto.

![Foto de referencia.](https://github.com/Tpskevin13/carpinteria/blob/main/referencias/fotos/CircutoDeMando.png)

[Ver](https://github.com/Tpskevin13/carpinteria/releases/tag/CircuitoDeMando)

## Circuito de potencia (fuerza)

- **`-Q`** (guardamotor, 3 polos) → **`-K`** (contactos principales del contactor, 3 polos) → motor (**U1, V1, W1, PE**).

El guardamotor es un único dispositivo físico: sus contactos de potencia (3 polos) van en el circuito de fuerza, y su contacto auxiliar NC (`-E`) va en el circuito de mando.

![Foto de referncia.](https://github.com/Tpskevin13/carpinteria/blob/main/referencias/fotos/Circuitodepotencia.png)

[Ver](https://github.com/Tpskevin13/carpinteria/releases/tag/CircuitoDePotencia)
