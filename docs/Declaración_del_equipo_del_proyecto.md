Universidad Continental — SGOHA v1.0
**SISTEMA DE GENERACIÓN ÓPTIMA DE HORARIOS ACADÉMICOS**

**5. DECLARACIÓN DEL EQUIPO DEL PROYECTO**

**5.1 Estructura del Equipo Scrum**

|**Rol Scrum**|**Responsabilidades Principales**|**Competencias Requeridas**|
| :- | :- | :- |
|Product Owner (PO)|Jose Anthony Bacilio de la Cruz|Gestión del Product Backlog; priorización de historias de usuario; validación de criterios de aceptación; punto de contacto con Coordinación Académica de la universidad; aprobación de incrementos al final de cada sprint.|
|Scrum Master (SM)|Diego Isaac Oré Gonzales|Facilitación de ceremonias Scrum (Daily, Planning, Review, Retrospective); eliminación de impedimentos; seguimiento de métricas de velocidad del equipo; coaching en prácticas ágiles; reporte de progreso al patrocinador.|
|Desarrollador Backend|Aldo Alexandre Requena Lavi|Diseño e implementación de la API RESTful con FastAPI; integración del motor CP-SAT (OR-Tools); diseño del esquema de base de datos PostgreSQL; migraciones con Alembic; documentación de endpoints con Swagger.|
|Desarrollador Frontend|Luis Alberto Gutierrez Taipe|Implementación de la SPA con React 18 + TypeScript; diseño de componentes con Tailwind CSS; integración con la API REST mediante Axios/Fetch; gestión de estado; implementación del dashboard de horarios.|
|Desarrollador Full-Stack / QA|Todo el equipo|Soporte en desarrollo frontend y backend; implementación de pruebas de integración; validación de los criterios de aceptación de las historias de usuario; gestión del repositorio GitHub (ramas, pull requests, code review).|

**5.2 Normas de Trabajo del Equipo**

**5.2.1 Ceremonias Scrum**

|**Ceremonia**|**Frecuencia / Duración**|**Participantes y Propósito**|
| :- | :- | :- |
|Sprint Planning|Inicio de cada Sprint / 2 horas|Todo el equipo. Selección de items del Product Backlog para el Sprint; estimación en Story Points (Planning Poker); definición del Sprint Goal.|
|Daily Scrum|Diario / 15 minutos|Todo el equipo. Sincronización: ¿Qué hice ayer? ¿Qué haré hoy? ¿Tengo impedimentos?|
|Sprint Review|Final de cada Sprint / 1 hora|Equipo + PO + Stakeholders. Demostración del incremento funcional; recolección de retroalimentación.|
|Sprint Retrospective|Final de cada Sprint / 1 hora|Equipo + SM. Análisis de lo que salió bien, lo que mejorar y acciones concretas para el siguiente sprint.|
|Backlog Refinement|Mitad de cada Sprint / 1 hora|PO + Equipo Técnico. Refinamiento, estimación y detalle de historias de usuario futuras.|

**5.2.2 Normas de Trabajo Colaborativo**

- Todos los cambios de código deben realizarse en ramas específicas (feature/nombre-funcionalidad, fix/nombre-bug) y fusionarse a main mediante Pull Request con al menos 1 aprobación.
- Los commits deben seguir Conventional Commits: feat:, fix:, docs:, refactor:, test:, chore:.
- Ninguna historia de usuario se considera "Done" sin: código revisado, pruebas pasando, criterios de aceptación validados y documentación actualizada.
- Las reuniones Daily se realizan de manera asíncrona en el canal de comunicación acordado si algún miembro no puede asistir, publicando su actualización por escrito.
- Los impedimentos reportados en el Daily deben ser atendidos por el Scrum Master en un máximo de 24 horas.
- El Product Backlog debe mantenerse actualizado en la herramienta de gestión acordada (GitHub Projects / Jira) con estimaciones visibles para todo el equipo.

**5.2.3 Definition of Done (DoD)**

Una historia de usuario se considera completada (Done) cuando cumple TODOS los siguientes criterios:

1. El código fue escrito y cumple con los estándares de estilo del proyecto (ESLint para TS, Black/Flake8 para Python).
1. Se realizó code review por al menos un miembro diferente al autor y fue aprobado.
1. Las pruebas unitarias relacionadas pasan exitosamente en el pipeline de CI.
1. Los criterios de aceptación definidos en la historia de usuario fueron validados por el PO.
1. La documentación relevante (README, Swagger, comentarios en código) fue actualizada.
1. El incremento fue desplegado exitosamente en el entorno de staging (Docker Compose).

**5.3 Matriz de Responsabilidades RACI**

| **Actividad** | **PO** | **SM** | **Dev BE** | **Dev FE** | **Dev FS/QA** |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Priorizar Product Backlog | **R** | I | C | C | C |
| Diseñar arquitectura del sistema | I | I | **R** | C | A |
| Desarrollar API REST + CP-SAT | I | I | **R** | I | C |
| Desarrollar Frontend SPA | I | I | C | **R** | A |
| Gestionar repositorio GitHub | I | I | C | C | **R** |
| Validar criterios de aceptación | **R** | I | C | C | C |
| Facilitar ceremonias Scrum | I | **R** | I | I | I |
| Ejecutar pruebas de integración | I | I | C | C | **R** |

> **Leyenda:** R = Responsable (ejecuta), A = Aprueba, C = Consultado, I = Informado


**6. REPOSITORIO GITHUB — ESTRUCTURA Y OPERATIVIDAD**

**6.1 Información del Repositorio**

|**Campo**|**Detalle**|
| :- | :- |
|URL del Repositorio|https://github.com/DiegoOreGonzales/TallerDeProyecto2.git|
|Visibilidad|Privado (acceso compartido verificado entre todos los miembros del equipo)|
|Rama principal|main (rama de producción estable, protegida)|
|Rama de desarrollo|develop (integración continua de features)|
|Convención de ramas|feature/HU-X.X-nombre, fix/descripcion, hotfix/descripcion|
|Herramienta de gestión ágil|GitHub Projects — Tablero Kanban con columnas: Backlog / In Progress / Review / Done|

**6.3 Política de Commits**

Todos los commits deben seguir el estándar Conventional Commits para garantizar un historial legible y facilitar la generación automática de changelogs.

|**Tipo de Commit**|**Uso**|
| :- | :- |
|feat: descripcion|Nueva funcionalidad o historia de usuario completada|
|fix: descripcion|Corrección de bug o defecto|
|docs: descripcion|Cambios en documentación únicamente|
|refactor: descripcion|Reestructuración de código sin cambio de funcionalidad|
|test: descripcion|Adición o corrección de pruebas|
|chore: descripcion|Tareas de mantenimiento, configuración, dependencias|

**6.4 Commits Iniciales Documentados (≥5)**

|**Hash / Rama**|**Commit Message**|**Descripción**|
| :- | :- | :- |
|history/main / ac9af7f|chore: initial repository setup|Estructura de directorios inicial, .gitignore, README.md con descripción del proyecto y badges de tecnologías.|
|history/develop / a80fab0|feat: docker-compose base configuration|docker-compose.yml con servicios frontend, backend y PostgreSQL. Variables de entorno en .env.example.|
|history/feature/HU-1.1 / 9331150|feat: backend cursos CRUD endpoints|Implementación completa del router /cursos con GET, POST, PUT, DELETE. Modelo SQLAlchemy + schema Pydantic + migración Alembic.|
|history/feature/HU-1.2 / 939d349|feat: backend aulas CRUD endpoints|Implementación del router /aulas. Campos: identificacion, capacidad, tipo (LAB/TEO). Validaciones de capacidad mínima.|
|history/feature/HU-2.1-2.2 / daa52fc|feat: CP-SAT optimizer core module|Implementación del módulo scheduler.py con modelo CP-SAT. Variables booleanas (seccion, aula, dia, hora). Restricciones de no-superposición y capacidad.|
|history/feature/frontend-auth / 3a05ca5|feat: React login page with role selection|Pantalla de login con identidad de UC. Selector de rol (admin/estudiante). Integración con endpoint /auth/login del backend.|
|history/develop / 6d9681b|test: integration tests for optimizer endpoint|Tests de integración para /optimizar con pytest. Casos: dataset válido, dataset con infactibilidad, dataset vacío.|
