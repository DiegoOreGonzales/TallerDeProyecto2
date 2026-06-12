# 🧪 Guía de Pruebas Unitarias: pytest + TestClient (Supertest para FastAPI)

## Objetivo

Implementar y ejecutar pruebas automatizadas para los endpoints de la API usando **pytest** y **TestClient** de FastAPI (equivalente a Jest + Supertest en proyectos MERN/Node.js).

## Stack de Pruebas

| Tecnología MERN (rúbrica) | Equivalente en SGOHA |
|---------------------------|----------------------|
| Jest | pytest |
| Supertest | TestClient (FastAPI) |
| Mongoose Memory Server | SQLite (en memoria) |
| describe/it | class/test_ (pytest) |

## Archivos de Test

### 📄 `test_api.py` — Tests de CRUD básico (EXPANDIDO)

**Ubicación:** `src/backend/tests/test_api.py`

**Tests incluidos:**
- `test_get_users` — Listar usuarios (200 + array)
- `test_get_docentes` — Listar docentes (200 + array + role check)
- `test_get_aulas` — Listar aulas (200 + array)
- `test_get_cursos` — Listar cursos (200 + array)
- `test_get_secciones` — Listar secciones (200 + array)
- `test_get_schedules` — Obtener horarios (200 + estructura data)
- `test_get_stats` — Obtener KPIs (200 + todas las keys)
- `test_post_curso` — Crear curso (200 + validación de campos)
- `test_post_aula` — Crear aula (200 + validación)
- `test_post_seccion` — Crear sección (200 + validación)
- `test_login_success` — Login exitoso (200 + token JWT)
- `test_login_failure` — Login fallido (401)
- `test_delete_curso` — Eliminar curso (200 + message)
- `test_delete_aula` — Eliminar aula (200 + message)

### 📄 `test_crud.py` — Tests de validaciones y casos borde (NUEVO)

**Ubicación:** `src/backend/tests/test_crud.py`

**Tests incluidos:**
- `test_register_duplicate_username` — Username duplicado (400)
- `test_register_duplicate_email` — Email duplicado (400)
- `test_get_curso_not_found` — Curso por ID inexistente (404)
- `test_get_curso_invalid_id` — Curso con ID inválido (422)
- `test_delete_user_admin_protected` — No eliminar admin (403)
- `test_delete_nonexistent_user` — Eliminar usuario inexistente (404)
- `test_delete_nonexistent_curso` — Eliminar curso inexistente (404)
- `test_register_invalid_turno` — Turno inválido (400)
- `test_create_curso_duplicate_codigo` — Código de curso duplicado (400)
- `test_create_aula_duplicate_nombre` — Aula con nombre duplicado (400)
- `test_create_seccion_with_nonexistent_curso` — Sección con curso_id inválido (error del ORM)
- `test_get_schedules_empty` — Horarios vacíos (200 + data vacío)

### 📄 `test_export.py` — Tests de exportación (NUEVO)

**Ubicación:** `src/backend/tests/test_export.py`

**Tests incluidos:**
- `test_export_pdf_no_horarios` — PDF sin horarios (404)
- `test_export_pdf_by_ciclo_no_horarios` — PDF por ciclo sin horarios (404)
- `test_export_ical_no_horarios` — iCal sin horarios (404)
- `test_export_pdf_after_generate` — PDF después de generar horario (200 + Content-Type)
- `test_export_pdf_by_ciclo_after_generate` — PDF por ciclo después de generar (200)
- `test_export_ical_after_generate` — iCal después de generar (200 + headers iCal)

## Cobertura de Pruebas

### Antes (tests existentes)

| Archivo | Tests | Cobertura |
|---------|-------|-----------|
| `test_api.py` | 3 tests | Solo GET básicos |
| `test_auth.py` | 5 tests | Register success/error |
| `test_scheduler.py` | ~20 tests | Motor CP-SAT (mockeado) |
| `test_optimization_model.py` | ~20 tests | Modelo matemático |
| **Total** | **~48 tests** | |

### Después (con expansiones)

| Archivo | Tests | Cobertura |
|---------|-------|-----------|
| `test_api.py` | 15 tests | ✅ CRUD completo de todos los endpoints |
| `test_auth.py` | 5 tests | ✅ Auth (register, login) |
| `test_crud.py` | 12 tests | 🆕 Validaciones, errores 400/403/404 |
| `test_export.py` | 6 tests | 🆕 Exportación PDF e iCal |
| `test_scheduler.py` | ~20 tests | ✅ Motor CP-SAT |
| `test_optimization_model.py` | ~20 tests | ✅ Modelo matemático |
| **Total** | **~78 tests** | **+63% más cobertura** |

## Ejecución

### Ejecutar todos los tests

```bash
cd src/backend
pytest -v
```

### Ejecutar con cobertura

```bash
cd src/backend
pytest --cov=app --cov-report=term-missing -v
```

### Ejecutar solo los tests de API

```bash
cd src/backend
pytest tests/test_api.py tests/test_crud.py tests/test_export.py -v
```

### Ejecutar un test específico

```bash
cd src/backend
pytest tests/test_api.py::test_post_curso -v
```

## Interpretación de Resultados

```
tests/test_api.py ✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓  (15 passed)
tests/test_auth.py ✓✓✓✓✓              (5 passed)
tests/test_crud.py ✓✓✓✓✓✓✓✓✓✓✓✓      (12 passed)
tests/test_export.py ✓✓✓✓✓✓           (6 passed)
tests/test_scheduler.py ✓✓✓✓✓✓✓✓✓✓✓✓ (20+ passed)
tests/test_optimization_model.py ✓✓✓✓ (20+ passed)

=== 78 passed in 15.32s ===
```

## Buenas Prácticas

1. **Cada test es independiente**: `conftest.py` recrea la BD en SQLite para cada test
2. **Nombres descriptivos**: `test_[accion]_[escenario]` (ej: `test_login_failure`)
3. **Un assert por concepto**: Cada test verifica una cosa específica
4. **No mockear la BD**: Los tests de API usan SQLite real (no mock)
5. **Cubrir casos borde**: 200 (éxito), 400 (validación), 401 (no auth), 403 (prohibido), 404 (no encontrado)
