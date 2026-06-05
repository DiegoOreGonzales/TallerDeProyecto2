# 🐚 Guía de Pruebas: cURL — Comandos para la API de SGOHA

## Objetivo

Proporcionar comandos `cURL` funcionales para probar cada endpoint de la API REST de SGOHA, documentados con título, descripción y respuesta esperada.

## Requisitos

- Backend ejecutándose en `http://localhost:8000`
- O usar JSON Server mock en `http://localhost:3001`

## Convenciones

- `{{base_url}}` = `http://localhost:8000/api` (FastAPI real) o `http://localhost:3001` (JSON Server mock)
- `{{token}}` = Token JWT obtenido del login
- Los comandos usan `-s` (silent) para omitir el progreso de curl
- Se usa `| jq` opcionalmente para formatear JSON (instalar con `apt install jq` o `brew install jq`)

---

## 🏠 Sistema

### 1. Health Check

**Descripción:** Verifica que el servidor backend esté operativo. Devuelve un estado "healthy" si todo funciona correctamente. Es el primer comando que debe ejecutarse para confirmar conectividad.

**Comando:**
```bash
curl -s http://localhost:8000/health | jq
```

**Respuesta esperada:**
```json
{
  "status": "healthy"
}
```

### 2. Root - Bienvenida

**Descripción:** Obtiene el mensaje de bienvenida de la API de SGOHA. Útil para verificar que el servidor FastAPI está respondiendo en su ruta raíz.

**Comando:**
```bash
curl -s http://localhost:8000/ | jq
```

**Respuesta esperada:**
```json
{
  "message": "Bienvenido al Sistema de Generación Óptima de Horarios"
}
```

---

## 🔐 Autenticación

### 3. POST Login

**Descripción:** Inicia sesión con credenciales de administrador y obtiene un token JWT. Este token debe usarse en los headers de autorización para acceder a los endpoints protegidos. La respuesta incluye el token, el rol y el nombre del usuario.

**Comando:**
```bash
curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}' | jq
```

**Respuesta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user_role": "admin",
  "user_name": "admin",
  "user_cycle": null,
  "user_shift": "COMPLETO"
}
```

### 4. POST Registrar Docente

**Descripción:** Registra un nuevo usuario con rol de docente. Requiere username, email, contraseña y turno preferido. No devuelve la contraseña por seguridad. El docente queda disponible para asignación de secciones.

**Comando:**
```bash
curl -s -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "docente_test",
    "email": "docente_test@ucontinental.edu.pe",
    "password": "segura123",
    "role": "docente",
    "turno_preferido": "MAÑANA"
  }' | jq
```

**Respuesta esperada:**
```json
{
  "id": 28,
  "username": "docente_test",
  "email": "docente_test@ucontinental.edu.pe",
  "role": "docente",
  "turno_preferido": "MAÑANA",
  "ciclo": null,
  "is_active": true
}
```

### 5. POST Registrar Estudiante

**Descripción:** Registra un estudiante con ciclo académico y turno. El ciclo debe estar entre 1 y 10. Si el ciclo es inválido, la API devuelve un error 400. Los estudiantes pueden ver su horario filtrado por ciclo.

**Comando:**
```bash
curl -s -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "estudiante_test",
    "email": "estu_test@ucontinental.edu.pe",
    "password": "segura123",
    "role": "estudiante",
    "turno_preferido": "TARDE",
    "ciclo_actual": 5
  }' | jq
```

**Respuesta esperada:**
```json
{
  "id": 29,
  "username": "estudiante_test",
  "email": "estu_test@ucontinental.edu.pe",
  "role": "estudiante",
  "turno_preferido": "TARDE",
  "ciclo": 5,
  "is_active": true
}
```

### 6. GET Listar Usuarios

**Descripción:** Obtiene la lista completa de todos los usuarios registrados en el sistema (admin, docentes, estudiantes). Cada usuario incluye sus datos básicos pero no la contraseña. Útil para verificación administrativa.

**Comando:**
```bash
curl -s http://localhost:8000/api/auth/users | jq
```

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@ucontinental.edu.pe",
    "role": "admin",
    "turno_preferido": "COMPLETO",
    "ciclo": null,
    "is_active": true
  },
  {
    "id": 2,
    "username": "docente_demo",
    "email": "docente@ucontinental.edu.pe",
    "role": "docente",
    "turno_preferido": "COMPLETO",
    "ciclo": null,
    "is_active": true
  }
]
```

### 7. GET Listar Docentes

**Descripción:** Filtra la lista de usuarios para mostrar únicamente aquellos con rol "docente". Es útil para asignar docentes a secciones en el frontend sin tener que filtrar manualmente.

**Comando:**
```bash
curl -s http://localhost:8000/api/auth/users/docentes | jq
```

**Respuesta esperada:**
```json
[
  {
    "id": 2,
    "username": "docente_demo",
    "email": "docente@ucontinental.edu.pe",
    "role": "docente",
    "turno_preferido": "COMPLETO",
    "is_active": true
  }
]
```

### 8. DELETE Eliminar Usuario

**Descripción:** Elimina un usuario del sistema por su ID. No se puede eliminar al administrador (role=admin). Si el usuario no existe, devuelve error 404. Es útil para limpieza de datos de prueba.

**Comando:**
```bash
curl -s -X DELETE http://localhost:8000/api/auth/users/28 | jq
```

**Respuesta esperada:**
```json
{
  "message": "Usuario eliminado"
}
```

---

## 📚 Cursos

### 9. POST Crear Curso

**Descripción:** Registra un nuevo curso en el sistema con código único, nombre, créditos, tipo (Teoría/Laboratorio) y periodo académico. Si el código ya existe, devuelve error 400. Es el paso previo para crear secciones.

**Comando:**
```bash
curl -s -X POST http://localhost:8000/api/cursos/ \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "ASUC99999",
    "nombre": "Curso de Prueba API",
    "creditos": 3,
    "tipo": "Teoría",
    "periodo": 5
  }' | jq
```

**Respuesta esperada:**
```json
{
  "id": 71,
  "codigo": "ASUC99999",
  "nombre": "Curso de Prueba API",
  "creditos": 3,
  "tipo": "Teoría",
  "periodo": 5
}
```

### 10. GET Listar Cursos

**Descripción:** Obtiene el catálogo completo de cursos ordenados por periodo y código. Incluye todos los cursos de la malla curricular de Ingeniería de Sistemas e Informática con sus créditos y tipo.

**Comando:**
```bash
curl -s http://localhost:8000/api/cursos/ | jq
```

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "codigo": "ASUC01113",
    "nombre": "MATEMÁTICA SUPERIOR",
    "creditos": 5,
    "tipo": "Teoría",
    "periodo": 1
  }
]
```

### 11. GET Obtener Curso por ID

**Descripción:** Obtiene los detalles de un curso específico usando su ID numérico. Si el ID no existe, devuelve error 404. Permite consultar información detallada de un curso particular.

**Comando:**
```bash
curl -s http://localhost:8000/api/cursos/1 | jq
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "codigo": "ASUC01113",
  "nombre": "MATEMÁTICA SUPERIOR",
  "creditos": 5,
  "tipo": "Teoría",
  "periodo": 1
}
```

### 12. DELETE Eliminar Curso

**Descripción:** Elimina un curso del sistema por su ID. Si el curso tiene secciones asociadas, la eliminación puede fallar por restricciones de integridad referencial. Útil para limpiar cursos de prueba.

**Comando:**
```bash
curl -s -X DELETE http://localhost:8000/api/cursos/71 | jq
```

**Respuesta esperada:**
```json
{
  "message": "Curso eliminado"
}
```

---

## 🏫 Aulas

### 13. POST Crear Aula

**Descripción:** Registra un nuevo espacio físico (aula) con nombre único, capacidad de alumnos y tipo (Teoría, Laboratorio o Taller). El nombre debe ser único. Las aulas de laboratorio solo pueden albergar cursos tipo Laboratorio.

**Comando:**
```bash
curl -s -X POST http://localhost:8000/api/aulas/ \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "A-TEST-01",
    "capacidad": 40,
    "tipo": "Teoría"
  }' | jq
```

**Respuesta esperada:**
```json
{
  "id": 32,
  "nombre": "A-TEST-01",
  "capacidad": 40,
  "tipo": "Teoría"
}
```

### 14. GET Listar Aulas

**Descripción:** Obtiene el listado completo de aulas disponibles en el sistema, incluyendo aulas de teoría, laboratorios y talleres. Cada aula muestra su nombre, capacidad y tipo para facilitar la asignación.

**Comando:**
```bash
curl -s http://localhost:8000/api/aulas/ | jq
```

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "nombre": "A-101",
    "capacidad": 50,
    "tipo": "Teoría"
  }
]
```

### 15. DELETE Eliminar Aula

**Descripción:** Elimina un aula del sistema por su ID. Si el aula tiene horarios asignados, no podrá eliminarse por restricciones de clave foránea. Útil para mantener actualizado el inventario de espacios.

**Comando:**
```bash
curl -s -X DELETE http://localhost:8000/api/aulas/32 | jq
```

**Respuesta esperada:**
```json
{
  "message": "Aula eliminada"
}
```

---

## 📋 Secciones

### 16. POST Crear Sección

**Descripción:** Crea una nueva sección (grupo) asociada a un curso y un docente. Cada sección tiene un código único, capacidad estimada de alumnos y turno (MAÑANA/TARDE/COMPLETO). Es el paso previo a la generación de horarios.

**Comando:**
```bash
curl -s -X POST http://localhost:8000/api/secciones/ \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "ASUC99999-M",
    "curso_id": 1,
    "docente_id": 2,
    "capac_estimada": 35,
    "turno": "MAÑANA"
  }' | jq
```

**Respuesta esperada:**
```json
{
  "id": 123,
  "codigo": "ASUC99999-M",
  "curso_id": 1,
  "docente_id": 2,
  "capac_estimada": 35,
  "turno": "MAÑANA",
  "curso": null,
  "docente": null
}
```

### 17. GET Listar Secciones

**Descripción:** Obtiene todas las secciones registradas en el sistema. Cada sección incluye su código, curso asociado, docente asignado, capacidad estimada y turno. Esencial para la gestión académica.

**Comando:**
```bash
curl -s http://localhost:8000/api/secciones/ | jq
```

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "codigo": "ASUC01113-M",
    "curso_id": 1,
    "docente_id": 2,
    "capac_estimada": 40,
    "turno": "MAÑANA",
    "curso": {
      "id": 1,
      "codigo": "ASUC01113",
      "nombre": "MATEMÁTICA SUPERIOR",
      "creditos": 5,
      "tipo": "Teoría",
      "periodo": 1
    },
    "docente": {
      "id": 2,
      "username": "docente_demo",
      "email": "docente@ucontinental.edu.pe",
      "role": "docente",
      "turno_preferido": "COMPLETO",
      "ciclo": null,
      "is_active": true
    }
  }
]
```

### 18. DELETE Eliminar Sección

**Descripción:** Elimina una sección por su ID. Si la sección tiene horarios asignados en el scheduler, la eliminación puede fallar. Permite limpiar secciones de prueba antes de regenerar horarios.

**Comando:**
```bash
curl -s -X DELETE http://localhost:8000/api/secciones/123 | jq
```

**Respuesta esperada:**
```json
{
  "message": "Sección eliminada"
}
```

---

## ⚡ Scheduler

### 19. POST Generar Horario

**Descripción:** Ejecuta el motor de optimización CP-SAT para generar la asignación de horarios. Primero limpia los horarios previos y luego asigna cada sección a un aula, día y bloque horario, respetando todas las restricciones. Puede tomar varios segundos.

**Comando:**
```bash
curl -s -X POST http://localhost:8000/api/scheduler/generate | jq
```

**Respuesta esperada:**
```json
{
  "message": "Horario generado: 244 bloques asignados",
  "data": [
    {
      "seccion_id": 1,
      "seccion_codigo": "ASUC01113-M",
      "aula_id": 1,
      "dia": 0,
      "dia_nombre": "Lunes",
      "slot": 0,
      "hora_inicio": "07:00",
      "hora_fin": "08:30",
      "nombre_curso": "MATEMÁTICA SUPERIOR",
      "nombre_aula": "A-101",
      "tipo_curso": "Teoría",
      "periodo": 1,
      "creditos": 5,
      "turno_seccion": "MAÑANA",
      "docente_nombre": "docente_demo",
      "codigo_curso": "ASUC01113"
    }
  ]
}
```

### 20. GET Obtener Horarios

**Descripción:** Obtiene todos los bloques de horario generados por el scheduler. Cada bloque incluye información completa: curso, aula, docente, día, hora de inicio y fin, horas pedagógicas y turno. Si no hay horarios, devuelve un arreglo vacío.

**Comando:**
```bash
curl -s http://localhost:8000/api/scheduler/ | jq
```

**Respuesta esperada:**
```json
{
  "data": [
    {
      "seccion_id": 1,
      "seccion_codigo": "ASUC01113-M",
      "aula_id": 1,
      "dia": 0,
      "dia_nombre": "Lunes",
      "slot": 0,
      "hora_inicio": "07:00",
      "hora_fin": "08:30",
      "horas_pedagogicas": [
        {"hp": 1, "inicio": "07:00", "fin": "07:40"},
        {"hp": 2, "inicio": "07:50", "fin": "08:30"}
      ],
      "nombre_curso": "MATEMÁTICA SUPERIOR",
      "nombre_aula": "A-101",
      "tipo_curso": "Teoría",
      "periodo": 1,
      "creditos": 5,
      "turno_seccion": "MAÑANA",
      "docente_nombre": "docente_demo",
      "codigo_curso": "ASUC01113"
    }
  ]
}
```

### 21. GET Obtener KPIs

**Descripción:** Obtiene los indicadores clave de rendimiento (KPIs) del dashboard: cantidad de cursos, aulas, secciones, docentes y bloques de horario generados. Todos los valores son números enteros no negativos. Esencial para monitorear el estado del sistema.

**Comando:**
```bash
curl -s http://localhost:8000/api/scheduler/stats | jq
```

**Respuesta esperada:**
```json
{
  "cursos": 70,
  "aulas": 31,
  "secciones": 140,
  "docentes": 26,
  "horarios_generados": 244
}
```

---

## 📤 Exportación

### 22. GET Exportar PDF Completo

**Descripción:** Genera y descarga un archivo PDF con el horario completo en formato apaisado (landscape A4). Incluye una tabla con todos los bloques asignados organizados por día y hora. El PDF tiene encabezados institucionales de la Universidad Continental.

**Comando:**
```bash
curl -s -o horario_completo.pdf http://localhost:8000/api/export/pdf
```

**Respuesta esperada:** Archivo PDF binario guardado como `horario_completo.pdf`. Los headers incluyen:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename=horario_sgoha.pdf
```

### 23. GET Exportar PDF por Ciclo

**Descripción:** Genera y descarga un PDF filtrado por ciclo académico. Muestra únicamente los horarios de los cursos pertenecientes al ciclo especificado (1-10). Si no hay horarios para ese ciclo, devuelve error 404.

**Comando:**
```bash
curl -s -o horario_ciclo_5.pdf http://localhost:8000/api/export/pdf/ciclo/5
```

**Respuesta esperada:** Archivo PDF binario guardado como `horario_ciclo_5.pdf`. Los headers incluyen:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename=horario_ciclo_5.pdf
```

### 24. GET Exportar Calendario iCal

**Descripción:** Genera y descarga un archivo .ics (formato iCalendar) con los horarios del ciclo especificado. Compatible con Google Calendar, Outlook y Apple Calendar. Cada bloque se convierte en un evento semanal recurrente por 16 semanas.

**Comando:**
```bash
curl -s -o horario_ciclo_5.ics http://localhost:8000/api/export/ical/ciclo/5
```

**Respuesta esperada:** Archivo .ics guardado como `horario_ciclo_5.ics`. Contenido comienza con:
```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SGOHA//Universidad Continental//ES
...
END:VCALENDAR
```

---

## Resumen de Comandos

| # | Método | Endpoint | Descripción |
|---|--------|----------|-------------|
| 1 | GET | `/health` | Health check |
| 2 | GET | `/` | Bienvenida |
| 3 | POST | `/api/auth/login` | Login |
| 4 | POST | `/api/auth/register` | Registrar docente |
| 5 | POST | `/api/auth/register` | Registrar estudiante |
| 6 | GET | `/api/auth/users` | Listar usuarios |
| 7 | GET | `/api/auth/users/docentes` | Listar docentes |
| 8 | DELETE | `/api/auth/users/{id}` | Eliminar usuario |
| 9 | POST | `/api/cursos/` | Crear curso |
| 10 | GET | `/api/cursos/` | Listar cursos |
| 11 | GET | `/api/cursos/{id}` | Obtener curso por ID |
| 12 | DELETE | `/api/cursos/{id}` | Eliminar curso |
| 13 | POST | `/api/aulas/` | Crear aula |
| 14 | GET | `/api/aulas/` | Listar aulas |
| 15 | DELETE | `/api/aulas/{id}` | Eliminar aula |
| 16 | POST | `/api/secciones/` | Crear sección |
| 17 | GET | `/api/secciones/` | Listar secciones |
| 18 | DELETE | `/api/secciones/{id}` | Eliminar sección |
| 19 | POST | `/api/scheduler/generate` | Generar horario |
| 20 | GET | `/api/scheduler/` | Obtener horarios |
| 21 | GET | `/api/scheduler/stats` | Obtener KPIs |
| 22 | GET | `/api/export/pdf` | Exportar PDF completo |
| 23 | GET | `/api/export/pdf/ciclo/{ciclo}` | Exportar PDF por ciclo |
| 24 | GET | `/api/export/ical/ciclo/{ciclo}` | Exportar calendario iCal |
