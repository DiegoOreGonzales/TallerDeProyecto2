# Inspección 02: SGOHA - Taller de Proyectos 2

Este documento consolida la lista de artefactos desarrollados para la Inspección 02, relacionándolos con los criterios de la rúbrica de evaluación "Sobresaliente".

## 🔗 URL del Video de Exposición (4-5 min)
> [!IMPORTANT]
> **Enlace del Video:** [Pegue aquí su URL de OneDrive o Google Drive]

---

## 🛠️ Lista de Artefactos y Relación con la Consigna

| Artefacto | Ubicación | Relación con la Rúbrica |
| :--- | :--- | :--- |
| **Modelado del Problema** | [Restricciones_Sistema.md](./docs/planificacion/Restricciones_Sistema.md) | **Criterio 2:** Define formalmente las restricciones duras (contigüidad, colisión) y blandas (turnos). |
| **Especificación SDD** | [Especificacion_SDD.md](./docs/especificaciones/Especificacion_SDD.md) | **Criterio 3:** Implementa Spec-Driven Development con BDD (Gherkin) y sustento de Google Antigravity. |
| **Suite de Tests (TDD)** | [test_scheduler.py](./src/backend/tests/test_scheduler.py) | **Criterio 4:** Evidencia de pruebas automatizadas y cobertura de lógica de negocio (Ciclo Red-Green-Refactor). |
| **Algoritmo Optimizado** | [scheduler.py](./src/backend/app/core/scheduler.py) | **Criterio 5:** Motor CP-SAT de alto rendimiento capaz de procesar 122 secciones sin conflictos. |
| **Evidencias de RNF** | [README.md](./README.md) | **Criterio 6:** Documentación de métricas de rendimiento (Tiempo de respuesta ≤ 2s). |
| **Prototipo Funcional** | [Código Fuente](./src/) | **Criterio 7:** Aplicación completa contenerizada (Docker) con UI Premium en React. |

---

## 🚀 Resumen Técnico de Mejoras (V2.0)
- **Contigüidad:** Garantiza bloques seguidos de una misma materia (evita huecos).
- **Deduplicación:** Lógica inteligente para estudiantes de turno "Completo".
- **Horas Pedagógicas:** Desglose visual de 40 min con recesos de 10 min.
- **Detección de Colisiones por Ciclo:** Ningún alumno tendrá dos clases del mismo periodo al mismo tiempo.

---

## 📄 Notas Adicionales
El proyecto ha sido estructurado siguiendo las recomendaciones de **Google Antigravity**, asegurando una arquitectura escalable y una optimización de recursos que satisface los requerimientos no funcionales de tiempo de respuesta y usabilidad premium.
