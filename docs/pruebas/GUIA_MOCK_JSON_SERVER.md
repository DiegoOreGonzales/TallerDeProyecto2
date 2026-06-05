# 🎭 Guía de Configuración: Mock API con JSON Server

## Objetivo

Simular una API REST con datos de prueba utilizando **JSON Server**, permitiendo el desarrollo y pruebas del frontend sin depender del backend completo en FastAPI.

## Requisitos

- Node.js ≥ 18 (para ejecutar JSON Server)
- npm o yarn

## Archivo de Datos

**Ubicación:** `mock/db.json`

Contiene 5 entidades relacionadas con datos realistas de la malla curricular de Ingeniería de Sistemas e Informática de la Universidad Continental.

## Entidades Incluidas

| Entidad | Registros | Descripción |
|---------|-----------|-------------|
| `usuarios` | 5 | Admin, docente, 3 estudiantes con ciclos variados |
| `cursos` | 8 | Cursos representativos de distintos periodos y tipos |
| `aulas` | 6 | Aulas de teoría, laboratorio y taller |
| `secciones` | 8 | Secciones mañana/tarde con relaciones a cursos, aulas y docentes |
| `horarios` | 6 | Bloques de horario generados (relaciones completas) |

## Relaciones entre entidades

```
usuarios (id) ──┬── secciones (docente_id)
                └── horarios (no directa, a través de secciones)

cursos (id) ──── secciones (curso_id)

aulas (id) ───── horarios (aula_id)

secciones (id) ── horarios (seccion_id)
```

## Instalación y Ejecución

### 1. Instalar JSON Server globalmente

```bash
npm install -g json-server@0.17.4
```

> **Nota:** Se usa la versión 0.17.4 porque la v1+ cambió la sintaxis. Si usas npm moderno, también funciona con `npx`.

### 2. Iniciar el servidor mock

```bash
# Desde la raíz del proyecto
npx json-server --watch mock/db.json --port 3001
```

### 3. Verificar que funciona

```bash
curl http://localhost:3001/usuarios
curl http://localhost:3001/cursos
curl http://localhost:3001/secciones?_expand=curso&_expand=docente
```

## Endpoints Disponibles

| Método | URL | Descripción |
|--------|-----|-------------|
| `GET` | `http://localhost:3001/usuarios` | Listar usuarios |
| `GET` | `http://localhost:3001/usuarios/1` | Usuario por ID |
| `POST` | `http://localhost:3001/usuarios` | Crear usuario |
| `PUT` | `http://localhost:3001/usuarios/1` | Actualizar usuario |
| `PATCH` | `http://localhost:3001/usuarios/1` | Actualizar parcial |
| `DELETE` | `http://localhost:3001/usuarios/1` | Eliminar usuario |
| `GET` | `http://localhost:3001/cursos` | Listar cursos |
| `GET` | `http://localhost:3001/aulas` | Listar aulas |
| `GET` | `http://localhost:3001/secciones` | Listar secciones |
| `GET` | `http://localhost:3001/horarios` | Listar horarios |

### Filtros y relaciones

```bash
# Filtrar por campo
GET http://localhost:3001/cursos?periodo=5

# Filtrar con operadores
GET http://localhost:3001/cursos?creditos_gte=4

# Incluir relaciones (embed)
GET http://localhost:3001/secciones?_expand=curso&_expand=docente

# Filtrar por relación anidada
GET http://localhost:3001/secciones?curso.periodo=5
```

## Uso con el Frontend

Para que el frontend use el mock en lugar del backend real, cambia las URLs en los componentes de React:

```typescript
// En src/pages/Dashboard.tsx, cambiar:
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';
// En lugar de:
// const API_BASE = 'http://localhost:8000/api';
```

## Estructura del Archivo db.json

```json
{
  "usuarios": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@ucontinental.edu.pe",
      "role": "admin",
      "turno_preferido": "COMPLETO",
      "is_active": true
    }
  ],
  "cursos": [ ... ],
  "aulas": [ ... ],
  "secciones": [ ... ],
  "horarios": [ ... ]
}
```

> **Importante:** El mock NO incluye contraseñas ni hashes. Es solo para pruebas de frontend.
