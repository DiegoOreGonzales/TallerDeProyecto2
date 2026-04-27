# Exposición del Proyecto: SGOHA
## Sistema de Generación Óptima de Horarios Académicos

---

### 1. Análisis del Problema
**Problema Central:** El sistema actual de programación académica (Banner) en la Universidad Continental es ineficiente y produce horarios no factibles para los estudiantes, caracterizados por discrepancias de disponibilidad y cruces constantes de recursos.

#### Ambigüedades Identificadas (Sobresaliente: ≥4)
*   **AMB-01:** Definición de "horarios académicos" (¿Incluye exámenes o solo clases regulares?).
*   **AMB-02:** Naturaleza de la disponibilidad docente (¿Restricción dura o preferencia blanda?).
*   **AMB-03:** Granularidad de bloques horarios (¿Bloques fijos de 1h, 1.5h o variables?).
*   **AMB-04:** Límite de carga horaria máxima por docente no especificado inicialmente.
*   **AMB-05:** Compatibilidad estricta curso-aula (Laboratorio vs. Teoría).
*   **AMB-06:** Manejo de desplazamientos entre múltiples campus o edificios.

#### Restricciones Reales (Sobresaliente: ≥4)
*   **DOM-01:** Imposibilidad física de superposición de aulas (1 sección por aula/bloque).
*   **DOM-02:** Imposibilidad física de superposición de docentes (1 sección por docente/bloque).
*   **DOM-03:** Aforo del aula ≥ demanda estimada de la sección.
*   **DOM-04:** Cardinalidad 1:1 (Cada sección debe tener exactamente un espacio asignado).
*   **DOM-05:** Horario de operación institucional (7:00 AM - 10:00 PM).

#### Stakeholders Principales
*   **Coordinación Académica (PO):** Usuario principal, define reglas de negocio.
*   **Dirección de TI (Patrocinador):** Garantiza infraestructura y escalabilidad.
*   **Docentes y Estudiantes:** Usuarios beneficiarios finales.
*   **Equipo de Desarrollo:** Responsables de la ejecución técnica.

---

### 2. Requerimientos (Sobresaliente: ≥8 RF y ≥5 RNF)

#### Requerimientos Funcionales (RF)
1. **RF-01:** Autenticación por roles (Admin/Estudiante).
2. **RF-02:** CRUD de Cursos (código, nombre, créditos).
3. **RF-03:** CRUD de Aulas (identificación, capacidad, tipo).
4. **RF-04:** CRUD de Secciones (curso, docente, capacidad estimada).
5. **RF-05:** Filtrado y búsqueda avanzada de recursos.
6. **RF-06:** Ejecución del motor CP-SAT mediante botón de optimización.
7. **RF-07:** Asignación automática sin colisiones de aulas (100% éxito).
8. **RF-08:** Asignación automática sin colisiones de docentes (100% éxito).
9. **RF-09:** Validación de capacidad física vs. demanda (Aforo ≥ Demanda).
10. **RF-10:** Visualización gráfica del horario para el estudiante.
11. **RF-11:** Gestión de sesiones persistentes vía JWT.
12. **RF-12:** Notificación de infactibilidad del modelo.

#### Requerimientos No Funcionales (RNF)
1. **RNF-01 [Rendimiento]:** Generación de solución en ≤ 2 segundos para dataset estándar.
2. **RNF-02 [Usabilidad]:** Interfaz responsiva (Mobile first design principles).
3. **RNF-03 [Seguridad]:** Protección de endpoints con JWT y verificación de roles.
4. **RNF-04 [Mantenibilidad]:** Código TypeScript 100% tipado y Python siguiendo PEP-8.
5. **RNF-05 [Escalabilidad]:** Arquitectura Dockerizada capaz de escalar horizontalmente.
6. **RNF-06 [Disponibilidad]:** Manejo de errores de conexión a DB (PostgreSQL).
7. **RNF-07 [Compatibilidad]:** Soporte para Chrome, Firefox y Edge (versión 120+).

---

### 3. Selección del Enfoque
**Enfoque Seleccionado:** Programación con Restricciones (CP-SAT) con stack FastAPI + React.

#### Comparativa de Alternativas (Sobresaliente: ≥2 comparaciones)
| Alternativa | Ventajas | Desventajas | Decisión |
| :--- | :--- | :--- | :--- |
| **Algoritmos Genéticos** | Flexibilidad | No garantizan factibilidad absoluta; convergencia lenta. | Descartado |
| **Búsqueda Tabú** | Rápido para medianos | Riesgo de óptimos locales; sin librerías de producción robustas. | Descartado |
| **CP-SAT (Google OR-Tools)** | **Garantía de factibilidad** | Curva de aprendizaje inicial. | **Seleccionado** |

**Justificación Técnica:** CP-SAT permite expresar las restricciones del negocio de forma declarativa. Es la única opción que garantiza que el horario generado sea 100% válido matemáticamente en el tiempo requerido (≤10s), cumpliendo estrictamente con los RNF de rendimiento y las restricciones físicas del problema.

---

### 4. Declaración de la Visión
*"Para la Universidad Continental, el SGOHA es una plataforma inteligente que automatiza la creación de horarios en segundos, eliminando errores al 100%, a diferencia de los procesos rígidos e ineficientes del sistema actual (Banner); garantizamos factibilidad absoluta, escalabilidad y una experiencia de usuario institucional moderna."*

*   **Valor:** Reducción drástica en tiempos de validación y 0% de conflictos post-generación.
*   **Alcance:** Dashboard administrativo (Gestión), Motor de Optimización, y Dashboard Estudiantil (Consulta).

---

### 5. Project Charter

| Campo | Detalle |
| :--- | :--- |
| **Nombre** | Sistema de Generación Óptima de Horarios Académicos (SGOHA) |
| **Líder (SM)** | Ore Gonzales Diego Isaac |
| **Product Owner** | Requena Lavi Aldo Alexandre |
| **Fecha Inicio** | Marzo 2026 |
| **Fecha Entrega** | Julio 2026 |

#### Objetivos del Proyecto
1. Automatizar la generación de horarios sin conflictos de recursos.
2. Implementar una arquitectura moderna y escalable (Docker/FastAPI/React).
3. Garantizar tiempos de respuesta óptimos (<10s).

#### Integrantes del Grupo y Roles
*   **Requena Lavi Aldo Alexandre:** Product Owner (Gestión de valor y enlace institucional).
*   **Ore Gonzales Diego Isaac:** Scrum Master / Líder Técnico (Facilitación y Arquitectura).
*   **Bacilio De La Cruz José Anthony:** Desarrollador Backend (API REST y Motor CP-SAT).
*   **Gutierrez Taipe Luis Alberto:** Desarrollador Frontend (Interfaz SPA y Experiencia de Usuario).

#### Riesgos Principales
*   **Infactibilidad:** Datos de entrada insuficientes para generar solución (Mitigación: Validaciones previas).
*   **Carga Académica:** Retrasos por disponibilidad del equipo (Mitigación: Sprints de 2 semanas).

---

### 6. Supuestos y Restricciones (Sobresaliente: ≥5/≥5)

#### Supuestos (SUP)
1. **SUP-01:** Disponibilidad de datos limpios de docentes y aulas.
2. **SUP-02:** Acceso continuo al stack tecnológico (Python, Node, Docker).
3. **SUP-03:** Usuarios admin con competencias digitales básicas.
4. **SUP-04:** No existen restricciones institucionales ocultas no documentadas.
5. **SUP-05:** El servidor tendrá acceso a internet para actualizaciones de seguridad.

#### Restricciones (RES)
1. **RES-01:** Stack predefinido: FastAPI, React, PostgreSQL, Docker.
2. **RES-02:** Tiempo máximo de procesamiento algorítmico de 2 segundos.
3. **RES-03:** Plazo inamovible de 6 meses (Ciclo académico).
4. **RES-04:** Uso exclusivo de Google OR-Tools (Licencia libre).
5. **RES-05:** Cumplimiento de la Ley de Protección de Datos Personales (Perú).

---

### 7. Equipo de Proyecto

#### Roles y Responsabilidades
*   **Product Owner (Requena Lavi):** Prioriza el backlog y valida el valor entregado.
*   **Scrum Master (Ore Gonzales):** Elimina impedimentos y asegura la agilidad del equipo.
*   **Desarrollador Backend (Bacilio):** Implementa el motor de optimización y la lógica de negocio sólida.
*   **Desarrollador Frontend (Gutierrez):** Crea interfaces intuitivas y Dashboards de alto impacto visual.

#### Normas de Trabajo
*   **Ceremonias:** Daily Scrum (15 min), Sprints de 2 semanas, Retrospectivas.
*   **Definition of Done (DoD):** Código revisado, tests pasados, criterios de aceptación validados.
*   **Colaboración:** Uso estricto de Pull Requests y Conventional Commits.

---

### 8. Repositorio GitHub
**URL:** [https://github.com/DiegoOreGonzales/TallerDeProyecto2.git](https://github.com/DiegoOreGonzales/TallerDeProyecto2.git)

#### Estructura y Estándares
*   **Ramas:** `main` (Producción), `develop` (Integración), `feature/*` (Nuevas funcionalidades).
*   **Commits Iniciales (≥5):**
    1. `chore: initial repository setup`
    2. `feat: docker-compose base configuration`
    3. `feat: backend cursos CRUD endpoints`
    4. `feat: backend aulas CRUD endpoints`
    5. `feat: CP-SAT optimizer core module`
*   **GitFlow:** Flujo de trabajo basado en ramas de características y revisiones de código obligatorias.

---

### 9. Evidencia de Problema Complejo y Argumentación
El proyecto demuestra pensamiento crítico al reconocer que el problema de horarios no es simplemente una base de datos, sino un problema de **Optimización Combinatoria (NP-Hard)**.

*   **Argumentación de Decisiones:** Se eligió CP-SAT en lugar de algoritmos genéticos porque la prioridad institucional es la **certeza operativa**. No se puede "probar" con un horario que tenga errores leves; la factibilidad debe ser absoluta.
*   **Gestión de Restricciones:** El diseño contempla restricciones duras (físicas) y anticipa la necesidad de restricciones blandas en versiones futuras, demostrando una visión escalable de la complejidad.
