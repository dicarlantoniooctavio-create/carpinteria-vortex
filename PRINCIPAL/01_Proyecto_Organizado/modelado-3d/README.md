# Modelado 3D — [Nombre de la máquina]

Modelo 3D en SolidWorks de una de las máquinas de la carpintería (ej: sierra circular, cepilladora, sierra sinfín, router CNC, etc.).

## Contenido a subir

- **`piezas/`**: archivos fuente de SolidWorks.
  - ⚠️ Los `.SLDPRT` y `.SLDASM` son binarios y no versionan bien en Git (no se puede ver el diff), pero igual se suben para tener el historial de entregas. Evitar subir carpetas de backup automático de SolidWorks (`~$*`, `*.SLDPRT.1`, etc. — ya están en el `.gitignore`).
  - Nombrar cada pieza de forma descriptiva: `base-maquina.SLDPRT`, `motor.SLDPRT`, `ensamble-completo.SLDASM`.
- **`renders/`**: capturas o renders exportados (PNG/JPG) del ensamble completo y de piezas clave, para que se vea sin abrir SolidWorks.
- Exportar también una versión **`.STEP`** del ensamble final (formato neutro, se puede abrir en cualquier software) para adjuntar a la entrega.

## Contenido sugerido para el informe

- Por qué se eligió esa máquina.
- Simplificaciones hechas respecto a la máquina real (si no se modeló el 100% del detalle, aclararlo).
- Vista explosionada del ensamble (SolidWorks permite exportarla directamente).
- Plano acotado de la pieza principal (opcional, si el proyecto lo pide).

## Pendiente / Notas

- [ ] Definir qué máquina se va a modelar.
- [ ] Tomar medidas reales o de catálogo del fabricante como referencia.
