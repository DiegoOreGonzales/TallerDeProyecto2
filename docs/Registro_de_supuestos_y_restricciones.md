Universidad Continental — SGOHA v1.0
**SISTEMA DE GENERACIÓN ÓPTIMA DE HORARIOS ACADÉMICOS**

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
