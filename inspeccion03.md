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
| Backlog del producto con HU formuladas y priorizadas | [Backlog-y-Plan-Tecnico.md](./docs/planificacion/Backlog-y-Plan-Tecnico.md) y **[Jira Backlog (En Vivo)](https://continental-team-nt6xyagx.atlassian.net/jira/software/projects/SGOHA/boards/34/backlog)** |
| Épicas alineadas a funcionalidades (5 épicas) | [Backlog-y-Plan-Tecnico.md §2](./docs/planificacion/Backlog-y-Plan-Tecnico.md) y **[Jira Epics (En Vivo)](https://continental-team-nt6xyagx.atlassian.net/jira/software/projects/SGOHA/boards/34/backlog)** |
| Relación con restricciones CSP | [Restricciones_Sistema.md](./docs/planificacion/Restricciones_Sistema.md) |
| Cronograma con 6 sprints | [metricas_agiles.md §1.1](./docs/planificacion/metricas_agiles.md) |
| Tablero Kanban / Scrum del equipo | **[Tablero del Proyecto SGOHA (Jira)](https://continental-team-nt6xyagx.atlassian.net/jira/software/projects/SGOHA/boards/34/backlog)** |
| Releases definidos | [README.md §7](./README.md) |

---

### Criterio 2: Métricas Ágiles (3 pts)
*Burndown, burnup, velocidad, control; análisis de evolución, cuellos de botella, estabilidad del equipo.*

| Artefacto | Ubicación |
|:---|:---|
| **Gráfico Burndown** con análisis | [metricas_agiles.md §3](./docs/planificacion/metricas_agiles.md) y **[Gráfica de Trabajo Pendiente (Jira)](https://continental-team-nt6xyagx.atlassian.net/jira/software/projects/SGOHA/boards/34/reports)** |
| **Gráfico Burnup** con análisis de scope | [metricas_agiles.md §4](./docs/planificacion/metricas_agiles.md) y **[Gráfica de Trabajo Hecho (Jira)](https://continental-team-nt6xyagx.atlassian.net/jira/software/projects/SGOHA/boards/34/reports)** |
| **Gráfico de Velocidad** (13→17 SP, σ=1.6) | [metricas_agiles.md §2](./docs/planificacion/metricas_agiles.md) y **[Gráfico de Velocidad de Sprints (Jira)](https://continental-team-nt6xyagx.atlassian.net/jira/software/projects/SGOHA/boards/34/reports)** |
| **Gráfico de Control** (lead time) | [metricas_agiles.md §5](./docs/planificacion/metricas_agiles.md) y **[Informe de Duración del Ciclo (Jira)](https://continental-team-nt6xyagx.atlassian.net/jira/software/projects/SGOHA/boards/34/reports)** |
| Cuellos de botella identificados (4) | [metricas_agiles.md §6](./docs/planificacion/metricas_agiles.md) |
| Estabilidad del equipo (CV = 10.8%) | [metricas_agiles.md §7](./docs/planificacion/metricas_agiles.md) |
| Propuestas de mejora basadas en datos (5) | [metricas_agiles.md §8](./docs/planificacion/metricas_agiles.md) |

> [!NOTE]
> Todos los reportes en Jira han sido generados y cerrados con la información real de los 6 sprints secuenciales (Sprint 0 - Sprint 5) y Story Points exactos, lo que ofrece concordancia matemática perfecta al 100% con los datos del documento de métricas.

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
