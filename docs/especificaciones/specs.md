# Specs.md — Especificación Formal del Sistema SGOHA

> Especificación completa del sistema con entradas, salidas, reglas de negocio, casos límite, trazabilidad requisito→implementación→test y cobertura de pruebas documentada.

---

## 1. Alcance del Sistema (PoC)

El SGOHA es un prototipo funcional que automatiza la generación de horarios académicos universitarios usando CP-SAT. El alcance PoC incluye:

- **Gestión CRUD** de cursos, aulas, secciones y usuarios
- **Motor de optimización** CP-SAT para asignación de horarios
- **Autenticación JWT** por roles (admin, estudiante)
- **Dashboard visual** para visualización de horarios generados
- **Escala:** ≤ 122 secciones, ≤ 20 aulas, ≤ 15 docentes

---

## 2. Especificación de Entradas

### 2.1 Datos Maestros

| Entidad | Campos | Validaciones |
|:---|:---|:---|
| **Curso** | `codigo` (único), `nombre`, `creditos` (1–5), `tipo` ∈ {Teoría, Laboratorio}, `periodo` (1–10) | `creditos > 0`, `periodo ∈ [1,10]` |
| **Aula** | `nombre` (único), `capacidad` (> 0), `tipo` ∈ {Teoría, Laboratorio, Taller} | `capacidad > 0` |
| **Sección** | `codigo` (único), `curso_id` (FK), `docente_id` (FK), `capac_estimada` (> 0), `turno` ∈ {MAÑANA, TARDE, COMPLETO} | FKs válidas |
| **Usuario** | `username` (único), `email` (único), `role` ∈ {admin, docente, estudiante}, `turno_preferido`, `ciclo` (1–10, nullable) | `ciclo ∈ [1,10]` si es estudiante |

### 2.2 Parámetros del Motor

| Parámetro | Valor Default | Rango |
|:---|:---|:---|
| `max_time_in_seconds` | 120.0 | > 0 |
| `num_workers` | 8 | ≥ 1 |
| Penalización dispersión | 15 | Configurable |
| Penalización huecos | 50 | Configurable |
| Penalización sábado | 25 | Configurable |

---

## 3. Especificación de Salidas

### 3.1 Generación Exitosa
```json
[
  {
    "seccion_id": 1,
    "seccion_codigo": "IS1001-A",
    "aula_id": 5,
    "dia": 0,
    "dia_nombre": "Lunes",
    "slot": 2,
    "hora_inicio": "10:10",
    "hora_fin": "11:40",
    "horas_pedagogicas": [
      {"hp": 1, "inicio": "10:10", "fin": "10:50"},
      {"hp": 2, "inicio": "11:00", "fin": "11:40"}
    ],
    "nombre_curso": "Cálculo I",
    "nombre_aula": "Aula 301",
    "tipo_curso": "Teoría",
    "periodo": 1,
    "creditos": 4,
    "turno_seccion": "MAÑANA",
    "docente_nombre": "Dr. García",
    "codigo_curso": "MAT101"
  }
]
```

### 3.2 Generación Fallida
```json
{
  "error": "INFACTIBILIDAD: No se puede generar horario. Estado: INFEASIBLE. Secciones: 122, Aulas: 5. Revise aulas de laboratorio, turnos docente/sección y aforo."
}
```

---

## 4. Reglas de Negocio

| ID | Regla | Categoría | Implementación |
|:---|:---|:---|:---|
| RN-01 | Cada sección recibe exactamente `créditos` bloques | Dura | HC-1 en scheduler.py:L134 |
| RN-02 | Una sección usa siempre la misma aula | Dura | HC-2 en scheduler.py:L141 |
| RN-03 | Máximo 3 bloques de una sección por día | Dura | HC-3 en scheduler.py:L151 |
| RN-04 | Un aula solo aloja 1 sección por slot | Dura | HC-4 en scheduler.py:L159 |
| RN-05 | Un docente solo dicta 1 sección por slot | Dura | HC-5 en scheduler.py:L174 |
| RN-06 | Docente ≤ 30 bloques/semana | Dura | HC-6 en scheduler.py:L190 |
| RN-07 | Sin colisión por periodo+turno | Dura | HC-7 en scheduler.py:L202 |
| RN-08 | Aula compatible en tipo y capacidad | Dura | HC-8 pre-filtrado:L68 |
| RN-09 | Turno efectivo = min(turno_sec, turno_doc) | Dura | HC-9 pre-filtrado:L83 |
| RN-10 | Preferir slots tempranos dentro del turno | Blanda | SC-1:L239 |
| RN-11 | Evitar bloques sueltos | Blanda | SC-2:L255 |
| RN-12 | Evitar huecos entre bloques | Blanda | SC-3:L265 |
| RN-13 | Solo admin puede generar horarios | Seguridad | auth.py + API |
| RN-14 | Ciclo de estudiante debe ser 1–10 | Validación | schemas.py |

---

## 5. Casos Límite (Edge Cases)

| ID | Caso | Comportamiento Esperado | Test |
|:---|:---|:---|:---|
| EDGE-01 | 0 secciones registradas | Retorna error "No hay secciones o aulas" | `test_empty_data` |
| EDGE-02 | 0 aulas registradas | Retorna error "No hay secciones o aulas" | `test_empty_data` |
| EDGE-03 | Sección tipo Lab sin aula Lab | Retorna INFACTIBILIDAD pre-filtrado | `test_infeasible_no_compatible_room` |
| EDGE-04 | Sección con capac > todas las aulas | Retorna INFACTIBILIDAD pre-filtrado | `test_infeasible_capacity` |
| EDGE-05 | Docente MAÑANA con sección TARDE | Turno efectivo = MAÑANA (más restrictivo) | `test_turno_efectivo` |
| EDGE-06 | 50 secciones para 10 aulas misma hora | Posible INFACTIBILIDAD por saturación | `test_high_density` |
| EDGE-07 | Docente con > 30 bloques de carga | INFACTIBILIDAD por HC-6 | `test_max_teacher_load` |
| EDGE-08 | Curso de 1 crédito | Exactamente 1 bloque en 1 día | `test_single_credit` |
| EDGE-09 | Curso de 5 créditos | Distribuido en 3–4 días | `test_five_credits` |
| EDGE-10 | Todas las secciones turno MAÑANA | Solo usa 4 slots × 6 días = 24 slots/aula | `test_morning_only` |

---

## 6. Escenarios Controlados PoC

### Escenario PoC-1: Generación Base (Happy Path)
```gherkin
Feature: Generación de horarios factible
  Scenario: Conjunto de datos estándar
    Given 5 cursos de 3 créditos tipo Teoría
    And 5 docentes con turno COMPLETO
    And 5 aulas de Teoría con capacidad 40
    And 5 secciones (1 por curso, 30 alumnos, turno COMPLETO)
    When se ejecuta el motor CP-SAT
    Then el resultado es una lista de 15 asignaciones (5×3 bloques)
    And no hay colisiones de aula
    And no hay colisiones de docente
    And el tiempo de ejecución es ≤ 30 segundos
```

### Escenario PoC-2: Infactibilidad Controlada
```gherkin
Feature: Detección de infactibilidad
  Scenario: Sección sin aula compatible
    Given 1 curso tipo Laboratorio
    And 1 sección de ese curso con 30 alumnos
    And 0 aulas de tipo Laboratorio
    When se ejecuta el motor
    Then retorna error con "INFACTIBILIDAD"
```

### Escenario PoC-3: Respeto de Turno
```gherkin
Feature: Restricción de turno
  Scenario: Sección turno MAÑANA
    Given 1 sección con turno MAÑANA
    And docente con turno COMPLETO
    When se genera el horario
    Then todos los bloques están en slots {0,1,2,3}
    And ningún bloque está en slots {4,5,6,7,8}
```

### Escenario PoC-4: No-Colisión por Período
```gherkin
Feature: No-colisión por ciclo
  Scenario: Dos secciones del mismo ciclo y turno
    Given 2 secciones de cursos distintos, ambas periodo=5, turno=MAÑANA
    When se genera el horario
    Then las secciones NO comparten ningún (día, slot)
```

### Escenario PoC-5: Estrés con 100 Secciones
```gherkin
Feature: Rendimiento a escala
  Scenario: Benchmark de 100 secciones
    Given 30 cursos, 10 docentes, 30 aulas, 100 secciones
    When se ejecuta el motor CP-SAT
    Then el status es OPTIMAL o FEASIBLE
    And el tiempo de ejecución ≤ 30 segundos
```

---

## 7. Trazabilidad Completa

### 7.1 Requisito → Especificación → Implementación → Test

| Requisito | Spec | Implementación | Test |
|:---|:---|:---|:---|
| RF-01: Autenticación por roles | constitution.md §4.3 | `auth.py`, `schemas.py` | `test_auth.py` |
| RF-02: CRUD Aulas | specs.md §2.1 | `api/aulas.py` | `test_api.py` |
| RF-03: CRUD Cursos | specs.md §2.1 | `api/cursos.py` | `test_api.py` |
| RF-04: CRUD Secciones | specs.md §2.1 | `api/secciones.py` | `test_api.py` |
| RF-05: Generación de horarios | optimization_model.md | `scheduler.py` | `test_scheduler.py` |
| RN-01: Asignación completa | optimization_model.md §4 HC-1 | `scheduler.py:L134` | `test_complete_assignment` |
| RN-04: No-superposición aulas | optimization_model.md §4 HC-4 | `scheduler.py:L159` | `test_no_room_collision` |
| RN-05: No-superposición docentes | optimization_model.md §4 HC-5 | `scheduler.py:L174` | `test_no_teacher_collision` |
| RN-07: No-colisión periodo | optimization_model.md §4 HC-7 | `scheduler.py:L202` | `test_no_period_collision` |
| RNF-01: Rendimiento ≤ 2s GET | arc42_rnf.md §1 | Docker + FastAPI | `benchmark.py` |
| RNF-02: Escalabilidad Docker | arc42_rnf.md §2 | `docker-compose.yml` | Despliegue manual |
| RNF-03: Mantenibilidad tipado | arc42_rnf.md §3 | TypeScript + Pydantic | Lint CI |

### 7.2 Artefactos SDD y Coherencia

```
constitution.md  ──────►  optimization_model.md  ──────►  scheduler.py
 (Principios)              (Modelo formal)                (Implementación)
      │                          │                              │
      └─────────►  specs.md  ◄───┘──────────────────────────────┘
                  (Trazabilidad,                          
                   Escenarios,       ──────►  test_scheduler.py
                   Cobertura)                 test_optimization_model.py
```

---

## 8. Cobertura de Pruebas

### 8.1 Tests Existentes

| Archivo | Tests | Cobertura | Descripción |
|:---|:---:|:---|:---|
| `test_scheduler.py` | 8+ | `scheduler.py` (core) | Colisiones, horas pedagógicas, periodos, escenarios PoC |
| `test_optimization_model.py` | 6+ | `scheduler.py` (modelo) | Validación matemática de restricciones |
| `test_auth.py` | 3+ | `auth.py` | Autenticación y autorización |
| `test_api.py` | 2+ | `api/*.py` | Endpoints CRUD |

### 8.2 Ciclo TDD Documentado

```
RED   → Escribir test que falla (ej: test_no_room_collision)
GREEN → Implementar restricción HC-4 en scheduler.py
REFACTOR → Optimizar pre-filtrado de variables para reducir espacio de búsqueda
```

### 8.3 Ejecución de Cobertura
```bash
cd src/backend
pytest --cov=app --cov-report=term-missing --cov-report=html tests/
```

Meta de cobertura: **≥ 70%** del módulo `app.core.scheduler`.

---

## 9. Validación Experimental

| Experimento | Configuración | Resultado Esperado |
|:---|:---|:---|
| Benchmark estándar | 30 cursos, 10 docs, 30 aulas, 100 secs | Factible ≤ 30s |
| Benchmark escala real | 61 cursos, 15 docs, 20 aulas, 122 secs | Factible ≤ 30s |
| Benchmark mínimo | 1 curso, 1 doc, 1 aula, 1 sección | Factible ≤ 1s |
| Test infactibilidad | 0 aulas Lab para sección Lab | INFEASIBLE |
| Test turno cruzado | Docente MAÑANA + sección TARDE | Turno = MAÑANA |
