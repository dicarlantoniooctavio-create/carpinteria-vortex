# Modelado 3D — Lijadora de banda

Modelo 3D de la lijadora de banda de la carpintería. La primera versión se hizo en SolidWorks y la segunda en FreeCAD (carpeta 3D.chonchons.beta/freecad/lijadora_mejorada_v3 del proyecto). La versión actual (v4) rehace esa máquina con las medidas de una lijadora de banda comercial y una altura de trabajo adecuada.

## Contenido a subir

- **`piezas/`**: archivos fuente de SolidWorks.
  - ⚠️ Los `.SLDPRT` y `.SLDASM` son binarios y no versionan bien en Git (no se puede ver el diff), pero igual se suben para tener el historial de entregas. Evitar subir carpetas de backup automático de SolidWorks (`~$*`, `*.SLDPRT.1`, etc. — ya están en el `.gitignore`).
  - Nombrar cada pieza de forma descriptiva: `base-maquina.SLDPRT`, `motor.SLDPRT`, `ensamble-completo.SLDASM`.
- **`renders/`**: vistas de la lijadora nueva sacadas de FreeCAD (iso, frente, lateral, planta y explotada). Los renders del modelo de SolidWorks quedan en `renders/version_solidworks/`.
- Exportar también una versión **`.STEP`** del ensamble final (formato neutro, se puede abrir en cualquier software) para adjuntar a la entrega.

## Contenido sugerido para el informe

- Por qué se eligió esa máquina.
- Simplificaciones hechas respecto a la máquina real (si no se modeló el 100% del detalle, aclararlo).
- Vista explotada del ensamble.
- Plano acotado de la pieza principal (opcional, si el proyecto lo pide).

## Qué definimos

- Máquina modelada: lijadora de banda con mesa regulable, del tipo de las que se usan en carpintería para lijar tableros y piezas largas.
- Medidas generales: 3659 × 950 × 1302 mm (largo × profundidad × alto).
- Altura de trabajo: la mesa queda a 850 mm del piso, a la altura de la cadera de una persona de 1,60 a 1,75 m, y se regula de 780 a 920 mm con cuatro gatos de tornillo. La banda pasa a 150 mm sobre la mesa, así el operario trabaja con los brazos bajos y apoya el presionador sin levantar los hombros.
- Banda de lija estándar de 150 × 7000 mm sobre dos ruedas de Ø300 separadas 3029 mm entre ejes.
- Transmisión: motor de 4 HP (3 kW, 2840 rpm), poleas de 90 y 160 mm y tres correas A64. La rueda gira a 1598 rpm y la banda va a 25,1 m/s.
- Estructura: dos largueros de piso de 100 × 100 mm unen las dos bases de la mesa y las dos columnas, así ninguna pieza queda suelta.
- 27 piezas distintas (47 unidades). Se verificó con un script que cada pieza toca al menos otra y que no hay piezas que se crucen.
- Despiece: `planos/Despiece_Lijadora.pdf` y `.dwg` (lámina A4 vertical: vista explotada con las 27 piezas numeradas y lista con medidas tomadas del modelo), `planos/Vistas_Lijadora.dwg` (frente, lateral y planta acotadas) y `planos/piezas.csv`.
- Modelo para girar en cualquier visor 3D: `renders/lijadora.glb`.
- `modelo/lijadora_corregida.FCStd` y `.step`: el modelo v4. De este archivo salen los renders, el despiece, las vistas acotadas y el `.glb`.
