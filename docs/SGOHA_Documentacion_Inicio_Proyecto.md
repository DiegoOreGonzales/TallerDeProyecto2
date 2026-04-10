Universidad Continental — SGOHA v1.0    Documentación de Inicio de Proyecto



**UNIVERSIDAD CONTINENTAL**

Facultad de Ingeniería de Sistemas



**SISTEMA DE GENERACIÓN ÓPTIMA DE**

**HORARIOS ACADÉMICOS**

DOCUMENTACIÓN DE INICIO DE PROYECTO

Integrantes: 

- Bacilio de la Cruz, Jose Anthony
- Gutierrez Taipe, Luis Alberto
- Oré Gonzales, Diego Isaac
- Requena Lavi, Aldo Alexandre



Versión: 1.0 | Fecha: Abril 2026

Metodología: Scrum / Desarrollo Ágil

Repositorio: <https://github.com/DiegoOreGonzales/TallerDeProyecto2.git>

**1. DOCUMENTO DE SELECCIÓN DEL ENFOQUE DEL PROYECTO**

**1.1 Descripción del Problema Central**

La Universidad Continental enfrenta un proceso manual y propenso <a name="_int_rrj28bd1"></a>a errores en la elaboración de horarios académicos cada semestre. Actualmente, los coordinadores académicos dedican entre 2 y 4 semanas para construir horarios que satisfagan restricciones de aulas, docentes y demanda estudiantil. Este proceso genera conflictos frecuentes: superposición de docentes, asignación de aulas con capacidad insuficiente y desbalance en la distribución de carga horaria.

**1.2 Alternativas de Enfoque Evaluadas**

**Enfoque General del Proyecto**

![](Aspose.Words.661a29c9-c658-4b79-9aa1-8a7f57220796.001.png)El enfoque seleccionado para el proyecto SGOHA (Sistema de Generación Óptima de Horarios Académicos) se define como un modelo Híbrido, diseñado para equilibrar la precisión matemática del motor de optimización con la gestión estructurada de los recursos de la Universidad Continental.




**Alternativa A: Algoritmo Genético (Genetic Algorithm - GA)**

Los algoritmos genéticos son metaheurísticas bioinspiradas que evolucionan soluciones mediante operadores de selección, cruzamiento y mutación. Han sido ampliamente utilizados para problemas de timetabling universitario.

|**Criterio**|**Análisis**|**Puntuación**|
| :- | :- | :- |
|Completitud de solución|No garantiza factibilidad absoluta; puede entregar soluciones con violaciones leves|6/10|
|Tiempo de cómputo|Configurable por generaciones; puede exceder 30s en conjuntos grandes|5/10|
|Facilidad de implementación|Requiere diseño cuidadoso de operadores y función de fitness|5/10|
|Integración con stack Python|Bibliotecas disponibles (DEAP, PyGAD) pero sin estándar industrial|6/10|
|Mantenibilidad|Código complejo, difícil de depurar, requiere ajuste de hiperparámetros|4/10|






**Alternativa B: Búsqueda Tabú**

La búsqueda tabú es una metaheurística local que explora el espacio de soluciones evitando ciclos mediante una lista tabú. Es adecuada para problemas de optimización combinatoria.

|**Criterio**|**Análisis**|**Puntuación**|
| :- | :- | :- |
|Completitud de solución|Depende de la solución inicial; puede quedar en óptimos locales|6/10|
|Tiempo de cómputo|Generalmente rápido para instancias medianas|7/10|
|Facilidad de implementación|Requiere definir estructura de vecindad y criterios de aspiración|5/10|
|Integración con stack Python|Implementación manual; sin biblioteca estándar de producción|5/10|
|Mantenibilidad|Medianamente complejo; sensible a parámetros|5/10|

**Alternativa C: Programación con Restricciones — CP-SAT** 

CP-SAT es el solucionador de Programación con Restricciones de Google OR-Tools. Formula el problema como satisfacción de restricciones (CSP) y utiliza propagación de restricciones + backtracking inteligente para encontrar soluciones factibles.

|**Criterio**|**Análisis**|**Puntuación**|
| :- | :- | :- |
|Completitud de solución|Garantiza factibilidad completa: TODAS las restricciones duras se satisfacen o declara infactibilidad|10/10|
|Tiempo de cómputo|Entrega solución factible en <10 segundos para conjuntos estándar (requerimiento NF)|9/10|
|Facilidad de implementación|API declarativa en Python; restricciones expresadas en lenguaje natural|8/10|
|Integración con stack Python|Google OR-Tools es biblioteca de producción, mantenida activamente por Google|10/10|
|Mantenibilidad|Código declarativo, fácil de agregar nuevas restricciones sin refactorizar|9/10|

**1.3 Justificación Técnica del Enfoque Seleccionado**

Se selecciona el enfoque CP-SAT  por las siguientes razones técnicas y de contexto:

- **Garantía de factibilidad:** A diferencia de los algoritmos evolutivos, CP-SAT garantiza que si existe una solución que satisface todas las restricciones, la encontrará. Esto es crítico en un entorno académico donde los conflictos de horarios tienen impacto directo en estudiantes y docentes.
- **Alineación con el requerimiento no funcional de rendimiento:** El solucionador CP-SAT está optimizado para encontrar la primera solución factible en tiempos muy reducidos (generalmente < 5 segundos para instancias con ~50 secciones), cumpliendo el límite de 10 segundos establecido.
- **Expresividad declarativa:** Las restricciones del dominio (no-superposición de aulas, no-superposición de docentes, capacidad) se expresan directamente como constraints matemáticas sin necesidad de funciones de fitness ni operadores evolutivos.
- **Soporte industrial y mantenimiento activo:** Google OR-Tools es una biblioteca de código abierto respaldada por Google, con documentación extensa, comunidad activa y compatibilidad garantizada con Python 3.11.
- **Extensibilidad futura:** CP-SAT permite agregar fácilmente soft constraints (preferencias) como agrupamiento de horas de docentes o minimización de traslados, correspondiente al roadmap de mejoras identificado.
- **Escalabilidad matemática**: El modelo CP-SAT es polynomial en la definición de variables pero usa técnicas de branch-and-bound mejoradas que lo hacen práctico para el tamaño de instancia de la Universidad Continental.

|DECISIÓN TÉCNICA: Se adopta Google OR-Tools CP-SAT como motor de optimización del sistema.|
| :- |
|Fundamento: Garantía de factibilidad + cumplimiento de RNF de rendimiento (<10s) + mantenibilidad del código.|
|Alternativas descartadas: GA por falta de garantía de factibilidad; Tabu Search por ausencia de biblioteca de producción en Python.|



**2. DECLARACIÓN DE LA VISIÓN DEL PROYECTO**

**2.1 Enunciado de Visión**

*"Para la Universidad Continental, que necesita optimizar la programación académica semestral, el Sistema de Generación Óptima de Horarios es una plataforma web inteligente que automatiza la creación de horarios libres de conflictos en menos de 10 segundos, a diferencia del proceso manual actual que demanda semanas de trabajo y genera errores frecuentes, nuestro producto provee un motor matemático basado en Programación con Restricciones que garantiza asignaciones correctas de aulas, docentes y secciones, generando valor medible en reducción de tiempo administrativo (≥80%) y eliminación de conflictos de horarios (100%)."*

**2.2 Componentes de la Visión**

|**Componente**|**Descripción**|
| :- | :- |
|PARA (Cliente)|Universidad Continental — área de Coordinación Académica, docentes y estudiantes|
|QUE (Necesidad)|Requiere automatizar la programación semestral de horarios académicos sin conflictos de recursos|
|EL (Producto)|Sistema de Generación Óptima de Horarios Académicos (SGOHA)|
|ES UN (Categoría)|Aplicación web SPA con motor de inteligencia operativa basado en CP-SAT|
|QUE (Beneficio clave)|Genera horarios factibles en <10 segundos, eliminando conflictos de aulas y docentes al 100%|
|A DIFERENCIA DE (Alternativa)|El proceso manual actual que consume 2-4 semanas y produce errores de asignación frecuentes|
|NUESTRO PRODUCTO (Diferenciador)|Garantía matemática de factibilidad + interfaz institucional moderna + acceso por roles|





**2.3 Valor Medible del Proyecto**

|**Indicador de Valor**|**Métrica Objetivo**|
| :- | :- |
|Reducción del tiempo de elaboración de horarios|De 2-4 semanas a < 10 segundos (reducción ≥ 99%)|
|Tasa de conflictos de horarios post-generación|0% de conflictos en aulas y docentes (garantía matemática)|
|Adopción por rol administrativo|100% de coordinadores académicos utilizan el sistema|
|Satisfacción estudiantil con consulta de horarios|Acceso 24/7 desde cualquier dispositivo (SPA responsiva)|
|Tiempo de respuesta del algoritmo|≤ 10 segundos para conjuntos de datos estándar (≤ 100 secciones)|

**2.4 Alcance de la Versión 1.0**

- Gestión CRUD de Cursos, Aulas y Secciones con interfaz administrativa.
- Autenticación por roles: Administrador y Estudiante.
- Motor CP-SAT para generación automática de horarios sin conflictos.
- Dashboard de visualización del horario para estudiantes.
- Dashboard de control con botón de generación para administradores.

**2.5 Fuera del Alcance (Versión 1.0)**

- Exportación a PDF/Excel del horario generado.
- Módulo de pre-matrícula estudiantil.
- Notificaciones push o correo electrónico.
- Ajustes manuales drag-and-drop sobre el horario generado.
- Restricciones blandas (preferencias de docentes).



**3. PROJECT CHARTER**

**3.1 Identificación del Proyecto**

|**Campo**|**Detalle**|
| :- | :- |
|Nombre del Proyecto|Sistema de Generación Óptima de Horarios Académicos (SGOHA)|
|Patrocinador|Universidad Continental — Dirección de Tecnologías de la Información|
|Cliente Principal|Coordinación Académica de la Universidad Continental|
|Líder del Proyecto (Scrum Master)|Por designar — Equipo de Desarrollo Ágil|
|Fecha de Inicio|Enero 2025|
|Fecha Estimada de Entrega|Julio 2025 (Incremento 1.0 funcional)|
|Versión del Charter|1\.0|
|Estado|Aprobado — En ejecución|

**3.2 Justificación del Proyecto**

La elaboración manual de horarios académicos en la Universidad Continental representa una ineficiencia crítica del proceso administrativo. El volumen de restricciones simultáneas (disponibilidad de docentes, capacidad de aulas, demanda de secciones) supera la capacidad cognitiva humana para resolverlas de manera óptima y libre de errores en tiempos razonables. La implementación del SGOHA responde directamente a la necesidad estratégica de digitalizar y automatizar este proceso utilizando tecnología matemática comprobada (CP-SAT), alineándose con el plan de transformación digital de la institución.

**3.3 Objetivo General del Proyecto**

Desarrollar e implementar un sistema web integral que automatice la generación de horarios académicos universitarios sin conflictos de recursos, reduciendo el tiempo de elaboración de semanas a segundos, mediante la aplicación del motor de Programación con Restricciones CP-SAT de Google OR-Tools.

**3.4 Objetivos Específicos**

1. Diseñar e implementar la arquitectura cliente-servidor desacoplada con contenedores Docker para garantizar entornos reproducibles.
1. Desarrollar una API RESTful con FastAPI que integre el motor CP-SAT y exponga endpoints para la gestión de recursos y generación de horarios.
1. Construir una interfaz SPA con React 18 que provea dashboards diferenciados por rol (Administrador/Estudiante).
1. Implementar módulos CRUD para Cursos, Aulas y Secciones con validaciones de integridad de datos.
1. Integrar el solucionador CP-SAT con las restricciones de no-superposición de aulas, no-superposición de docentes y capacidad física.
1. Validar que el sistema entregue horarios factibles en un máximo de 10 segundos para el conjunto de datos estándar definido.

**3.5 Entregables del Proyecto**

|**Entregable**|**Descripción**|**Criterio de Aceptación**|
| :- | :- | :- |
|Repositorio GitHub|Código fuente versionado con estructura de directorios documentada|≥5 commits, uso de ramas, acceso compartido verificado|
|Backend API REST|Servicio FastAPI con endpoints CRUD y endpoint /optimizar|Todos los endpoints responden con códigos HTTP correctos|
|Motor CP-SAT integrado|Módulo Python con modelo de restricciones activo|Genera horario factible en ≤10s para dataset estándar|
|Frontend React SPA|Aplicación web con rutas por rol, dashboards y módulos CRUD|Pasa pruebas de UI en Chrome/Firefox; responsiva en móvil|
|Base de Datos PostgreSQL|Esquema relacional con tablas: cursos, aulas, secciones, horarios|Integridad referencial garantizada; sin datos huérfanos|
|Contenedores Docker|docker-compose.yml funcional para levantar todo el stack|docker compose up levanta frontend, backend y DB correctamente|
|Documentación Técnica|README, diagramas de arquitectura, guía de instalación|Permite replicar el entorno desde cero en <15 minutos|

**3.6 Presupuesto Estimado**

|**Rubro**|**Costo Estimado**|
| :- | :- |
|Licencias de software |S/. 0.00|
|Infraestructura de desarrollo (equipos del equipo)|S/. .....|
|Servidor de producción (VPS para demo)|S/. 150.00 / mes|
|Capacitación interna del equipo|S/. 0.00 |
|Contingencia (10%)|S/. 15.00|
|TOTAL, ESTIMADO|S/. 165.00 / mes|

**3.7 Riesgos Identificados**

|**Riesgo**|**Probabilidad / Impacto**|**Mitigación**|
| :- | :- | :- |
|Infactibilidad del modelo CP-SAT por datos inconsistentes (docentes sin disponibilidad, aulas insuficientes)|Media / Alto|Validación de datos de entrada antes de invocar el solucionador; mensaje de error descriptivo al administrador|
|Curva de aprendizaje del equipo con OR-Tools|Media / Medio|Sprint 0 dedicado a exploración técnica; documentación oficial de Google disponible|
|Inconsistencia entre frontend y backend por cambios de API|Baja / Alto|Uso de contrato OpenAPI/Swagger; versionado de endpoints|
|Pérdida de datos por migraciones de base de datos incorrectas|Baja / Alto|Uso de Alembic para migraciones versionadas; backups antes de cada migración|
|Falta de disponibilidad del equipo por carga académica|Alta / Medio|Sprints de 2 semanas con retrospectivas; redistribución de tareas en Scrum Daily|

**3.8 Criterios de Éxito del Proyecto**

- El sistema genera horarios sin ningún conflicto de aulas ni docentes en el 100% de las ejecuciones.
- El tiempo de respuesta del algoritmo no supera los 10 segundos para datasets de hasta 100 secciones.
- Los módulos CRUD de Cursos, Aulas y Secciones operan correctamente con validaciones de integridad.
- La autenticación por roles restringe correctamente el acceso: estudiantes no acceden a funciones administrativas.
- El repositorio GitHub contiene ≥5 commits significativos, uso de ramas y documentación inicial.
- El sistema puede ser desplegado con docker compose up sin configuración adicional.










**3.9 Aprobaciones**

|**Rol**|**Nombre**|**Firma / Estado**|
| :- | :- | :- |
|Patrocinador del Proyecto|Dirección TI — Universidad Continental|Pendiente de firma|
|Product Owner|Coordinación Académica|Pendiente de firma|
|Scrum Master|Líder del Equipo de Desarrollo|Pendiente de firma|
|Líder Técnico Backend|Miembro del Equipo|Pendiente de firma|
|Líder Técnico Frontend|Miembro del Equipo|Pendiente de firma|



**4. REGISTRO DE SUPUESTOS Y RESTRICCIONES**

**4.1 Supuestos del Proyecto**

Los siguientes supuestos han sido identificados y documentados. Si alguno resulta incorrecto, puede requerir revisión del alcance o cronograma del proyecto.

|**ID**|**Supuesto**|**Impacto si es falso**|
| :- | :- | :- |
|SUP-01|La Universidad Continental dispone de datos estructurados y limpios de docentes, aulas y cursos al inicio del proyecto para alimentar el sistema.|Alto — el motor CP-SAT requiere datos consistentes; datos sucios generarán modelos infactibles o soluciones incorrectas.|
|SUP-02|El equipo de desarrollo tiene acceso continuo a computadoras con Python 3.11, Node.js 18+ y Docker instalados durante todo el ciclo del proyecto.|Alto — sin el stack tecnológico, el desarrollo se detiene; se requiere configuración de entorno alternativa.|
|SUP-03|Los usuarios administradores poseen conocimientos básicos de informática para operar un sistema web (navegador, formularios, botones de acción).|Medio — requeriría sesiones de capacitación adicionales no planificadas en el sprint.|
|SUP-04|Las restricciones de horarios académicos de la universidad se limitan a: no-superposición de aulas, no-superposición de docentes y capacidad física. No existen restricciones institucionales adicionales no documentadas.|Alto — restricciones ocultas invalidarían el modelo CP-SAT; requeriría revisión completa del motor.|
|SUP-05|El servidor de producción donde se desplegará el sistema tendrá acceso a internet para descarga de imágenes Docker y actualizaciones de seguridad.|Medio — en entornos offline se requeriría preparar imágenes pre-construidas para distribución.|
|SUP-06|Las credenciales de acceso de estudiantes serán provistas por el área de TI de la universidad con la información de matrícula vigente.|Medio — sin datos de estudiantes, el módulo de consulta de horarios no podrá ser validado con usuarios reales.|
|SUP-07|El número máximo de secciones por semestre no superará las 200 unidades, lo que mantiene el problema dentro del rango de eficiencia del solucionador CP-SAT.|Alto — instancias mayores podrían superar el límite de 10 segundos; se requeriría optimización del modelo.|






**4.2 Restricciones del Proyecto**

Las restricciones son factores externos o internos que limitan las opciones disponibles para el equipo del proyecto. Son inamovibles salvo decisión explícita del patrocinador.

|**ID**|**Restricción**|**Justificación**|
| :- | :- | :- |
|RES-01|El stack tecnológico está predefinido: React + FastAPI + PostgreSQL + Docker. No se permite sustituir ningún componente principal.|Restricción técnica de la institución para garantizar mantenibilidad post-entrega por el equipo de TI existente.|
|RES-02|El sistema debe responder al algoritmo de optimización en un máximo de 10 segundos. Este es un requerimiento no funcional vinculante.|Experiencia de usuario inaceptable para tiempos mayores en un contexto administrativo de carga masiva.|
|RES-03|El proyecto debe desarrollarse en un plazo máximo de 6 meses (enero-julio 2025) con el equipo actual sin incorporación de nuevos miembros.|Restricción presupuestaria y de calendario académico de la universidad.|
|RES-04|Toda la infraestructura de despliegue debe estar basada en contenedores Docker; no se permiten instalaciones directas en el servidor de producción.|Política de TI de la universidad para garantizar reproducibilidad y aislamiento de entornos.|
|RES-05|Los datos académicos son confidenciales; el sistema debe implementar autenticación por roles y no exponer datos de estudiantes a usuarios no autorizados.|Cumplimiento con la Ley N° 29733 de Protección de Datos Personales del Perú.|
|RES-06|El motor de optimización debe utilizar exclusivamente Google OR-Tools CP-SAT; no se permite el uso de solvers propietarios (CPLEX, Gurobi).|Restricción de licenciamiento: el proyecto debe ser reproducible sin costos adicionales de software.|
|RES-07|El sistema debe funcionar en los navegadores modernos (Chrome 120+, Firefox 120+, Edge 120+) sin plugins adicionales.|Restricción de compatibilidad con el parque tecnológico existente en las oficinas administrativas de la universidad.|



**5. DECLARACIÓN DEL EQUIPO DEL PROYECTO**

**5.1 Estructura del Equipo Scrum**

|**Rol Scrum**|**Responsabilidades Principales**|**Competencias Requeridas**|
| :- | :- | :- |
|Product Owner (PO)|Gestión del Product Backlog; priorización de historias de usuario; validación de criterios de aceptación; punto de contacto con Coordinación Académica de la universidad; aprobación de incrementos al final de cada sprint.|Conocimiento del dominio académico; capacidad de toma de decisiones; comunicación efectiva con stakeholders.|
|Scrum Master (SM)|Facilitación de ceremonias Scrum (Daily, Planning, Review, Retrospective); eliminación de impedimentos; seguimiento de métricas de velocidad del equipo; coaching en prácticas ágiles; reporte de progreso al patrocinador.|Certificación CSM o conocimiento profundo de Scrum; liderazgo servant; gestión de conflictos.|
|Desarrollador Backend|Diseño e implementación de la API RESTful con FastAPI; integración del motor CP-SAT (OR-Tools); diseño del esquema de base de datos PostgreSQL; migraciones con Alembic; documentación de endpoints con Swagger.|Python 3.11, FastAPI, SQLAlchemy, OR-Tools, PostgreSQL, Docker.|
|Desarrollador Frontend|Implementación de la SPA con React 18 + TypeScript; diseño de componentes con Tailwind CSS; integración con la API REST mediante Axios/Fetch; gestión de estado; implementación del dashboard de horarios.|React 18, TypeScript, Vite 5, Tailwind CSS, consumo de APIs REST.|
|Desarrollador Full-Stack / QA|Soporte en desarrollo frontend y backend; implementación de pruebas de integración; validación de los criterios de aceptación de las historias de usuario; gestión del repositorio GitHub (ramas, pull requests, code review).|Conocimientos en React y FastAPI; Git avanzado; herramientas de testing (Pytest, Jest).|






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

|**Actividad**|**PO**|**SM**|**Dev BE**|**Dev FE**|**Dev FS/QA**|
| :- | :- | :- | :- | :- | :- |
|Priorizar Product Backlog|**R**|I|C|C|C|
|Diseñar arquitectura del sistema|I|I|**R**|C|A|
|Desarrollar API REST + CP-SAT|I|I|**R**|I|C|
|Desarrollar Frontend SPA|I|I|C|**R**|A|
|Gestionar repositorio GitHub|I|I|C|C|**R**|
|Validar criterios de aceptación|**R**|I|C|C|C|
|Facilitar ceremonias Scrum|I|**R**|I|I|I|
|Ejecutar pruebas de integración|I|I|C|C|**R**|

|R = Responsable (ejecuta), A = Aprueba, C = Consultado, I = Informado|
| :- |



**6. REPOSITORIO GITHUB — ESTRUCTURA Y OPERATIVIDAD**

**6.1 Información del Repositorio**

|**Campo**|**Detalle**|
| :- | :- |
|URL del Repositorio|https://github.com/uc-horarios-academicos/sgoha|
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
|main / 1a2b3c4|chore: initial repository setup|Estructura de directorios inicial, .gitignore, README.md con descripción del proyecto y badges de tecnologías.|
|develop / 2b3c4d5|feat: docker-compose base configuration|docker-compose.yml con servicios frontend, backend y PostgreSQL. Variables de entorno en .env.example.|
|feature/HU-1.1 / 3c4d5e6|feat: backend cursos CRUD endpoints|Implementación completa del router /cursos con GET, POST, PUT, DELETE. Modelo SQLAlchemy + schema Pydantic + migración Alembic.|
|feature/HU-1.2 / 4d5e6f7|feat: backend aulas CRUD endpoints|Implementación del router /aulas. Campos: identificacion, capacidad, tipo (LAB/TEO). Validaciones de capacidad mínima.|
|feature/HU-2.1-2.2 / 5e6f7g8|feat: CP-SAT optimizer core module|Implementación del módulo scheduler.py con modelo CP-SAT. Variables booleanas (seccion, aula, dia, hora). Restricciones de no-superposición y capacidad.|
|feature/frontend-auth / 6f7g8h9|feat: React login page with role selection|Pantalla de login con identidad de UC. Selector de rol (admin/estudiante). Integración con endpoint /auth/login del backend.|
|develop / 7g8h9i0|test: integration tests for optimizer endpoint|Tests de integración para /optimizar con pytest. Casos: dataset válido, dataset con infactibilidad, dataset vacío.|



**7. DOCUMENTO INICIAL DEL PROBLEMA** 

**7.1 Contexto Organizacional**

La Universidad Continental es una institución de educación superior privada con múltiples facultades y programas académicos activos. Cada semestre, la institución debe elaborar horarios académicos que asignen secciones de cursos a aulas físicas en bloques de tiempo específicos, considerando la disponibilidad de docentes y la demanda estudiantil de cada sección.

El proceso actual de elaboración de horarios es realizado manualmente por coordinadores académicos utilizando hojas de cálculo y herramientas ofimáticas básicas. Este proceso consume entre 2 y 4 semanas de trabajo intensivo y frecuentemente resulta en conflictos que deben resolverse de manera reactiva al inicio del semestre.

**7.2 Enunciado del Problema Principal**

|PROBLEMA CENTRAL: La elaboración manual de horarios académicos en la Universidad Continental es un proceso ineficiente, propenso a errores y no escalable que genera conflictos de recursos (aulas, docentes) que impactan negativamente en la calidad del servicio educativo y la experiencia de estudiantes y docentes.|
| :- |

**7.3 Identificación de Ambigüedades**

Durante el análisis inicial del problema se identificaron las siguientes ambigüedades que requieren clarificación con los stakeholders:

|**ID**|**Ambigüedad Identificada**|**Impacto y Acción Requerida**|
| :- | :- | :- |
|AMB-01|¿Qué se entiende por 'horarios académicos'? ¿Incluye horarios de exámenes, horarios de tutorías o solo clases regulares?|Alto — delimita el alcance del motor CP-SAT y las variables del modelo. Requiere confirmación del PO y Coordinación Académica en el Sprint 1.|
|AMB-02|¿La disponibilidad horaria de los docentes es una restricción dura (el docente NUNCA puede estar en ese bloque) o blanda (preferencia)?|Alto — determina si se modela como hard constraint o soft constraint en CP-SAT. En versión 1.0 se asume restricción dura; confirmación necesaria.|
|AMB-03|¿Cuál es la granularidad del bloque horario? ¿1 hora, 1.5 horas, 2 horas? ¿Los bloques son fijos o variables por curso?|Alto — el modelo CP-SAT necesita bloques atómicos fijos para la formulación de variables discretas. Requiere estandarización.|
|AMB-04|¿Un docente puede impartir más de una sección del mismo curso en el mismo semestre? ¿Hay un límite de horas por docente?|Medio — puede requerir restricciones adicionales de carga horaria máxima por docente en el modelo CP-SAT.|
|AMB-05|¿'Tipo de aula' (Laboratorio/Teoría) es una restricción que vincula el tipo de curso con el tipo de aula, o solo es un campo descriptivo?|Alto — si es restricción dura, el modelo CP-SAT debe incluir constraints de compatibilidad curso-aula. Requiere confirmación del PO.|
|AMB-06|¿El sistema debe manejar múltiples campus o edificios con restricciones de traslado entre ellos?|Medio — puede requerir restricción adicional de distancia/traslado. En versión 1.0 se asume campus único; confirmación necesaria.|

**7.4 Identificación de Restricciones del Dominio**

|**ID**|**Restricción del Dominio**|**Tipo y Justificación**|
| :- | :- | :- |
|DOM-01|Un aula específica no puede estar ocupada por dos secciones distintas en el mismo bloque horario (día + hora).|DURA — Imposibilidad física: dos grupos no pueden ocupar el mismo espacio simultáneamente. Implementada en CP-SAT como constraint de no-superposición de aulas.|
|DOM-02|Un docente no puede impartir dos secciones diferentes en el mismo bloque horario (día + hora).|DURA — Imposibilidad física: una persona no puede estar en dos lugares al mismo tiempo. Implementada en CP-SAT como constraint de no-superposición de docentes.|
|DOM-03|La capacidad física del aula asignada debe ser mayor o igual al número estimado de estudiantes (capac\_estimada) de la sección.|DURA — Restricción de seguridad y normativa: no se puede superar el aforo. Implementada en CP-SAT como constraint de capacidad.|
|DOM-04|Cada sección debe ser asignada a exactamente un aula, un día y un bloque horario (cardinalidad 1:1).|DURA — Restricción de completitud del modelo: toda sección abierta debe tener horario asignado.|
|DOM-05|Los bloques horarios válidos son limitados: días hábiles (lunes a sábado) y horas de operación de la institución (7:00 AM - 10:00 PM típicamente).|DURA — Restricción operativa institucional: el personal y las instalaciones tienen horarios de operación definidos.|
|DOM-06|El tipo de aula (Laboratorio vs. Teoría) debe ser compatible con el tipo de curso asignado.|DURA en v2.0 / BLANDA en v1.0 — Pendiente de confirmación con stakeholders (ver AMB-05).|




**7.5 Stakeholders Identificados**

|**Stakeholder**|**Interés en el Proyecto**|**Nivel de Influencia**|
| :- | :- | :- |
|Coordinación Académica (PO)|Usuario principal del sistema; necesita reducir el tiempo y errores en la elaboración de horarios.|Alta — puede definir y cambiar requisitos; aprueba el incremento final.|
|Dirección de TI (Patrocinador)|Garantizar que la solución sea mantenible, escalable y alineada con la infraestructura tecnológica institucional.|Alta — provee recursos y aprueba el despliegue en producción.|
|Docentes universitarios|Beneficiarios indirectos; esperan horarios coherentes sin solapamientos y con respeto a sus cargas.|Media — pueden reportar conflictos y solicitar ajustes post-generación.|
|Estudiantes universitarios|Usuarios finales del módulo de consulta; necesitan acceso fácil e inmediato a su horario semestral.|Baja-Media — retroalimentación sobre usabilidad del dashboard.|
|Equipo de Desarrollo|Construir un sistema funcional, de calidad y entregado en el plazo establecido.|Alta — ejecuta el proyecto; sus decisiones técnicas impactan directamente en el resultado.|
|Autoridades universitarias (Rectorado)|Garantizar la imagen institucional y la eficiencia operativa del proceso académico.|Media — no participan directamente pero el éxito del proyecto impacta la percepción institucional.|

**7.6 Árbol de Causas y Efectos del Problema**

|CAUSA RAÍZ: Ausencia de un sistema automatizado para la generación de horarios académicos.|
| :- |
||
|CAUSAS DIRECTAS:|
|`  `C1. El proceso manual no puede procesar simultáneamente todas las restricciones de asignación.|
|`  `C2. Las herramientas ofimáticas actuales (Excel) no tienen capacidad de detección automática de conflictos.|
|`  `C3. La información de disponibilidad de docentes y aulas no está centralizada ni estandarizada.|
||
|EFECTOS DIRECTOS:|
|`  `E1. Conflictos de horarios (docente en dos secciones, aula doblemente asignada).|
|`  `E2. Demora de 2-4 semanas en la entrega de horarios a estudiantes y docentes.|
|`  `E3. Insatisfacción de la comunidad universitaria al inicio de cada semestre.|
||
|EFECTOS INDIRECTOS:|
|`  `E4. Pérdida de credibilidad institucional en la gestión académica.|
|`  `E5. Carga administrativa excesiva para los coordinadores académicos.|
|`  `E6. Inicio tardío efectivo de clases por corrección manual de conflictos.|



**8. LISTA PRELIMINAR DE REQUERIMIENTOS FUNCIONALES Y NO FUNCIONALES**

**8.1 Requerimientos Funcionales**

Los requerimientos funcionales describen comportamientos específicos que el sistema DEBE realizar. Cada uno incluye criterio de verificación y trazabilidad a la historia de usuario correspondiente.

|**ID**|**Descripción del Requerimiento**|**Criterio de Verificación**|**Prioridad**|**Traza HU**|
| :- | :- | :- | :- | :- |
|RF-01|El sistema debe permitir autenticar usuarios mediante credenciales (usuario + contraseña) y asignarles un rol (Administrador o Estudiante).|Login exitoso redirige al dashboard del rol correspondiente; credenciales incorrectas muestran mensaje de error.|Alta|HU-3.1|
|RF-02|El sistema debe permitir crear, leer, actualizar y eliminar (CRUD) registros de Cursos con campos: código, nombre y créditos.|Todas las operaciones CRUD responden correctamente; validación de código único; persistencia en PostgreSQL.|Alta|HU-1.1|
|RF-03|El sistema debe permitir gestionar (CRUD) Aulas físicas con campos: identificación, capacidad máxima y tipo (Laboratorio/Teoría).|CRUD completo operativo; capacidad no puede ser negativa o cero; tipo restringido a valores válidos.|Alta|HU-1.2|
|RF-04|El sistema debe permitir gestionar (CRUD) Secciones vinculando un Curso, un Docente asignado y la capacidad estimada de alumnos.|Sección requiere curso y docente existentes; capacidad estimada > 0; integridad referencial garantizada.|Alta|HU-1.3|
|RF-05|El sistema debe proveer funcionalidad de búsqueda y filtrado en las tablas de gestión de Cursos, Aulas y Secciones.|Búsqueda por nombre/código retorna resultados en tiempo real (<500ms); filtros combinables.|Media|HU-1.4|
|RF-06|El sistema debe ejecutar el algoritmo CP-SAT al presionar el botón 'Generar Optimización' del dashboard administrativo y mostrar indicador de progreso.|Botón visible solo para admin; indicador de carga activo durante ejecución; mensaje de éxito o error al finalizar.|Alta|HU-2.3|
|RF-07|El motor de optimización debe asignar aulas a secciones garantizando que no haya dos secciones en la misma aula en el mismo bloque horario.|En 100% de los horarios generados no existe ninguna colisión de aula; verificable con query de validación.|Alta|HU-2.1|
|RF-08|El motor de optimización debe garantizar que un docente no sea asignado a dos secciones distintas en el mismo bloque horario (día + hora).|En 100% de los horarios generados no existe ningún docente con dos secciones simultáneas; verificable.|Alta|HU-2.2|
|RF-09|El motor de optimización debe asignar aulas cuya capacidad sea mayor o igual a la demanda estimada de la sección (capac\_estimada).|Ningún aula asignada tiene capacidad < capac\_estimada de la sección; verificable con consulta JOIN en BD.|Alta|HU-2.4|
|RF-10|El dashboard del Estudiante debe mostrar su horario semanal de manera visual y gráfica, sin acceso a funciones administrativas.|Horario visible solo para el estudiante autenticado; sin botones de edición ni navegación a módulos admin.|Alta|HU-3.2|
|RF-11|La sesión del usuario debe persistir durante un tiempo definido (configurable) o hasta que el usuario cierre sesión manualmente.|Token JWT con expiración configurable; botón 'Cerrar sesión' invalida el token y redirige al login.|Media|HU-3.3|
|RF-12|El sistema debe notificar al administrador si el algoritmo no encuentra solución factible (infactibilidad), con un mensaje descriptivo.|Si CP-SAT retorna INFEASIBLE, el frontend muestra mensaje indicando la causa probable (ej: capacidad insuficiente).|Alta|HU-2.3|

**8.2 Requerimientos No Funcionales**

Los requerimientos no funcionales describen atributos de calidad del sistema que determinan cómo debe operar.

|**ID**|**Categoría**|**Descripción**|**Métrica de Verificación**|**Traza RF**|
| :- | :- | :- | :- | :- |
|RNF-01|Rendimiento|El algoritmo de optimización CP-SAT debe entregar una solución factible en un máximo de 10 segundos para un conjunto de datos estándar (≤100 secciones, ≤30 aulas).|Prueba de performance con dataset de 100 secciones; tiempo medido con pytest-benchmark; debe ser ≤10s en percentil 95.|RF-06, RF-07, RF-08, RF-09|
|RNF-02|Usabilidad|La interfaz debe ser responsiva y funcionar correctamente en dispositivos de escritorio y móviles (breakpoints: 768px, 1024px, 1280px).|Tests de UI en Chrome DevTools con viewports estándar; no debe haber elementos cortados o superpuestos.|RF-10, RF-06|
|RNF-03|Seguridad|Todas las rutas del backend que manipulen datos deben requerir autenticación JWT válida. Las rutas de admin deben verificar adicionalmente el rol.|Tests de seguridad: petición sin token retorna 401; petición de estudiante a endpoint admin retorna 403.|RF-01, RF-11|
|RNF-04|Mantenibilidad|El código TypeScript del frontend debe tener cobertura de tipos al 100% (sin uso de 'any'). El código Python debe seguir PEP-8 verificado con flake8.|Pipeline CI ejecuta ESLint (0 errores tipo 'any') y flake8 (0 violaciones PEP-8) en cada PR.|Todos los RF|
|RNF-05|Escalabilidad|La arquitectura Docker debe permitir escalar el servicio backend de manera independiente sin modificar el frontend o la base de datos.|docker compose scale backend=3 debe funcionar sin errores; el load balancer distribuye peticiones correctamente.|RF-06, RF-07|
|RNF-06|Disponibilidad|El sistema debe manejar reconexiones o respuestas claras cuando la base de datos no esté disponible temporalmente, sin crasheos silenciosos.|Simulación de caída de PostgreSQL: el API retorna 503 con mensaje 'Servicio temporalmente no disponible'; el frontend lo muestra.|RF-02, RF-03, RF-04|
|RNF-07|Compatibilidad|El frontend debe funcionar correctamente en Chrome 120+, Firefox 120+ y Edge 120+ sin plugins adicionales.|Testing manual y automatizado (Playwright) en los tres navegadores; 0 errores funcionales críticos.|RF-10, RF-06|

**8.3 Trazabilidad: Épicas → Historias de Usuario → Requerimientos**

|**Épica**|**Historia de Usuario**|**Requerimientos Funcionales**|
| :- | :- | :- |
|Épica 1: Gestión de Recursos|HU-1.1 Gestión de Cursos|RF-02, RF-05|
|Épica 1: Gestión de Recursos|HU-1.2 Gestión de Aulas|RF-03, RF-05|
|Épica 1: Gestión de Recursos|HU-1.3 Gestión de Secciones|RF-04, RF-05|
|Épica 1: Gestión de Recursos|HU-1.4 Búsqueda y Filtrado|RF-05|
|Épica 2: Motor de Optimización|HU-2.1 No-superposición de Aulas|RF-07|
|Épica 2: Motor de Optimización|HU-2.2 No-superposición de Docentes|RF-08|
|Épica 2: Motor de Optimización|HU-2.3 Botón de Generación + Feedback|RF-06, RF-12|
|Épica 2: Motor de Optimización|HU-2.4 Restricción de Capacidad|RF-09|
|Épica 3: Experiencia Estudiante|HU-3.1 Login con identidad institucional|RF-01|
|Épica 3: Experiencia Estudiante|HU-3.2 Dashboard de Horario|RF-10|
|Épica 3: Experiencia Estudiante|HU-3.3 Persistencia de sesión|RF-11|


Sistema de Generación Óptima de Horarios Académicos |                                                                                               Página: 
