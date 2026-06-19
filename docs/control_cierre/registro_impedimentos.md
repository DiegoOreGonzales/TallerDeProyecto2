# Registro de Impedimentos (Impediment Log)

Este documento registra los obstáculos e impedimentos externos o internos que bloquearon o demoraron el progreso normal del equipo de desarrollo de **SGOHA**, detallando su impacto y las acciones tomadas para resolverlos.

---

## 📋 Registro de Impedimentos

| ID | Fecha | Descripción del Impedimento | Impacto en el Sprint | Severidad | Mitigación o Resolución | Estado |
| :---: | :---: | :--- | :--- | :---: | :--- | :---: |
| **IM-01** | 15/05/2026 | **Falta de hardware compatible para SonarQube:** Algunos integrantes del equipo disponían de sistemas con recursos limitados (RAM < 8GB), lo cual impedía levantar SonarQube en local debido al alto consumo de Java y Elasticsearch. | Retrasó 3 días el análisis estático inicial del proyecto. | Alta | Se centralizó la ejecución de SonarQube en el entorno local contenerizado de Docker del QA Lead (José Bacilio), quien procesaba el escaneo del repositorio y compartía los reportes técnicos consolidados. | **Resuelto** |
| **IM-02** | 22/05/2026 | **Cambio en las directivas de evaluación de la Rúbrica:** La inclusión imprevista de la consigna SUS de usabilidad requirió diseñar un instrumento y aplicar encuestas a usuarios simulados. | Reorganizó el Backlog del Sprint 5. | Media | El Scrum Master (Diego Oré) asumió el rol de Analista UX y diseñó la plantilla Likert de 10 ítems para aplicarla de forma controlada a 10 participantes, evitando sobrecargar a los desarrolladores backend y frontend. | **Resuelto** |
| **IM-03** | 05/06/2026 | **Lentitud en la generación de horarios en el Frontend:** En los primeros testeos del frontend, la llamada al endpoint de optimización matemática bloqueaba la UI del navegador sin mostrar indicadores de progreso. | Afectaba la percepción de usabilidad del usuario. | Media | Luis Gutierrez rediseñó el componente de generación inyectando un spinner de carga dinámico (`LoadingState`) y Aldo Requena configuró el backend de FastAPI para que el solucionador retorne la factibilidad en un tiempo máximo de 30 segundos. | **Resuelto** |

---

## 💡 Lecciones de Gestión
El Scrum Master lideró la remoción de impedimentos de forma activa mediante reuniones diarias de sincronización (Dailies), coordinando con el Product Owner para priorizar los bloqueos en el Backlog del sprint de calidad.
