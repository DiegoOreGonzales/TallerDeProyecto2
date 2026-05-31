# Inspección 04 — SGOHA: Análisis, Validación y Plan de Implementación del Equipo

> **Proyecto:** Sistema de Generación Óptima de Horarios Académicos (SGOHA)
> **Institución:** Universidad Continental · Taller de Proyecto 2
> **Equipo:** Jose Antonio Bacilio · Aldo Requena · Diego Ore · Luis Gutierrez
> **GitHub:** https://github.com/DiegoOreGonzales/TallerDeProyecto2
> **Jira:** https://continental-team-nt6xyagx.atlassian.net/jira/software/projects/SGH2/boards/67/backlog
> **Fecha:** Mayo–Junio 2026

---

## 1. Contexto del Proyecto

El **Sistema de Generación Óptima de Horarios Académicos (SGOHA)** automatiza la distribución de cargas horarias en la Universidad Continental usando **CP-SAT de Google OR-Tools** — un solver de programación por restricciones (CSP). El prototipo actual (PoC) genera horarios sin colisiones para 122 secciones en menos de 2 segundos y cuenta con 40 tests automatizados al 99% de cobertura.

Esta inspección aborda la transición del PoC hacia un MVP enriquecido, integrando los hallazgos del **Análisis de Requerimientos y Mapeo de Stakeholders (MAPE)**, y define el plan de trabajo colaborativo del equipo de 4 integrantes para los sprints restantes.

---

## 2. Análisis y Validación del Problema

### 2.1 Actores Involucrados (Stakeholders)

| Actor | Rol | Necesidades clave |
|:---|:---|:---|
| **Coordinador Académico** | Administrador del sistema | Generación automática, ajuste manual drag-and-drop, resolución de conflictos de última hora |
| **Docentes** | Ejecutores del horario | Horarios compactos, respeto de disponibilidad, sin traslados inter-campus el mismo día |
| **Estudiantes** | Usuarios finales | Sin cruces de materias obligatorias, horarios agrupados, acceso móvil offline |
| **Dirección Académica** | Patrocinador estratégico | Tasa de ocupación de aulas, reportes SUNEDU, reducción de deserción |
| **Ingeniero de Sistemas (DevOps)** | Arquitecto técnico | CI/CD, TDD ≥ 70%, observabilidad del solver, seguridad JWT/SSO |
| **Soporte Técnico** | Helpdesk | Alertas automáticas, guías de diagnóstico rápido |

### 2.2 Proceso Mayor donde se Aplica la Optimización

La optimización CP-SAT actúa en el **proceso de Planificación Académica Semestral**, que involucra:

1. **Carga de datos maestros** → cursos, aulas, docentes, secciones, disponibilidades
2. **Formulación del CSP** → variables binarias `x[s,d,a]` (sección s, slot d, aula a)
3. **Ejecución del solver** → restricciones duras (HC-1 a HC-9) + función objetivo blanda (Z)
4. **Publicación del horario** → dashboard estudiante, exportación PDF/iCal
5. **Ajustes manuales** → drag-and-drop con validación en tiempo real

```
Coordinador ──► [Carga datos] ──► [CP-SAT solver] ──► [Horario óptimo] ──► [Publicación]
                                         │                      │
                                  Restricciones duras    Ajuste manual D&D
                                  HC-1 a HC-9            (validación RT)
```

### 2.3 Restricciones Críticas del Sistema

#### Restricciones Duras (Hard Constraints — no negociables)
| Código | Descripción | Impacto si se viola |
|:---|:---|:---|
| HC-1 | Una aula no puede tener dos secciones simultáneas | Colisión física — imposible |
| HC-2 | Un docente no puede dictar dos secciones simultáneas | Conflicto docente — ilegal |
| HC-3 | Capacidad del aula ≥ demanda estimada de la sección | Incapacidad física — ilegal |
| HC-4 | Tipo de aula correcto (TEO/LAB) para el tipo de curso | Error pedagógico |
| HC-5 | Un estudiante no puede tener cruces de materias obligatorias | Retraso de egreso |
| HC-6 | No asignar docente fuera de su disponibilidad declarada | Violación contractual |
| HC-7 | Horas semanales por docente ≤ límite legal SUNEDU | Incumplimiento normativo |
| HC-8 | Un docente no puede estar en dos sedes diferentes el mismo día | Inviabilidad logística |
| HC-9 | No generar horario si el sistema es matemáticamente infactible | Integridad del solver |

#### Restricciones Blandas (Soft Constraints — optimizadas con función Z)
| Código | Descripción | Peso en Z |
|:---|:---|:---:|
| SC-1 | Minimizar huecos entre clases del mismo docente | Alto |
| SC-2 | Respetar preferencia de turno (mañana/tarde/noche) | Medio |
| SC-3 | Maximizar bloques de clases consecutivas | Medio |
| SC-4 | Evitar bloques en fin de semana | Bajo |
| SC-5 | Maximizar tasa de ocupación de aulas | Bajo |

### 2.4 Indicadores Clave de Éxito (KPIs)

| KPI | Métrica | Meta |
|:---|:---:|:---:|
| Tiempo de generación del horario | segundos | ≤ 2s (50 cursos) / ≤ 30s (122 secciones) |
| Colisiones de aulas | # conflictos HC-1 | 0 (cero absoluto) |
| Colisiones docentes | # conflictos HC-2 | 0 (cero absoluto) |
| Satisfacción de disponibilidad docente | % restricciones blandas respetadas | ≥ 85% |
| Ocupación promedio de aulas | % del aforo | ≥ 70% |
| Huecos promedio por docente | horas/semana | ≤ 2h |
| Cobertura de tests automatizados | % líneas cubiertas | ≥ 70% (actual: 99%) |
| Tiempo de respuesta API | ms p95 | ≤ 500ms |
| Usuarios concurrentes soportados | # usuarios | 10,000 (temporada matrícula) |

### 2.5 Justificación de la GUI

La interfaz gráfica del SGOHA cumple tres roles críticos:

| Rol | Descripción | Pantalla |
|:---|:---|:---|
| **Interacción de usuarios** | El Coordinador configura parámetros, ejecuta el solver y realiza ajustes manuales mediante drag-and-drop sin tocar código | `/admin/scheduler`, `/admin/horarios` |
| **Visualización de resultados** | El Estudiante ve su horario semanal con colores semánticos por curso y puede exportarlo a PDF/iCal | `/student/dashboard` |
| **Validación operativa** | El sistema muestra en rojo las celdas conflictivas durante el drag-and-drop y alerta si el solver detecta infactibilidad | Feedback visual en tiempo real |

---

## 3. Modelado y Fundamentación Técnica

### 3.1 Modelo Formal CSP (Programación por Restricciones)

**Variables de decisión:**
```
x[s, d, a] ∈ {0, 1}
  s = sección (curso × docente × turno)
  d = slot horario (día × bloque)
  a = aula física
```

**Función objetivo (minimizar Z):**
```
Z = λ₁·Z₁(dispersión_slots) + λ₂·Z₂(huecos_docente) + λ₃·Z₃(preferencia_turno)

donde:
  λ₁ = 10   (peso alto: compacidad del horario)
  λ₂ = 7    (peso medio-alto: evitar huecos docente)
  λ₃ = 3    (peso bajo: preferencias de turno)
```

**Restricciones duras formalizadas:**
```
HC-1: ∑ₛ x[s,d,a] ≤ 1    ∀d,a       (unicidad de aula)
HC-2: ∑ₛ x[s,d,a] ≤ 1    ∀d, doc(s)  (unicidad docente)
HC-3: capacidad(a) ≥ demanda(s)  cuando x[s,d,a]=1
HC-5: ∑ₛ∈ciclo_k x[s,d,a] ≤ 1   ∀d,k  (sin cruce estudiantes)
```

### 3.2 Análisis Comparativo de Alternativas Técnicas

| Dimensión | CP-SAT (Google OR-Tools) ✅ | Algoritmo Genético | Búsqueda Tabú |
|:---|:---|:---|:---|
| **Garantía de optimalidad** | Sí (con tiempo suficiente) | No (heurística) | No (heurística) |
| **Manejo de restricciones duras** | Nativo, automático | Manual, complejo | Manual, complejo |
| **Tiempo para 122 secciones** | ≤ 30s | Variable (min-horas) | Variable |
| **IIS (diagnóstico infactibilidad)** | Sí (nativo) | No | No |
| **Escalabilidad** | Alta (workers paralelos) | Media | Baja |
| **Curva de aprendizaje del equipo** | Media (Python API) | Alta | Alta |

**Decisión:** CP-SAT es la opción técnicamente superior para este problema. La alternativa con CSV temporal para importación de datos (en lugar de Banner ERP directo) es viable para el MVP y reduce riesgo de integración.

### 3.3 Stack Tecnológico y Justificación

| Capa | Tecnología | Justificación |
|:---|:---|:---|
| **Backend** | FastAPI + Python | Integración nativa con OR-Tools (Python), tipado Pydantic, async nativo |
| **Frontend** | React + TypeScript | Ecosistema maduro, dnd-kit para drag-and-drop, TypeScript previene errores de runtime |
| **Base de datos** | PostgreSQL + SQLAlchemy | ACID, relaciones complejas (cursos↔aulas↔docentes), migraciones con Alembic |
| **Contenerización** | Docker + docker-compose | Reproducibilidad, escalado horizontal (3 instancias API), despliegue en cualquier entorno |
| **CI/CD** | GitHub Actions | Integración nativa con el repositorio, gratuito para proyectos académicos |
| **Solver** | Google OR-Tools CP-SAT | Ver Sección 3.2 |

> [!NOTE]
> El docente menciona stack MERN (MongoDB + Express + React + Node). Nuestro stack usa **PostgreSQL en lugar de MongoDB** (justificado por la naturaleza relacional del problema: aulas, cursos, secciones y docentes tienen fuertes interdependencias que MongoDB no modela eficientemente) y **FastAPI en lugar de Express** (necesario para la integración directa con OR-Tools en Python). El frontend usa React + TypeScript, coincidiendo con la "R" de MERN.

---

## 4. Desarrollo y Actualización del MVP — Plan de Trabajo del Equipo

### 4.1 Resumen del Estado Actual del MVP

| Módulo | Estado | Cobertura tests |
|:---|:---:|:---:|
| Auth JWT por roles | ✅ Completado | 99% |
| CRUD Cursos, Aulas, Secciones | ✅ Completado | 99% |
| Motor CP-SAT (9 HC + función Z) | ✅ Completado | 99% |
| Dashboard Estudiante | ✅ Completado | — |
| Drag-and-Drop Coordinador | ✅ Completado | — |
| Exportación PDF | 🔵 En curso | — |
| Tests TDD (40 tests) | ✅ Completado | 99% |
| CI/CD GitHub Actions | ✅ Completado | — |
| Disponibilidad Docente (RF-Nue-01) | ⬜ Pendiente Sprint 5 | — |
| Optimización solver (pre-filtrado) | ⬜ Pendiente Sprint 5 | — |
| Documentación final | ⬜ Pendiente Sprint 5 | — |

### 4.2 Requerimientos Nuevos Priorizados MoSCoW

#### 🔴 Must Have — Sprint 5 (01–14 Jun 2026)
| Código | Requerimiento | Responsable |
|:---|:---|:---:|
| RF-Nue-02 | Editor Drag-and-Drop con validación RT (ya implementado, refinar) | Bacilio |
| RF-Nue-04 | Soporte multi-sede y restricción de traslado docente | Aldo |
| RNF-Nue-03 | Degradación elegante del solver + reporte IIS de conflictos | Diego |
| RNF-Nue-07 | Pipeline CI/CD completo (ya activo, validar cobertura ≥ 70%) | Luis |

#### 🟡 Should Have — Sprint 5 (si hay capacidad restante)
| Código | Requerimiento | Responsable |
|:---|:---|:---:|
| RF-Nue-01 | Portal de autogestión de disponibilidad docente | Aldo |
| RF-Nue-05 | Exportación iCal/ICS + PDF institucional | Bacilio |
| RF-Nue-09 | Consola de telemetría del solver | Diego |

#### 🟢 Could Have — Backlog largo plazo
- RF-Nue-06: Notificaciones WhatsApp/Email ante cambios
- RF-Nue-07: Dashboard gerencial de analítica
- RNF-Nue-05: PWA con modo offline

### 4.3 Plan de Implementación por Colaborador

---

#### 👤 Jose Antonio Bacilio — Líder Técnico / Backend Core

**Responsabilidades:**
- Arquitectura del backend, integración de nuevos módulos al core FastAPI
- Refinamiento del Drag-and-Drop Editor (validación en tiempo real backend)
- Exportación PDF con branding institucional UC

**Tareas Sprint 5:**

| # | Tarea | Tipo | Estimación |
|:---:|:---|:---:|:---:|
| 1 | Endpoint `POST /api/schedules/{id}/move` con validación HC en tiempo real | Backend | 3 SP |
| 2 | Servicio de exportación PDF (`ReportLab` / `WeasyPrint`) con paleta UC | Backend | 2 SP |
| 3 | Exportación iCal/ICS con `icalendar` Python library | Backend | 1 SP |
| 4 | Actualizar `inspeccion04.md` y `README.md` con evidencias | Docs | 1 SP |
| **Total** | | | **7 SP** |

**Commits esperados:**
```
feat(scheduler): add real-time HC validation on manual block move
feat(export): implement PDF export with UC institutional branding
feat(export): add iCal/ICS calendar export for students and teachers
docs: update inspeccion04 and README with sprint 5 evidence
```

---

#### 👤 Aldo Requena — Full Stack / Restricciones Multi-sede

**Responsabilidades:**
- Módulo de registro de sedes (campus) y su vinculación a aulas
- Nueva restricción dura HC-8: no asignar docente en 2 sedes el mismo día
- Portal de autogestión de disponibilidad docente (interfaz calendario)

**Tareas Sprint 5:**

| # | Tarea | Tipo | Estimación |
|:---:|:---|:---:|:---:|
| 1 | Modelo `Sede` en BD + CRUD de sedes | Backend | 2 SP |
| 2 | Agregar campo `sede_id` a tabla `Aulas` + migración Alembic | Backend | 1 SP |
| 3 | Implementar HC-8 en `scheduler.py` (restricción inter-campus) | Solver | 3 SP |
| 4 | UI: Grid de disponibilidad docente (clic para marcar slots) | Frontend | 3 SP |
| **Total** | | | **9 SP** |

**Commits esperados:**
```
feat(models): add Sede model and link to Aulas with Alembic migration
feat(scheduler): implement HC-8 same-day multi-campus constraint
feat(frontend): add teacher availability management calendar grid
test: add 8 tests for HC-8 multi-campus and sede CRUD endpoints
```

---

#### 👤 Diego Ore Gonzales — Backend / Solver Avanzado y Telemetría

**Responsabilidades:**
- Degradación elegante del solver CP-SAT (timeout + solución parcial)
- Identificación de IIS (Irreducible Inconsistent Subsystem) para mostrar conflictos
- Consola de telemetría: métricas de ejecución del solver (RAM, CPU, tiempo, variables)

**Tareas Sprint 5:**

| # | Tarea | Tipo | Estimación |
|:---:|:---|:---:|:---:|
| 1 | Implementar timeout configurable en CP-SAT + retorno de mejor solución parcial | Solver | 4 SP |
| 2 | Módulo IIS: identificar y reportar qué sección/docente causa infactibilidad | Solver | 3 SP |
| 3 | Endpoint `GET /api/solver/metrics` con métricas de última ejecución | Backend | 2 SP |
| 4 | UI: Panel de telemetría en `/admin/telemetria` | Frontend | 2 SP |
| **Total** | | | **11 SP** |

**Commits esperados:**
```
feat(solver): implement configurable timeout with partial solution fallback
feat(solver): add IIS detection to report conflicting constraints on infeasibility
feat(api): add GET /api/solver/metrics endpoint with execution telemetry
feat(frontend): add solver telemetry panel in admin dashboard
test: add 6 tests for solver timeout, IIS detection and metrics endpoint
```

---

#### 👤 Luis Gutierrez — DevOps / QA / Documentación

**Responsabilidades:**
- Validar y completar el pipeline CI/CD en GitHub Actions
- Asegurar cobertura de tests ≥ 70% en todos los módulos nuevos
- Actualizar documentación técnica: `specs.md`, `arc42_rnf.md`, `metricas_agiles.md`
- Gestión del repositorio GitHub: PRs, code reviews, merge a `main`

**Tareas Sprint 5:**

| # | Tarea | Tipo | Estimación |
|:---:|:---|:---:|:---:|
| 1 | Actualizar pipeline GitHub Actions para cubrir nuevos módulos (HC-8, solver timeout, export) | DevOps | 2 SP |
| 2 | Agregar tests de integración: exportación PDF, ICS, endpoint telemetría | QA | 3 SP |
| 3 | Actualizar `specs.md` §7 con trazabilidad de los nuevos RFs | Docs | 2 SP |
| 4 | Actualizar `arc42_rnf.md` con RNF-Nue-01 (SSO), RNF-Nue-03 (degradación), RNF-Nue-07 (CI/CD) | Docs | 2 SP |
| 5 | Actualizar `metricas_agiles.md` con velocidad real de Sprint 5 | Docs | 1 SP |
| **Total** | | | **10 SP** |

**Commits esperados:**
```
ci: update GitHub Actions pipeline for HC-8, timeout and export modules
test: add integration tests for PDF/ICS export and telemetry endpoint
docs(specs): add traceability for RF-Nue-01, RF-Nue-03, RF-Nue-04, RNF-Nue-07
docs(arc42): update RNF section with SSO, graceful degradation and CI/CD metrics
docs(metricas): update sprint 5 velocity and burndown chart
```

---

### 4.4 Cronograma Visual Sprint 5 (01–14 Junio 2026)

```
Semana 1 (01–07 Jun)          Semana 2 (08–14 Jun)
─────────────────────────────  ─────────────────────────────
Bacilio  ████ PDF/iCal Export  ████ D&D Validation + Docs
Aldo     ████ Sedes + HC-8     ████ Portal Disponibilidad Doc
Diego    ████ Solver Timeout   ████ IIS + Telemetría Panel
Luis     ████ CI/CD + Tests    ████ Docs specs/arc42/métricas
─────────────────────────────  ─────────────────────────────
Review diario: 15 min stand-up (sincronía por WhatsApp/Discord)
PR: cada tarea → rama feature → PR con code review de 1 compañero → merge
```

### 4.5 Flujo de Trabajo Git (Git Flow)

```
main
  └── develop
        ├── feature/bacilio/pdf-ical-export
        ├── feature/aldo/sedes-hc8
        ├── feature/aldo/teacher-availability
        ├── feature/diego/solver-timeout-iis
        ├── feature/diego/telemetria-panel
        └── feature/luis/ci-tests-docs
```

**Reglas del equipo:**
- Cada PR requiere al menos **1 aprobación** antes del merge
- Los commits siguen **Conventional Commits** (feat/fix/test/docs/ci/perf)
- Los PRs deben pasar el pipeline CI/CD (pytest ≥ 70% cobertura) antes de ser mergeados
- No se hace push directo a `main`

---

## 5. Gestión Documental y Repositorio

### 5.1 Documentos a Actualizar en Sprint 5

| Documento | Sección a actualizar | Responsable |
|:---|:---|:---:|
| `specs.md` | §7 Trazabilidad: agregar RF-Nue-01, RF-Nue-03, RF-Nue-04, RNF-Nue-07 | Luis |
| `arc42_rnf.md` | Agregar RNF-Nue-01 (SSO), RNF-Nue-03 (degradación), RNF-Nue-04 (accesibilidad) | Luis |
| `metricas_agiles.md` | §2 Velocidad real Sprint 5 · §3 Burndown actualizado | Luis |
| `Backlog-y-Plan-Tecnico.md` | Agregar HUs de RF-Nue-01, RF-Nue-04, RNF-Nue-03 al backlog | Bacilio |
| `riesgos_oportunidades.md` | Agregar riesgos de SSO y multi-sede | Diego |
| `README.md` | Agregar sección de exportación y disponibilidad docente | Bacilio |
| `inspección04.md` | Este documento — actualizar con evidencias finales Sprint 5 | Todos |

### 5.2 Matriz RACI del Sprint 5

| Tarea | Bacilio | Aldo | Diego | Luis |
|:---|:---:|:---:|:---:|:---:|
| HC-8 Multi-sede | C | **R** | I | A |
| Portal Disponibilidad Docente | I | **R** | C | A |
| Solver Timeout + IIS | C | I | **R** | A |
| Telemetría del Solver | C | I | **R** | A |
| Exportación PDF/iCal | **R** | I | C | A |
| D&D Validación RT | **R** | C | I | A |
| CI/CD + Tests | C | C | C | **R** |
| Documentación final | C | C | C | **R** |

*R=Responsible · A=Accountable · C=Consulted · I=Informed*

---

## 6. Entregable Final

### 6.1 Checklist de Entrega (Inspección 04)

- [ ] MVP actualizado con RF-Nue-02 (D&D refinado), RF-Nue-04 (multi-sede), RF-Nue-05 (PDF/iCal)
- [ ] Degradación elegante del solver implementada y testeada (RNF-Nue-03)
- [ ] Portal de disponibilidad docente funcional (RF-Nue-01)
- [ ] Consola de telemetría del solver en producción (RF-Nue-09)
- [ ] Pipeline CI/CD actualizado con todos los módulos nuevos (RNF-Nue-07)
- [ ] `specs.md` actualizado con trazabilidad completa de los nuevos RFs
- [ ] `arc42_rnf.md` actualizado con RNF-Nue-01, 03, 04
- [ ] `metricas_agiles.md` con velocidad y burndown de Sprint 5
- [ ] Todos los commits siguiendo Conventional Commits en ramas feature → PR → main
- [ ] `inspección04.md` actualizado con evidencias del análisis MAPE y plan de equipo

### 6.2 Criterios de Calidad

| Criterio | Verificación | Meta |
|:---|:---|:---:|
| Cobertura de tests | `pytest --cov` en pipeline | ≥ 70% |
| Sin errores TypeScript | `tsc --noEmit` en CI | 0 errores `any` |
| Lint backend | `flake8` / `ruff` | 0 warnings |
| Commits semánticos | Revisión manual en PR | 100% conformidad |
| Documentos versionados | Sin eliminación de info previa | Git diff limpio |
| Tiempo solver | Benchmark con 122 secciones | ≤ 30s |

> [!IMPORTANT]
> Todo el trabajo del Sprint 5 debe estar en el repositorio GitHub con evidencias verificables antes del **14 de Junio de 2026**. Cada integrante es responsable de abrir sus PRs, solicitar revisión al compañero asignado y cerrar sus ramas feature antes del cierre del sprint.

> [!TIP]
> Para la **exposición ante el docente**, el equipo debe destacar:
> 1. La transición metodológica PoC → MVP basada en análisis real de stakeholders (documento MAPE)
> 2. La justificación técnica del stack (CP-SAT vs GA, PostgreSQL vs MongoDB) con datos cuantitativos
> 3. La evidencia de trabajo colaborativo: commits por integrante, PRs revisados y aprobados
> 4. La concordancia exacta entre backlog Jira, commits en GitHub y documentación de inspección

---

*Documento generado por el equipo SGOHA — Taller de Proyecto 2 — Universidad Continental*
*Última actualización: 31 de Mayo de 2026*