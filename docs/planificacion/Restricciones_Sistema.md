# Restricciones del Sistema de Generación de Horarios (SGOHA v2.0)

El núcleo del sistema SGOHA es su motor de optimización basado en **Google OR-Tools (CP-SAT)**. Este motor procesa un conjunto de restricciones lógicas para encontrar una asignación de horarios matemática y operativamente válida.

Las restricciones se dividen en dos categorías: **Duras** (deben cumplirse obligatoriamente o el problema es infactible) y **Blandas** (se usan para guiar la optimización hacia soluciones más convenientes).

---

## 1. Restricciones Duras (Hard Constraints)
Si alguna de estas restricciones no puede cumplirse con los datos actuales (ej. no hay suficientes aulas), el sistema devolverá un error de "Infactibilidad" en lugar de generar un horario erróneo.

### A. Restricciones de Carga Académica y Estructura
*   **A.1. Asignación Completa:** Cada sección de un curso debe tener asignados exactamente $N$ bloques de 90 minutos, donde $N$ equivale a la cantidad de **créditos** del curso.
*   **A.2. Aula Única por Sección:** Una sección debe impartirse siempre en la **misma aula** para todos sus bloques semanales, evitando que los estudiantes tengan que migrar de aula para el mismo curso.
*   **A.3. Límite de Fragmentación Diaria:** Una sección puede tener como máximo **3 bloques (4.5 horas)** asignados en un mismo día.
*   **A.4. Contigüidad de Bloques:** Si una sección tiene múltiples bloques asignados en un mismo día, estos deben ocupar **slots consecutivos** (sin huecos). Por ejemplo, si un curso ocupa los slots 4 y 6, obligatoriamente debe ocupar también el slot 5.

### B. Restricciones de Recursos (Espacio y Docentes)
*   **B.1. No-Superposición de Aulas:** Un aula específica en un día y bloque horario (slot) solo puede ser ocupada por **máximo una sección**.
*   **B.2. No-Superposición de Docentes:** Un docente no puede ser asignado a impartir más de una sección en el mismo día y bloque horario exacto.
*   **B.3. Compatibilidad de Tipo de Aula (DOM-06):** Una sección de tipo "Laboratorio" solo puede ser asignada a un aula de tipo "Laboratorio". Las secciones de "Teoría" pueden asignarse a aulas de "Teoría" o "Taller".
*   **B.4. Capacidad de Aforo (DOM-03):** La capacidad máxima del aula asignada debe ser mayor o igual a la capacidad estimada de alumnos de la sección.
*   **B.5. Carga Máxima Docente:** Ningún docente puede superar **24 bloques semanales** (~36 horas de docencia).

### C. Restricciones de Turno (Preferencias Temporales)
El sistema divide el día en dos grandes turnos: **MAÑANA** (Slots 0 al 3: 07:00 a 13:15) y **TARDE** (Slots 4 al 8: 14:00 a 21:50).

*   **C.1. Turno de Sección (Estudiantes):** Si una sección está matriculada bajo el turno `MAÑANA`, todos sus bloques deben ser asignados exclusivamente en los slots 0 al 3. Si está en turno `TARDE`, solo en los slots 4 al 8. Si es `COMPLETO`, puede usar cualquier slot.
*   **C.2. Disponibilidad del Docente:** Si el perfil del docente asignado a la sección tiene configurado su `turno_preferido` como `MAÑANA`, el motor tiene estrictamente prohibido asignarle clases en el turno Tarde, y viceversa.
*   **C.3. Turno Efectivo:** El turno efectivo de una sección es la **intersección** entre el turno de la sección y el turno del docente. Si cualquiera de los dos dice `MAÑANA`, el turno efectivo es `MAÑANA`.

### D. Restricciones de Distribución Semanal
*   **D.1. Límite de Días Activos:** Cada sección tiene un límite máximo de días activos según sus créditos:

| Créditos | Máx. Días Activos | Distribución Típica |
|----------|-------------------|---------------------|
| 1        | 1                 | 1 bloque en 1 día   |
| 2        | 2                 | 1+1 en 2 días       |
| 3        | 3                 | 2+1 en 2-3 días     |
| 4        | 3                 | 2+2 en 2 días       |
| 5        | 4                 | 2+2+1 en 3 días     |

---

## 2. Restricciones Blandas (Soft Constraints / Función Objetivo)
Estas reglas no invalidan el horario si se rompen, pero el motor CP-SAT intentará minimizarlas para encontrar el horario "más óptimo".

*   **E.1. Priorización por Turno:** La función objetivo es **relativa al turno** de cada sección:
    - **MAÑANA:** Penaliza slots más tardíos → prefiere 07:00 sobre 11:45.
    - **TARDE:** Penaliza slots nocturnos (≥ slot 7) → prefiere 14:00–18:40 sobre 20:20.
    - **COMPLETO:** Solo penaliza slot 8 (20:20+).
*   **E.2. Penalización de Fines de Semana:** Se aplica un costo extra alto (30 puntos) a cualquier asignación que caiga el día Sábado (Día 5).
*   **E.3. Compactación de Días:** Cada día activo de una sección tiene un costo de 3 puntos, incentivando al solver a concentrar bloques en menos días.

---

## 3. Modelo de Horas Pedagógicas

La hora pedagógica en la Universidad Continental es de **40 minutos** con **10 minutos de receso** entre cada hora. Un bloque de 90 minutos equivale a **2 horas pedagógicas**.

| Slot | Bloque | HP 1 | Receso | HP 2 | Grupo |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 0 | 07:00 – 08:30 | 07:00 – 07:40 | 07:40 – 07:50 | 07:50 – 08:30 | MAÑANA |
| 1 | 08:35 – 10:05 | 08:35 – 09:15 | 09:15 – 09:25 | 09:25 – 10:05 | MAÑANA |
| 2 | 10:10 – 11:40 | 10:10 – 10:50 | 10:50 – 11:00 | 11:00 – 11:40 | MAÑANA |
| 3 | 11:45 – 13:15 | 11:45 – 12:25 | 12:25 – 12:35 | 12:35 – 13:15 | MAÑANA |
| 4 | 14:00 – 15:30 | 14:00 – 14:40 | 14:40 – 14:50 | 14:50 – 15:30 | TARDE |
| 5 | 15:35 – 17:05 | 15:35 – 16:15 | 16:15 – 16:25 | 16:25 – 17:05 | TARDE |
| 6 | 17:10 – 18:40 | 17:10 – 17:50 | 17:50 – 18:00 | 18:00 – 18:40 | TARDE |
| 7 | 18:45 – 20:15 | 18:45 – 19:25 | 19:25 – 19:35 | 19:35 – 20:15 | TARDE |
| 8 | 20:20 – 21:50 | 20:20 – 21:00 | 21:00 – 21:10 | 21:10 – 21:50 | TARDE |

_Si la sección requiere turno MAÑANA, matemáticamente se fuerza: `X[..., ..., ..., slot_tarde] = 0`._

---

## 4. Optimizaciones de Rendimiento

*   **Pre-filtrado de Variables:** El motor solo crea variables para combinaciones `(sección, aula, slot)` que son compatibles según tipo, capacidad y turno. Esto reduce drásticamente el espacio de búsqueda.
*   **Paralelismo:** El solver usa hasta 4 workers en paralelo.
*   **Tiempo Máximo:** 30 segundos de resolución para encontrar la mejor solución.
*   **RNF-01:** El sistema responde en ≤ 2 segundos para consultas GET; la generación puede tomar hasta 30s.
