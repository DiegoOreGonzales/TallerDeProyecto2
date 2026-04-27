Universidad Continental — SGOHA v1.0    Documentación de Inicio de Proyecto

**UNIVERSIDAD CONTINENTAL**

Facultad de Ingeniería de Sistemas

**SISTEMA DE GENERACIÓN ÓPTIMA DE HORARIOS ACADÉMICOS**

DOCUMENTACIÓN DE INICIO DE PROYECTO

Integrantes: 

- Bacilio de la Cruz, Jose Anthony
- Gutierrez Taipe, Luis Alberto
- Oré Gonzales, Diego Isaac
- Requena Lavi, Aldo Alexandre

Versión: 1.0 | Fecha: Abril 2026

Metodología: Scrum / Desarrollo Ágil

Repositorio: <https://github.com/DiegoOreGonzales/TallerDeProyecto2.git>

**7. DOCUMENTO INICIAL DEL PROBLEMA** 

**7.1 Contexto Organizacional**

La Universidad Continental es una institución de educación superior privada con múltiples facultades y programas académicos activos. Cada semestre, la institución debe elaborar horarios académicos que asignen secciones de cursos a aulas físicas en bloques de tiempo específicos, considerando la disponibilidad de docentes y la demanda estudiantil de cada sección.

La Universidad Continental utiliza el sistema ERP Banner para la gestión de matrículas; sin embargo, la programación académica generada por los procesos actuales presenta ineficiencias críticas. Los horarios resultantes no son factibles para los estudiantes debido a discrepancias severas entre la disponibilidad horaria real y la oferta programada, además de presentar cruces de horarios y aulas que impactan la operatividad institucional de manera constante.

**7.2 Enunciado del Problema Principal**

|PROBLEMA CENTRAL: El sistema actual de programación académica (Banner) en la Universidad Continental es ineficiente y produce horarios no factibles para los estudiantes, caracterizados por discrepancias entre la disponibilidad y la carga horaria, así como cruces constantes de recursos que degradan la experiencia educativa y la eficiencia administrativa.|
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

|CAUSA RAÍZ: Limitaciones del motor de programación actual para manejar restricciones complejas de simultaneidad y optimización matemática.|
| :- |
||
|CAUSAS DIRECTAS:|
|`  `C1. El sistema actual no garantiza la factibilidad de los horarios respecto a la disponibilidad real de estudiantes y docentes.|
|`  `C2. El ERP Banner no cuenta con un motor de optimización matemática (solver) que resuelva el problema de asignación de manera integral.|
|`  `C3. Insuficiencia en las validaciones algorítmicas de cruces de horarios y aforos en los procesos de carga masiva.|
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
