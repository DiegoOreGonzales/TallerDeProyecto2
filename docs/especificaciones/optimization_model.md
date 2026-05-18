# Modelo Formal de Optimización: Timetabling Universitario (SGOHA v2.0)

> **Documento técnico** que formaliza matemáticamente el modelo de programación con restricciones (CP-SAT) implementado en el motor de generación de horarios del SGOHA.

---

## 1. Definición del Problema

El problema de **University Course Timetabling (UCTP)** consiste en asignar un conjunto de secciones académicas a combinaciones válidas de **(aula, día, bloque horario)** satisfaciendo restricciones operativas y maximizando la calidad del horario.

- **Tipo:** Constraint Satisfaction/Optimization Problem (CSOP)
- **Complejidad:** NP-Hard
- **Solver:** Google OR-Tools CP-SAT v9.x

---

## 2. Conjuntos y Parámetros

### 2.1 Conjuntos

| Símbolo | Descripción | Dominio |
|:---:|:---|:---|
| **S** | Secciones académicas | tabla `secciones` |
| **A** | Aulas disponibles | tabla `aulas` |
| **D** | Días lectivos | {0..5} = {Lun..Sáb} |
| **H** | Bloques horarios (slots) | {0..8} (9 bloques de 90 min) |
| **P** | Docentes | `User` con `role='docente'` |
| **Π** | Períodos académicos | {1..10} |

### 2.2 Parámetros

| Símbolo | Descripción |
|:---:|:---|
| `créditos(s)` | Bloques requeridos por sección `s` |
| `tipo(s)`, `tipo(a)` | Tipo de curso / aula |
| `cap(a)` | Capacidad máxima del aula |
| `dem(s)` | Demanda estimada de alumnos |
| `turno(s)`, `turno_doc(s)` | Turno de sección / docente |
| `H_M = {0,1,2,3}` | Slots mañana |
| `H_T = {4,5,6,7,8}` | Slots tarde |

---

## 3. Variables de Decisión

### 3.1 Variable Principal

```
x[s, a, d, h] ∈ {0, 1}   ∀ s ∈ S, a ∈ A_s, d ∈ D, h ∈ H_s
```

**x = 1** si la sección `s` es asignada al aula `a` en día `d`, bloque `h`.

**Pre-filtrado:** Solo se crean variables para combinaciones factibles:
- `A_s ⊆ A`: aulas compatibles por tipo y capacidad
- `H_s ⊆ H`: slots compatibles con turno efectivo

### 3.2 Variables Auxiliares

| Variable | Descripción |
|:---|:---|
| `ua[s,a] ∈ {0,1}` | 1 si sección `s` usa aula `a` |
| `bd[s,d] ∈ [0, min(créditos(s), 3)]` | Bloques de `s` en día `d` |
| `single[s,d] ∈ {0,1}` | 1 si `s` tiene exactamente 1 bloque en día `d` |
| `gap[s,d,i] ∈ {0,1}` | 1 si hay hueco entre bloques |

---

## 4. Restricciones Duras (Hard Constraints)

> **Inviolables.** Si no se satisfacen → estado `INFEASIBLE`.

### HC-1: Asignación Completa
```
Σ x[s,a,d,h] = créditos(s)   ∀ s ∈ S
```
*Cada sección recibe exactamente N bloques.*

### HC-2: Aula Única por Sección
```
Σ ua[s,a] = 1                ∀ s ∈ S
x[s,a,d,h] ≤ ua[s,a]        ∀ s,a,d,h
```

### HC-3: Máximo 3 Bloques por Día
```
Σ_a Σ_h x[s,a,d,h] ≤ 3     ∀ s ∈ S, d ∈ D
```

### HC-4: No-Superposición de Aulas
```
Σ_s x[s,a,d,h] ≤ 1          ∀ a ∈ A, d ∈ D, h ∈ H
```

### HC-5: No-Superposición de Docentes
```
Σ_{s: docente(s)=p} Σ_a x[s,a,d,h] ≤ 1   ∀ p ∈ P, d ∈ D, h ∈ H
```

### HC-6: Carga Máxima Docente
```
Σ_{s: docente(s)=p} Σ_a Σ_d Σ_h x[s,a,d,h] ≤ 30   ∀ p ∈ P
```

### HC-7: No-Colisión por Período y Turno
```
Σ_{s: periodo(s)=π, turno(s)=t} Σ_a x[s,a,d,h] ≤ 1   ∀ π, t ∈ {M,T}, d, h
```

### HC-8: Compatibilidad Aula (Pre-filtrado)
```
A_s = {a ∈ A | compatible(tipo(s), tipo(a)) ∧ cap(a) ≥ dem(s)}
```

### HC-9: Restricción de Turno Efectivo (Pre-filtrado)
```
H_s = H_M  si turno(s)=M ∨ turno_doc(s)=M
H_s = H_T  si turno(s)=T ∨ turno_doc(s)=T
H_s = H    en otro caso
```

---

## 5. Función Objetivo (Soft Constraints)

```
Minimizar Z = Z1 + Z2 + Z3
```

### SC-1: Preferencia de Slot según Turno (Z1)
```
Z1 = Σ_s Σ_a Σ_d Σ_h x[s,a,d,h] · c(s,d,h)
```

| Turno | Costo c(s,d,h) |
|:---|:---|
| MAÑANA | `h × 3` |
| TARDE | `max(0, h-6) × 10` |
| COMPLETO | `max(0, h-7) × 8` |

**Sábado:** Si `d=5` → `c += 25`

### SC-2: Penalización por Dispersión (Z2)
```
Z2 = Σ_s Σ_d 15 · single[s,d]
```
*Incentiva agrupar bloques (evita 1 bloque suelto/día).*

### SC-3: Penalización por Huecos (Z3)
```
Z3 = Σ_s Σ_d Σ_i 50 · gap[s,d,i]
```
*Fuerte penalización por huecos internos → promueve contigüidad.*

---

## 6. KPIs Institucionales

| KPI | Descripción | Meta PoC | Medición |
|:---|:---|:---:|:---|
| **KPI-01** | Tasa de resolución factible | ≥ 95% | `status ∈ {OPTIMAL, FEASIBLE}` |
| **KPI-02** | Tiempo de generación | ≤ 30s | `solver.WallTime()` |
| **KPI-03** | Tiempo de consulta GET | ≤ 2s | Benchmark HTTP |
| **KPI-04** | Utilización de aulas | ≥ 60% | asignaciones / (|A|×|D|×|H|) |
| **KPI-05** | Satisfacción de turno | 100% | Restricción dura |
| **KPI-06** | Contigüidad de bloques | ≥ 90% | Validación post-gen |
| **KPI-07** | Cero colisiones | 0 | Restricción dura |
| **KPI-08** | Distribución equilibrada | Minimizada | Var(bloques_por_docente) |

---

## 7. Supuestos del PoC

| ID | Supuesto |
|:---|:---|
| SUP-01 | 1 bloque = 90 min (2 horas pedagógicas + receso) |
| SUP-02 | Cada sección tiene exactamente 1 docente |
| SUP-03 | Capacidad de aula fija y conocida |
| SUP-04 | Prerrequisitos no impactan asignación horaria |
| SUP-05 | 6 días lectivos (Lun–Sáb) |
| SUP-06 | Turno efectivo = intersección turno_sección ∩ turno_docente |
| SUP-07 | Datos de entrada validados por capa API |

## 8. Limitaciones del PoC

| ID | Limitación | Mitigación futura |
|:---|:---|:---|
| LIM-01 | No modela preferencias individuales de docente | Soft constraint adicional v3.0 |
| LIM-02 | Sin multi-campus | Extender A con `sede_id` |
| LIM-03 | Sin ventana de almuerzo obligatoria | Restricción dura franja 13:15–14:00 |
| LIM-04 | Escala probada ≤ 122 secciones | Benchmarking con escalas mayores |
| LIM-05 | Sin warm start de soluciones previas | Solution hints de OR-Tools |

---

## 9. Parámetros del Solver

```python
solver.parameters.max_time_in_seconds = 120.0
solver.parameters.num_workers = 8
solver.parameters.log_search_progress = True
```

## 10. Trazabilidad con Implementación

| Componente | Archivo | Líneas |
|:---|:---|:---|
| Variables `x[s,a,d,h]` | `scheduler.py` | L105–L111 |
| Auxiliar `uses_aula` | `scheduler.py` | L113–L117 |
| Auxiliar `bloques_dia_var` | `scheduler.py` | L119–L124 |
| HC-1 Asignación completa | `scheduler.py` | L134–L139 |
| HC-2 Aula única | `scheduler.py` | L141–L149 |
| HC-3 Máx 3 bloques/día | `scheduler.py` | L151–L157 |
| HC-4 No-superposición aulas | `scheduler.py` | L159–L172 |
| HC-5 No-superposición docentes | `scheduler.py` | L174–L188 |
| HC-6 Carga máxima | `scheduler.py` | L190–L200 |
| HC-7 No-colisión periodo | `scheduler.py` | L202–L226 |
| HC-8/HC-9 Pre-filtrado | `scheduler.py` | L68–L100 |
| SC-1 Preferencia slot | `scheduler.py` | L239–L253 |
| SC-2 Dispersión | `scheduler.py` | L255–L263 |
| SC-3 Huecos | `scheduler.py` | L265–L282 |
| Función objetivo | `scheduler.py` | L284 |
