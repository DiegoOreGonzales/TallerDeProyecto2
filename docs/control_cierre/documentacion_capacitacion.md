# Documentación de Capacitación y Operación (Training & Ops Manual)

Este documento sirve como guía de transferencia de conocimiento para el equipo de operaciones, administradores de TI e ingenieros de mantenimiento encargados del despliegue, monitoreo y soporte a largo plazo del sistema **SGOHA (Sistema de Gestión y Optimización de Horarios Académicos)**.

---

## 🏗️ 1. Arquitectura Lógica de la Solución

La plataforma **SGOHA** adopta una arquitectura de microservicios contenerizados y desacoplados que interactúan de la siguiente manera:

```mermaid
graph TD
    User(["Usuario / Admin"]) -->|Accede a la UI (Puerto 5173)| Frontend["Frontend: React + Vite"]
    Frontend -->|Consume endpoints REST (Puerto 8000)| Backend["Backend: FastAPI"]
    Backend -->|Invoca| Engine["Motor de Optimización: CP-SAT Google OR-Tools"]
    Backend -->|Persiste / Consulta (Puerto 5432)| DB[("Base de Datos: PostgreSQL 15")]
    PGAdmin["pgAdmin 4 (Puerto 5050)"] -.->|Administración Visual| DB
```

### Componentes y Tecnologías Clave:
1.  **Frontend (UI)**: React 18, TypeScript, Vite y Tailwind CSS. Implementa un diseño premium y adaptativo con soporte para accesibilidad web (normas WCAG 2.1).
2.  **Backend (Core API)**: FastAPI (Python 3.11). Provee endpoints para la gestión de entidades, configuración de restricciones y exportación de datos.
3.  **Motor de Optimización**: resolvedor **CP-SAT** integrado dentro de Google OR-Tools. Modela restricciones matemáticas duras y blandas para generar la malla horaria ideal en segundos.
4.  **Base de Datos**: PostgreSQL 15. Almacena las entidades académicas (cursos, aulas, secciones, usuarios) y la configuración del motor.

---

## 🛠️ 2. Guía de Instalación y Despliegue de Entornos

El sistema está completamente contenerizado mediante **Docker** y **Docker Compose**, lo que garantiza un despliegue idéntico y reproducible tanto en desarrollo local como en producción.

### 2.1 Prerrequisitos del Sistema:
*   **Docker Engine** versión 24.0.0 o superior.
*   **Docker Compose V2** instalado y configurado en el PATH del sistema operativo.
*   Mínimo de **4 GB de RAM** disponibles para la compilación y ejecución de contenedores.

### 2.2 Pasos Detallados para el Despliegue:

1.  **Clonar el repositorio de la plataforma:**
    ```bash
    git clone https://github.com/DiegoOreGonzales/TallerDeProyecto2.git
    cd TallerDeProyecto2
    ```

2.  **Verificar el archivo de orquestación:**
    Asegúrese de que el archivo `docker-compose.yml` contenga las definiciones correctas de puertos y variables de entorno para los servicios `db`, `pgadmin`, `backend` y `frontend`.

3.  **Construir y levantar los servicios:**
    Ejecute el siguiente comando para compilar las imágenes locales e iniciar la red de contenedores en segundo plano:
    ```bash
    docker-compose up -d --build
    ```
    *Este paso descargará las imágenes base (Alpine, Postgres, pgAdmin), instalará dependencias de Node.js y Python, y levantará la infraestructura.*

4.  **Verificar el estado de los servicios:**
    Confirme que los 4 contenedores estén en estado *Up (Healthy)*:
    ```bash
    docker-compose ps
    ```
    Los servicios se mapearán localmente en las siguientes direcciones:
    *   **Frontend UI**: `http://localhost:5173`
    *   **Backend API**: `http://localhost:8000` (Documentación interactiva Swagger en `/docs`)
    *   **pgAdmin 4**: `http://localhost:5050` (Credenciales por defecto: `admin@ucontinental.edu.pe` / `admin123`)
    *   **PostgreSQL**: Mapeado al puerto `5432` de la máquina anfitriona.

5.  **Ejecutar semillas de inicialización (Database Seeder):**
    Para precargar el plan de estudios completo de Ingeniería de Sistemas (ciclos 1 al 10), 15 aulas físicas y la configuración por defecto del solucionador, ejecute:
    ```bash
    docker-compose exec backend python seed.py
    ```

### 2.3 Resolución de Problemas Comunes de Despliegue:

*   **Error: Puerto 5173 o 8000 ya está en uso:**
    *   *Solución:* Edite la sección `ports` en `docker-compose.yml` modificando el puerto izquierdo (ejemplo: cambiar `- "5173:5173"` por `- "3000:5173"`).
*   **Problema de Permisos en Volúmenes de PostgreSQL:**
    *   *Síntoma:* El contenedor `scheduling_db` se reinicia continuamente.
    *   *Solución:* Elimine el volumen corrupto ejecutando `docker-compose down -v` y vuelva a iniciar el despliegue.

---

## 💻 3. Manual de Usuario del Administrador (Dashboard UI)

El administrador interactúa con el motor de optimización mediante un panel web moderno.

### 3.1 Flujo Operativo para Generación de Horarios:
1.  **Autenticación**: Ingrese a la UI en `http://localhost:5173/`. Seleccione el rol de **Administrador** (credenciales del seeder: usuario `admin`, contraseña `admin`).
2.  **Configuración del Motor CP-SAT (Panel de Restricciones)**:
    En la parte superior del Dashboard se listan las restricciones activas en la base de datos. Cada restricción posee un interruptor (*switch*) accesible mediante teclado y lectores de pantalla:
    *   **Restricciones Duras (Hard Constraints - Obligatorias)**:
        *   *No colisión de Docentes*: Evita que un docente dicte en dos aulas al mismo tiempo.
        *   *No colisión de Aulas*: Impide que un aula albergue dos secciones concurrentes.
        *   *No colisión de Ciclo/Turno*: Garantiza que cursos del mismo ciclo y turno no se crucen para que los alumnos puedan matricularse sin colisiones.
        *   *Carga Máxima Docente*: Limita la labor docente a un máximo de 30 bloques semanales.
    *   **Preferencias Blandas (Soft Constraints - Optimizables)**:
        *   *Minimizar ventanas libres*: Agrupa las clases de los alumnos de forma compacta.
        *   *Evitar bloques sueltos*: Evita que el alumno asista a la universidad por una sola hora de clase.
        *   *Respetar turnos preferidos*: Prioriza los horarios en base a las preferencias registradas en las secciones y perfiles.
3.  **Generación de la Optimización**:
    Haga clic en el botón naranja **"Generar Nuevo Horario"**. La interfaz deshabilitará controles para evitar ediciones y mostrará un spinner con el mensaje *"Optimizando con CP-SAT..."*. En un periodo promedio de **15 a 30 segundos**, el motor retornará la matriz óptima de asignación.
4.  **Visualización e Inspección**:
    *   **Vista de Grilla**: Muestra la distribución tradicional por días (Lunes a Sábado) y bloques de hora.
    *   **Vista de Agenda (Lista)**: Agrupa el horario secuencialmente por días, ideal para lectura lineal y dispositivos móviles.
    *   **Modal de Detalle**: Al hacer clic en cualquier bloque de clase, se abre un modal con información del curso, docente asignado, tipo de aula (Teoría/Laboratorio) e información detallada de las horas pedagógicas de 40 minutos con sus respectivos recesos de 10 minutos.
5.  **Exportación y Descargas**:
    Utilice los botones del panel para exportar el resultado final:
    *   **PDF Completo**: Descarga el reporte imprimible de la malla completa.
    *   **Exportar Calendario (iCal)**: Descarga el archivo de integración para importar directamente en Google Calendar, Outlook o Apple Calendar.

### 3.2 Manual de Usuario para Estudiantes y Docentes

A diferencia del administrador, los estudiantes y docentes acceden a vistas adaptadas que garantizan la confidencialidad y la usabilidad según sus perfiles:

*   **Flujo del Estudiante**:
    1.  **Inicio de Sesión**: Ingrese a la UI en `http://localhost:5173/`. Seleccione el rol de **Estudiante** y elija su ciclo académico (ej. `Periodo 8` para alumnos de 8vo ciclo) y su turno preferido (`MAÑANA`, `TARDE` o `COMPLETO`). Las credenciales de prueba del seeder son: usuario `estudiante_c8`, contraseña `ucontinental`.
    2.  **Visualización Adaptada**: El Dashboard del estudiante ocultará de forma inteligente las opciones de configuración de restricciones del motor CP-SAT y el botón de optimización.
    3.  **Filtrado Inteligente de Turno (De-duplicación)**: Si el estudiante seleccionó el turno `COMPLETO`, el frontend de React aplica de forma automática un algoritmo de de-duplicación. Si una asignatura se ofrece en la mañana y tarde, la UI priorizará mostrar la sección de la mañana (`MAÑANA`), evitando la sobrecarga de bloques duplicados en el calendario visual.
    4.  **Descarga Personalizada**: El estudiante tendrá habilitado el botón para descargar únicamente el **PDF de su Ciclo** y exportar su calendario personalizado a Google Calendar usando el formato estándar **iCal**.
*   **Flujo del Docente**:
    1.  **Inicio de Sesión**: Ingrese a la UI. Seleccione el rol de **Docente** (credenciales: usuario `docente_demo`, contraseña `docente`).
    2.  **Visualización de Carga Académica**: El docente puede inspeccionar en la grilla los días y bloques asignados a sus clases semanales, el aula (Teoría o Laboratorio) correspondiente y el nombre del curso, asegurando que no existan ventanas libres excesivas.

---

## ⚙️ 4. Manual de Mantenimiento y Operaciones (TI)

Para asegurar la disponibilidad y salud de los entornos de base de datos y backend, el equipo de TI debe ejecutar tareas de monitoreo y soporte rutinario.

### 4.1 Monitoreo de logs en Tiempo Real:
Para depurar peticiones HTTP, errores de base de datos o excepciones del resolvedor CP-SAT:
```bash
# Logs consolidados de todos los servicios
docker-compose logs -f

# Logs específicos del backend FastAPI
docker-compose logs -f backend

# Logs del motor PostgreSQL
docker-compose logs -f db
```

### 4.2 Gestión de Respaldos de Datos (Backups):
El esquema relacional almacena el catálogo de asignaturas y secciones generadas. Se debe programar un cron semanal para respaldar el volumen de Postgres utilizando la herramienta `pg_dump` integrada en la imagen:

*   **Generar una Copia de Seguridad:**
    ```bash
    docker-compose exec db pg_dump -U admin scheduling_system > backup_horarios.sql
    ```
    *Este comando genera un archivo SQL plano con todas las tablas, restricciones y datos en el directorio actual.*

*   **Restaurar una Copia de Seguridad:**
    Para recuperar la base de datos a partir de un archivo SQL guardado (advertencia: esto sobrescribirá los datos actuales):
    ```bash
    docker-compose exec -T db psql -U admin scheduling_system < backup_horarios.sql
    ```

### 4.3 Reinicio Total y Limpieza del Entorno:
Si requiere reinstalar el sistema con una versión de base de datos limpia o aplicar nuevas migraciones SQLAlchemy:
```bash
# Apagar contenedores y destruir volúmenes de datos físicos persistidos
docker-compose down -v

# Volver a levantar el entorno recreando contenedores
docker-compose up -d --build

# Volver a inyectar las semillas académicas
docker-compose exec backend python seed.py
```

