# Requerimientos No Funcionales — Estándar arc42

> Documentación de atributos de calidad del SGOHA conforme al estándar arc42 (Sección 10: Quality Requirements).

---

## 1. Árbol de Calidad (Quality Tree)

```
                         Calidad del Sistema SGOHA
                                    │
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
      Rendimiento            Escalabilidad           Mantenibilidad
            │                       │                       │
    ┌───────┼───────┐       ┌───────┼───────┐       ┌───────┼───────┐
    │       │       │       │       │       │       │       │       │
 Latencia Throughput Consumo  Horizontal Vertical  Tipado  Modular  Testeable
  API    Solver    Recurso   Docker    Workers   TS+Py   SoC      TDD
```

---

## 2. Escenarios de Calidad

### 2.1 Rendimiento (Performance)

#### RNF-01: Latencia de API (Consultas GET)

| Atributo | Valor |
|:---|:---|
| **Estímulo** | Usuario solicita horario personal vía GET `/api/schedules` |
| **Fuente** | Cliente HTTP (Frontend React) |
| **Artefacto** | Backend FastAPI + PostgreSQL |
| **Entorno** | Operación normal con ≤ 50 usuarios concurrentes |
| **Respuesta** | Datos JSON del horario del usuario |
| **Medida** | Tiempo de respuesta **≤ 2 segundos** (p95) |
| **Prioridad** | Alta |
| **Validación** | Benchmark HTTP con `benchmark.py` |

#### RNF-02: Tiempo de Generación del Solver

| Atributo | Valor |
|:---|:---|
| **Estímulo** | Admin ejecuta "Generar Horarios" para el semestre |
| **Artefacto** | Motor CP-SAT (scheduler.py) |
| **Entorno** | Dataset estándar: ≤ 122 secciones, ≤ 20 aulas |
| **Respuesta** | Horario OPTIMAL o FEASIBLE |
| **Medida** | Tiempo de ejecución **≤ 30 segundos** |
| **Prioridad** | Crítica |
| **Validación** | `solver.WallTime()` registrado en logs |

#### RNF-03: Consumo de Recursos

| Atributo | Valor |
|:---|:---|
| **Estímulo** | Ejecución del solver con 8 workers paralelos |
| **Medida** | RAM ≤ 512 MB, CPU ≤ 4 cores |
| **Validación** | `docker stats` durante benchmark |

---

### 2.2 Escalabilidad (Scalability)

#### RNF-04: Escalado Horizontal

| Atributo | Valor |
|:---|:---|
| **Estímulo** | Aumento de usuarios concurrentes |
| **Artefacto** | Infraestructura Docker Compose |
| **Respuesta** | Se instancian réplicas del backend independientes del frontend |
| **Medida** | Soportar **3x réplicas** del servicio backend sin degradación |
| **Prioridad** | Media |
| **Validación** | `docker-compose up --scale backend=3` |

#### RNF-05: Escalado del Solver (Workers)

| Atributo | Valor |
|:---|:---|
| **Estímulo** | Datasets más grandes (> 200 secciones) |
| **Respuesta** | Incrementar `num_workers` del solver |
| **Medida** | Escalado lineal de workers: 1, 2, 4, 8 |
| **Validación** | Benchmark comparativo por workers |

---

### 2.3 Mantenibilidad (Maintainability)

#### RNF-06: Tipado Estático

| Atributo | Valor |
|:---|:---|
| **Estímulo** | Desarrollador modifica lógica de restricciones |
| **Artefacto** | Código Python (Pydantic) + TypeScript (React) |
| **Respuesta** | Errores de tipo detectados en tiempo de compilación/lint |
| **Medida** | 100% de schemas validados con Pydantic; 100% componentes TypeScript |
| **Prioridad** | Alta |
| **Validación** | `mypy` en backend, `tsc --noEmit` en frontend |

#### RNF-07: Separación de Responsabilidades (SoC)

| Atributo | Valor |
|:---|:---|
| **Estímulo** | Nuevo requisito de negocio (ej. nueva restricción) |
| **Respuesta** | Cambio localizado en `scheduler.py` sin afectar API/frontend |
| **Medida** | Cada capa (API, Core, Models, Frontend) es independiente |
| **Validación** | Review de arquitectura |

#### RNF-08: Cobertura de Tests

| Atributo | Valor |
|:---|:---|
| **Estímulo** | Cambio en lógica de negocio |
| **Respuesta** | Tests detectan regresiones |
| **Medida** | Cobertura ≥ **70%** del módulo `app.core` |
| **Prioridad** | Alta |
| **Validación** | `pytest --cov` con reporte |

---

### 2.4 Disponibilidad (Availability)

#### RNF-09: Tolerancia a Fallos de BD

| Atributo | Valor |
|:---|:---|
| **Estímulo** | Pérdida temporal de conexión a PostgreSQL |
| **Respuesta** | API retorna HTTP 503 con mensaje claro |
| **Medida** | Recovery time ≤ 30 segundos tras reconexión |
| **Prioridad** | Media |
| **Validación** | Test de desconexión simulada |

---

### 2.5 Usabilidad (Usability)

#### RNF-10: Interfaz Institucional

| Atributo | Valor |
|:---|:---|
| **Estímulo** | Usuario accede al dashboard |
| **Respuesta** | UI con colores institucionales, diseño moderno (glassmorphism) |
| **Medida** | Cumplimiento de paleta UC, responsive design |
| **Prioridad** | Media |
| **Validación** | Revisión visual, test en dispositivos |

---

## 3. Métricas de Calidad Cuantificables

| ID | Métrica | Valor Objetivo | Herramienta | Estado |
|:---|:---|:---:|:---|:---|
| M-01 | Latencia GET API | ≤ 2s (p95) | benchmark.py / curl | ✅ Validado |
| M-02 | Tiempo solver (122 secs) | ≤ 30s | solver.WallTime() | ✅ Validado |
| M-03 | Cobertura tests core | ≥ 70% | pytest-cov | 🔄 En validación |
| M-04 | 0 colisiones en output | 0 | test_scheduler.py | ✅ Validado |
| M-05 | Tipado TypeScript | 100% | tsc --noEmit | ✅ Compilado |
| M-06 | Tipado Pydantic | 100% schemas | Validación automática | ✅ Activo |
| M-07 | RAM máxima solver | ≤ 512 MB | docker stats | ✅ Validado |

---

## 4. Riesgos Técnicos y Decisiones Arquitectónicas

| Riesgo | Probabilidad | Impacto | Mitigación |
|:---|:---|:---|:---|
| Timeout del solver con datasets > 200 secs | Media | Alto | `max_time_in_seconds` configurable; pre-filtrado agresivo |
| Inconsistencia de datos maestros | Baja | Crítico | Validación Pydantic en API; integridad referencial PostgreSQL |
| Degradación frontend con grillas grandes | Media | Medio | Virtualización de tabla; paginación |
| Dependencia de OR-Tools (vendor lock-in) | Baja | Medio | API abstracta `SchedulerEngine` permite cambiar solver |

---

## 5. Decisiones de Sostenibilidad (Green Software)

| Aspecto | Decisión | Impacto |
|:---|:---|:---|
| **Imágenes Docker** | `python:3.11-slim-bookworm` (< 150 MB) | -60% tamaño vs imagen completa |
| **Pre-filtrado variables** | Reduce espacio búsqueda ~70% | -40% consumo CPU del solver |
| **Workers adaptativos** | `num_workers = min(8, cpu_count)` | Solo usa cores disponibles |
| **Cache de docentes** | `docentes_cache` pre-computado | Evita N queries repetidas a BD |
| **Build multi-stage** | Frontend compiled → Nginx | Imagen producción < 50 MB |
