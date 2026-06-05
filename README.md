# Sistema de Generación Óptima de Horarios Académicos

## 1. Resumen Ejecutivo
El **Sistema de Generación Óptima de Horarios Académicos** es una solución integral diseñada para la Universidad Continental. Su objetivo principal es automatizar y optimizar la creación de horarios de clases, resolviendo conflictos complejos de asignación matemática que involucran a docentes, aulas, recursos y la disponibilidad de los estudiantes.

---

## 2. Arquitectura del Sistema
El proyecto emplea una **Arquitectura Cliente-Servidor Desacoplada** completamente contenerizada.

*   **Capa de Presentación (Frontend):** Aplicación de Página Única (SPA) responsiva y reactiva que interactúa con el backend mediante peticiones HTTP asíncronas.
*   **Capa de Lógica de Negocio (Backend):** API RESTful que procesa las reglas de negocio, orquesta las operaciones CRUD y ejecuta el motor matemático de optimización.
*   **Capa de Persistencia (Base de Datos):** Base de datos relacional para garantizar la integridad y estructura de los datos académicos.
*   **Infraestructura:** Orquestación basada en contenedores para garantizar entornos reproducibles en desarrollo y producción.

---

## 3. Tecnologías Utilizadas

| Componente | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 5, TypeScript | Framework UI reactivo y empaquetador ultrarrápido para una experiencia de usuario moderna. |
| **Estilos** | Vanilla CSS, Tailwind CSS | Framework de utilidades CSS para un diseño premium, "glassmorphism" e identidad institucional. |
| **Backend** | Python 3.11, FastAPI | Framework web de alto rendimiento asíncrono para la creación de APIs REST. Validación con Pydantic. |
| **Base de Datos** | PostgreSQL, SQLAlchemy | SGDBD relacional robusto; ORM para el mapeo de modelos de datos en Python. |
| **Optimización** | Google OR-Tools (CP-SAT) | Motor de Programación con Restricciones (*Constraint Programming*) optimizado por **Google Antigravity**. |
| **Despliegue** | Docker, Docker Compose | Contenerización de servicios (Imágenes ligeras `bookworm-slim` optimizadas para producción). |

---

## 4. Algoritmo de Optimización Utilizado

El núcleo del sistema utiliza el solucionador **CP-SAT de Google OR-Tools**, aplicando la teoría de **Programación con Restricciones (Constraint Programming - CP)**.

### Modelo Matemático Formal

**Variable de decisión:** `x[s, a, d, h] ∈ {0, 1}` — 1 si la sección `s` se asigna al aula `a` en día `d`, bloque `h`.

**Restricciones Duras (9):**
1.  **HC-1:** Asignación completa — cada sección recibe exactamente `créditos` bloques.
2.  **HC-2:** Aula única — cada sección se dicta en la misma aula toda la semana.
3.  **HC-3:** Máximo 3 bloques por día por sección.
4.  **HC-4:** No-superposición de aulas (1 sección por aula/día/slot).
5.  **HC-5:** No-superposición de docentes.
6.  **HC-6:** Carga máxima docente ≤ 30 bloques/semana.
7.  **HC-7:** No-colisión por período académico y turno.
8.  **HC-8:** Compatibilidad tipo de aula (pre-filtrado).
9.  **HC-9:** Restricción de turno efectivo (pre-filtrado).

**Función Objetivo:** `Minimizar Z = Z1(preferencia slot) + Z2(dispersión) + Z3(huecos)`

> 📄 Documento completo: [optimization_model.md](./docs/especificaciones/optimization_model.md)

### Rendimiento
*   El motor CP busca la viabilidad (*feasibility*) y optimalidad satisfaciendo todas las restricciones en ≤ **30 segundos** para 122 secciones.
*   Las consultas GET responden en ≤ **2 segundos** (RNF-01).

---

## 📁 Índice de Documentación del Proyecto (TOC)

A continuación se presenta el índice unificado de la documentación del proyecto, clasificado por categorías y alineado con las entregas e inspecciones:

| Categoría | Documento | Descripción | Inspección / Hito |
| :--- | :--- | :--- | :---: |
| **Entregable Principal** | [analisis_validacion_problema.md](./docs/analisis_validacion_problema.md) | **Informe de Respuesta Oficial para la Inspección 04 (Validación de RF/RNF, KPIs, GUI y CP-SAT)** | 04 |
| **Especificación** | [optimization_model.md](./docs/especificaciones/optimization_model.md) | Modelo matemático formal: variables, función objetivo, restricciones CSP | 03 / 04 |
| **Especificación** | [Especificacion_SDD_Antigravity.md](./docs/especificaciones/Especificacion_SDD_Antigravity.md) | Documento de Especificación de Diseño de Software (SDD) optimizado | 04 |
| **Especificación** | [Especificacion_SDD.md](./docs/especificaciones/Especificacion_SDD.md) | Especificación de Diseño de Software (SDD) preliminar | 03 |
| **Especificación** | [constitution.md](./docs/especificaciones/constitution.md) | Principios generales del sistema, contratos y reglas de desarrollo | 03 |
| **Especificación** | [specs.md](./docs/especificaciones/specs.md) | Especificación funcional formal: Entradas, salidas, reglas y casos borde | 03 |
| **Arquitectura** | [arc42_rnf.md](./docs/arquitectura/arc42_rnf.md) | Especificación de Requisitos No Funcionales utilizando el estándar arc42 | 03 |
| **Planificación** | [Backlog-y-Plan-Tecnico.md](./docs/planificacion/Backlog-y-Plan-Tecnico.md) | Backlog maestro con Historias de Usuario, Story Points y Roadmap | 04 |
| **Planificación** | [metricas_agiles.md](./docs/planificacion/metricas_agiles.md) | Reporte y gráficos de control ágil (Burnup, Burndown y Velocity) | 03 / 04 |
| **Planificación** | [presupuesto.md](./docs/planificacion/presupuesto.md) | Estructura de presupuesto y análisis de costos del proyecto | 03 |
| **Planificación** | [Restricciones_Sistema.md](./docs/planificacion/Restricciones_Sistema.md) | Catálogo de restricciones duras (HC) y blandas (SC) del solver CP-SAT | 04 |
| **Gestión** | [Declaración_del_equipo_del_proyecto.md](./docs/gestion/Declaración_del_equipo_del_proyecto.md) | Registro de firmas, roles y responsabilidades de los colaboradores | 03 |
| **Gestión** | [Project_Charter.md](./docs/gestion/Project_Charter.md) | Acta de constitución del proyecto y definición de alcances | 03 |
| **Gestión** | [Seleccion_enfoque_proyecto.md](./docs/gestion/Seleccion_enfoque_proyecto.md) | Justificación de la selección del stack tecnológico (FastAPI + React ↔ MERN) | 04 |
| **Gestión** | [SGOHA_Documentacion_Inicio_Proyecto.md](./docs/gestion/SGOHA_Documentacion_Inicio_Proyecto.md) | Plan preliminar y bases de inicio de la orquestación del proyecto | 03 |
| **Gestión** | [Declaración_de_la_visión_del_proyecto.md](./docs/gestion/Declaración_de_la_visión_del_proyecto.md) | Declaración de la visión del producto y objetivos estratégicos | 03 |
| **Gestión** | [Documento_inicial_proyecto.md](./docs/gestion/Documento_inicial_proyecto.md) | Alcance inicial y contextualización del problema académico | 03 |
| **Gestión** | [Registro_de_supuestos_y_restricciones.md](./docs/gestion/Registro_de_supuestos_y_restricciones.md) | Supuestos de partida, hipótesis de negocio y límites del sistema | 03 |
| **Gestión** | [riesgos_oportunidades.md](./docs/gestion/riesgos_oportunidades.md) | Matriz de riesgos del proyecto y planes de mitigación correspondientes | 03 |
| **Gestión** | [Jira_CLI_Guide.md](./docs/gestion/Jira_CLI_Guide.md) | Guía técnica para el uso y sincronización de Jira CLI en el proyecto | 04 |
| **Sostenibilidad** | [reporte_sostenibilidad.md](./docs/sostenibilidad/reporte_sostenibilidad.md) | **Informe de Sostenibilidad, Huella de Carbono y Eficiencia Energética (Green Software)** | 05 / 06_B |
| **Calidad / Testing** | [estrategia_testing.md](./docs/testing/estrategia_testing.md) | **Estrategia Integral de Testing y QA (Unitario, Componentes, Integración, Cypress, Playwright, Cobertura)** | 06_A |
| **Guías** | [Guia_Exposicion_SGOHA.md](./docs/Guia_Exposicion_SGOHA.md) | Guía detallada para la defensa del proyecto ante el jurado | 04 |
| **Guías** | [Exposicion_Proyecto.md](./docs/gestion/Exposicion_Proyecto.md) | Presentación y material de soporte de la defensa del proyecto | 04 |
| **Histórico** | [Evaluacion_Nueva_Rubrica.md](./docs/Evaluacion_Nueva_Rubrica.md) | Documento de análisis de la nueva rúbrica y criterios de evaluación | 04 |
| **Histórico** | [inspección04.md](./inspección04.md) | Rúbrica oficial del docente para la Inspección 04 | 04 |
| **Histórico** | [inspeccion03.md](./inspeccion03.md) | Rúbrica y entregas de la Inspección 03 | 03 |
| **Histórico** | [inspeccion02.md](./inspeccion02.md) | Rúbrica y entregas de la Inspección 02 | 02 |

---

## 4.2. Tests y Cobertura (TDD)

```bash
# Ejecutar tests
cd src/backend
pytest tests/ -v

# Con reporte de cobertura
pytest --cov=app --cov-report=term-missing tests/
```

| Suite | Tests | Descripción |
| :--- | :---: | :--- |
| `test_scheduler.py` | 20+ | Escenarios PoC, colisiones, turnos, TDD |
| `test_optimization_model.py` | 15+ | Validación matemática del modelo |
| `test_auth.py` | 3+ | Autenticación y autorización |
| `test_api.py` | 2+ | Endpoints CRUD |

---

## 5. Descripción del Flujo de Pantallas

1.  **Pantalla de Login (`/`):**
    *   Interfaz con gradientes y estilos de la Universidad Continental.
    *   Permite seleccionar el rol (`admin` o `estudiante`) e ingresar credenciales.
    *   Redirige al Dashboard según el rol.
2.  **Dashboard Principal (`/dashboard`):**
    *   **Estudiante:** Visualiza un panel en modo presentación con su horario asignado. No tiene acceso a herramientas de edición.
    *   **Administrador:** Panel de control gerencial. Incluye un botón para invocar el algoritmo de resolución ("Generar Optimización") con indicadores de carga.
3.  **Gestión de Cursos (`/cursos`):**
    *   Solo visible para administradores.
    *   Interfaz CRUD para registrar asignaturas (Código, Nombre, Créditos).
4.  **Gestión de Aulas (`/aulas`):**
    *   Solo visible para administradores.
    *   Gestión de la infraestructura física (Identificación, Capacidad, Tipo: Laboratorio/Teoría).
5.  **Gestión de Secciones (`/secciones`):**
    *   Solo visible para administradores.
    *   Módulo para relacionar cursos con el docente asignado y establecer la demanda de espacios (cupos).

---

## 6. Requerimientos del Sistema

### Requerimientos Funcionales
1.  El sistema debe permitir la autenticación y autorización de usuarios basados en roles (Admin/Estudiante).
2.  El sistema debe permitir gestionar (CRUD) la infraestructura: Aulas, Laboratorios.
3.  El sistema debe permitir gestionar (CRUD) el contenido curricular: Cursos y Secciones.
4.  El sistema debe asignar automáticamente horarios a las secciones sin conflictos de recursos físicos (aulas) ni humanos (docentes).
5.  El sistema debe proveer una interfaz visual interactiva que muestre el horario generado.

### Requerimientos No Funcionales
1.  **Usabilidad:** La interfaz debe ser moderna, reactiva (SPA) y alineada a los colores institucionales.
2.  **Rendimiento:** El algoritmo de optimización de horarios debe entregar una solución factible en un máximo de **2 segundos** para un conjunto de datos estándar (61 cursos, 122 secciones).
3.  **Escalabilidad:** La arquitectura basada en Docker debe permitir el escalado horizontal independiente del frontend frente al backend.
4.  **Disponibilidad:** El sistema debe manejar reconexiones o respuestas claras "offline" en caso de pérdida de conexión temporal con la base de datos.
5.  **Mantenibilidad:** El código debe estar tipado (TypeScript, Pydantic) y seguir el principio de separación de responsabilidades (*Separation of Concerns*).

---

## 7. Desglose Ágil: Épicas e Historias de Usuario

A continuación, se define la estructura ágil de desarrollo planificada para el producto:

### Épica 1: Gestión de Recursos Académicos Estatales
*Permitir al área administrativa gestionar la infraestructura y el contenido de la malla académica para preparar los insumos del semestre.*

*   **HU-1.1:** Como Administrador, quiero poder crear, editar y eliminar Cursos para mantener actualizado el plan académico.
*   **HU-1.2:** Como Administrador, necesito registrar Aulas físicas considerando su capacidad máxima y tipo (Taller, Teoría) para su futura asignación.
*   **HU-1.3:** Como Administrador, requiero poder agregar nuevas Secciones estableciendo el Curso, el Docente a cargo y la cantidad estimada de alumnos.
*   **HU-1.4:** Como Administrador, quiero buscar y filtrar dentro de las tablas de gestión para encontrar registros específicos rápidamente.

### Épica 2: Motor Inteligente de Programación de Horarios
*Automatizar el proceso de creación de horarios utilizando algoritmos matemáticos para mitigar errores humanos.*

*   **HU-2.1:** Como Sistema, debo analizar la disponibilidad de Aulas y evitar asignar dos Secciones a la misma Aula simultáneamente.
*   **HU-2.2:** Como Sistema, debo garantizar que un Docente no sea programado en dos Secciones distintas en el mismo bloque horario.
*   **HU-2.3:** Como Administrador, quiero accionar un botón en el Dashboard que ejecute la inteligencia artificial y me indique cuando ha finalizado.
*   **HU-2.4:** Como Sistema, debo asegurar que las especificaciones de capacidad del Aula correspondan con la demanda (`capac_estimada`) exigida por la Sección.

### Épica 3: Autogestión y Experiencia del Estudiante
*Proveer a los alumnos de herramientas digitales interactivas para consultar la programación asignada a sus perfiles.*

*   **HU-3.1:** Como Estudiante, quiero iniciar sesión en un portal web con la identidad gráfica de la universidad utilizando mis credenciales exclusivas.
*   **HU-3.2:** Como Estudiante, deseo visualizar un tablero de resúmenes (*Dashboard*) que contenga mi horario de manera gráfica y fácil de leer sin opciones intrusivas.
*   **HU-3.3:** Como Estudiante, quiero que mi sesión perdure durante un tiempo definido o hasta que presione el botón cerrar sesión de manera voluntaria.

---

## 8. Posibles Mejoras a Futuro (Roadmap)

1.  **Generación de Reportes PDF/Excel:** Habilitar la exportación del horario generado para directores de carrera y alumnos para su fácil distribución e impresión.
2.  **Restricciones Blandas (Soft Constraints):** Modificar OR-Tools para incluir preferencias, como:
    *   Que las clases de un docente tiendan a estar en días agrupados (ej. evitar "huecos" u horas vacías en el horario del profesor).
    *   Minimizar el traslado entre campus físicos (si existen).
3.  **Auditoría de Cambios Manuales:** Permitir que, una vez generado el horario, el administrador pueda hacer pequeños "ajustes (drag-and-drop)" manuales y guardar esa versión.
4.  **Notificaciones Push/Email:** Enviar notificaciones automatizadas a estudiantes y profesores si ocurren actualizaciones a sus aulas o bloqueo de horarios en tiempo real.
5.  **Módulo de Pre-Matrícula Estudiantil:** Permitir a los estudiantes proponer posibles horarios cruzando su índice histórico para calcular con mayor certeza las capacidades estimadas de las secciones por abrir.
