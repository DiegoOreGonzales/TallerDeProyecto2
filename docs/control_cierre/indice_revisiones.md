# Índice de Revisiones y Matriz de Control y Cierre (Inspección 08)

Este documento centraliza el mapeo de entregables, la matriz de responsabilidades del equipo de ingeniería para la **Inspección 08 (Fase de Control y Cierre del Proyecto)** y la **Rúbrica de Competencias del Consolidado 2 (08_A)**. Además, detalla el historial de versiones y revisiones documentales a lo largo de todo el proyecto.

---

## 📂 1. Mapeo de Entregables Administrativos y Técnicos (Consigna 08_B)

Para facilitar la verificación del jurado y asegurar la trazabilidad del proyecto, los entregables se organizan bajo la siguiente estructura física:

| Hito / Consigna | Entregable Documental | Ruta Relativa en el Repositorio | Responsable Principal |
| :--- | :--- | :--- | :--- |
| **08_B (Cierre 1)** | Informe Final del Proyecto (*Final Project Report*) | [informe_final_proyecto.md](informe_final_proyecto.md) | Diego Isaac Oré Gonzales |
| **08_B (Cierre 2)** | Informe Final de Lecciones Aprendidas | [lecciones_aprendidas.md](lecciones_aprendidas.md) | Diego Isaac Oré Gonzales |
| **08_B (Registro 1)**| Registro de Riesgos (*Risk Register*) | [registro_riesgos.md](registro_riesgos.md) | José Anthony Bacilio De La Cruz |
| **08_B (Registro 2)**| Registro de Incidentes o Problemas (*Issue Log*) | [registro_incidentes.md](registro_incidentes.md) | Aldo Alexandre Requena Lavi |
| **08_B (Registro 3)**| Registro de Impedimentos (*Impediment Log*) | [registro_impedimentos.md](registro_impedimentos.md) | Aldo Alexandre Requena Lavi |
| **08_B (Registro 4)**| Registro de Defectos (*Defect Log*) | [registro_defectos.md](registro_defectos.md) | José Anthony Bacilio De La Cruz |
| **08_B (Registro 5)**| Registro de Supuestos (*Assumption Log*) | [registro_supuestos.md](registro_supuestos.md) | Diego Isaac Oré Gonzales |
| **08_B (Otros 1)** | Revisión del Acta de Constitución (*Project Charter*) | [revision_acta_constitucion.md](revision_acta_constitucion.md) | Diego Isaac Oré Gonzales |
| **08_B (Otros 2)** | Revisión de la Declaración de Trabajo (*SOW*) | [revision_declaracion_trabajo.md](revision_declaracion_trabajo.md) | Luis Alberto Gutierrez Taipe |
| **08_B (Otros 3)** | Documentación de Capacitación y Operación | [documentacion_capacitacion.md](documentacion_capacitacion.md) | Luis Alberto Gutierrez Taipe |

---

## 📅 2. Registro Histórico de Versiones y Revisiones Documentales

Este registro detalla la evolución y auditorías aplicadas a cada artefacto documental desde su creación inicial (Sprint 0) hasta su estado de aceptación final (Sprint 6):

| Documento | Versión | Fecha | Autores / Revisores | Descripción de Cambios Realizados | Estado |
| :--- | :---: | :---: | :--- | :--- | :---: |
| **Project Charter** | 1.0 | 12/03/2026 | D. Oré / J. Bacilio | Creación inicial de objetivos estratégicos, presupuesto preliminar y riesgos de incepción. | **Aprobado** |
| | 1.1 | 24/04/2026 | D. Oré / A. Requena | Ajuste de métricas de rendimiento del resolvedor tras las pruebas físicas en el Sprint 2. | **Aprobado** |
| | 2.0 (Cierre) | 20/06/2026 | D. Oré / J. Bacilio | Auditoría final de cierre del Project Charter y firmas de aceptación del sistema. | **Auditado** |
| **Declaración de Trabajo (SOW)** | 1.0 | 15/03/2026 | L. Gutierrez / D. Oré | Redacción inicial de los 6 entregables contractuales de la solución. | **Aprobado** |
| | 1.1 | 28/05/2026 | L. Gutierrez / J. Bacilio | Inyección de las HUs de accesibilidad (CR-01) y seguridad (CR-02) al alcance. | **Aprobado** |
| | 2.0 (Cierre) | 22/06/2026 | L. Gutierrez / PO | Auditoría final de entregables del contrato y mapeo de competencias WCAG. | **Auditado** |
| **Registro de Riesgos** | 1.0 | 15/03/2026 | J. Bacilio / A. Requena | Identificación de 5 riesgos iniciales y asignación de probabilidad e impacto. | **En Seguimiento** |
| | 2.0 (Cierre) | 25/06/2026 | J. Bacilio / D. Oré | Cierre de riesgos mitigados y adición de riesgos de fugas de base de datos (RS-06) y adopción (RS-07). | **Cerrado** |
| **Registro de Incidentes** | 1.0 | 25/05/2026 | A. Requena / J. Bacilio | Apertura y seguimiento de incidentes de indexación (IS-01) y seeder (IS-02). | **En Seguimiento** |
| | 2.0 (Cierre) | 25/06/2026 | A. Requena / D. Oré | Cierre de incidentes y adición de incidentes de WSL2 (IS-05) y CORS local (IS-06). | **Cerrado** |
| **Registro de Impedimentos** | 1.0 | 20/05/2026 | A. Requena / L. Gutierrez | Registro de impedimentos de hardware (IM-01) y cambio de rúbrica de usabilidad (IM-02). | **En Seguimiento** |
| | 2.0 (Cierre) | 25/06/2026 | A. Requena / D. Oré | Registro y mitigación de impedimentos de Windows Home (IM-04) y cuellos de botella (IM-05). | **Cerrado** |
| **Registro de Defectos** | 1.0 | 30/05/2026 | J. Bacilio / L. Gutierrez | Identificación de defectos de software DF-01 al DF-04 mediante pruebas y SonarQube. | **Corregido** |
| | 2.0 (Cierre) | 25/06/2026 | J. Bacilio / A. Requena | Registro y resolución de defectos DF-05 al DF-08 (Windows, CSP, puertos y key duplicados). | **Cerrado** |
| **Manual de Capacitación** | 1.0 | 05/06/2026 | L. Gutierrez / A. Requena | Estructuración inicial de guías de instalación docker y manuales de administrador. | **Aprobado** |
| | 2.0 (Cierre) | 26/06/2026 | L. Gutierrez / D. Oré | Inclusión del manual para estudiantes/docentes, talleres externos e histórico de capacitación. | **Auditado** |

---

## ♿ 3. Mapeo de Rúbrica de Competencias del Consolidado 2 (Consigna 08_A)

De acuerdo con la rúbrica de evaluación de competencias para las semanas 14 y 15, el proyecto documenta y defiende el cumplimiento de los siguientes indicadores de ingeniería:

*   **2. Aprendizaje Experiencial y Colaborativo:**
    *   *Métrica:* Organización en entornos iterativos (Scrum) y toma de decisiones técnicas sustentadas en la experiencia previa.
    *   *Soporte Documental:* [plan_auditoria_calidad.md](../gestion/plan_auditoria_calidad.md) y [lecciones_aprendidas.md](lecciones_aprendidas.md).
*   **3. Ciudadanía Glocal:**
    *   *Métrica:* Consideración de normas de seguridad, reglamentos y manuales que regulan el sistema SGOHA.
    *   *Soporte Documental:* [reporte_calidad_inspeccion07.md](../calidad/reporte_calidad_inspeccion07.md) (Mitigación de seguridad OWASP) y [registro_riesgos.md](registro_riesgos.md).
*   **4. Comunicación Efectiva:**
    *   *Métrica:* Redacción técnica con terminología apropiada de Ingeniería de Sistemas y defensa del discurso oral según roles Scrum.
    *   *Soporte Documental:* [distribucion_exposicion_inspecciones.md](../gestion/distribucion_exposicion_inspecciones.md) (Guión de exposición) e informes en `docs/calidad/`.
*   **9. Medio Ambiente y Sostenibilidad:**
    *   *Métrica:* Ecoeficiencia, Green Software (solucionador matemático CP-SAT de bajo consumo de CPU) e impacto socioambiental del software.
    *   *Soporte Documental:* [reporte_sostenibilidad.md](../sostenibilidad/reporte_sostenibilidad.md).
*   **12. Diseño y Desarrollo de Soluciones:**
    *   *Métrica:* Definición de requisitos, restricciones complejas (costo del ciclo de vida - LCC, cero carbono neto) y gestión de cambios.
    *   *Soporte Documental:* [optimization_model.md](../especificaciones/optimization_model.md) y [informe_final_proyecto.md](informe_final_proyecto.md).
