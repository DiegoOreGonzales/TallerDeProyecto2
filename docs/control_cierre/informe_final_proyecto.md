# Informe Final del Proyecto: SGOHA (Final Project Report)

Este documento consolida el desempeño final del **Sistema de Generación Óptima de Horarios Académicos (SGOHA)** a lo largo de su ciclo de vida (Marzo - Junio 2026). Compara la línea base planificada con los resultados reales obtenidos y detalla las métricas de alcance, cronograma, calidad y costo del ciclo de vida (LCC).

---

## 1. Resumen Ejecutivo

El sistema **SGOHA** se desarrolló con éxito para solventar la infactibilidad y colisiones de horarios en la Universidad Continental. El motor de optimización basado en **Google OR-Tools (CP-SAT)** cumple con las 9 restricciones duras (HC) y minimiza las penalizaciones de restricciones blandas en un tiempo promedio de ejecución de **30 segundos** por lote (satisfaciendo el RNF-01 de rendimiento). 

El proyecto se extendió a lo largo de **6 Sprints** planificados e iterativos y finalizó dentro del presupuesto de tiempo e inversión inicial. El código cumple con los estándares de seguridad OWASP, accesibilidad WCAG y calidad de SonarQube.

---

## 2. Desempeño del Proyecto (Plan vs. Ejecución)

### A. Desempeño del Alcance
*   **Planificado:** 3 Épicas compuestas por 11 Historias de Usuario (HU) funcionales y no funcionales detalladas en el Backlog inicial.
*   **Real:** **100% del alcance cubierto** (verificado en la [Revisión del SOW](revision_declaracion_trabajo.md) y en la [Revisión del Acta de Constitución](revision_acta_constitucion.md)). Se implementó el Dashboard administrativo de control, los CRUDs de aulas, cursos y secciones, el motor CP-SAT, las vistas específicas para estudiantes (con de-duplicación de turnos), y se agregaron las HU complementarias de calidad (HU-7.1 a HU-7.4) y cierre de proyecto (HU-8.1 a HU-8.4).
*   **Desviación:** +15% de alcance debido a la inyección de requerimientos regulatorios de calidad (cabeceras OWASP, ARIA WCAG y Green Software) requeridos por las inspecciones de software.

### B. Desempeño del Cronograma
*   **Planificado:** 5 Sprints de desarrollo de 2 semanas cada uno.
*   **Real:** **6 Sprints de desarrollo**.
*   **Desviación:** Se incorporó un Sprint 6 (14 días adicionales) de control y cierre administrativo para asegurar la transferencia final del producto y la compilación documental.

#### Tabla Histórica de Sprints de Desarrollo
El proyecto se estructuró de forma iterativa y secuencial según el siguiente detalle:

| Sprint | Periodo | SP Planificados | SP Completados | Hitos y Entregables Clave |
| :---: | :--- | :---: | :---: | :--- |
| **Sprint 0** | 09/03/2026 - 22/03/2026 | 13 | 13 | Setup inicial de arquitectura, base de datos PostgreSQL, dockerización básica, autenticación y lógica de roles inicial. Estudia matemática de OR-Tools. |
| **Sprint 1** | 23/03/2026 - 05/04/2026 | 15 | 13 | Desarrollo de los CRUDs de Cursos y Aulas. El CRUD de Secciones quedó parcialmente completado (carry-over de 2 SP para el Sprint 2). |
| **Sprint 2** | 13/04/2026 - 26/04/2026 | 18 | 15 | Construcción del motor de optimización CP-SAT base. Resolución del carry-over de Secciones. Cuello de botella en la curva de OR-Tools. |
| **Sprint 3** | 27/04/2026 - 10/05/2026 | 16 | 16 | Implementación de la vista del Dashboard, paneles dinámicos y filtros por rol (Administrador/Estudiante). |
| **Sprint 4** | 18/05/2026 - 31/05/2026 | 15 | 17 | Integración de restricciones blandas (soft constraints), pruebas unitarias en Pytest (backend) y Vitest (frontend). Se absorben 2 SP de accesibilidad WCAG. |
| **Sprint 5** | 01/06/2026 - 14/06/2026 | 12 | 15 | Benchmark del motor, documentación operativa, auditoría SonarQube, mitigación de vulnerabilidades y cierre de deuda técnica. |
| **Sprint 6 (Cierre)** | 15/06/2026 - 28/06/2026 | 0 (Buffer) | 0 | Auditorías de cierre (Acta, SOW, LCC), pruebas en staging local y transferencia de conocimiento. |

### C. Desempeño de la Calidad
*   **Planificado:** Cobertura de pruebas unitarias > 80%, 0 bugs críticos y pase del Quality Gate.
*   **Real:** Cobertura de pruebas del Backend del **81%** (84 tests unitarios en Pytest) y Frontend del **100%** (7 tests unitarios en Vitest). ESLint limpio de errores y Quality Gate de SonarQube aprobado (verificado en el [Registro de Defectos](registro_defectos.md) con estado final de 0 bugs).
*   **Desviación:** Sobresaliente. Se superaron los estándares iniciales mediante análisis estático continuo local contenerizado.

### D. Desempeño de los Costos y Ciclo de Vida (Life Cycle Cost - LCC)

El análisis financiero de SGOHA evalúa los costos desde la adquisición hasta la puesta en marcha y soporte proyectado a **3 años**:

*   **Costo de Desarrollo Inicial (Adquisición):** **$12,450 USD**
    *   *Desarrolladores (3) & Scrum Master (1) por 3 meses:* $12,000 USD.
    *   *Sprint 6 de cierre y control documental:* $450 USD.
*   **Costo de Operación (Cloud Hosting - Estimado a 36 meses):** **$4,320 USD**
    *   *Servidor PostgreSQL (AWS RDS db.t4g.micro):* $50 USD/mes.
    *   *Backend FastAPI + Frontend React (AWS ECS / App Runner):* $70 USD/mes.
    *   *Total Operación:* $120 USD/mes $\times$ 36 meses = $4,320 USD.
*   **Costo de Mantenimiento y Soporte (3 años):** **$1,500 USD**
    *   *Soporte anual (parches de seguridad y actualización de dependencias):* $500 USD/año.
*   **Costo de Retiro o Transición:** **$0 USD**
    *   La base de datos estándar de PostgreSQL y la modularidad de la API permiten una migración transparente a sistemas de planificación futuros de la universidad.
*   **Costo Total del Ciclo de Vida (LCC a 3 años):** **$18,270 USD**.

#### 💰 Justificación Financiera (CP-SAT Offline vs. SaaS Comercial):
La elección de integrar el solucionador CP-SAT de Google OR-Tools de forma local y offline dentro de la API FastAPI representa un ahorro significativo en comparación con el uso de APIs comerciales basadas en la nube (como solucionadores de optimización SaaS que cobran planes de suscripción mensual o cobro por número de ejecuciones):
*   Un servicio SaaS comercial promedio cobra alrededor de **$150 USD/mes** por 1,000 llamadas de optimización.
*   Para la Universidad Continental, con múltiples simulaciones horarias por carrera al inicio de cada ciclo, el costo de llamadas API podría escalar a **$1,800 USD anuales** ($5,400 USD en 3 años).
*   Al ejecutar CP-SAT en CPU local de forma contenerizada, el costo por llamada matemática es **$0**, reduciendo la infraestructura a un hosting básico de CPU en la nube.

---

## 3. Resumen de Riesgos e Incidentes Ocurridos

A lo largo del proyecto se gestionaron, mitigaron y cerraron los eventos detallados en los siguientes registros de control:
*   **Riesgo Tecnológico (Ocurrido):** Incompatibilidad y problemas de tipado TypeScript al inyectar switches de accesibilidad WCAG (verificado en el [Registro de Riesgos: RS-04 y RS-07](registro_riesgos.md)).
    *   *Mitigación:* Se forzó el tipado con interfaces estrictas de TypeScript y validación local de compilación con Vite (`npm run build`).
*   **Incidente Operativo (Solucionado):** Doble indexación y falsos positivos de cobertura en SonarQube (verificado en el [Registro de Incidentes: IS-01](registro_incidentes.md) y [Registro de Impedimentos: IM-01](registro_impedimentos.md)).
    *   *Acción Correctiva:* Se definieron exclusiones explícitas cruzadas en el archivo `sonar-project.properties`.

---

## 4. Conclusiones y Cierre

El proyecto cumple satisfactoriamente con la definición de éxito inicial. El producto es transferible, reproducible mediante Docker y cuenta con un nivel excelente de usabilidad percibida (83.75 puntos SUS). Se declara formalmente el **cierre técnico** del proyecto.
