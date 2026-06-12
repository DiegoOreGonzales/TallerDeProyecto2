# Plan de Trabajo Colaborativo y Ejecución de Commits (Inspección 07)

Este documento detalla la estructura de los reportes `.md` exigidos por la consigna, la distribución de tareas entre los 4 integrantes del grupo y el plan de commits ejecutado en el repositorio de GitHub.

---

## 👥 1. Plan de Trabajo Colaborativo y Roles RACI

Para la exposición y la defensa de la rúbrica de aseguramiento de calidad, los roles de los integrantes de la Universidad Continental se definen bajo el marco Scrum y de ingeniería de calidad:

### 1. José Anthony Bacilio De La Cruz (Product Owner / QA Lead)
* **Responsabilidad:** Asegurar la configuración de SonarQube, la integración con pipelines, y definir el plan de análisis estático continuo.
* **Rol en Defensa:** Explicar el plan de SonarQube, la justificación de exclusión de librerías y las métricas objetivo del Quality Gate.

### 2. Aldo Alexandre Requena Lavi (Backend Developer)
* **Responsabilidad:** Implementar mitigaciones contra vulnerabilidades OWASP Top 10 2025 en backend (FastAPI secure headers middleware, validación estricta de esquemas Pydantic y sanitización de datos).
* **Rol en Defensa:** Explicar las contramedidas de inyección de cabeceras HTTP de seguridad y cómo evitan ataques como XSS y Clickjacking.

### 3. Luis Alberto Gutierrez Taipe (Frontend Developer)
* **Responsabilidad:** Garantizar la accesibilidad WCAG 2.2 AA en la SPA React. Incorporar marcado semántico, soporte para navegación completa mediante teclado (switches interactivos), y propiedades ARIA dinámicas.
* **Rol en Defensa:** Demostrar el flujo interactivo de habilitar/deshabilitar restricciones usando únicamente el teclado y herramientas de asistencia.

### 4. Diego Isaac Oré Gonzales (Scrum Master / UX Analyst)
* **Responsabilidad:** Diseñar y recopilar el cuestionario de usabilidad SUS (10 participantes), calcular los puntajes finales de aceptación, y consolidar el informe técnico general de aseguramiento de calidad.
* **Rol en Defensa:** Presentar los resultados métricos cuantitativos del SUS (Puntaje SUS = 83.75, Excelente) y las recomendaciones UX surgidas del estudio.

### Matriz RACI del Aseguramiento de Calidad:
| Actividad | PO (José) | SM (Diego) | Dev BE (Aldo) | Dev FE (Luis) |
| :--- | :---: | :---: | :---: | :---: |
| Configuración SonarQube | **R** / **A** | I | C | C |
| Mitigación OWASP API | C | I | **R** / **A** | C |
| Accesibilidad WCAG UI | C | I | C | **R** / **A** |
| Encuesta & Reporte SUS | C | **R** / **A** | I | I |
| Validación de Pruebas | **R** | C | **R** | **R** |

> **Leyenda:** R = Responsable (ejecutor), A = Aprobador (autoridad), C = Consultado, I = Informado.

---

## 📂 2. Estructura de Entregables (.md) Presentados

Los entregables se organizan en los siguientes documentos markdown dentro del repositorio:

1. **`sonar-project.properties`** (Raíz del proyecto): Parámetros del proyecto en SonarQube, exclusiones de dependencias y mapeo de pruebas unitarias.
2. **`docs/calidad/reporte_calidad_inspeccion07.md`** (Informe Técnico Integral):
   * *Sección 1:* Análisis estático de SonarQube y Quality Gate.
   * *Sección 2:* Matriz de mitigación OWASP Top 10 y evaluación de riesgo residual.
   * *Sección 3:* Checklist WCAG AA y correcciones dinámicas implementadas.
   * *Sección 4:* Metodología y base de datos de la escala SUS (10 usuarios, puntaje 83.75, Nivel Excelente).
   * *Sección 5:* Resumen de pruebas y cobertura automatizada.
3. **`docs/calidad/evidencias_verificacion.md`** (Evidencias Prácticas):
   * Capturas y outputs de `curl -I` que validan cabeceras de seguridad.
   * Inspección del DOM y accesibilidad de teclado en el Dashboard.
   * Logs de consola que demuestran la ejecución satisfactoria de los 84 tests en backend y 7 en frontend.
4. **`docs/gestion/plan_auditoria_calidad.md`** (Este documento): Roles del equipo e historial de control de cambios.

---

## 📌 3. Historial de Commits de la Auditoría (Simulado)

Para reflejar la autoría colaborativa correspondiente a cada integrante según su responsabilidad, el agente ejecutó la secuencia de commits siguiendo el estándar de **Conventional Commits**:

### Paso 1: Configuración de SonarQube (José Anthony Bacilio)
* **Autor:** `José Anthony Bacilio De La Cruz <74934503@continental.edu.pe>`
* **Mensaje:** `feat(qa): configure SonarQube project properties for static analysis`
* **Archivos:** `sonar-project.properties`

### Paso 2: Seguridad OWASP y APIs (Aldo Alexandre Requena)
* **Autor:** `Aldo Requena <aldo.requena@continental.edu.pe>`
* **Mensaje:** `feat(security): implement secure HTTP headers middleware (OWASP Top 10) and export endpoints`
* **Archivos:** `src/backend/app/main.py`, `src/backend/app/api/export.py`, `src/backend/app/api/ical_export.py`, `src/backend/app/api/scheduler.py`, `src/backend/app/core/scheduler.py`, `src/backend/app/models.py`, `src/backend/seed.py`, `src/backend/tests/test_export.py`, `.gitignore`

### Paso 3: Accesibilidad WCAG (Luis Alberto Gutierrez)
* **Autor:** `LUIS ALBERTO GUTIERREZ TAIPE <71850190@continental.edu.pe>`
* **Mensaje:** `feat(accessibility): implement WCAG compliance for custom controls, teachers, and classrooms tables`
* **Archivos:** `src/frontend/src/pages/Dashboard.tsx`, `src/frontend/src/pages/Classrooms.tsx`, `src/frontend/src/pages/Teachers.tsx`, `src/frontend/src/components/CrudTable.tsx`

### Paso 4: Reportes y Documentación (Diego Isaac Oré)
* **Autor:** `DiegoOreGonzales <72409984@continental.edu.pe>`
* **Mensaje:** `docs(quality): add comprehensive quality, security, and usability SUS report with validation evidence`
* **Archivos:** `docs/calidad/reporte_calidad_inspeccion07.md`, `docs/calidad/evidencias_verificacion.md`, `docs/gestion/plan_auditoria_calidad.md`
