<!-- Estado del Proyecto -->
![Estado](https://img.shields.io/badge/Estado-En_Desarrollo-orange?style=for-the-badge)

<!-- Especialidad y Temática -->
![Área](https://img.shields.io/badge/Área-Instalación_Eléctrica-FFD700?style=for-the-badge&logo=lightning&logoColor=black)
![Taller](https://img.shields.io/badge/Proyecto-Carpintería-8B4513?style=for-the-badge)

<!-- Herramientas y Documentación -->
![AutoCAD](https://img.shields.io/badge/AutoCAD-06A94D?style=for-the-badge&logo=autodesk&logoColor=white)
![Markdown](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

# Carpintería [Vortex] — Proyecto 
Proyecto integrador escolar/técnico que simula el diseño y automatización e instalacion electrica de una carpintería. El equipo aborda siete frentes de trabajo:

| Área | Carpeta | Responsable(s) |
|---|---|---|
|  La empresa | [`empresa/`](./empresa) | — |
|  Instalación eléctrica | [`instalacion-electrica/`](./instalacion-electrica) | — |
|  Tablero eléctrico | [`tablero/`](./tablero) | — |
|  Tuberías (canalizaciones) | [`tuberias/`](./tuberias) | — |
|  Modelado 3D de máquina | [`modelado-3d/`](./modelado-3d) | — |
|  Automatización de máquinas | [`automatizacion/`](./automatizacion) | — |
|  Iluminación | [`iluminacion/`](./iluminacion) | — |

## Sobre el proyecto

Este proyecto integrador toma como caso de estudio una carpintería, sobre la cual el equipo (actuando como la empresa [`Vortex`](./empresa)) diseña de punta a punta la parte eléctrica del taller: alimentación general y tablero, iluminación, canalizaciones, y la automatización de una de sus máquinas (sierra circular, cepilladora, sierra sinfín, router CNC u otra, a definir en [`modelado-3d/`](./modelado-3d)) junto con su modelado 3D, sus resguardos y su parada de emergencia.

El trabajo busca resolver, con criterio técnico y normativo, los problemas típicos de un taller de este tipo: máquinas con motores que exigen protecciones y arranques seguros, necesidad de buena iluminación para trabajos de precisión, y una distribución de tablero, cañerías y circuitos que sea segura y ordenada.

El alcance del proyecto es de diseño y documentación técnica (cálculos, planos, esquemas y modelado 3D) y no incluye la ejecución física de la obra: es un trabajo académico pensado para aplicar, sobre un caso concreto, los contenidos de instalaciones eléctricas, automatismo y seguridad de máquinas.

## Estructura del repositorio

```
carpinteria-proyecto/
├── empresa/                     # Presentación de la carpintería, máquinas, organigrama
├── instalacion-electrica/       # Circuitos, cálculo de cargas, planos unifilares
│   ├── planos/
│   └── calculos/
├── tablero/                       # Tablero general: llaves térmicas, diferencial
│   └── planos/
├── tuberias/                       # Canalizaciones: tipo de caño, recorrido, diámetros
│   └── planos/
├── modelado-3d/                     # Modelo SolidWorks de la máquina elegida
│   ├── piezas/
│   └── renders/
├── automatizacion/                   # Lógica de control: relé, marcha, paro, emergencia
│   ├── esquemas/
│   └── logica-relee/
├── iluminacion/                        # Cálculo lumínico y disposición de luminarias
│   ├── planos/
│   └── calculos/
├── docs/                                # Memoria descriptiva, cronograma, presentación final
└── referencias/                           # Fotos, normas, fichas técnicas de referencia
    ├── fotos/
    └── recursos/
```

## Equipo

- Kevin Dibella
- Octavio Di Carlantonio
- Lucio Di Carlantonio
- Agustín Duarte

## Cronograma

Ver [`docs/cronograma.md`](./docs/cronograma.md)

## Licencia

Ver [`LICENSE`](./LICENSE)
