# Restricciones del Sistema de Generación de Horarios (SGOHA)

El núcleo del sistema SGOHA es su motor de optimización basado en **Google OR-Tools (CP-SAT)**. Este motor procesa un conjunto de restricciones lógicas para encontrar una asignación de horarios matemática y operativamente válida.

Las restricciones se dividen en dos categorías: **Duras** (deben cumplirse obligatoriamente o el problema es infactible) y **Blandas** (se usan para guiar la optimización hacia soluciones más convenientes).

---

## 1. Restricciones Duras (Hard Constraints)
Si alguna de estas restricciones no puede cumplirse con los datos actuales (ej. no hay suficientes aulas), el sistema devolverá un error de "Infactibilidad" en lugar de generar un horario erróneo.

### A. Restricciones de Carga Académica y Estructura
*   **A.1. Asignación Completa:** Cada sección de un curso debe tener asignados exactamente $N$ bloques de 1.5 horas, donde $N$ equivale a la cantidad de **créditos** del curso.
*   **A.2. Aula Única por Sección:** Una sección debe impartirse siempre en la **misma aula** para todos sus bloques semanales, evitando que los estudiantes tengan que migrar de aula para el mismo curso.
*   **A.3. Límite de Fragmentación Diaria:** Una sección puede tener como máximo **3 bloques (4.5 horas)** asignados en un mismo día.

### B. Restricciones de Recursos (Espacio y Docentes)
*   **B.1. No-Superposición de Aulas:** Un aula específica en un día y bloque horario (slot) solo puede ser ocupada por **máximo una sección**.
*   **B.2. No-Superposición de Docentes:** Un docente no puede ser asignado a impartir más de una sección en el mismo día y bloque horario exacto.
*   **B.3. Compatibilidad de Tipo de Aula (DOM-06):** Una sección de tipo "Laboratorio" solo puede ser asignada a un aula de tipo "Laboratorio". Las secciones de "Teoría" pueden asignarse a aulas de "Teoría" o "Taller".
*   **B.4. Capacidad de Aforo (DOM-03):** La capacidad máxima del aula asignada debe ser mayor o igual a la capacidad estimada de alumnos de la sección.

### C. Restricciones de Turno (Preferencias Temporales)
El sistema divide el día en dos grandes turnos: **MAÑANA** (Slots 0 al 3: 07:00 a 13:15) y **TARDE** (Slots 4 al 8: 14:00 a 21:50).

*   **C.1. Turno de Sección (Estudiantes):** Si una sección está matriculada bajo el turno `MAÑANA`, todos sus bloques deben ser asignados exclusivamente en los slots 0 al 3. Si está en turno `TARDE`, solo en los slots 4 al 8. Si es `COMPLETO`, puede usar cualquier slot.
*   **C.2. Disponibilidad del Docente:** Si el perfil del docente asignado a la sección tiene configurado su `turno_preferido` como `MAÑANA`, el motor tiene estrictamente prohibido asignarle clases en el turno Tarde, y viceversa.

---

## 2. Restricciones Blandas (Soft Constraints / Función Objetivo)
Estas reglas no invalidan el horario si se rompen, pero el motor CP-SAT intentará minimizarlas para encontrar el horario "más óptimo".

*   **D.1. Priorización de Horarios Tempranos:** Dentro del turno permitido de cada sección, se aplica un costo o penalidad que se incrementa con el índice del slot. Es decir, el motor preferirá asignar la clase a las 07:00 que a las 11:45.
*   **D.2. Penalización de Fines de Semana:** Se aplica un costo extra alto (20 puntos) a cualquier asignación que caiga el día Sábado (Día 5), forzando al motor a concentrar las clases de Lunes a Viernes a menos que sea estrictamente necesario usar el sábado por falta de espacio.

---

## 3. Modelo Matemático del Turno

Para la implementación CP-SAT, las variables de decisión booleanas son:
`X[seccion, aula, dia, slot] ∈ {0, 1}`

La matriz de Slots (9 bloques de 1.5 horas) es la siguiente:

| Índice Slot | Grupo | Rango Horario |
| :---: | :--- | :--- |
| 0 | MAÑANA | 07:00 - 08:30 |
| 1 | MAÑANA | 08:35 - 10:05 |
| 2 | MAÑANA | 10:10 - 11:40 |
| 3 | MAÑANA | 11:45 - 13:15 |
| 4 | TARDE | 14:00 - 15:30 |
| 5 | TARDE | 15:35 - 17:05 |
| 6 | TARDE | 17:10 - 18:40 |
| 7 | TARDE | 18:45 - 20:15 |
| 8 | TARDE | 20:20 - 21:50 |

_Si la sección requiere turno MAÑANA, matemáticamente se fuerza: `X[..., ..., ..., slot_tarde] = 0`._
