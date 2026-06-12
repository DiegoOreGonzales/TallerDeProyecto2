# Plan de Auditoría de Calidad — SGOHA

> **Proyecto:** Sistema de Generación Óptima de Horarios Académicos (SGOHA)  
> **Rol de Ejecución:** Diego Isaac Oré Gonzales (Scrum Master & UX Analyst)  
> **Fecha:** 12 de Junio de 2026  
> **Universidad Continental · Taller de Proyecto 2**

---

## 🎯 1. Objetivos de la Auditoría

El presente **Plan de Auditoría de Calidad** tiene como finalidad evaluar de forma objetiva e independiente el grado de conformidad del software SGOHA con respecto a las especificaciones técnicas del proyecto, los requerimientos no funcionales (RNF) definidos y las mejores prácticas en ingeniería de software.

**Objetivos específicos:**
1.  Verificar el cumplimiento de los estándares de usabilidad (medición SUS), accesibilidad (WCAG 2.1 AA) y seguridad (OWASP Top 10).
2.  Evaluar la correctitud, consistencia y rendimiento del algoritmo de optimización matemática CP-SAT de Google OR-Tools.
3.  Asegurar que la cobertura de pruebas automatizadas y el pipeline de CI/CD operen según los estándares requeridos.
4.  Identificar oportunidades de mejora y riesgos de calidad en el ciclo de vida del desarrollo.

---

## 🔎 2. Alcance de la Auditoría

La auditoría abarcará los siguientes componentes y procesos de la rama de trabajo `develop`:
*   **Código de Backend (FastAPI / Python):** Estructura del código, patrones de diseño, correctitud del motor del solver, modularidad y cobertura de pruebas unitarias/integración.
*   **Código de Frontend (React / TypeScript):** Componentes visuales, manejo de estado, consistencia de diseño y accesibilidad WCAG.
*   **Seguridad y Vulnerabilidades:** Análisis de la autenticación por tokens JWT, vulnerabilidades de inyección SQL, configuraciones CORS y resguardo de variables de entorno.
*   **Rendimiento y Eficiencia de Recursos:** Tiempos de ejecución del solver y tiempos de respuesta de la API REST bajo cargas concurrentes simuladas.

---

## 📏 3. Criterios de Calidad y Estándares de Referencia

La evaluación del producto de software se guiará bajo los siguientes marcos y estándares de la industria:
1.  **ISO/IEC 25010 (System and Software Quality Requirements and Evaluation):**
    *   *Adecuación Funcional:* Cumplimiento de las restricciones del solver.
    *   *Eficiencia de Desempeño:* Tiempos de respuesta y carga del CPU.
    *   *Usabilidad:* Facilidad de aprendizaje, estética de la UI y accesibilidad.
    *   *Fiabilidad:* Estabilidad y robustez frente a entradas infactibles del solver.
    *   *Mantenibilidad:* Coherencia de tipos, modularidad y legibilidad del código.
2.  **System Usability Scale (SUS):** Meta del puntaje promedio de usabilidad $\ge 80.0$ (Grado A - Excelente).
3.  **WCAG 2.1 AA (Web Content Accessibility Guidelines):** Evaluación de contraste de color, navegación por teclado y legibilidad por lectores de pantalla.
4.  **OWASP Top 10:** Aseguramiento contra vulnerabilidades comunes de seguridad web.

---

## 🕒 4. Cronograma de Actividades de la Auditoría

La auditoría se ejecutará en 4 fases secuenciales:

| Fase | Actividad | Entregable / Evidencia | Responsable |
|:---|:---|:---|:---|
| **Fase 1: Planificación** | Definición del alcance, criterios y elaboración del checklist de control de calidad. | Documento del Plan de Auditoría. | Scrum Master / UX Analyst |
| **Fase 2: Ejecución** | Revisión del repositorio, ejecución local de benchmarks de rendimiento, tests unitarios y pruebas WCAG/Lighthouse. | Archivos de logs de ejecución y reportes de cobertura. | Equipo de Desarrollo / Auditor |
| **Fase 3: Análisis** | Tabulación de puntajes de la encuesta SUS y evaluación del cumplimiento de la matriz OWASP Top 10. | Reporte de Calidad, Seguridad y Usabilidad. | Scrum Master / UX Analyst |
| **Fase 4: Cierre** | Presentación de hallazgos, sugerencias de remediación y formulación de historias de refactorización técnica en el backlog. | Acta de conformidad y lista de mejoras priorizadas. | Todo el equipo |

---

## 📋 5. Checklists de Verificación de Calidad

Los siguientes checklists sirven de instrumento objetivo de verificación para el equipo de calidad:

### 5.1. Checklist de Revisión de Código y Mantenibilidad
*   [ ] ¿El código cuenta con tipado estricto (Pydantic en backend y TypeScript strict en frontend)?
*   [ ] ¿Las llaves API y credenciales de base de datos se configuran de manera segura fuera del código (`.env`)?
*   [ ] ¿El pipeline de CI/CD ejecuta la suite completa de pruebas unitarias (`pytest`) en cada commit de integración?
*   [ ] ¿La cobertura de pruebas cumple o supera el umbral establecido para lógica crítica?

### 5.2. Checklist de Rendimiento del Algoritmo (Solver)
*   [ ] ¿El solver retorna una respuesta satisfactoria (OPTIMAL o FEASIBLE) en un entorno con 100+ secciones académicas?
*   [ ] ¿El tiempo de ejecución del backend es inferior a 2 segundos en condiciones normales de hardware?
*   [ ] ¿Se maneja elegantemente el caso de infactibilidad del solver (conflictos de horario irresolubles), informando al usuario?

### 5.3. Checklist de Seguridad (OWASP) y Usabilidad
*   [ ] ¿Todos los endpoints sensibles validan la firma y expiración del JWT en la cabecera HTTP?
*   [ ] ¿Las consultas de base de datos están parameterizadas a través del ORM, previniendo inyección SQL?
*   [ ] ¿El puntaje SUS supera el promedio de usabilidad excelente (SUS $\ge 80$)?
*   [ ] ¿Todos los elementos interactivos cuentan con foco visible y soporte de navegación por teclado?
