Universidad Continental — SGOHA v1.0
**SISTEMA DE GENERACIÓN ÓPTIMA DE HORARIOS ACADÉMICOS**

**3. PROJECT CHARTER**

**3.1 Identificación del Proyecto**

|**Campo**|**Detalle**|
| :- | :- |
|Nombre del Proyecto|Sistema de Generación Óptima de Horarios Académicos (SGOHA)|
|Patrocinador|Universidad Continental — Dirección de Tecnologías de la Información|
|Cliente Principal|Coordinación Académica de la Universidad Continental|
|Líder del Proyecto (Scrum Master)|Diego Isaac Oré Gonzales|
|Fecha de Inicio|Marzo 2026|
|Fecha Estimada de Entrega|Julio 2026 (Incremento 1.0 funcional)|
|Versión del Charter|1\.0|
|Estado|Aprobado — En ejecución|

**3.2 Justificación del Proyecto**

A pesar de contar con un sistema ERP (Banner), la programación de horarios en la Universidad Continental presenta fallas críticas de factibilidad. El motor actual no logra procesar eficientemente el volumen de restricciones simultáneas (disponibilidad de docentes, capacidad de aulas, demanda de secciones), resultando en horarios que no coinciden con la disponibilidad real y presentan constantes cruces de recursos. La implementación del SGOHA responde directamente a la necesidad estratégica de reemplazar este proceso subóptimo por una solución basada en tecnología matemática comprobada (CP-SAT), garantizando factibilidad absoluta y alineándose con el plan de transformación digital de la institución.

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
|Product Owner|Jose Anthony Bacilio de la Cruz|Pendiente de firma|
|Scrum Master|Diego Isaac Oré Gonzales|Pendiente de firma|
|Líder Técnico Backend|Aldo Alexandre Requena Lavi|Pendiente de firma|
|Líder Técnico Frontend|Luis Alberto Gutierrez Taipe|Pendiente de firma|
