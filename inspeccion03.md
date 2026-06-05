# Inspección 03: SGOHA — Taller de Proyectos 2

> Consolidación de todos los artefactos del proyecto, mapeados a los **11 criterios** de la rúbrica de evaluación para evidenciar el nivel "Sobresaliente (3)" en cada indicador.

---

## 📋 Retroalimentación del Docente (Inspección 02) — Estado

| Feedback | Artefacto Creado | Estado |
|:---|:---|:---:|
| Definir modelo de optimización formal | `optimization_model.md` | ✅ |
| KPI institucionales | `optimization_model.md` §6 | ✅ |
| Integrar `constitution.md` | `constitution.md` | ✅ |
| Integrar `specs.md` con trazabilidad | `specs.md` | ✅ |
| RNF según arc42 | `arc42_rnf.md` | ✅ |
| TDD con cobertura ≥ 70% | 40 tests, 99% cobertura | ✅ |
| Escenarios controlados PoC | 5 escenarios en `specs.md` §6 | ✅ |

---

## 🛠️ Artefactos por Criterio de Rúbrica

### Criterio 1: Planificación del Proyecto en Jira (3 pts)
*Backlog completo, priorización valor/riesgo/complejidad, épicas, releases, sprints, cronograma con ruta crítica.*

| Artefacto | Ubicación |
|:---|:---|
| Backlog del producto con HU formuladas y priorizadas | [Backlog-y-Plan-Tecnico.md](./docs/planificacion/Backlog-y-Plan-Tecnico.md) y **[Jira Backlog SGH2 (En Vivo)](https://continental-team-nt6xyagx.atlassian.net/jira/software/projects/SGH2/boards/67/backlog)** |
| Épicas alineadas a funcionalidades (5 épicas) | [Backlog-y-Plan-Tecnico.md §2](./docs/planificacion/Backlog-y-Plan-Tecnico.md) y **[Jira Epics SGH2-6 a SGH2-10 (En Vivo)](https://continental-team-nt6xyagx.atlassian.net/jira/software/projects/SGH2/boards/67/backlog)** |
| Relación con restricciones CSP | [Restricciones_Sistema.md](./docs/planificacion/Restricciones_Sistema.md) |
| Cronograma con 7 sprints (Sprint 4 activo) | [metricas_agiles.md §1.1](./docs/planificacion/metricas_agiles.md) |
| Tablero Scrum del equipo | **[Tablero SGH2 (Jira)](https://continental-team-nt6xyagx.atlassian.net/jira/software/projects/SGH2/boards/67)** |
| Releases definidos | [README.md §7](./README.md) |

---

### Criterio 2: Métricas Ágiles (3 pts)
*Burndown, burnup, velocidad, control; análisis de evolución, cuellos de botella, estabilidad del equipo.*

| Artefacto | Ubicación |
|:---|:---|
| **Gráfico Burndown** con análisis | [metricas_agiles.md §3](./docs/planificacion/metricas_agiles.md) y **[Gráfica de Trabajo Pendiente — SGH2 (Jira)](https://continental-team-nt6xyagx.atlassian.net/jira/software/projects/SGH2/boards/67/reports)** |
| **Gráfico Burnup** con análisis de scope | [metricas_agiles.md §4](./docs/planificacion/metricas_agiles.md) y **[Gráfica de Trabajo Hecho — SGH2 (Jira)](https://continental-team-nt6xyagx.atlassian.net/jira/software/projects/SGH2/boards/67/reports)** |
| **Gráfico de Velocidad** (13→17 SP, σ=1.6) | [metricas_agiles.md §2](./docs/planificacion/metricas_agiles.md) y **[Gráfico de Velocidad de Sprints — SGH2 (Jira)](https://continental-team-nt6xyagx.atlassian.net/jira/software/projects/SGH2/boards/67/reports)** |
| **Gráfico de Control** (lead time) | [metricas_agiles.md §5](./docs/planificacion/metricas_agiles.md) y **[Informe de Duración del Ciclo — SGH2 (Jira)](https://continental-team-nt6xyagx.atlassian.net/jira/software/projects/SGH2/boards/67/reports)** |
| Cuellos de botella identificados (4) | [metricas_agiles.md §6](./docs/planificacion/metricas_agiles.md) |
| Estabilidad del equipo (CV = 10.8%) | [metricas_agiles.md §7](./docs/planificacion/metricas_agiles.md) |
| Propuestas de mejora basadas en datos (5) | [metricas_agiles.md §8](./docs/planificacion/metricas_agiles.md) |

> [!NOTE]
> Todos los reportes en Jira (proyecto **SGH2**, board 67) reflejan el ciclo de vida real: Sprints 0–3 cerrados con historias en **Listo**, Sprint 4 **activo** (18–31 Mayo 2026) con historias en **En curso**, y Sprints 5–6 planificados. Los Story Points (78 SP totales) concuerdan al 100% con las métricas documentadas.

---

### Criterio 3: Presupuesto del Proyecto (3 pts)
*RRHH, infraestructura, indirectos, evolución temporal, costo por sprint, acumulado, Green Software.*

| Artefacto | Ubicación |
|:---|:---|
| **Costos RRHH** (4 roles, S/.1,850/sprint) | [presupuesto.md §1.1](./docs/planificacion/presupuesto.md) |
| **Infraestructura tecnológica** (S/.3,540) | [presupuesto.md §1.2](./docs/planificacion/presupuesto.md) |
| **Costos indirectos** (S/.765) | [presupuesto.md §1.4](./docs/planificacion/presupuesto.md) |
| **Costo por sprint** (6 sprints) | [presupuesto.md §2.1](./docs/planificacion/presupuesto.md) |
| **Costo acumulado** (S/.15,380 total) | [presupuesto.md §2.2](./docs/planificacion/presupuesto.md) |
| **Green Software** (huella de carbono) | [presupuesto.md §3.3](./docs/planificacion/presupuesto.md) |

---

### Criterio 4: Análisis de Costos (3 pts)
*Relación complejidad CSP ↔ costo, drivers de incremento, sostenibilidad.*

| Artefacto | Ubicación |
|:---|:---|
| **Relación complejidad NP-Hard → costo** | [presupuesto.md §3.1](./docs/planificacion/presupuesto.md) |
| **Factores de incremento** (4 identificados) | [presupuesto.md §3.2](./docs/planificacion/presupuesto.md) |
| **Evaluación de sostenibilidad** (Green Software) | [presupuesto.md §3.3](./docs/planificacion/presupuesto.md) |
| **ROI estimado** (94.7% a 2 años) | [presupuesto.md §4](./docs/planificacion/presupuesto.md) |
| **Optimización sostenible** (pre-filtrado -70%) | [arc42_rnf.md §5](./docs/arquitectura/arc42_rnf.md) |

---

### Criterio 5: Gestión de Riesgos y Oportunidades (3 pts)
*Registro con probabilidad/impacto/mitigación, oportunidades, relación con restricciones/dependencias.*

| Artefacto | Ubicación |
|:---|:---|
| **Registro de riesgos** (7 riesgos formalizados) | [riesgos_oportunidades.md §1](./docs/gestion/riesgos_oportunidades.md) |
| **Matriz probabilidad × impacto** | [riesgos_oportunidades.md §1.1](./docs/gestion/riesgos_oportunidades.md) |
| **Mapa de calor** | [riesgos_oportunidades.md §1.3](./docs/gestion/riesgos_oportunidades.md) |
| **Registro de oportunidades** (5) | [riesgos_oportunidades.md §2](./docs/gestion/riesgos_oportunidades.md) |
| **Relación riesgos ↔ restricciones CSP** | [riesgos_oportunidades.md §3](./docs/gestion/riesgos_oportunidades.md) |
| **Relación riesgos ↔ dependencias externas** | [riesgos_oportunidades.md §4](./docs/gestion/riesgos_oportunidades.md) |

---

### Criterio 6: Spec-Driven Development (SDD) (3 pts)
*constitution.md con principios/restricciones, specs.md con I/O/reglas/edge cases, reducción de ambigüedad.*

| Artefacto | Ubicación |
|:---|:---|
| **Constitution.md** (7 principios, reglas, contratos) | [constitution.md](./docs/especificaciones/constitution.md) |
| **Specs.md** (I/O, 14 reglas, 10 edge cases) | [specs.md](./docs/especificaciones/specs.md) |
| Escenarios BDD (Gherkin) | [Especificacion_SDD.md](./docs/especificaciones/Especificacion_SDD.md) |
| Justificación arquitectónica | [Especificacion_SDD_Antigravity.md](./docs/especificaciones/Especificacion_SDD_Antigravity.md) |

---

### Criterio 7: Coherencia SDD (3 pts)
*Alineación especificación ↔ modelado ↔ implementación, anticipación de conflictos.*

| Artefacto | Ubicación |
|:---|:---|
| **Trazabilidad Requisito → Spec → Impl → Test** | [specs.md §7](./docs/especificaciones/specs.md) |
| **Modelo formal ↔ Código** (tabla de líneas) | [optimization_model.md §10](./docs/especificaciones/optimization_model.md) |
| **Anticipación de conflictos** (10 edge cases) | [specs.md §5](./docs/especificaciones/specs.md) |
| **5 escenarios PoC validados** | [specs.md §6](./docs/especificaciones/specs.md) |

---

### Criterio 8: Gestión del Repositorio GitHub (3 pts)
*Git Flow, commits semánticos, PRs, desarrollo incremental, README completo, evolución.*

| Artefacto | Ubicación |
|:---|:---|
| **Estrategia de ramas** (Git Flow) | [Declaración_del_equipo.md §6](./docs/gestion/Declaración_del_equipo_del_proyecto.md) |
| **Commits semánticos** (Conventional Commits) | [Declaración_del_equipo.md §6.3](./docs/gestion/Declaración_del_equipo_del_proyecto.md) |
| **7+ commits documentados** | [Declaración_del_equipo.md §6.4](./docs/gestion/Declaración_del_equipo_del_proyecto.md) |
| **README.md completo** (arquitectura, instalación) | [README.md](./README.md) |
| **Desarrollo incremental** (6 sprints) | [metricas_agiles.md](./docs/planificacion/metricas_agiles.md) |

---

### Criterio 9: Trazabilidad del Desarrollo (3 pts)
*Relación backlog → commits → funcionalidades, evidencia de trabajo colaborativo.*

| Artefacto | Ubicación |
|:---|:---|
| **Backlog → Commits mapping** | [Declaración_del_equipo.md §6.4](./docs/gestion/Declaración_del_equipo_del_proyecto.md) |
| **Épicas → Historias → Sprints** | [Backlog-y-Plan-Tecnico.md](./docs/planificacion/Backlog-y-Plan-Tecnico.md) |
| **Trazabilidad en specs.md** | [specs.md §7](./docs/especificaciones/specs.md) |
| **Matriz RACI** (trabajo colaborativo) | [Declaración_del_equipo.md §5.3](./docs/gestion/Declaración_del_equipo_del_proyecto.md) |
| **Definition of Done** | [Declaración_del_equipo.md §5.2.3](./docs/gestion/Declaración_del_equipo_del_proyecto.md) |

---

### Criterio 10: Análisis del Problema y Toma de Decisiones (3 pts)
*Modelado del problema complejo, trade-offs técnicos, justificación de decisiones.*

| Artefacto | Ubicación |
|:---|:---|
| **Modelo matemático formal** | [optimization_model.md](./docs/especificaciones/optimization_model.md) |
| **Trade-off: PERN vs MERN** | [Especificacion_SDD_Antigravity.md §1](./docs/especificaciones/Especificacion_SDD_Antigravity.md) |
| **Trade-off: CP-SAT vs GA vs Tabú** | [Seleccion_enfoque_proyecto.md](./docs/gestion/Seleccion_enfoque_proyecto.md) |
| **Supuestos y limitaciones del PoC** | [optimization_model.md §7–8](./docs/especificaciones/optimization_model.md) |
| **KPIs institucionales** (8 KPIs) | [optimization_model.md §6](./docs/especificaciones/optimization_model.md) |

---

### Criterio 11: Calidad Global de los Artefactos (3 pts)
*Coherencia, claridad, integración entre planificación, costos, riesgos, SDD y repositorio.*

| Aspecto | Evidencia |
|:---|:---|
| **Integración planificación ↔ presupuesto** | Sprints del backlog = sprints del presupuesto (misma estructura) |
| **Integración riesgos ↔ CSP** | Riesgos R-01, R-02, R-07 mapeados a restricciones HC específicas |
| **Integración SDD ↔ implementación** | Trazabilidad línea por línea en optimization_model.md §10 |
| **Integración tests ↔ specs** | Cada edge case en specs.md tiene test correspondiente |
| **Coherencia temporal** | Cronograma (métricas) ↔ costos (presupuesto) ↔ sprints (backlog) |

---

## 📊 Evidencia de Pruebas

```
40 tests PASSED | 0 FAILED | 2.82s
Cobertura: 99% en app.core.scheduler (181 stmts, 1 miss)
```

```bash
# Ejecutar tests
cd src/backend
pytest tests/ -v

# Con cobertura
pytest --cov=app.core.scheduler --cov-report=term-missing tests/
```

---

## 📁 Estructura Completa del Proyecto

```
TallerDeProyecto2/
├── docs/
│   ├── arquitectura/
│   │   └── arc42_rnf.md               ← RNF según arc42
│   ├── especificaciones/
│   │   ├── constitution.md             ← Principios SDD
│   │   ├── optimization_model.md       ← Modelo matemático formal
│   │   ├── specs.md                    ← Especificación + trazabilidad
│   │   ├── Especificacion_SDD.md       ← BDD Gherkin
│   │   └── Especificacion_SDD_Antigravity.md
│   ├── gestion/
│   │   ├── riesgos_oportunidades.md    ← Riesgos y oportunidades
│   │   ├── Project_Charter.md
│   │   ├── Declaración_del_equipo_del_proyecto.md
│   │   ├── Seleccion_enfoque_proyecto.md
│   │   └── ...
│   └── planificacion/
│       ├── presupuesto.md              ← Presupuesto completo
│       ├── metricas_agiles.md          ← Burndown/Burnup/Velocidad/Control
│       ├── Backlog-y-Plan-Tecnico.md
│       └── Restricciones_Sistema.md
├── src/
│   ├── backend/
│   │   ├── app/core/scheduler.py       ← Motor CP-SAT
│   │   ├── tests/
│   │   │   ├── test_scheduler.py       ← 23 tests TDD
│   │   │   ├── test_optimization_model.py ← 17 tests modelo
│   │   │   ├── test_auth.py
│   │   │   └── test_api.py
│   │   └── benchmark.py
│   └── frontend/
├── docker-compose.yml
├── inspeccion03.md                     ← Este documento
└── README.md
```

---

## 🎤 Guía de Exposición: Pitch de Alto Impacto (Rúbrica Sobresaliente)

> [!IMPORTANT]
> **Estrategia de Exposición (4-5 minutos):** Enfoque directo en el valor técnico, decisiones basadas en datos y coherencia entre negocio (Jira/presupuesto) y desarrollo (SDD/algoritmo). No leas diapositivas; narra la historia de cómo resolviste un problema **NP-Hard** combinando ingeniería de software rigurosa y optimización matemática.

### 📌 Criterio 1: Planificación del Proyecto en Jira
* **Qué decir:** *"Nuestro backlog no es una lista estática de tareas, sino un motor de valor. Formulamos historias de usuario enfocadas en la resolución del problema CSP (Constraint Satisfaction Problem). Estructuramos el desarrollo en 5 épicas críticas con 6 sprints y mapeamos las dependencias mediante un cronograma con ruta crítica validada. Esto nos permite garantizar que cada sprint tenga un incremento de software funcional alineado con las restricciones del negocio."*
* **Palabras clave:** *Ruta crítica, priorización basada en riesgo/complejidad, backlog trazable a CSP.*

### 📌 Criterio 2: Métricas Ágiles
* **Qué decir:** *"Gestionamos el proyecto basándonos en evidencia empírica. Analizamos el gráfico Burnup para controlar desviaciones de alcance y el Burndown para asegurar el ritmo de entrega de cada sprint. Registramos una velocidad promedio de 15 puntos con un coeficiente de variación de apenas 10.8%, lo que demuestra la alta estabilidad de nuestro equipo. Además, mediante el Diagrama de Flujo Acumulado e Histogramas de Lead Time, identificamos cuellos de botella y tomamos medidas correctivas inmediatas."*
* **Palabras clave:** *Estabilidad del equipo (CV = 10.8%), burnup de alcance, control de Lead Time, mejora continua basada en datos.*

### 📌 Criterio 3: Presupuesto del Proyecto
* **Qué decir:** *"El costo total de desarrollo de nuestro prototipo PoC asciende a S/. 15,380. Esto incluye un desglose transparente de RRHH estructurado en 4 roles clave, costos de infraestructura cloud en AWS y costos indirectos. Además, incorporamos principios de Green Software estimando de forma proactiva la huella de carbono de la ejecución del algoritmo de optimización, garantizando un presupuesto sostenible y responsable."*
* **Palabras clave:** *Costos integrales (RRHH, Cloud, indirectos), Green Software, evolución temporal de costos.*

### 📌 Criterio 4: Análisis de Costos
* **Qué decir:** *"Demostramos que resolver un problema complejo de optimización no tiene que ser costoso. Justificamos la relación entre la complejidad NP-Hard del problema de horarios y el costo del procesamiento cloud. Propusimos una optimización sostenible mediante pre-filtrado de datos en memoria, reduciendo las consultas en un 70% y asegurando un Retorno de Inversión (ROI) estimado del 94.7% a los dos años."*
* **Palabras clave:** *NP-Hard, optimización sostenible (pre-filtrado -70%), ROI de 94.7% a 2 años.*

### 📌 Criterio 5: Gestión de Riesgos y Oportunidades
* **Qué decir:** *"Mitigamos la incertidumbre de forma activa. Desarrollamos una matriz de riesgos cualitativa y cuantitativa (probabilidad x impacto), identificando 7 riesgos críticos mapeados directamente a restricciones duras del CSP (como colisión de horarios) y dependencias de API. Asimismo, estructuramos 5 oportunidades estratégicas para capitalizar el uso de herramientas inteligentes de desarrollo como Google Antigravity para acelerar la entrega."*
* **Palabras clave:** *Matriz probabilidad-impacto, mitigación de colisiones de CSP, oportunidades de automatización.*

### 📌 Criterio 6: Spec-Driven Development (SDD)
* **Qué decir:** *"Redujimos a cero la ambigüedad antes de escribir una sola línea de código. Nuestro `constitution.md` establece las reglas y principios éticos del sistema. El documento `specs.md` especifica de manera matemática las entradas y salidas, consolidando 14 reglas de negocio estrictas y 10 casos de borde extremadamente complejos. Esto permitió al equipo de desarrollo avanzar con total claridad y sin bloqueos de diseño."*
* **Palabras clave:** *Constitution.md, specs.md, 14 reglas de negocio, 10 edge-cases documentados.*

### 📌 Criterio 7: Coherencia SDD
* **Qué decir:** *"Garantizamos la fidelidad de nuestro software. Existe una trazabilidad de extremo a extremo que conecta el requisito funcional, el modelo matemático formal, la especificación en `specs.md` y la implementación real en Python. Para probar la hipótesis, validamos con éxito 5 escenarios complejos (PoC) diseñados en la especificación, demostrando la eliminación de conflictos de solapamiento en tiempo de ejecución."*
* **Palabras clave:** *Trazabilidad Requisito-Spec-Impl-Test, validación de 5 escenarios PoC sin solapamientos.*

### 📌 Criterio 8: Gestión del Repositorio GitHub
* **Qué decir:** *"Adoptamos estándares de la industria para desarrollo colaborativo. Seguimos la metodología Git Flow con ramas dedicadas de feature, release y main. Todos nuestros commits siguen la nomenclatura semántica (Conventional Commits), lo que facilita el despliegue automático y control de versiones. Nuestra documentación en el README incluye guías completas de instalación, arquitectura y dependencias contenerizadas en Docker."*
* **Palabras clave:** *Git Flow, commits semánticos, Docker, README detallado.*

### 📌 Criterio 9: Trazabilidad del Desarrollo
* **Qué decir:** *"Cada línea de código tiene un propósito de negocio claro. Mapeamos de forma directa cada ID de commit de GitHub a su respectiva historia de usuario en Jira. Además, implementamos una matriz RACI para definir las responsabilidades del equipo y establecemos una rigurosa Definition of Done (DoD) que exige pruebas automatizadas completas para aceptar cualquier entrega."*
* **Palabras clave:** *Backlog to commits mapping, matriz RACI, Definition of Done.*

### 📌 Criterio 10: Análisis del Problema y Toma de Decisiones
* **Qué decir:** *"La solución que construimos está fundamentada técnicamente. Realizamos análisis comparativos profundos de trade-offs de arquitectura (PERN vs MERN) y tecnologías de resolución matemática (Google OR-Tools CP-SAT contra algoritmos genéticos y búsqueda tabú). Demostramos que CP-SAT de OR-Tools garantiza la obtención de óptimos globales en menos de 2 segundos, optimizando adicionalmente 8 KPIs institucionales."*
* **Palabras clave:** *Trade-off PERN vs MERN, motor CP-SAT de OR-Tools, 8 KPIs de optimización.*

### 📌 Criterio 11: Calidad Global de los Artefactos
* **Qué decir:** *"Finalmente, el valor de nuestro proyecto radica en su consistencia sistémica global. Toda nuestra planificación, costos y gestión de riesgos se integran de forma orgánica con el software entregado. Como resultado de esta rigurosidad, nuestra suite de TDD (con 40 tests automatizados) reporta un 99% de cobertura en el núcleo del motor del scheduler, garantizando estabilidad y mantenibilidad en producción."*
* **Palabras clave:** *Coherencia transversal, cobertura del 99% con pytest, 40 tests automatizados.*

