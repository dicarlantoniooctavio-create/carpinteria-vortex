# Modelado 3D — Lijadora de banda

Modelo 3D de la lijadora de banda de la carpintería. La primera versión se hizo en SolidWorks; la versión actual, más grande y completa, está en FreeCAD (carpeta 3D.chonchons.beta/freecad/lijadora_mejorada_v3 del proyecto).

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

- Máquina modelada: lijadora de banda larga con mesa regulable (motor de 4 HP / 3 kW, 2840 rpm, poleas 90/315, ruedas Ø600 a 4000 mm, banda de 150 mm a 25,5 m/s). 45 piezas en la lista (96 unidades). Medidas: 4848 × 900 × 1503 mm con el cabezal abajo.
- Despiece: `planos/Despiece_Lijadora.pdf` y `.dwg` (lámina A3 vertical: vista explotada con las 44 piezas dibujadas numeradas, de la base hidráulica abajo a la banda arriba, y lista de 45 piezas con medidas tomadas del modelo), `planos/Vistas_Lijadora.dwg` y `planos/despiece_vistas.png` (frente, lateral y planta acotadas: largo, ancho, alto, entre ejes 4000, mesa 833, eje de rueda 1200, subida del cabezal 250 y carrera de los gatos 200) y `planos/piezas.csv`.
- Modelo para girar en cualquier visor 3D: `renders/lijadora.glb`.
- **Versión 2026-11-26** (`modelo/lijadora_corregida.FCStd`, regenerada con un script de FreeCAD):
  - **Tamaño real**: la máquina mide 1.400 mm de alto (borde de las ruedas) con el cabezal abajo, más los 100 mm de la base; mesa fija a 733 mm sobre la base.
  - **Cabezal con elevación eléctrica**: cada columna es un tubo fijo de 200 × 220 × 8 con un tubo móvil de 150 × 170 × 8 adentro (patines de UHMW). Las chumaceras y el motor van sobre el tubo móvil, así suben y bajan juntos y la distancia entre poleas no cambia: la correa no se tensa ni se afloja. Carrera 250 mm (1.400 → 1.650 mm).
  - **Mando de la elevación**: un motorreductor de 0,37 kW con freno mueve un eje de sincronismo Ø40 por detrás; en cada columna, una caja de reenvío a 90° acciona un gato de tornillo de 2,5 t con husillo Tr30. Las dos columnas suben siempre a la par. Tiene finales de carrera arriba y abajo.
  - **Transmisión**: el motor quedó a 367 mm de la polea grande, con 2 correas A54.
  - **Mesa fija**: se sacaron los 4 gatos, la cadena y el volante de la mesa; los travesaños apoyan directo en las bases (640 mm de alto).
  - **Soportes fijos**: dos largueros de 100 × 80 × 4 a lo largo unen las placas de las columnas y las bases, con calzos y separadores; todo va abulonado al bastidor de la base con bulones M20.
  - **Base hidráulica**: bastidor de tubo 100 × 120 × 5 bajo toda la máquina (las columnas, las bases y el motorreductor van atornillados encima). Va atornillado con ménsulas a 4 cilindros hidráulicos Ø100 de 200 mm de carrera, uno en cada esquina, con pie articulado. Los mueve una central hidráulica eléctrica (motor de 1,1 kW, tanque de 20 L y electroválvula con divisor de caudal para que suban a la par) montada sobre una chapa en el centro del bastidor.
  - Con la base, la máquina mide 4.848 × 900 × 1.500 mm (1.750 con el cabezal arriba, y 200 más con los gatos extendidos); la mesa queda a 833 mm.
  - **Panel de mando** (frente de la base 1): MARCHA verde (I) y PARADA roja (O) del motor; SUBIR y BAJAR azules con flecha para el cabezal; SUBIR y BAJAR amarillos con flecha para la base; y hongo de parada de emergencia.
  - Despiece, vistas acotadas, `piezas.csv` y `renders/lijadora_explosion.png` rehechos con las piezas nuevas (proyección con líneas ocultas de FreeCAD/TechDraw).
- `modelo/lijadora_corregida.FCStd`: copia del modelo del equipo con la banda de lija (9885 × 150 mm), las dos correas A54 y el cubrecorreas rehechos cerrados, tangentes a las ruedas y a las poleas. De esta copia salen los renders, el despiece, las vistas acotadas y el `.glb`.
