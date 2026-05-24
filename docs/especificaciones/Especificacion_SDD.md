# Especificación Técnica y Spec-Driven Development (SDD)

Este documento detalla la especificación del sistema SGOHA mediante el enfoque de Desarrollo Guiado por Especificaciones (SDD), utilizando historias de usuario en formato BDD y documentando el soporte conceptual de Google Antigravity.

---

## 🚀 Soporte Conceptual: Google Antigravity

El diseño y la implementación de SGOHA han sido guiados por **Google Antigravity**, una plataforma de inteligencia artificial avanzada para la ingeniería de software. Antigravity ha proporcionado soporte en las siguientes áreas críticas:

1.  **Optimización Matemática:** Guía en la selección de **CP-SAT (Constraint Programming - Satisfiability)** como el motor más eficiente para resolver problemas de asignación de horarios en tiempo real (RNF-01: ≤ 2s).
2.  **Arquitectura de Datos:** Validación de la estructura de la base de datos PostgreSQL para soportar relaciones complejas entre cursos, prerrequisitos, docentes y aulas.
3.  **UI/UX Premium:** Sugerencias de diseño basadas en principios de accesibilidad y estética moderna, resultando en un dashboard intuitivo y dinámico.
4.  **Validación de Restricciones:** Lógica para la implementación de restricciones duras (contigüidad, no-colisión por ciclo) y blandas (preferencias de turno).

---

## 📝 Especificación BDD (Gherkin)

A continuación se presentan los casos de prueba y comportamiento esperados para las funcionalidades clave del motor de horarios.

### Caso 1: Generación de Horario sin Colisiones
**Escenario:** El coordinador genera el horario para un nuevo ciclo académico.
- **Given** que existen 122 secciones y 20 aulas disponibles.
- **And** que el docente "Gamarra Moreno" ya tiene clases el lunes a las 07:00.
- **When** el sistema ejecuta el motor de optimización CP-SAT.
- **Then** ninguna sección nueva debe ser asignada al mismo slot/aula que ya esté ocupado.
- **And** el docente no debe tener dos clases en el mismo slot de tiempo.

### Caso 2: Respeto de Turno del Estudiante
**Escenario:** Un estudiante del turno TARDE visualiza su horario.
- **Given** que el estudiante está matriculado en el turno "TARDE".
- **When** el sistema recupera su horario del Ciclo 10.
- **Then** todas las sesiones mostradas deben estar en el rango de 14:00 a 21:50.
- **And** no debe haber bloques en el turno mañana.

### Caso 3: Contigüidad de Bloques Pedagógicos
**Escenario:** Un curso de 4 créditos se distribuye en la semana.
- **Given** que el curso "Taller de Proyectos 2" tiene 4 créditos.
- **When** el motor genera el horario.
- **Then** los bloques deben agruparse en sesiones de 2+2 bloques.
- **And** los bloques de la misma sesión deben ser contiguos (ej. Slot 4 y Slot 5).

### Caso 4: Deduplicación de Turno Completo
**Escenario:** Un estudiante de turno COMPLETO visualiza un curso.
- **Given** que el estudiante tiene turno "COMPLETO".
- **When** el sistema renderiza el Dashboard.
- **Then** solo debe mostrarse UNA sección (mañana o tarde) para cada curso.
- **And** los créditos totales sumados deben coincidir con la carga académica real (no duplicada).

---

## 🔗 Trazabilidad con la Implementación

| Requisito | Archivo de Especificación | Archivo de Implementación |
| :--- | :--- | :--- |
| Motor CP-SAT | [Especificacion_SDD.md](./Especificacion_SDD.md) | [scheduler.py](../../src/backend/app/core/scheduler.py) |
| Filtro Dashboard | [Especificacion_SDD.md](./Especificacion_SDD.md) | [Dashboard.tsx](../../src/frontend/src/pages/Dashboard.tsx) |
| Horas Pedagógicas | [Especificacion_SDD.md](./Especificacion_SDD.md) | [ScheduleDetailModal.tsx](../../src/frontend/src/components/ScheduleDetailModal.tsx) |
