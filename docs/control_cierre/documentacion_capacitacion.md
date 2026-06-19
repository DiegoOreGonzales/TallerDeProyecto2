# Documentación de Capacitación y Operación (Training & Ops Manual)

Este documento sirve como guía de transferencia de conocimiento para el equipo de operaciones, administradores de TI e ingenieros de mantenimiento encargados del despliegue, monitoreo y operación a largo plazo del sistema **SGOHA**.

---

## 🛠️ 1. Guía de Instalación y Despliegue de Entornos

El sistema está completamente contenerizado mediante Docker, garantizando un despliegue reproducible en un solo paso:

### Prerrequisitos:
*   Docker Desktop (versión 24.0.0 o superior).
*   Docker Compose V2 instalado en PATH.

### Pasos de Despliegue:
1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/DiegoOreGonzales/TallerDeProyecto2.git
    cd TallerDeProyecto2
    ```
2.  **Iniciar los servicios en segundo plano:**
    ```bash
    docker-compose up -d --build
    ```
    *Este comando compila las imágenes del Backend (FastAPI), Frontend (React/Vite) y levanta la Base de Datos PostgreSQL, mapeando los puertos 8000 (API) y 3000 (UI).*
3.  **Ejecutar semillas de base de datos (Seeder de Restricciones):**
    ```bash
    docker-compose exec backend python app/seed.py
    ```

---

## 💻 2. Manual de Usuario Final (Administrador)

El administrador de la universidad controla la generación de horarios desde el Dashboard principal de la UI:

### Flujo de Generación de Horarios:
1.  **Inicio de Sesión:** Ingrese a `http://localhost:3000/`. Seleccione el rol `admin` y provea las credenciales autorizadas.
2.  **Configurar Restricciones:** En el Dashboard, active o desactive los interruptores deslizantes (switches accesibles) según las necesidades operativas de la semana:
    *   *Ejemplo:* "Evitar colisiones de aula", "Minimizar ventanas libres docentes".
3.  **Accionar el resolvedor:** Haga clic en el botón naranja **"Generar Optimización"**.
    *   El motor CP-SAT procesará las restricciones duras y blandas, mostrando un indicador de progreso (spinner). El proceso finalizará en un tiempo inferior a **30 segundos**.
4.  **Descargar Horarios:** Una vez finalizada la optimización, se habilitarán los botones para exportar las grillas de horarios académicas en formato **PDF** e **iCal** por ciclos, aulas o docentes.

---

## ⚙️ 3. Manual de Mantenimiento y Operaciones (TI)

Para asegurar la sostenibilidad de la aplicación, el equipo de TI debe tener en cuenta los siguientes comandos de soporte:

### A. Monitoreo de Logs:
*   **Logs del Backend FastAPI:**
    ```bash
    docker-compose logs -f backend
    ```
*   **Logs de PostgreSQL:**
    ```bash
    docker-compose logs -f db
    ```

### B. Copias de Respaldo de Base de Datos (Backups):
Para realizar un respaldo físico de los datos referenciales de cursos, aulas y secciones:
```bash
docker-compose exec db pg_dump -U postgres local_scheduler > backup_horarios.sql
```

### C. Restauración de Datos:
```bash
docker-compose exec -T db psql -U postgres local_scheduler < backup_horarios.sql
```
