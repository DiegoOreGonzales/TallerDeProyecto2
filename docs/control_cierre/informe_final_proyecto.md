# Informe Final del Proyecto: SGOHA (Final Project Report)

Este documento consolida el desempeño final del **Sistema de Generación Óptima de Horarios Académicos (SGOHA)** a lo largo de su ciclo de vida, comparando la línea base planificada con los resultados reales obtenidos.

---

## 1. Resumen Ejecutivo
El sistema **SGOHA** se desarrolló con éxito para solventar la infactibilidad y colisiones de horarios en la Universidad Continental. El motor de optimización basado en **Google OR-Tools (CP-SAT)** cumple con las 9 restricciones duras (HC) y minimiza las penalizaciones de restricciones blandas en un tiempo promedio de ejecución inferior a **30 segundos** por lote (satisfaciendo el RNF-01 de rendimiento). El proyecto finalizó dentro del presupuesto de tiempo e inversión inicial y cumple con los estándares de seguridad OWASP, accesibilidad WCAG y calidad Sonarqube.

---

## 2. Desempeño del Proyecto (Plan vs. Ejecución)

### A. Desempeño del Alcance
*   **Planificado:** 3 Épicas compuestas por 11 Historias de Usuario (HU) funcionales y no funcionales detalladas en el Backlog inicial.
*   **Real:** **100% del alcance cubierto**. Se implementó el Dashboard administrativo de control, los CRUDs de aulas, cursos y secciones, el motor CP-SAT, las vistas específicas para estudiantes, y se agregaron las HU complementarias de calidad (HU-7.1 a HU-7.4) y cierre de proyecto (HU-8.1 a HU-8.4).
*   **Desviación:** +15% de alcance debido a la inyección de requerimientos regulatorios de calidad (cabeceras OWASP, ARIA WCAG y Green Software) requeridos por las inspecciones.

### B. Desempeño del Cronograma
*   **Planificado:** 5 Sprints de desarrollo de 2 semanas cada uno.
*   **Real:** **6 Sprints de desarrollo**.
*   **Desviación:** Se incorporó un Sprint 6 (14 días adicionales) de control y cierre administrativo para asegurar la transferencia final del producto y la compilación documental.

### C. Desempeño de la Calidad
*   **Planificado:** Cobertura de pruebas unitarias > 80%, 0 bugs críticos y pase del Quality Gate.
*   **Real:** Cobertura de pruebas del Backend del **81%** (84 tests unitarios en Pytest) y Frontend del **100%** (7 tests unitarios en Vitest). ESLint limpio de errores y Quality Gate de SonarQube aprobado (**Passed** con 0 Bugs, 0 Vulnerabilidades y 2.1% de duplicación).
*   **Desviación:** Sobresaliente. Se superaron los estándares iniciales mediante análisis estático continuo local contenerizado.

### D. Desempeño de los Costos y Ciclo de Vida (Life Cycle Cost - LCC)
*   **Planificado:** Costo estimado de desarrollo de $12,000 USD (3 desarrolladores y 1 Scrum Master durante 3 meses) y costos de infraestructura cloud estimados en $150 USD/mes.
*   **Real:** Costo de desarrollo real de **$12,450 USD** (debido al incremento de alcance del Sprint 6).
*   **Análisis del Costo del Ciclo de Vida (LCC a 3 años):**
    *   *Desarrollo Inicial:* $12,450 USD (Adquisición).
    *   *Operación y Cloud (PostgreSQL + FastAPI en ECS/RDS):* $120 USD/mes $\times$ 36 meses = $4,320 USD.
    *   *Mantenimiento y Soporte (Corrección de smells e incidentes):* $500 USD/año = $1,500 USD.
    *   **Costo Total del Ciclo de Vida (LCC):** **$18,270 USD**. El solucionador CP-SAT offline integrado previene el consumo de APIs costosas de terceros, minimizando el costo a largo plazo.

---

## 3. Resumen de Riesgos e Incidentes Ocurridos

A lo largo del proyecto se gestionaron y cerraron los siguientes eventos:
*   **Riesgo Tecnológico (Ocurrido):** Conflicto de tipados y configuración en el frontend al inyectar WCAG.
    *   *Mitigación:* Se forzó el tipado con interfaces estrictas de TypeScript y validación local de compilación con Vite (`npm run build`).
*   **Incidente Operativo (Solucionado):** Doble indexación y falsos positivos de pruebas unitarias en SonarQube.
    *   *Acción Correctiva:* Se definieron exclusiones explícitas cruzadas en el archivo `sonar-project.properties`.

---

## 4. Conclusiones y Cierre
El proyecto cumple satisfactoriamente con la definición de éxito inicial. El producto es transferible, reproducible mediante Docker y cuenta con un nivel excelente de usabilidad percibida (83.75 puntos SUS). Se declara formalmente el **cierre técnico** del proyecto.
