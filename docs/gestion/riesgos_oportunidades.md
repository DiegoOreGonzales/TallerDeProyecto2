# Gestión de Riesgos y Oportunidades — Proyecto SGOHA

> Registro formal de riesgos y oportunidades del proyecto con análisis cuantitativo de probabilidad/impacto, estrategias de mitigación/aprovechamiento y relación directa con las restricciones del problema CSP.

---

## 1. Registro de Riesgos

### 1.1 Matriz de Probabilidad × Impacto

|  | **Impacto Bajo (1)** | **Impacto Medio (2)** | **Impacto Alto (3)** | **Impacto Crítico (4)** |
|:---|:---:|:---:|:---:|:---:|
| **Prob. Alta (4)** | 4 | 8 | 12 | **16** |
| **Prob. Media (3)** | 3 | 6 | **9** | 12 |
| **Prob. Baja (2)** | 2 | 4 | 6 | 8 |
| **Prob. Muy Baja (1)** | 1 | 2 | 3 | 4 |

> **Umbrales:** Verde (1–4) = Aceptable | Amarillo (5–9) = Monitorear | Rojo (10–16) = Mitigar activamente

### 1.2 Registro Detallado de Riesgos

#### R-01: Infactibilidad del modelo CP-SAT por datos inconsistentes

| Campo | Detalle |
|:---|:---|
| **ID** | R-01 |
| **Categoría** | Técnico — Restricciones CSP |
| **Descripción** | El motor CP-SAT retorna INFEASIBLE porque los datos de entrada violan restricciones duras (ej: más secciones que slots×aulas disponibles, docente sin turno compatible). |
| **Probabilidad** | Media (3) |
| **Impacto** | Alto (3) → No se genera horario |
| **Puntuación** | **9** — Monitorear activamente |
| **Restricción CSP relacionada** | HC-4 (No-superposición aulas), HC-5 (No-superposición docentes), HC-8 (Compatibilidad aula) |
| **Estrategia de mitigación** | Pre-validación de factibilidad antes de invocar el solver (scheduler.py L94–L100). Mensaje de error descriptivo indicando qué sección es incompatible. |
| **Indicador de activación** | Error INFEASIBLE en ≥ 2 ejecuciones consecutivas |
| **Responsable** | Dev Backend (Aldo Requena) |
| **Estado** | ✅ Mitigado — Pre-filtrado implementado |

#### R-02: Timeout del solver con datasets grandes (> 200 secciones)

| Campo | Detalle |
|:---|:---|
| **ID** | R-02 |
| **Categoría** | Técnico — Rendimiento |
| **Descripción** | El solver CP-SAT no encuentra solución factible dentro del límite de tiempo configurado (120s), especialmente con datasets que excedan el alcance PoC. |
| **Probabilidad** | Media (3) |
| **Impacto** | Alto (3) |
| **Puntuación** | **9** — Monitorear |
| **Restricción CSP relacionada** | Complejidad NP-Hard del problema |
| **Estrategia de mitigación** | Pre-filtrado agresivo de variables (~70% reducción). Workers paralelos (8). Timeout configurable con respuesta parcial (FEASIBLE vs OPTIMAL). |
| **Estado** | ✅ Mitigado — Pre-filtrado + 8 workers implementados |

#### R-03: Curva de aprendizaje del equipo con OR-Tools

| Campo | Detalle |
|:---|:---|
| **ID** | R-03 |
| **Categoría** | Organizacional — Competencias |
| **Descripción** | El equipo no tiene experiencia previa con Google OR-Tools ni programación con restricciones, lo que podría ralentizar el desarrollo del motor. |
| **Probabilidad** | Alta (4) |
| **Impacto** | Medio (2) |
| **Puntuación** | **8** — Monitorear |
| **Dependencia externa** | Documentación de Google OR-Tools |
| **Estrategia de mitigación** | Sprint 0 dedicado a exploración técnica. Pair programming Dev Backend + SM. Soporte de Google Antigravity para modelado de restricciones. |
| **Estado** | ✅ Materializado y superado — Sprint 0 absorbió la curva |

#### R-04: Inconsistencia entre frontend y backend por cambios de API

| Campo | Detalle |
|:---|:---|
| **ID** | R-04 |
| **Categoría** | Técnico — Integración |
| **Descripción** | Cambios en los schemas de la API (Pydantic) que no se reflejan en el frontend, causando errores de renderizado o datos incorrectos. |
| **Probabilidad** | Baja (2) |
| **Impacto** | Alto (3) |
| **Puntuación** | **6** — Monitorear |
| **Estrategia de mitigación** | Contrato OpenAPI/Swagger auto-generado por FastAPI. TypeScript en frontend con interfaces tipadas. |
| **Estado** | ✅ Mitigado — Swagger + TS |

#### R-05: Falta de disponibilidad del equipo por carga académica

| Campo | Detalle |
|:---|:---|
| **ID** | R-05 |
| **Categoría** | Organizacional — Recursos |
| **Descripción** | Los integrantes del equipo tienen otros cursos y responsabilidades académicas que pueden reducir la dedicación al proyecto. |
| **Probabilidad** | Alta (4) |
| **Impacto** | Medio (2) |
| **Puntuación** | **8** — Monitorear |
| **Estrategia de mitigación** | Sprints de 2 semanas (permite flexibilidad). Daily asíncrono. Redistribución de tareas cuando un miembro reporta impedimento. |
| **Estado** | 🔄 Activo — Gestionado sprint a sprint |

#### R-06: Pérdida de datos por migraciones de BD incorrectas

| Campo | Detalle |
|:---|:---|
| **ID** | R-06 |
| **Categoría** | Técnico — Datos |
| **Descripción** | Migraciones de esquema que corrompen o eliminan datos existentes en PostgreSQL. |
| **Probabilidad** | Baja (2) |
| **Impacto** | Crítico (4) |
| **Puntuación** | **8** — Monitorear |
| **Estrategia de mitigación** | Docker volumes para persistencia. Seed script (`seed.py`) para regenerar datos de prueba. |
| **Estado** | ✅ Mitigado — Volumes + seed |

#### R-07: Solapamiento no detectado por turno COMPLETO

| Campo | Detalle |
|:---|:---|
| **ID** | R-07 |
| **Categoría** | Técnico — Restricciones CSP |
| **Descripción** | Secciones con turno COMPLETO podrían generar solapamientos invisibles si el motor no aplica HC-7 correctamente para turnos mixtos. |
| **Probabilidad** | Media (3) |
| **Impacto** | Alto (3) |
| **Puntuación** | **9** — Monitorear |
| **Restricción CSP** | HC-7 (No-colisión por período+turno), HC-9 (Turno efectivo) |
| **Estrategia de mitigación** | HC-7 solo aplica a turnos fijos (MAÑANA/TARDE). Test `test_poc4_no_period_collision` valida este escenario. |
| **Estado** | ✅ Mitigado — Test automatizado |

### 1.3 Mapa de Calor de Riesgos

```
IMPACTO →   Bajo(1)  Medio(2)  Alto(3)  Crítico(4)
PROB ↓
Alta (4)              R-03,R-05
Media(3)                        R-01,R-02,R-07
Baja (2)                        R-04          R-06
Muy Baja(1)
```

---

## 2. Registro de Oportunidades

### O-01: Adopción institucional del SGOHA

| Campo | Detalle |
|:---|:---|
| **Descripción** | La Universidad Continental podría adoptar SGOHA como sistema oficial de programación académica, reemplazando el proceso manual actual. |
| **Impacto positivo** | Reducción del 95% en tiempo de elaboración de horarios. Eliminación de conflictos. |
| **Probabilidad** | Media |
| **Estrategia de aprovechamiento** | Presentar benchmark comparativo: manual (4 semanas) vs SGOHA (30 segundos). Demo en Sprint Review con stakeholders reales. |

### O-02: Extensión a otras universidades

| Campo | Detalle |
|:---|:---|
| **Descripción** | El modelo CSP es genérico para cualquier universidad con currículo flexible. Podría ofrecerse como SaaS. |
| **Impacto positivo** | Escalabilidad del producto. Potencial comercial. |
| **Probabilidad** | Baja (requiere inversión adicional) |
| **Estrategia de aprovechamiento** | Diseñar arquitectura multi-tenant desde el inicio. Parametrizar restricciones institucionales. |

### O-03: Contribución a Google OR-Tools community

| Campo | Detalle |
|:---|:---|
| **Descripción** | Publicar el modelo de timetabling como caso de estudio open source para la comunidad de OR-Tools. |
| **Impacto positivo** | Visibilidad académica. Feedback de expertos en optimización. |
| **Probabilidad** | Media |
| **Estrategia de aprovechamiento** | Documentar el modelo en optimization_model.md con rigor formal. Publicar en GitHub con licencia MIT. |

### O-04: Integración con sistema de matrícula existente

| Campo | Detalle |
|:---|:---|
| **Descripción** | Conectar SGOHA con el ERP Banner de la universidad para alimentar automáticamente los datos de cursos, secciones y docentes. |
| **Impacto positivo** | Eliminación de carga manual de datos. Sincronización en tiempo real. |
| **Probabilidad** | Media-Alta (interés institucional) |
| **Estrategia de aprovechamiento** | Diseñar API de importación CSV/Excel como paso intermedio. Documentar esquema de datos requerido. |

### O-05: Machine Learning para predicción de demanda

| Campo | Detalle |
|:---|:---|
| **Descripción** | Usar datos históricos de matrícula para predecir `capac_estimada` de cada sección, mejorando la entrada del modelo CSP. |
| **Impacto positivo** | Mejor utilización de aulas. Reducción de secciones sobre/sub-dimensionadas. |
| **Probabilidad** | Baja (fuera de alcance PoC) |
| **Estrategia de aprovechamiento** | Registrar datos de matrícula real como training data. Integrar módulo predictivo en v3.0. |

---

## 3. Relación Riesgos ↔ Restricciones CSP

| Riesgo | Restricciones CSP Impactadas | Nivel de Acoplamiento |
|:---|:---|:---:|
| R-01 (Infactibilidad) | HC-4, HC-5, HC-8, HC-9 | **Alto** — fallo directo del solver |
| R-02 (Timeout) | Todas (espacio de búsqueda) | **Alto** — NP-Hard inherente |
| R-07 (Turno COMPLETO) | HC-7, HC-9 | **Medio** — caso límite específico |
| R-03 (Curva OR-Tools) | Todas | **Medio** — afecta calidad de implementación |
| R-04 (API inconsistencia) | Ninguna directa | **Bajo** — capa de presentación |

---

## 4. Relación Riesgos ↔ Dependencias Externas

| Riesgo | Dependencia Externa | Tipo |
|:---|:---|:---|
| R-02 (Timeout) | Google OR-Tools (solver performance) | Tecnológica |
| R-03 (Curva aprendizaje) | Documentación OR-Tools, Google Antigravity | Conocimiento |
| R-04 (API inconsistencia) | OpenAPI/Swagger spec | Contractual |
| R-05 (Disponibilidad) | Calendario académico UC | Organizacional |
| R-06 (Migraciones) | PostgreSQL + Docker volumes | Infraestructura |

---

## 5. Plan de Contingencia Resumido

| Escenario Crítico | Acción Inmediata | Responsable |
|:---|:---|:---|
| INFEASIBLE persistente | Revisar datos maestros; ejecutar pre-validación manual | Dev Backend |
| Timeout > 120s | Reducir `max_time_in_seconds`; aceptar FEASIBLE (no OPTIMAL) | Dev Backend |
| Miembro no disponible (> 3 días) | Redistribuir tareas en Daily; SM prioriza historial críticas | Scrum Master |
| Pérdida de BD | Ejecutar `seed.py` + restaurar desde Docker volume backup | Equipo |
| API breaking change | Rollback a commit anterior; comunicar al frontend dev | SM + Dev Backend |
