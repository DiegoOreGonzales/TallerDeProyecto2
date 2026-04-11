# Constitution.md — SGOHA: Sistema de Generación Óptima de Horarios Académicos

> Este documento define los principios fundamentales, reglas globales e invariantes del sistema SGOHA. Actúa como el "contrato constitucional" que rige todo el comportamiento del motor de optimización y la plataforma.

---

## 1. Misión del Sistema

Automatizar la generación de horarios académicos universitarios mediante optimización matemática (CP-SAT), eliminando conflictos de asignación y maximizando la utilización de recursos institucionales, dentro del contexto de la Universidad Continental.

## 2. Visión Técnica

Un sistema PoC que demuestre la viabilidad de resolver el problema NP-Hard de timetabling universitario con herramientas de programación con restricciones, generando soluciones factibles en tiempo acotado (≤ 30s) para escalas reales (≥ 100 secciones).

---

## 3. Principios del Sistema (Inviolables)

### P-01: Integridad de Asignación
> Toda sección registrada DEBE recibir exactamente la cantidad de bloques horarios correspondiente a sus créditos. No existen secciones parcialmente asignadas.

### P-02: No-Colisión Universal
> El sistema NUNCA producirá un horario donde dos secciones compartan simultáneamente el mismo recurso (aula en día/slot, docente en día/slot, o período+turno en día/slot).

### P-03: Respeto de Turno
> El turno efectivo de una sección (intersección turno_sección ∩ turno_docente) es inviolable. Ningún bloque será asignado fuera de los slots permitidos por el turno efectivo.

### P-04: Transparencia de Infactibilidad
> Si el modelo no puede satisfacer todas las restricciones duras, el sistema DEBE reportar explícitamente el estado INFEASIBLE con información diagnóstica, en lugar de producir un horario parcial o inválido.

### P-05: Separación Datos-Algoritmo
> Los datos académicos (cursos, aulas, docentes, secciones) son gestionados por la capa CRUD/API. El motor de optimización opera sobre snapshots de datos y NUNCA modifica directamente las entidades maestras.

### P-06: Determinismo Reproducible
> Dada la misma entrada de datos y parámetros del solver, el sistema debe producir resultados consistentes y verificables.

### P-07: Prioridad de Restricciones Duras sobre Blandas
> Las restricciones duras (HC-1 a HC-9) tienen prioridad absoluta. Las restricciones blandas (SC-1 a SC-3) solo influyen en la calidad de la solución, nunca en su validez.

---

## 4. Reglas Globales del Sistema

### 4.1 Reglas de Dominio Académico

| ID | Regla | Tipo |
|:---|:---|:---|
| RG-01 | Un bloque horario = 90 minutos = 2 horas pedagógicas de 40 min + receso | Invariante |
| RG-02 | Existen 9 bloques/día × 6 días/semana = 54 slots totales | Invariante |
| RG-03 | El turno MAÑANA comprende slots {0,1,2,3} (07:00–13:15) | Invariante |
| RG-04 | El turno TARDE comprende slots {4,5,6,7,8} (14:00–21:50) | Invariante |
| RG-05 | La carga máxima docente es 30 bloques semanales | Límite |
| RG-06 | Una sección usa máximo 3 bloques en un mismo día | Límite |
| RG-07 | Una sección se dicta siempre en la misma aula durante toda la semana | Invariante |

### 4.2 Reglas de Compatibilidad

| ID | Regla |
|:---|:---|
| RC-01 | Sección tipo "Laboratorio" → solo aulas tipo "Laboratorio" |
| RC-02 | Sección tipo "Teoría" → aulas tipo "Teoría" o "Taller" |
| RC-03 | El aforo del aula debe ser ≥ demanda estimada de la sección |

### 4.3 Reglas de Seguridad

| ID | Regla |
|:---|:---|
| RS-01 | Solo usuarios con rol `admin` pueden ejecutar la generación de horarios |
| RS-02 | Solo usuarios con rol `admin` pueden gestionar (CRUD) cursos, aulas y secciones |
| RS-03 | Los estudiantes solo pueden visualizar horarios de su ciclo y turno |
| RS-04 | La autenticación se realiza mediante JWT con expiración configurable |

---

## 5. Restricciones Duras del Motor

> Referencia completa en [optimization_model.md](./optimization_model.md) §4.

| ID | Restricción | Consecuencia de violación |
|:---|:---|:---|
| HC-1 | Asignación completa de bloques | INFEASIBLE |
| HC-2 | Aula única por sección | INFEASIBLE |
| HC-3 | Máximo 3 bloques/día por sección | INFEASIBLE |
| HC-4 | No-superposición de aulas | INFEASIBLE |
| HC-5 | No-superposición de docentes | INFEASIBLE |
| HC-6 | Carga máxima docente ≤ 30 bloques | INFEASIBLE |
| HC-7 | No-colisión por período+turno | INFEASIBLE |
| HC-8 | Compatibilidad tipo aula | INFEASIBLE (pre-filtrado) |
| HC-9 | Restricción turno efectivo | INFEASIBLE (pre-filtrado) |

---

## 6. Restricciones Blandas (Optimización)

> Referencia completa en [optimization_model.md](./optimization_model.md) §5.

| ID | Restricción | Peso | Propósito |
|:---|:---|:---:|:---|
| SC-1 | Preferencia de slot por turno | 3–10 pts | Horarios tempranos preferidos |
| SC-2 | Evitar bloques sueltos (dispersión) | 15 pts | Sesiones agrupadas |
| SC-3 | Evitar huecos internos | 50 pts | Contigüidad de bloques |
| SC-4 | Penalización sábado | 25 pts | Minimizar uso de sábado |

---

## 7. Contratos de Comportamiento del Agente Optimizador

### Contrato de Entrada
```
PRE-CONDICIONES:
  - Existe al menos 1 sección registrada con curso, docente y turno asignados
  - Existe al menos 1 aula registrada con tipo y capacidad
  - Para cada sección existe al menos 1 aula compatible (tipo + capacidad)
  - Los datos de entrada han sido validados por la capa API (Pydantic schemas)
```

### Contrato de Salida
```
POST-CONDICIONES (Éxito):
  - Retorna lista de asignaciones: [{seccion_id, aula_id, dia, slot, ...}]
  - Todas las restricciones duras HC-1 a HC-9 están satisfechas
  - La función objetivo Z está minimizada (OPTIMAL) o acotada (FEASIBLE)
  - Incluye metadata: hora_inicio, hora_fin, horas_pedagogicas, docente, curso

POST-CONDICIONES (Fallo):
  - Retorna dict con clave "error" y mensaje diagnóstico
  - El mensaje incluye: status del solver, cantidad de secciones/aulas
  - No se persiste ningún horario en la base de datos
```

### Invariantes en Tiempo de Ejecución
```
INVARIANTES:
  - El solver NO modifica los datos maestros (solo lectura de DB)
  - El solver SIEMPRE termina (max_time_in_seconds = 120)
  - El resultado es idempotente para los mismos datos de entrada
```

---

## 8. Glosario de Términos

| Término | Definición |
|:---|:---|
| **Bloque** | Unidad temporal de 90 minutos (1 slot en la grilla) |
| **Hora Pedagógica (HP)** | 40 minutos de instrucción efectiva |
| **Sección** | Instancia de un curso con docente y grupo de estudiantes |
| **Slot** | Posición en la grilla temporal (día × bloque) |
| **Turno Efectivo** | Intersección entre turno de sección y turno de docente |
| **Factible** | Solución que satisface todas las restricciones duras |
| **Óptimo** | Solución factible que minimiza la función objetivo |
| **Infactible** | No existe asignación que satisfaga todas las restricciones duras |
