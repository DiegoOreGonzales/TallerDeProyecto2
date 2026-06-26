# Revisión del Acta de Constitución (Project Charter Review)
**Sistema de Generación Óptima de Horarios Académicos (SGOHA)**

---

## 1. Introducción

El **Project Charter (Acta de Constitución del Proyecto)** original, firmado en marzo de 2026, estableció el alcance, objetivos, presupuesto, riesgos y criterios de éxito preliminares para el desarrollo de **SGOHA**. En esta fase de cierre, revisamos de manera crítica el cumplimiento de dicho documento fundacional para evaluar la efectividad de la gestión realizada y formalizar el cierre administrativo.

---

## 2. Comparación de Objetivos Fundacionales vs. Resultados Reales

| Objetivo Original del Charter | Resultado al Cierre del Proyecto | Grado de Cumplimiento |
| :--- | :--- | :--- |
| **Objetivo General:** Desarrollar e implementar un sistema web integral que automatice la generación de horarios sin conflictos, reduciendo el tiempo de semanas a segundos. | Se entregó el sistema SGOHA completamente funcional. La generación de horarios se ejecuta de forma exacta y automatizada. | **100% - Exitoso** |
| **OE-01:** Diseñar e implementar la arquitectura cliente-servidor desacoplada con contenedores Docker. | Arquitectura finalizada y validada con `docker-compose.yml` orquestando Frontend (React), Backend (FastAPI) y PostgreSQL. | **100% - Exitoso** |
| **OE-02:** Desarrollar una API RESTful con FastAPI que integre el motor CP-SAT y exponga endpoints para gestión de recursos. | API desarrollada, con documentación interactiva Swagger activa y endpoints CRUD optimizados para rendimiento. | **100% - Exitoso** |
| **OE-03:** Construir una interfaz SPA con React 18 que provea dashboards diferenciados por rol (Administrador/Estudiante). | Interfaz de usuario responsiva implementada, con control de acceso basado en roles y panel administrativo intuitivo. | **100% - Exitoso** |
| **OE-04:** Integrar el solucionador CP-SAT con las restricciones de no-superposición y capacidad física. | Motor CP-SAT completamente integrado en el backend, resolviendo óptimamente y sin colisiones de recursos. | **100% - Exitoso** |
| **OE-05:** Validar que el sistema entregue horarios factibles en un máximo de 2 segundos para datasets estándar. | Pruebas de rendimiento demuestran que el tiempo de respuesta del solucionador oscila entre 0.4 y 1.8 segundos. | **100% - Exitoso** |

---

## 3. Evaluación de Criterios de Éxito del Charter

*   **Criterio 1: Generación libre de conflictos al 100%:** **LOGRADO.** El modelo matemático de Google OR-Tools CP-SAT garantiza mediante programación por restricciones la factibilidad matemática absoluta de las soluciones generadas.
*   **Criterio 2: Tiempo de respuesta $\le$ 2 segundos:** **LOGRADO.** A través de una optimización en el modelamiento de variables y restricciones del solucionador, el tiempo de procesamiento para datasets de hasta 100 secciones es de menos de 2 segundos.
*   **Criterio 3: Despliegue simple con Docker:** **LOGRADO.** Cualquier desarrollador o administrador de TI de la universidad puede levantar el stack completo ejecutando `docker compose up --build` sin necesidad de dependencias o pre-configuraciones del sistema operativo.

---

## 4. Revisión y Desviación Presupuestaria

El Project Charter estimó un costo recurrente operativo de producción de **S/. 165.00 mensuales** (servidor VPS y contingencia).

### Análisis de Desviaciones:
* **Fase de Desarrollo:** Se mantuvo dentro de los recursos de hardware provistos por los integrantes del equipo de desarrollo, resultando en un costo de adquisición de desarrollo directo cubierto en la estimación de ciclo de vida.
* **Costo de Operación Real (AWS Cloud):** Se consolidó en un equivalente a **$120.00 USD mensuales** para producción en la nube AWS, lo cual proporciona redundancia, backups automáticos y alta disponibilidad de grado corporativo.
* **Cálculo de Sostenibilidad a Largo Plazo (LCC):** Como se detalla en el *Informe Final del Proyecto*, el Costo del Ciclo de Vida a 3 años asciende a **$18,270 USD** (incluyendo desarrollo, nube y soporte técnico). La portabilidad que otorga Docker permite la opción de migrar el sistema a servidores físicos propios de la Universidad Continental (on-premise) en el futuro, lo cual reduciría los costos recurrentes de AWS a cero.

---

## 5. Gestión de Riesgos Declarados vs. Realidad

El Project Charter identificó riesgos clave. Su gestión se detalla a continuación:

1.  **Riesgo 1: Infactibilidad del modelo por datos inconsistentes o aulas insuficientes (Media / Alto):**
    *   *Realidad:* Este riesgo se materializó en su totalidad (escasez de aulas físicas/laboratorios especializados).
    *   *Mitigación:* Se implementó el **switch de flexibilización** en la consola de generación del administrador en React, permitiendo al sistema resolver el horario relajando de forma segura la restricción de compatibilidad de aula, transformando un bloqueo total en una advertencia informativa resuelta con éxito.
2.  **Riesgo 2: Curva de aprendizaje de Google OR-Tools (Media / Medio):**
    *   *Realidad:* Se superó mediante investigación intensiva y modelado matemático iterativo durante el Sprint 0 y Sprint 1, logrando un modelado óptimo y de bajo consumo computacional.
3.  **Riesgo 3: Falta de disponibilidad del equipo por carga académica (Alta / Medio):**
    *   *Realidad:* Gestionado eficientemente mediante ceremonias Scrum rigurosas dirigidas por el Scrum Master Diego Isaac Oré Gonzales, redistribuyendo cargas de trabajo de forma equitativa.

---

## 6. Aprobaciones de Cierre de Proyecto

Las firmas correspondientes al cierre formal confirman la aceptación del producto entregable SGOHA versión 1.0:

| Rol | Nombre | Firma / Estado |
| :--- | :--- | :--- |
| **Patrocinador del Proyecto** | Dirección TI — Universidad Continental | Aprobado (Cierre Técnico) |
| **Product Owner** | Jose Anthony Bacilio de la Cruz | Aprobado |
| **Scrum Master / UX Analyst** | Diego Isaac Oré Gonzales | Aprobado |
| **Líder Técnico Backend** | Aldo Alexandre Requena Lavi | Aprobado |
| **Líder Técnico Frontend** | Luis Alberto Gutierrez Taipe | Aprobado |
