# Revisión del Acta de Constitución del Proyecto (Project Charter Review)

Este documento realiza la auditoría de cierre sobre el **Acta de Constitución del Proyecto (Project Charter)** inicial del sistema **SGOHA**, redactado y aprobado originalmente en **Marzo de 2026**. Se evalúa el nivel de cumplimiento de los objetivos estratégicos, los requisitos de alto nivel, los riesgos previstos y los criterios de éxito acordados desde el inicio del ciclo de vida del proyecto.

---

## 📅 1. Contexto de Iniciación y Evolución del Proyecto

En marzo de 2026, la Dirección de Tecnologías de la Información y la Coordinación Académica de la Universidad Continental definieron la necesidad urgente de automatizar y optimizar la generación de horarios para la carrera de Ingeniería de Sistemas. 

El proceso tradicional se gestionaba de forma manual en hojas de cálculo y se validaba en el ERP Banner, lo que tomaba entre **2 y 3 semanas** de trabajo, con un alto índice de colisiones y quejas de docentes. El proyecto **SGOHA** nació con el compromiso de resolver esta problemática mediante programación matemática usando el motor **Google OR-Tools (CP-SAT)**.

A lo largo de los **6 sprints** (Sprint 0 al Sprint 5, más el periodo de control y cierre administrativo), la visión original del Project Charter se mantuvo firme, adaptándose a nuevos requerimientos de accesibilidad y seguridad lógica sin desviar la fecha de entrega acordada para fines de junio de 2026.

---

## 📈 2. Evaluación de Objetivos del Proyecto y Criterios de Éxito

A continuación se realiza una confrontación detallada entre los criterios de éxito definidos en el Project Charter original y los resultados reales obtenidos al cierre del proyecto:

| Objetivo Inicial | Criterio de Éxito Establecido (Project Charter) | Nivel de Cumplimiento | Sustento Técnico / Métrica Obtenida al Cierre |
| :--- | :--- | :---: | :--- |
| **O1. Automatización de Horarios** | Generar una grilla horaria semanal completa sin colisiones en menos de 2 minutos. | **100% (Sobresaliente)** | El motor CP-SAT genera soluciones factibles y optimizadas en un promedio de **30 segundos** para 122 secciones y 61 asignaturas. En entornos locales con recursos limitados de Windows, se implementó un solucionador de backtracking en Python como fallback para garantizar resiliencia. |
| **O2. Mantenimiento y Calidad** | Cobertura de tests unitarios superior al 80% y Quality Gate de SonarQube aprobado. | **100% (Sobresaliente)** | Cobertura final del backend en **81%** (84 tests unitarios en Pytest) y frontend en **100%** (7 tests en Vitest). El Quality Gate en SonarQube se aprobó con **Rating A** en seguridad y mantenibilidad. |
| **O3. Accesibilidad y Usabilidad** | Relación de contraste > 4.5:1, navegación por teclado 100% interactiva y puntaje SUS > 80. | **100% (Sobresaliente)** | Se aplicó la normativa WCAG 2.1 AA (marcado ARIA y foco visible `focus:ring-orange-500`). El estudio métrico cuantitativo SUS finalizó con un puntaje de **83.75 / 100** (Grado A, Excelente). |
| **O4. Seguridad de la Información** | Mitigar riesgos de Clickjacking, MIME Sniffing y XSS a un nivel de riesgo residual bajo. | **100% (Sobresaliente)** | Se configuró el middleware de cabeceras de seguridad en FastAPI (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` y CSP estricta), verificado exitosamente mediante auditoría con `curl -I`. |

---

## 📋 3. Verificación de Requisitos de Alto Nivel

Los tres requisitos de alto nivel definidos al inicio del proyecto fueron validados y completados según el siguiente detalle:

*   **R-01: Arquitectura Multitapa Reproducible:**
    *   *Estado:* **Completado y Verificado.**
    *   *Detalle técnico:* Se estructuró un stack desacoplado compuesto por una base de datos relacional (PostgreSQL 15), un backend RESTful (FastAPI con Python 3.11) y un frontend (React 18 con TypeScript y Vite). La orquestación completa se gestiona mediante Docker Compose, permitiendo que cualquier desarrollador o personal de TI levante el entorno en menos de 10 minutos con `docker-compose up -d --build`.
*   **R-02: Interfaz de Gestión de Malla:**
    *   *Estado:* **Completado y Verificado.**
    *   *Detalle técnico:* Se desarrollaron vistas dinámicas e interactivas para la gestión de CRUDs de Aulas (validando tipo de aula: Teoría o Laboratorio), Cursos (con restricciones de horas y ciclo) y Secciones (vinculando docentes y turnos). Estas interfaces cuentan con validaciones de integridad de datos tanto en el frontend como en el backend.
*   **R-03: Visualización Gráfica de Mallas:**
    *   *Estado:* **Completado y Verificado.**
    *   *Detalle técnico:* Se implementó un Dashboard premium adaptativo que permite visualizar el horario generado en dos modos: una Grilla Semanal interactiva (distribuida por aulas, ciclos o docentes) y una vista de Agenda lineal optimizada para dispositivos móviles. Además, incluye la funcionalidad de exportar a PDF y descargar en formato estándar iCal para integración con calendarios externos.

---

## ⚠️ 4. Auditoría de Riesgos de Iniciación

El Project Charter original identificó riesgos tempranos que fueron gestionados activamente durante el ciclo de vida (verificados en el [Registro de Riesgos](registro_riesgos.md) y en el [Registro de Supuestos](registro_supuestos.md)):

1.  **Infactibilidad del modelo CP-SAT (Riesgo RS-01 / Supuesto AS-01):** Se mitigó agregando un validador en el frontend que impide al administrador activar combinaciones de restricciones duras mutuamente excluyentes y añadiendo tests unitarios de infactibilidad.
2.  **Curva de aprendizaje de Google OR-Tools (Riesgo RS-01 / Supuesto AS-06):** El equipo dedicó el Sprint 0 a la investigación matemática y pruebas unitarias de factibilidad, minimizando los cuellos de botella de desarrollo en los sprints siguientes.
3.  **Falta de disponibilidad del equipo (Impedimento IM-05):** Se gestionó mediante ceremonias ágiles Scrum (Daily Standups y retrospectivas), lo cual permitió reasignar tareas a tiempo cuando surgían bloqueos por sobrecarga académica (verificado en el [Registro de Impedimentos](registro_impedimentos.md)).

---

## 💡 Criterio de Aceptación Final

Dado que se han cumplido con todos los requisitos funcionales y no funcionales, se superaron las métricas de calidad de software propuestas en el Project Charter inicial, y se capacitaron exitosamente a los usuarios clave (coordinadores y administradores), el equipo de Scrum Master y el Product Owner declaran la **aceptación y cierre formal del sistema SGOHA**.

| Rol | Nombre | Firma / Estado |
| :--- | :--- | :---: |
| **Product Owner** | José Anthony Bacilio de la Cruz | **Aprobado (Digital)** |
| **Scrum Master / Project Manager** | Diego Isaac Oré Gonzales | **Aprobado (Digital)** |
| **Líder Técnico Backend** | Aldo Alexandre Requena Lavi | **Aprobado (Digital)** |
| **Líder Técnico Frontend** | Luis Alberto Gutierrez Taipe | **Aprobado (Digital)** |
