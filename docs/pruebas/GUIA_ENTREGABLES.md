# 📂 Guía de Entregables: Estructura de Archivos y Convenciones

## Objetivo

Documentar la ubicación y contenido de todos los archivos entregables para las pruebas de rutas API, siguiendo las convenciones de nombres y organización del repositorio.

## Convención de Nombres

Según las instrucciones de gestión de proyectos en GitHub, los archivos deben usar:
- `snake_case` para nombres de archivo
- Prefijo descriptivo del contenido
- Ubicación coherente dentro del repositorio

## Estructura Completa de Entregables

```
📁 TallerDeProyecto2/
│
├── 📄 coleccion_postman.json          ← (1) Colección exportada de Postman
├── 📄 pruebas_curl.txt                ← (2) Comandos cURL documentados
├── 📄 rutas_archivos.txt              ← (3) Ubicación de implementación
│
├── 📁 mock/
│   └── 📄 db.json                     ← (4) Datos de prueba para JSON Server
│
├── 📁 docs/
│   └── 📁 pruebas/
│       ├── 📄 GUIA_MOCK_JSON_SERVER.md   ← Documentación del Mock API
│       ├── 📄 GUIA_CURL.md               ← Documentación de pruebas cURL
│       ├── 📄 GUIA_TEST_UNITARIOS.md     ← Documentación de tests unitarios
│       ├── 📄 GUIA_POSTMAN.md            ← Documentación de Postman
│       ├── 📄 GUIA_ENTREGABLES.md        ← Este archivo
│       └── 📄 PLAN_PRUEBAS_API.md        ← Plan general de implementación
│
└── 📁 src/
    └── 📁 backend/
        └── 📁 tests/
            ├── 📄 conftest.py             ← Configuración de pytest/DB
            ├── 📄 test_api.py             ← (5a) Tests CRUD expandidos
            ├── 📄 test_crud.py            ← (5b) Tests de validaciones (NUEVO)
            ├── 📄 test_export.py          ← (5c) Tests de exportación (NUEVO)
            ├── 📄 test_auth.py            ← Tests de autenticación
            ├── 📄 test_scheduler.py       ← Tests del motor CP-SAT
            └── 📄 test_optimization_model.py ← Tests del modelo matemático
```

## Detalle de Cada Entregable

### (1) `coleccion_postman.json`
- **Archivo:** Raíz del proyecto
- **Contenido:** Colección exportada de Postman en formato JSON v2.1
- **Incluye:** Todos los requests (~21 endpoints), tests automatizados, variables de colección
- **Cómo se genera:** Exportar desde Postman (ver GUIA_POSTMAN.md)

### (2) `pruebas_curl.txt`
- **Archivo:** Raíz del proyecto
- **Contenido:** 24 comandos cURL funcionales con título, descripción (40-50 palabras), comando y respuesta esperada
- **Cobertura:** Todos los endpoints de la API

### (3) `rutas_archivos.txt`
- **Archivo:** Raíz del proyecto
- **Contenido:** Mapa de ubicación de mock/db.json y los tests unitarios
- **Propósito:** Facilitar la evaluación indicando dónde encontrar cada implementación

### (4) `mock/db.json`
- **Archivo:** `mock/db.json`
- **Contenido:** Datos de prueba para JSON Server con 5 entidades relacionadas (usuarios, cursos, aulas, secciones, horarios)
- **Propósito:** Simular la API para desarrollo frontend independiente

### (5a) `test_api.py` (Expandido)
- **Archivo:** `src/backend/tests/test_api.py`
- **Contenido:** 15 tests de CRUD básico para todos los endpoints
- **Tecnología:** pytest + TestClient (FastAPI)

### (5b) `test_crud.py` (Nuevo)
- **Archivo:** `src/backend/tests/test_crud.py`
- **Contenido:** 12 tests de validaciones, errores y casos borde
- **Cobertura:** Códigos de error 400, 403, 404, 422

### (5c) `test_export.py` (Nuevo)
- **Archivo:** `src/backend/tests/test_export.py`
- **Contenido:** 6 tests de exportación PDF e iCal
- **Cobertura:** Verificación de Content-Type, headers y estructura del contenido

## Resumen de Cobertura

| Criterio de Rúbrica | Estado | Archivo(s) |
|---------------------|--------|------------|
| Postman: Colección organizada | 📦 Manual | `coleccion_postman.json` |
| Postman: Tests automatizados | 📦 Manual | Scripts en cada request |
| Exportación Postman | 📦 Manual | `coleccion_postman.json` |
| Pruebas cURL (≥6 comandos) | ✅ Automático | `pruebas_curl.txt` (24 comandos) |
| Mock API JSON Server | ✅ Automático | `mock/db.json` |
| Pruebas Unitarias (≥5 endpoints) | ✅ Automático | `test_api.py` (15) + `test_crud.py` (12) + `test_export.py` (6) |
| Estructura de Entregables | ✅ Automático | `rutas_archivos.txt` |
| Documentación | ✅ Automático | `docs/pruebas/` (6 guías) |

## Notas para el Evaluador

- **Backend:** FastAPI (Python) — no Express/Node.js
- **Pruebas unitarias:** pytest + TestClient (equivalente a Jest + Supertest)
- **Mock API:** JSON Server (Node.js) compatible con cualquier backend HTTP
- **Postman:** Configuración manual requerida (ver GUIA_POSTMAN.md)
- **Seed de datos:** Ejecutar `python src/backend/seed.py` antes de probar
