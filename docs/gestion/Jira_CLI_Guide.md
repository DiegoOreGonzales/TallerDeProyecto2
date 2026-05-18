# Guía de Uso: Jira CLI (ankitpokhrel/jira-cli)

El CLI de Jira (Command Line Interface) es una herramienta de alto nivel que permite interactuar con Jira directamente desde la terminal. En este proyecto, su implementación refuerza la productividad del equipo de ingeniería al automatizar flujos de trabajo sin depender de la interfaz web.

## 🚀 ¿Para qué sirve?

*   **Automatización:** Permite ejecutar comandos de texto para tareas repetitivas como crear, actualizar, clonar o eliminar incidencias (tickets).
*   **Gestión Masiva:** Facilita la realización de ediciones masivas en múltiples elementos de trabajo, superando la eficiencia de la interfaz web.
*   **Transiciones de Estado:** Cambia el estado de los tickets (workflow) instantáneamente desde la terminal (ej. de "To Do" a "In Progress").
*   **Integración Continua:** Permite conectar Jira con scripts de automatización y flujos de CI/CD para actualizar tickets automáticamente al realizar commits o despliegues.

## 🛠️ Funcionalidades Principales

Hemos instalado la versión de **ankitpokhrel/jira-cli** por su interfaz intuitiva y rapidez. Aquí algunos ejemplos de uso:

| Acción | Comando | Descripción |
| :--- | :--- | :--- |
| **Listar** | `jira issue list` | Muestra las incidencias del sprint actual. |
| **Crear** | `jira issue create` | Abre un prompt interactivo para crear un nuevo ticket. |
| **Mover** | `jira issue move` | Cambia el estado de un ticket en el flujo de trabajo. |
| **Comentar** | `jira issue comment` | Añade comentarios rápidos a un ticket específico. |
| **Ver** | `jira issue view` | Muestra el detalle completo de una incidencia. |

## 🌟 Ventajas para el Proyecto SGOHA

1.  **Velocidad:** Los desarrolladores pueden gestionar sus tareas sin salir del entorno de desarrollo.
2.  **Estandarización:** Asegura que los procesos de transición y etiquetado sean consistentes mediante scripts.
3.  **Eficiencia:** Ahorra tiempo crítico durante las reuniones diarias (Dailies) y la planificación de sprints.

---
**Nota:** El binario se encuentra disponible en `./bin/jira.exe`. Requiere configuración inicial mediante un token de API de Atlassian.
