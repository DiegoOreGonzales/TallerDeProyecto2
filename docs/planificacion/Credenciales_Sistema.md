# SGOHA: Matriz de Credenciales del Sistema

Este documento centraliza los accesos necesarios para la administración, desarrollo y uso del Sistema de Generación Óptima de Horarios Académicos (SGOHA).

---

## 🔐 1. Accesos de Aplicación (Roles de Usuario)
Acceso vía: [http://localhost:5173](http://localhost:5173)

| Rol | Usuario | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `admin` | Acceso total, generación de horarios. |
| **Estudiante** | `estudiante` | `ucontinental` | Consulta de horarios (Solo lectura). |
| **Docente** | `juan_perez` | `docente` | Visualización de carga académica. |

---

## 💾 2. Base de Datos (PostgreSQL)
Acceso interno (Docker) o externo (Client):

- **Host:** `localhost` (puerto `5432`) o `db` (interno)
- **Base de Datos:** `scheduling_system`
- **Usuario:** `admin`
- **Contraseña:** `admin123`

---

## 🛠️ 3. Administración de Datos (pgAdmin 4)
Interfaz web para gestión de PostgreSQL:

- **Acceso:** [http://localhost:5050](http://localhost:5050)
- **Email:** `admin@ucontinental.edu.pe`
- **Contraseña:** `admin123`

---

## ⚡ 4. Endpoints de API (FastAPI)
- **Documentación Swagger:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Endpoint Optimización:** `POST /api/scheduler/generate`

> [!CAUTION]
> Estas credenciales son para entornos de **Desarrollo/Prueba**. Para entornos de producción, se recomienda encarecidamente cambiar todas las contraseñas por defecto y utilizar variables de entorno cifradas (.env).
