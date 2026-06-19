# Revisión de la Declaración de Trabajo (SOW Review)

Este documento detalla la auditoría de cierre sobre la **Declaración de Trabajo (Statement of Work - SOW)** del sistema **SGOHA**, verificando formalmente que cada uno de los entregables y alcances comprometidos contractualmente con el patrocinador del proyecto estén completados al 100%.

---

## 📋 1. Estado de los Entregables del Contrato (SOW)

| ID Entregable | Entregable Comprometido | Descripción / Criterio de Aceptación | Estado | Evidencia y Ruta de Verificación |
| :---: | :--- | :--- | :---: | :--- |
| **ENT-01** | Core API (Backend) | API en FastAPI que procesa el motor matemático de asignación de horarios en un tiempo máximo de 30 segundos. | **Completado** | [test_scheduler.py](../../src/backend/tests/test_scheduler.py) y [test_api.py](../../src/backend/tests/test_api.py). |
| **ENT-02** | Dashboard UI (Frontend) | Panel gerencial interactivo en React que muestra el horario generado gráficamente. | **Completado** | [Dashboard.tsx](../../src/frontend/src/pages/Dashboard.tsx) y CRUDs. |
| **ENT-03** | Base de Datos Relacional | Base de datos PostgreSQL con migraciones SQLAlchemy y semillas de carga (`seed.py`). | **Completado** | [models.py](../../src/backend/app/models.py) y [database.py](../../src/backend/app/database.py). |
| **ENT-04** | Orquestación Docker | Entorno contenerizado ejecutable en un solo paso mediante `docker-compose up`. | **Completado** | [docker-compose.yml](../../docker-compose.yml) en la raíz del proyecto. |
| **ENT-05** | Informe de Calidad | Auditoría de linter, compilación, SonarQube, accesibilidad WCAG y usabilidad SUS. | **Completado** | [reporte_calidad_inspeccion07.md](../calidad/reporte_calidad_inspeccion07.md). |
| **ENT-06** | Manuales de Operación | Manuales de instalación, usuario final y mantenimiento del software. | **Completado** | [documentacion_capacitacion.md](documentacion_capacitacion.md). |

---

## 🛠️ 2. Control de Cambios y Adiciones al Alcance

Se registraron e implementaron los siguientes cambios al alcance original bajo el protocolo de control de configuración (PMBOK):
*   **Adición de Accesibilidad WCAG (CR-01):** Modificación del marcado HTML en formularios y switches interactivos para incluir soporte de lectores de pantalla.
*   **Mitigación OWASP en API (CR-02):** Inyección de middleware de cabeceras HTTP de seguridad restrictivas no contemplado originalmente.
*   **Estudio métrico SUS (CR-03):** Aplicación de la encuesta cuantitativa SUS a 10 usuarios para evaluar la aceptación del software.

---

## 🔑 3. Declaración de Cumplimiento Contractual
Al haberse verificado que todos los entregables técnicos y administrativos (ENT-01 a ENT-06) fueron implementados, testeados y documentados en el repositorio del proyecto sin pendientes contractuales, se da por **aprobado y cerrado el Statement of Work (SOW)**.
