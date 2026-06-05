# Plan de Implementación: Pruebas de Rutas API — SGOHA

> **Proyecto**: SGOHA — Sistema de Generación Óptima de Horarios Académicos  
> **Stack Real**: FastAPI (Python) + React (TypeScript) + PostgreSQL  
> **Stack de la Rúbrica**: MERN (MongoDB, Express, React, Node.js)  
> **Fecha**: Junio 2026

---

## ⚠️ Nota importante: Adaptación del stack MERN → FastAPI/Python

La rúbrica original está diseñada para proyectos **MERN** (MongoDB + Express + React + Node.js). Este proyecto usa **FastAPI (Python)** + **React (TypeScript)**. A continuación se muestra la adaptación:

| Componente MERN (rúbrica) | Equivalente en SGOHA |
|---------------------------|----------------------|
| **Backend** Express/Node.js | **FastAPI** (Python) |
| **ORM** Mongoose | **SQLAlchemy** |
| **BD** MongoDB | **PostgreSQL** |
| **Dependencias** npm | **pip / requirements.txt** |
| **Mock API** JSON Server (Node.js) | JSON Server **instalado con npm** (compatible con cualquier backend HTTP) |
| **Pruebas Unitarias** Jest + Supertest | **pytest + TestClient** (FastAPI) |

---

## 1. 📋 Inventario Completo de Endpoints

### 🔐 Autenticación (`/api/auth/`)
| Método | Endpoint | Descripción | Cuerpo/Parámetros |
|--------|----------|-------------|-------------------|
| POST | `/api/auth/login` | Iniciar sesión | `{ username, password }` |
| POST | `/api/auth/register` | Registrar usuario | `{ username, email, password, role, turno_preferido, ciclo_actual? }` |
| GET | `/api/auth/users` | Listar todos los usuarios | — |
| GET | `/api/auth/users/docentes` | Listar solo docentes | — |
| DELETE | `/api/auth/users/{user_id}` | Eliminar usuario | — |

### 📚 Cursos (`/api/cursos/`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/cursos/` | Crear un curso |
| GET | `/api/cursos/` | Listar todos los cursos |
| GET | `/api/cursos/{curso_id}` | Obtener curso por ID |
| DELETE | `/api/cursos/{curso_id}` | Eliminar curso |

### 🏫 Aulas (`/api/aulas/`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/aulas/` | Crear un aula |
| GET | `/api/aulas/` | Listar todas las aulas |
| DELETE | `/api/aulas/{aula_id}` | Eliminar aula |

### 📋 Secciones (`/api/secciones/`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/secciones/` | Listar todas las secciones |
| POST | `/api/secciones/` | Crear una sección |
| DELETE | `/api/secciones/{seccion_id}` | Eliminar sección |

### ⚡ Scheduler (`/api/scheduler/`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/scheduler/` | Obtener horarios generados |
| GET | `/api/scheduler/stats` | Obtener KPIs del dashboard |
| POST | `/api/scheduler/generate` | Ejecutar motor de optimización CP-SAT |

### 📤 Exportación (`/api/export/`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/export/pdf` | Exportar PDF completo |
| GET | `/api/export/pdf/ciclo/{ciclo}` | Exportar PDF por ciclo |
| GET | `/api/export/ical/ciclo/{ciclo}` | Exportar calendario .ics |

### 🏠 Sistema
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Mensaje de bienvenida |
| GET | `/health` | Health check |

**Total: ~21 endpoints únicos en 7 grupos lógicos**

---

## 2. 📌 Qué puedes hacer TÚ (automatizable)

Como asistente de IA, puedo generar automáticamente los siguientes archivos:

### ✅ Archivos que entrego directamente

| # | Archivo | Descripción |
|---|---------|-------------|
| 1 | `mock/db.json` | Datos de prueba para JSON Server (~10 registros por entidad con relaciones) |
| 2 | `pruebas_curl.txt` | Comandos cURL documentados para todos los endpoints |
| 3 | `rutas_archivos.txt` | Documentación de ubicación de todos los entregables |
| 4 | Tests `pytest` adicionales | Pruebas unitarias con TestClient (equivalente a Supertest) |
| 5 | Esquema de Postman | Archivo base para ayudarte a estructurar la colección |

### ⚡ Mejoras a tests existentes

También puedo **mejorar los tests existentes** que ya están en el proyecto:
- `test_api.py` → Actualmente solo tiene 3 tests básicos (GET users, docentes, aulas). Puedo expandirlo para cubrir POST, DELETE y validaciones.
- `test_auth.py` → Tiene 5 tests de registro. Puedo agregar login, eliminación de usuarios, y casos borde.

---

## 3. 🧑‍💻 Qué DEBES hacer TÚ (manual en Postman)

### Paso a paso para Postman

#### 3.1. Preparación: Configurar el servidor

1. **Inicia el backend**:
   ```bash
   docker compose up -d   # o desde tu entorno local
   # La API estará en http://localhost:8000
   ```

2. **Verifica que el servidor responda**:
   ```bash
   curl http://localhost:8000/health
   # → {"status": "healthy"}
   ```

3. **Siembra datos de prueba** (opcional pero recomendado):
   ```bash
   cd src/backend
   python seed.py
   ```

#### 3.2. Creación de la Colección en Postman

**Paso 1**: Crear una nueva colección llamada **`SGOHA - API Tests`**

**Paso 2**: Crear una **variable de entorno** en Postman:
- `base_url` = `http://localhost:8000`
- `token` = (se llenará automáticamente con el test del login)

**Paso 3**: Crear las carpetas con íconos:

```
SGOHA - API Tests
├── 🏠 Sistema
│   ├── GET  Health Check
│   └── GET  Root
├── 🔐 Autenticación
│   ├── POST Login
│   ├── POST Registrar Usuario
│   ├── GET  Listar Usuarios
│   ├── GET  Listar Docentes
│   └── DELETE Eliminar Usuario [Admin]
├── 📚 Cursos
│   ├── POST Crear Curso
│   ├── GET  Listar Cursos
│   ├── GET  Obtener Curso por ID
│   └── DELETE Eliminar Curso
├── 🏫 Aulas
│   ├── POST Crear Aula
│   ├── GET  Listar Aulas
│   └── DELETE Eliminar Aula
├── 📋 Secciones
│   ├── POST Crear Sección
│   ├── GET  Listar Secciones
│   └── DELETE Eliminar Sección
├── ⚡ Scheduler
│   ├── POST Generar Horario
│   ├── GET  Obtener Horarios
│   └── GET  Obtener KPIs
└── 📤 Exportación
    ├── GET  Exportar PDF Completo
    ├── GET  Exportar PDF por Ciclo
    └── GET  Exportar Calendario iCal
```

#### 3.3. Scripts de Test para cada Request

**Para cada request**, debes ir a la pestaña **"Tests"** y pegar el script correspondiente.

<details>
<summary><b>📋 Scripts de Test para cada endpoint</b></summary>

### 🏠 Sistema

**GET Health Check**:
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Respuesta tiene status healthy", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("status", "healthy");
});
```

**GET Root**:
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Mensaje de bienvenida presente", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("message");
});
```

### 🔐 Autenticación

**POST Login**:
```javascript
pm.test("Status 200 - Login exitoso", () => {
    pm.response.to.have.status(200);
});
pm.test("Token JWT recibido", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("access_token");
    pm.expect(json.token_type).to.eql("bearer");
    pm.expect(json).to.have.property("user_role");
    pm.expect(json).to.have.property("user_name");
    
    // Guardar token para otros requests
    pm.collectionVariables.set("token", json.access_token);
});
```

**POST Registrar Usuario**:
```javascript
pm.test("Status 200 - Registro exitoso", () => {
    pm.response.to.have.status(200);
});
pm.test("Datos del usuario creado", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("username");
    pm.expect(json).to.have.property("role");
    pm.expect(json).to.have.property("is_active", true);
});
pm.test("No se devuelve contraseña", () => {
    const json = pm.response.json();
    pm.expect(json).to.not.have.property("hashed_password");
    pm.expect(json).to.not.have.property("password");
});
```

**GET Listar Usuarios**:
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Es un arreglo", () => {
    const json = pm.response.json();
    pm.expect(json).to.be.an("array");
});
```

**GET Listar Docentes**:
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Todos los usuarios son docentes", () => {
    const json = pm.response.json();
    pm.expect(json).to.be.an("array");
    json.forEach(user => {
        pm.expect(user.role).to.eql("docente");
    });
});
```

**DELETE Eliminar Usuario**:
```javascript
pm.test("Status 200 - Usuario eliminado", () => {
    pm.response.to.have.status(200);
});
pm.test("Mensaje de confirmación", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("message");
});
```

### 📚 Cursos

**POST Crear Curso**:
```javascript
pm.test("Status 200 - Curso creado", () => {
    pm.response.to.have.status(200);
});
pm.test("Estructura del curso válida", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("id");
    pm.expect(json).to.have.property("codigo");
    pm.expect(json).to.have.property("nombre");
    pm.expect(json).to.have.property("creditos");
    pm.expect(json).to.have.property("tipo");
    pm.expect(json).to.have.property("periodo");
});
```

**GET Listar Cursos**:
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Es un arreglo", () => {
    pm.expect(pm.response.json()).to.be.an("array");
});
```

**GET Obtener Curso por ID**:
```javascript
pm.test("Status 200 - Curso encontrado", () => {
    pm.response.to.have.status(200);
});
pm.test("ID del curso coincide", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("id");
});
```

**DELETE Eliminar Curso**:
```javascript
pm.test("Curso eliminado", () => {
    pm.response.to.have.status(200);
});
pm.test("Mensaje de confirmación", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("message");
});
```

### 🏫 Aulas (misma estructura que Cursos)

**POST Crear Aula**:
```javascript
pm.test("Status 200 - Aula creada", () => {
    pm.response.to.have.status(200);
});
pm.test("Estructura del aula válida", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("id");
    pm.expect(json).to.have.property("nombre");
    pm.expect(json).to.have.property("capacidad");
    pm.expect(json).to.have.property("tipo");
});
```

**GET Listar Aulas**:
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Es un arreglo", () => {
    pm.expect(pm.response.json()).to.be.an("array");
});
```

### 📋 Secciones

**POST Crear Sección**:
```javascript
pm.test("Status 200 - Sección creada", () => {
    pm.response.to.have.status(200);
});
pm.test("Estructura de sección válida", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("id");
    pm.expect(json).to.have.property("codigo");
    pm.expect(json).to.have.property("curso_id");
    pm.expect(json).to.have.property("docente_id");
});
```

**GET Listar Secciones**:
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Es un arreglo", () => {
    pm.expect(pm.response.json()).to.be.an("array");
});
```

### ⚡ Scheduler

**POST Generar Horario**:
```javascript
pm.test("Status 200 - Horario generado", () => {
    pm.response.to.have.status(200);
});
pm.test("Mensaje de éxito con bloques asignados", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("message");
    pm.expect(json.message).to.include("bloques asignados");
});
pm.test("Datos de horarios presentes", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("data");
    pm.expect(json.data).to.be.an("array");
});
```

**GET Obtener Horarios**:
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Estructura de datos correcta", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("data");
    pm.expect(json.data).to.be.an("array");
});
```

**GET Obtener KPIs**:
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("KPIs requeridos presentes", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("cursos");
    pm.expect(json).to.have.property("aulas");
    pm.expect(json).to.have.property("secciones");
    pm.expect(json).to.have.property("docentes");
    pm.expect(json).to.have.property("horarios_generados");
});
pm.test("KPIs son números no negativos", () => {
    const json = pm.response.json();
    Object.values(json).forEach(v => {
        pm.expect(v).to.be.a("number").and.to.be.at.least(0);
    });
});
```

### 📤 Exportación

**GET Exportar PDF**:
```javascript
pm.test("Status 200 - PDF generado", () => {
    pm.response.to.have.status(200);
});
pm.test("Content-Type es application/pdf", () => {
    pm.expect(pm.response.headers.get("Content-Type"))
      .to.include("application/pdf");
});
pm.test("Content-Disposition presente", () => {
    pm.expect(pm.response.headers.get("Content-Disposition"))
      .to.include("attachment; filename=");
});
```

**GET Exportar Calendario iCal**:
```javascript
pm.test("Status 200 - Calendario exportado", () => {
    pm.response.to.have.status(200);
});
pm.test("Content-Type es text/calendar", () => {
    pm.expect(pm.response.headers.get("Content-Type"))
      .to.include("text/calendar");
});
pm.test("Contenido iCal válido", () => {
    const body = pm.response.text();
    pm.expect(body).to.include("BEGIN:VCALENDAR");
    pm.expect(body).to.include("END:VCALENDAR");
    pm.expect(body).to.include("VERSION:2.0");
});
```
</details>

#### 3.4. Organización de la colección

1. **Crea las carpetas** en Postman con los nombres y emojis indicados.
2. **Arrastra cada request** a su carpeta correspondiente.
3. **Configura la autorización**: En la carpeta raíz o en cada carpeta protegida, ve a la pestaña **Authorization**, selecciona **Bearer Token** y usa `{{token}}` como valor.
4. **Prueba el flujo completo**: Ejecuta primero **POST Login** → el script guarda el token → los demás requests lo usan automáticamente.

#### 3.5. Exportar la colección

1. Haz clic en los **`…`** junto al nombre de la colección
2. Selecciona **Export**
3. Elige **Collection v2.1** (recomendado)
4. Guarda como `coleccion_postman.json`

---

## 4. 📝 Cuerpos de Request (para Postman)

### POST Login
```json
{
    "username": "admin",
    "password": "admin"
}
```

### POST Registrar Usuario (Docente)
```json
{
    "username": "nuevo_docente",
    "email": "ndocente@ucontinental.edu.pe",
    "password": "segura123",
    "role": "docente",
    "turno_preferido": "MAÑANA"
}
```

### POST Registrar Usuario (Estudiante)
```json
{
    "username": "estudiante_nuevo",
    "email": "enuevo@ucontinental.edu.pe",
    "password": "segura123",
    "role": "estudiante",
    "turno_preferido": "TARDE",
    "ciclo_actual": 6
}
```

### POST Crear Curso
```json
{
    "codigo": "ASUC99999",
    "nombre": "Curso de Prueba API",
    "creditos": 3,
    "tipo": "Teoría",
    "periodo": 5
}
```

### POST Crear Aula
```json
{
    "nombre": "A-TEST-01",
    "capacidad": 40,
    "tipo": "Teoría"
}
```

### POST Crear Sección
```json
{
    "codigo": "ASUC99999-M",
    "curso_id": 1,
    "docente_id": 2,
    "capac_estimada": 35,
    "turno": "MAÑANA"
}
```

### DELETE Eliminar (por ID)
```
# URL: {{base_url}}/api/cursos/999
# URL: {{base_url}}/api/aulas/999
# URL: {{base_url}}/api/auth/users/999
# URL: {{base_url}}/api/secciones/999
```

---

## 5. 🔄 Dependencias entre Requests (Orden de Ejecución)

Para una ejecución fluida en Postman, sigue este orden:

```
1. GET  /health
2. POST /auth/register       (crea un docente de prueba)
3. POST /auth/login           (guarda el token automáticamente)
4. GET  /auth/users           (listar usuarios)
5. GET  /auth/users/docentes  (listar solo docentes)

6. POST /cursos/              (crear curso → guarda curso_id)
7. GET  /cursos/              (listar cursos)
8. GET  /cursos/{id}          (obtener curso por su ID)

9. POST /aulas/               (crear aula)
10. GET /aulas/               (listar aulas)

11. POST /secciones/          (crear sección con curso_id y docente_id)
12. GET  /secciones/          (listar secciones)

13. POST /scheduler/generate  (generar horario)
14. GET  /scheduler/          (ver horarios)
15. GET  /scheduler/stats     (ver KPIs)

16. GET  /export/pdf          (PDF completo)
17. GET  /export/pdf/ciclo/5  (PDF por ciclo)
18. GET  /export/ical/ciclo/5 (iCal por ciclo)

19. DELETE /cursos/{id}       (limpiar)
20. DELETE /aulas/{id}
21. DELETE /auth/users/{id}
```

---

## 6. 🧪 Pruebas Unitarias con pytest (+ TestClient)

La rúbrica pide **Supertest + Jest** (Node.js). Como el backend es **FastAPI (Python)**, el equivalente es **pytest + TestClient**.

### Estado actual de los tests:

| Archivo | Tests | Cobertura |
|---------|-------|-----------|
| `test_api.py` | 3 tests | Solo GET users, docentes, aulas |
| `test_auth.py` | 5 tests | Register: éxito y errores |
| `test_scheduler.py` | ~20 tests | Motor de optimización (mockeado) |
| `test_optimization_model.py` | ~20 tests | Propiedades matemáticas del modelo |
| **Total** | **~48 tests** | ✅ Ya existe una base sólida |

### Lo que puedo agregar (automatizable):

Yo puedo expandir `test_api.py` y crear nuevos archivos de test para cubrir:

1. **CRUD completo de Cursos** (POST, GET, GET by ID, DELETE)
2. **CRUD completo de Aulas** (POST, GET, DELETE)
3. **CRUD completo de Secciones** (POST, GET, DELETE)
4. **Login exitoso y fallido**
5. **Eliminación de usuarios** (admin, docente, estudiante)
6. **Errores 400** (duplicados, validaciones)
7. **Errores 404** (recursos no encontrados)
8. **Exportación PDF e iCal** (verificar headers y contenido)
9. **Generación de horario** (ciclo completo con seed)

### Ubicación:
```
src/backend/tests/
├── conftest.py           ✅ Ya existe
├── test_api.py           🔴 Expandiré este archivo
├── test_auth.py          ✅ Ya existe
├── test_scheduler.py     ✅ Ya existe
├── test_optimization_model.py  ✅ Ya existe
├── test_export.py        🆕 Crearé este archivo
└── test_crud.py          🆕 Crearé este archivo
```

---

## 7. 📁 Entregables Finales

### Estructura de archivos a crear/entregar:

```
docs/
└── planificacion/
    └── PLAN_PRUEBAS_API.md        ← Este documento (plan de implementación)
mock/
└── db.json                        ← Datos de prueba para JSON Server (🆕)
pruebas_curl.txt                   ← Comandos cURL documentados (🆕)
rutas_archivos.txt                 ← Ubicación de todos los entregables (🆕)
coleccion_postman.json             ← Exportación de Postman (📦 manual)
src/backend/tests/
├── conftest.py                    ✅ Ya existe
├── test_api.py                    🔴 Expandido
├── test_auth.py                   ✅ Ya existe
├── test_scheduler.py              ✅ Ya existe
├── test_optimization_model.py     ✅ Ya existe
├── test_export.py                 🆕 Nuevo
└── test_crud.py                   🆕 Nuevo
```

---

## 8. ✅ Checklist de Implementación

### 📦 Fase 1: Automatizable por mí (IA)
- [ ] Crear `mock/db.json` con datos de prueba para JSON Server
- [ ] Crear `pruebas_curl.txt` con todos los endpoints documentados
- [ ] Crear `rutas_archivos.txt` con la ubicación de todos los entregables
- [ ] Expandir `test_api.py` con tests de CRUD completo
- [ ] Crear `test_crud.py` con tests específicos de validaciones y casos borde
- [ ] Crear `test_export.py` con tests de exportación PDF e iCal
- [ ] Ejecutar todos los tests y verificar que pasen

### 🧑‍💻 Fase 2: Manual (tú en Postman)
- [ ] Iniciar el servidor backend (`docker compose up` o `uvicorn`)
- [ ] Ejecutar `seed.py` para tener datos de prueba
- [ ] Crear colección en Postman con estructura de carpetas
- [ ] Crear cada request con su método, URL, headers y body
- [ ] Pegar los scripts de test en la pestaña "Tests" de cada request
- [ ] Probar la ejecución completa de la colección
- [ ] Exportar la colección como `coleccion_postman.json`
- [ ] Verificar que el archivo JSON exportado sea válido

### ✅ Fase 3: Verificación Final
- [ ] Confirmar que `coleccion_postman.json` existe y es importable
- [ ] Confirmar que `mock/db.json` es funcional con JSON Server
- [ ] Ejecutar `pytest` y confirmar que todos los tests pasan
- [ ] Verificar que `pruebas_curl.txt` tenga al menos 6 comandos funcionales
- [ ] Verificar que `rutas_archivos.txt` documente todo correctamente

---

## 9. ⏱️ Tiempo Estimado

| Actividad | Tiempo | Responsable |
|-----------|--------|-------------|
| Crear mock/db.json | ~10 min | IA 🤖 |
| Crear pruebas_curl.txt | ~20 min | IA 🤖 |
| Crear/expandir tests pytest | ~30 min | IA 🤖 |
| Ejecutar y verificar tests | ~10 min | IA 🤖 |
| Configurar Postman (colección) | ~40 min | Tú 🧑‍💻 |
| Probar requests en Postman | ~20 min | Tú 🧑‍💻 |
| Exportar colección | ~5 min | Tú 🧑‍💻 |
| **Total** | **~2 horas** | — |
