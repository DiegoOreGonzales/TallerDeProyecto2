# Backlog y Plan Técnico: Sistema de Generación Óptima de Horarios Académicos

Este documento sirve como la guía maestra para el desarrollo del PMV del sistema de horarios para la Universidad Continental. Está diseñado para ser trasladado directamente a Jira y GitHub.

---

## 1. Stack Tecnológico (Escalable y Profesional)

Para cumplir con los requisitos de eficiencia energética, seguridad y optimización CSP, se recomienda el siguiente stack:

| Capa | Tecnología | Justificación |
| :--- | :--- | :--- |
| **Contenedores** | **Docker** | Asegura que los 4 desarrolladores trabajen en entornos idénticos, evitando el "en mi máquina funciona". |
| **Frontend** | **React + Vite + TypeScript** | SPA moderna con alto rendimiento. TypeScript es vital para manejar las interfaces complejas de los horarios sin errores de tipos. |
| **Estilos** | **Tailwind CSS + shadcn/ui** | Permite implementar la paleta de colores institucional con precisión y componentes premium accesibles (WCAG). |
| **Backend** | **Python + FastAPI** | FastAPI es de alto rendimiento y asíncrono. Python es el lenguaje líder para bibliotecas de optimización y CSP. |
| **Base de Datos** | **PostgreSQL** | Relacional, robusta y con excelente soporte para consultas complejas de disponibilidad y restricciones. |
| **Motor CSP** | **Google OR-Tools (CP-SAT)** | El estándar de la industria para problemas de programación y ruteo. Extremadamente eficiente para el enfoque híbrido propuesto. |

---

## 2. Backlog Detallado (Épicas e Historias de Usuario)

### Épica 1: Gestión de Datos Maestros (Administración)
*Objetivo: Centralizar la información base para la generación de horarios.*

- **HU-01: Registro de Infraestructura (Aulas):** Como Administrador, quiero registrar aulas con su capacidad y tipo (laboratorio/teoría) para asegurar que los cursos se asignen a espacios adecuados.
    - *Criterio 1:* Validar que la capacidad sea un número positivo.
    - *Criterio 2:* Permitir edición y eliminación de aulas sin horarios asignados.
- **HU-02: Gestión de Carga Académica (Cursos):** Como Coordinador, quiero subir la lista de cursos con sus prerrequisitos y créditos para alimentar el motor de validación.
    - *Criterio 1:* Soporte para carga masiva vía CSV/Excel (Formato estándar).
    - *Criterio 2:* Visualización de la malla curricular básica.

### Épica 2: Proceso de Matrícula y Restricciones
*Objetivo: Capturar la demanda y las limitaciones de los actores.*

- **HU-03: Disponibilidad Docente:** Como Docente, quiero marcar mis bloques horarios de disponibilidad para que el sistema no me asigne clases en horarios personales.
    - *Criterio 1:* Interfaz de calendario intuitiva (clic y arrastrar).
    - *Criterio 2:* Persistencia de disponibilidad por semestre.
- **HU-04: Validación de Créditos:** Como Estudiante, quiero que el sistema me impida matricularme en más de 22 créditos para cumplir con el reglamento universitario.
    - *Criterio 1:* Alerta visual instantánea al exceder el límite.

### Épica 3: Motor de Generación de Horarios (Core)
*Objetivo: Ejecutar el algoritmo CSP para generar soluciones válidas.*

- **HU-05: Generación Base Automática:** Como Coordinador, quiero ejecutar el motor CSP para obtener una propuesta de horario que no tenga solapamientos ni infrinja prerrequisitos.
    - *Criterio 1:* Tiempo de ejecución menor a 2 segundos para un set de 50 cursos.
    - *Criterio 2:* Reporte de restricciones "blandas" no cumplidas (ej. preferencias de turno).
- **HU-06: Ajuste Manual (Híbrido):** Como Coordinador, quiero mover un bloque de horario manualmente y recibir feedback instantáneo si causo un conflicto.
    - *Criterio 1:* Uso de `Drag & Drop`.
    - *Criterio 2:* Colorear en Coral Alerta (`#E76F51`) las celdas en conflicto.

### Épica 4: Visualización y Exportación
*Objetivo: Publicar y consumir los horarios.*

- **HU-07: Vista de Horario Individual:** Como Estudiante, quiero ver mi horario semanal con colores semánticos para identificar rápidamente mis clases.
    - *Criterio 1:* Usar la paleta semántica (Azul Celeste para cursos).
    - *Criterio 2:* Responsividad para vista móvil.
- **HU-08: Exportación a PDF:** Como Usuario, quiero descargar mi horario en PDF para tenerlo disponible offline.

### Épica 5: Seguridad y Perfiles
- **HU-10: Autenticación por Roles:** Como Usuario, quiero iniciar sesión para acceder a las funcionalidades correspondientes a mi rol (Admin, Docente, Estudiante).

---

## 3. Definición de Roles en Jira (Equipo de 4)

| Rol Jira | Responsable Sugerido | Responsabilidades Primordiales |
| :--- | :--- | :--- |
| **Product Owner** | Integrante 1 | Prioriza el Backlog, valida Criterios de Aceptación y despeja dudas funcionales. |
| **Scrum Master** | Integrante 2 | Facilita las ceremonias, elimina bloqueos técnicos y asegura el flujo en el tablero Jira. |
| **Desarrollador Backend / CSP** | Integrante 3 | Se enfoca en el Motor de Generación (Épica 3) y la API REST técnica. |
| **Desarrollador Frontend / UI** | Integrante 4 | Implementa el diseño con Tailwind y la lógica de validación visual en React. |

---

## 4. Estructura de Historia en Jira (Ejemplo Real)

**Nombre:** HU-06: Ajuste Manual de Bloques Horarios (Drag & Drop)
**Descripción:** Como Coordinador Académico, quiero poder arrastrar y soltar clases en la cuadrícula de horarios para realizar ajustes finos basados en criterios humanos que el algoritmo no capturó.
**Criterios de Aceptación:**
- El sistema debe validar en tiempo real si el nuevo slot tiene conflicto de aula o docente.
- Si hay conflicto, el bloque debe retornar a su posición original o mostrarse en rojo.
- Los cambios deben guardarse automáticamente en la base de datos tras la confirmación.
**Estimación de Esfuerzo:** 8 Story Points (Complejidad Alta por lógica de validación).
**Tareas Técnicas:**
1. Instalar y configurar `dnd-kit` o `react-beautiful-dnd` en el frontend.
2. Crear endpoint `PATCH /api/schedules/{id}` para actualizar el horario.
3. Implementar lógica de "Detección de Colisiones" en el motor Python.

---

## 5. Configuración Inicial del Repositorio

### Estructura de Carpetas Recomendada:
```bash
/
├── .github/              # Workflows de CI/CD
├── docs/                 # Documentación del proyecto (PDFs, Planificación)
│   └── planificacion/    # Backlog-y-Plan-Tecnico.md
├── src/
│   ├── frontend/         # App React (Vite)
│   │   ├── src/components/ui/
│   │   └── src/styles/   # Variables CSS de la paleta Continental
│   └── backend/          # API FastAPI y Motor CSP
│       ├── app/api/      # Endpoints
│       ├── app/core/     # Lógica del Algoritmo CP-SAT
│       └── tests/        # Pruebas unitarias
├── docker/               # Dockerfiles para dev y prod
├── docker-compose.yml    # Orquestación (Frontend, Backend, DB)
└── README.md             # Instrucciones de ejecución
```

### Archivo `.gitignore`:
```text
# Node.js
**/node_modules/
dist/
.env

# Python
**/__pycache__/
**.pyc
.venv/
env/

# Docker & OS
.DS_Store
*.log
```

---

## 6. Respuestas para Despejar Ambigüedades

1.  **Profundidad del Algoritmo:** Para el PMV v1.0.0, implementaremos el enfoque **Híbrido**. El motor genera una base 100% válida cumpliendo restricciones duras (aulas, créditos, prerrequisitos), y el coordinador puede hacer ajustes manuales con validación en tiempo real.
2.  **Datos de Prueba:** El equipo generará un set de datos sintético basado en el currículo de Ingeniería de Sistemas de la UC. Escala: 30 cursos, 15 docentes, 10 aulas, 100 estudiantes.
3.  **Autenticación:** Implementaremos un sistema JWT simple en el Sprint 1. Es crítico para definir quién puede "mover" horarios o simplemente "verlos".
4.  **Despliegue:** Usaremos **Docker Compose** para la ejecución local garantizada. Para la entrega final, ofreceremos instrucciones para desplegar en la nube (Render para Backend/DB y Vercel para Frontend).
