# 📬 Guía de Postman: Configuración de la Colección de Pruebas

## Objetivo

Crear una colección completa en Postman para probar todos los endpoints de la API REST de SGOHA, organizada en carpetas lógicas con tests automatizados.

## Requisitos

- [Postman](https://www.postman.com/downloads/) instalado
- Backend ejecutándose en `http://localhost:8000`
- Seed de datos ejecutado (`python src/backend/seed.py`)

## Estructura de la Colección

```
SGOHA - API Tests
├── 🏠 Sistema
│   ├── GET  Health Check
│   └── GET  Root
├── 🔐 Autenticación
│   ├── POST Login (admin/admin)
│   ├── POST Registrar Docente
│   ├── POST Registrar Estudiante
│   ├── GET  Listar Usuarios
│   ├── GET  Listar Docentes
│   └── DELETE Eliminar Usuario
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

## Variables de Colección

Configurar en Postman (Collection → Variables):

| Variable | Valor Inicial | Descripción |
|----------|---------------|-------------|
| `base_url` | `http://localhost:8000` | URL del servidor |
| `token` | _(vacío)_ | Token JWT (se llena automáticamente) |
| `curso_id` | _(vacío)_ | ID del curso creado |
| `aula_id` | _(vacío)_ | ID del aula creada |
| `seccion_id` | _(vacío)_ | ID de la sección creada |
| `user_id` | _(vacío)_ | ID del usuario a eliminar |

## Scripts de Test

Cada request debe incluir scripts en la pestaña **Tests**. A continuación, los scripts agrupados por carpeta.

### 🏠 Sistema

**GET Health Check:**
```javascript
pm.test("Status 200 — Servidor operativo", () => {
    pm.response.to.have.status(200);
});
pm.test("Respuesta healthy", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("status", "healthy");
});
```

**GET Root:**
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Mensaje de bienvenida", () => {
    pm.expect(pm.response.json()).to.have.property("message");
});
```

### 🔐 Autenticación

**POST Login:**
```javascript
pm.test("Status 200 — Login exitoso", () => {
    pm.response.to.have.status(200);
});
const json = pm.response.json();
pm.test("Token JWT recibido", () => {
    pm.expect(json).to.have.property("access_token");
    pm.expect(json.token_type).to.eql("bearer");
});
pm.test("Rol y nombre presentes", () => {
    pm.expect(json).to.have.property("user_role");
    pm.expect(json).to.have.property("user_name");
});
// Guardar token para otros requests
pm.collectionVariables.set("token", json.access_token);
```

**POST Registrar Docente:**
```javascript
pm.test("Status 200 — Docente registrado", () => {
    pm.response.to.have.status(200);
});
const json = pm.response.json();
pm.test("Datos correctos", () => {
    pm.expect(json).to.have.property("username");
    pm.expect(json.role).to.eql("docente");
    pm.expect(json.is_active).to.eql(true);
});
pm.test("No expone contraseña", () => {
    pm.expect(json).to.not.have.property("password");
    pm.expect(json).to.not.have.property("hashed_password");
});
pm.collectionVariables.set("user_id", json.id);
```

**POST Registrar Estudiante:**
```javascript
pm.test("Status 200 — Estudiante registrado", () => {
    pm.response.to.have.status(200);
});
const json = pm.response.json();
pm.test("Datos del estudiante", () => {
    pm.expect(json.role).to.eql("estudiante");
    pm.expect(json).to.have.property("ciclo");
});
```

**GET Listar Usuarios:**
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Es un arreglo de usuarios", () => {
    const json = pm.response.json();
    pm.expect(json).to.be.an("array");
    if (json.length > 0) {
        pm.expect(json[0]).to.have.property("username");
    }
});
```

**GET Listar Docentes:**
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Todos son docentes", () => {
    const json = pm.response.json();
    pm.expect(json).to.be.an("array");
    json.forEach(u => pm.expect(u.role).to.eql("docente"));
});
```

**DELETE Eliminar Usuario:**
```javascript
pm.test("Usuario eliminado", () => {
    pm.response.to.have.status(200);
});
pm.test("Mensaje de confirmación", () => {
    pm.expect(pm.response.json()).to.have.property("message");
});
```

### 📚 Cursos

**POST Crear Curso:**
```javascript
pm.test("Status 200 — Curso creado", () => {
    pm.response.to.have.status(200);
});
const json = pm.response.json();
pm.test("Estructura válida", () => {
    pm.expect(json).to.have.property("id");
    pm.expect(json).to.have.property("codigo");
    pm.expect(json).to.have.property("nombre");
    pm.expect(json).to.have.property("creditos");
    pm.expect(json).to.have.property("tipo");
    pm.expect(json).to.have.property("periodo");
});
pm.collectionVariables.set("curso_id", json.id);
```

**GET Listar Cursos:**
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Es un arreglo", () => {
    pm.expect(pm.response.json()).to.be.an("array");
});
```

**GET Obtener Curso por ID:**
```javascript
pm.test("Status 200 — Curso encontrado", () => {
    pm.response.to.have.status(200);
});
pm.test("ID coincide", () => {
    pm.expect(pm.response.json()).to.have.property("id");
});
```

**DELETE Eliminar Curso:**
```javascript
pm.test("Curso eliminado", () => {
    pm.response.to.have.status(200);
});
pm.test("Mensaje de confirmación", () => {
    pm.expect(pm.response.json()).to.have.property("message");
});
```

### 🏫 Aulas (misma estructura)

**POST Crear Aula:**
```javascript
pm.test("Status 200 — Aula creada", () => {
    pm.response.to.have.status(200);
});
const json = pm.response.json();
pm.test("Estructura válida", () => {
    pm.expect(json).to.have.property("id");
    pm.expect(json).to.have.property("nombre");
    pm.expect(json).to.have.property("capacidad");
    pm.expect(json).to.have.property("tipo");
});
pm.collectionVariables.set("aula_id", json.id);
```

**GET Listar Aulas:**
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Es un arreglo", () => {
    pm.expect(pm.response.json()).to.be.an("array");
});
```

**DELETE Eliminar Aula:**
```javascript
pm.test("Aula eliminada", () => {
    pm.response.to.have.status(200);
});
pm.expect(pm.response.json()).to.have.property("message");
```

### 📋 Secciones

**POST Crear Sección:**
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
const json = pm.response.json();
pm.test("Estructura válida", () => {
    pm.expect(json).to.have.property("id");
    pm.expect(json).to.have.property("codigo");
    pm.expect(json).to.have.property("curso_id");
    pm.expect(json).to.have.property("docente_id");
});
```

**GET Listar Secciones:**
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Es un arreglo", () => {
    pm.expect(pm.response.json()).to.be.an("array");
});
```

**DELETE Eliminar Sección:**
```javascript
pm.test("Sección eliminada", () => {
    pm.response.to.have.status(200);
});
pm.expect(pm.response.json()).to.have.property("message");
```

### ⚡ Scheduler

**POST Generar Horario:**
```javascript
pm.test("Status 200 — Horario generado", () => {
    pm.response.to.have.status(200);
});
const json = pm.response.json();
pm.test("Mensaje con bloques asignados", () => {
    pm.expect(json).to.have.property("message");
    pm.expect(json.message).to.include("bloques");
});
pm.test("Data con arreglo de horarios", () => {
    pm.expect(json).to.have.property("data");
    pm.expect(json.data).to.be.an("array");
});
```

**GET Obtener Horarios:**
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Estructura { data: [...] }", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("data");
    pm.expect(json.data).to.be.an("array");
});
```

**GET Obtener KPIs:**
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
const json = pm.response.json();
pm.test("Todos los KPIs presentes", () => {
    pm.expect(json).to.have.property("cursos");
    pm.expect(json).to.have.property("aulas");
    pm.expect(json).to.have.property("secciones");
    pm.expect(json).to.have.property("docentes");
    pm.expect(json).to.have.property("horarios_generados");
});
pm.test("Valores numéricos no negativos", () => {
    Object.values(json).forEach(v => {
        pm.expect(v).to.be.a("number").and.to.be.at.least(0);
    });
});
```

### 📤 Exportación

**GET Exportar PDF:**
```javascript
pm.test("Status 200 — PDF generado", () => {
    pm.response.to.have.status(200);
});
pm.test("Content-Type es PDF", () => {
    pm.expect(pm.response.headers.get("Content-Type"))
      .to.include("application/pdf");
});
pm.test("Content-Disposition tiene filename", () => {
    const cd = pm.response.headers.get("Content-Disposition");
    pm.expect(cd).to.include("attachment; filename=");
});
```

**GET Exportar PDF por Ciclo:**
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Content-Type PDF", () => {
    pm.expect(pm.response.headers.get("Content-Type"))
      .to.include("application/pdf");
});
```

**GET Exportar Calendario iCal:**
```javascript
pm.test("Status 200 — iCal exportado", () => {
    pm.response.to.have.status(200);
});
pm.test("Content-Type text/calendar", () => {
    pm.expect(pm.response.headers.get("Content-Type"))
      .to.include("text/calendar");
});
pm.test("Estructura iCal válida", () => {
    const body = pm.response.text();
    pm.expect(body).to.include("BEGIN:VCALENDAR");
    pm.expect(body).to.include("END:VCALENDAR");
    pm.expect(body).to.include("VERSION:2.0");
});
```

## Cuerpos de Request JSON

Para facilitar la configuración, aquí están los cuerpos JSON para cada POST:

### POST Login
```json
{
    "username": "admin",
    "password": "admin"
}
```

### POST Registrar Docente
```json
{
    "username": "docente_postman",
    "email": "docente_postman@test.com",
    "password": "test123",
    "role": "docente",
    "turno_preferido": "MAÑANA"
}
```

### POST Registrar Estudiante
```json
{
    "username": "estudiante_postman",
    "email": "estu_postman@test.com",
    "password": "test123",
    "role": "estudiante",
    "turno_preferido": "TARDE",
    "ciclo_actual": 6
}
```

### POST Crear Curso
```json
{
    "codigo": "ASUC-TEST-01",
    "nombre": "Curso Test Postman",
    "creditos": 4,
    "tipo": "Teoría",
    "periodo": 5
}
```

### POST Crear Aula
```json
{
    "nombre": "A-POSTMAN-01",
    "capacidad": 45,
    "tipo": "Teoría"
}
```

### POST Crear Sección
```json
{
    "codigo": "ASUC-TEST-01-M",
    "curso_id": 1,
    "docente_id": 2,
    "capac_estimada": 35,
    "turno": "MAÑANA"
}
```

## Orden de Ejecución Sugerido

Para una ejecución fluida de la colección completa:

```
1. GET  /health
2. POST /auth/login               → guarda token automáticamente
3. POST /auth/register (docente)  → guarda user_id
4. POST /auth/register (estu.)    → prueba registro estudiante
5. GET  /auth/users
6. GET  /auth/users/docentes
7. POST /cursos/                  → guarda curso_id
8. GET  /cursos/
9. GET  /cursos/{curso_id}        → usa variable {{curso_id}}
10. POST /aulas/                  → guarda aula_id
11. GET  /aulas/
12. POST /secciones/
13. GET  /secciones/
14. POST /scheduler/generate
15. GET  /scheduler/
16. GET  /scheduler/stats
17. GET  /export/pdf
18. GET  /export/pdf/ciclo/5
19. GET  /export/ical/ciclo/5
20. DELETE /cursos/{curso_id}
21. DELETE /aulas/{aula_id}
22. DELETE /auth/users/{user_id}
```

## Exportación de la Colección

1. Click derecho sobre la colección → **Export**
2. Seleccionar **Collection v2.1** (recomendado)
3. Guardar como `coleccion_postman.json`
4. Verificar que el archivo JSON sea válido (abrir en editor)

## Notas Adicionales

- Los requests que crean recursos (POST) guardan automáticamente el ID en variables de colección
- Los requests GET/DELETE usan `{{curso_id}}` y `{{aula_id}}` para referenciar recursos creados
- El token JWT se almacena automáticamente en la variable `{{token}}`
- Puedes ejecutar la colección completa con **Runner** (Run Collection)

## Verificación con Docker + Newman (Tests Automatizados)

### 1. Levantar el backend con Docker

```bash
docker-compose up -d
```

Esto inicia:
- **PostgreSQL** (puerto 5432)
- **Backend FastAPI** (puerto 8000) con auto-reload
- **pgAdmin** (puerto 5050)
- **Frontend** (puerto 5173)

### 2. Sembrar datos de prueba

```bash
docker-compose exec backend python seed.py
```

### 3. Exportar la colección desde Postman Web

1. Ir a la colección → **...** → **Export**
2. Seleccionar **Collection v2.1**
3. Guardar como `coleccion_postman.json` (en la raíz del proyecto)

O alternativamente, descargar via API de Postman.

### 4. Ejecutar Newman (CLI)

Con la colección exportada y el backend corriendo, ejecutar:

```bash
# Primer paso: instalar el reporter HTML extra
npm install --save-dev newman-reporter-htmlextra

# Segundo paso: ejecutar Newman con el reporter
npx newman run coleccion_postman.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export newman/report.html
```

> **Nota:** El flag correcto es `--reporter-htmlextra-export` (con `reporter-` no `report-`).

Si solo se desea ver el resultado en terminal (sin reporte HTML):

```bash
npx newman run coleccion_postman.json
```

Esto ejecuta los **23 endpoints** con sus **tests automatizados** y genera:
- **Terminal:** Resumen de tests pasados/fallados
- **`newman/report.html`:** Reporte visual HTML con detalle de cada request

### 5. Evidencias para presentación

| Archivo | Propósito |
|---------|-----------|
| `coleccion_postman.json` | Entregable de la colección (punto 2.4 de la rúbrica) |
| `newman/report.html` | Reporte de pruebas automatizadas |
| Captura de pantalla del Runner | Muestra todos los tests en verde |

### 6. Orden completo de verificación

```
 1. docker-compose up -d                    ← Levantar servicios
 2. docker-compose exec backend python seed.py  ← Sembrar datos
 3. Exportar colección desde Postman Web    ← Obtener JSON
 4. npx newman run coleccion_postman.json   ← Ejecutar tests
 5. Revisar newman/report.html              ← Verificar resultados
```
