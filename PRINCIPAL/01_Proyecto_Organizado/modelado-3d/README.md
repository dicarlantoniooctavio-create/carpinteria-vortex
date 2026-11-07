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

- Máquina modelada: lijadora de banda larga con mesa regulable (motor de 4 HP / 3 kW, 2840 rpm, poleas 90/315, ruedas Ø600 a 4000 mm, banda de 150 mm a 25,5 m/s). 27 piezas en FreeCAD (47 unidades). Medidas: 4754 × 919 × 2220 mm.
- Despiece: `planos/Despiece_Lijadora.pdf` y `.dwg` (lámina A3 vertical: vista explotada en diagonal con las 27 piezas numeradas y lista con medidas tomadas del modelo), `planos/Vistas_Lijadora.dwg` (frente, lateral y planta acotadas) y `planos/piezas.csv`.
- Modelo para girar en cualquier visor 3D: `renders/lijadora.glb`.
