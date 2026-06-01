Taller de proyectos 2 – Ingeniería de Sistemas e Informática


CONSIGNA ACADÉMICA – EVALUACIÓN DE PLANIFICACIÓN, SPEC-
DRIVEN DEVELOPMENT Y GESTIÓN DEL REPOSITORIO

1. Contexto del Proyecto
El presente encargo se desarrolla en el marco del Proyecto de Fin de Asignatura (PFA), orientado al
diseño e implementación de un Sistema de Generación Óptima de Horarios Académicos en Entornos
de Currículo Flexible. Este problema constituye un problema complejo de ingeniería, caracterizado
por:
a. Requisitos dinámicos y parcialmente definidos
b. Múltiples restricciones interdependientes
c. Conflictos entre actores y recursos
d. Necesidad de modelado formal (CSP / optimización combinatoria)
e. Ausencia de soluciones únicas o triviales
f. En este contexto, la presente actividad evalúa la capacidad del estudiante para estructurar,
analizar y gestionar el desarrollo del sistema, más allá de su implementación.
2. Propósito de la Actividad
El objetivo es que los estudiantes demuestren competencias en:
a. Planificación ágil de proyectos complejos
b. Aplicación del enfoque Spec-Driven Development (SDD) para reducir ambigüedad
c. Gestión profesional del ciclo de desarrollo mediante GitHub
d. Evaluación de costos, riesgos e impacto del sistema
Se enfatiza el análisis crítico del problema, la justificación de decisiones y la coherencia entre
artefactos.
3. Entregables Obligatorios
3.1. Planificación del Proyecto (Jira)
Se debe evidenciar una planificación estructurada y coherente con la complejidad del problema.
a. Artefactos requeridos
1o Backlog del producto
i. Historias de usuario correctamente formuladas
ii. Priorización basada en valor, riesgo y complejidad
iii. Relación con restricciones del problema (CSP)
2o Estructuración del trabajo
i. Épicas alineadas a funcionalidades críticas
ii. Versiones (releases) coherentes con entregables
iii. Sprints definidos con objetivos claros
3o Gestión temporal
i. Cronograma del proyecto
ii. Identificación de dependencias y ruta crítica

Taller de proyectos 2 – Ingeniería de Sistemas e Informática

2/6
4o Métricas ágiles (obligatorio incluir análisis)
i. Gráfico de trabajo hecho (Burnup)
ii. Gráfico de trabajo pendiente (Burndown)
iii. Gráfico de velocidad
iv. Gráfico de control
b. Análisis esperado
1o Interpretación de la evolución del proyecto
2o Identificación de cuellos de botella
3o Evaluación de la estabilidad del equipo (variabilidad de velocidad)
4o Coherencia entre planificación y complejidad del problema
3.2. Presupuesto del Proyecto
Se debe presentar un análisis económico integral del sistema.
a. Elementos requeridos
1o Fuente de costos
i. Recursos humanos (roles, horas estimadas)
ii. Infraestructura tecnológica
iii. Costos indirectos
2o Evolución de costos
i. Costos a lo largo del tiempo
ii. Costos por Sprint
iii. Costo acumulado del proyecto
b. Análisis esperado
1o Relación entre complejidad del problema y costo del sistema
2o Identificación de factores de incremento de costos
3o Evaluación de sostenibilidad (enfoque Green Software)
3.3. Gestión de Riesgos y Oportunidades
a. El equipo debe anticipar escenarios críticos del proyecto.
Registros obligatorios
1o Registro de riesgos
i. Descripción del riesgo
ii. Probabilidad e impacto
iii. Estrategia de mitigación
2o Registro de oportunidades
i. Impacto positivo esperado
ii. Estrategia de aprovechamiento

Taller de proyectos 2 – Ingeniería de Sistemas e Informática

3/6

b. Análisis esperado
1o Relación de riesgos con:
i. Restricciones del problema (CSP)
ii. Limitaciones técnicas
iii. Dependencias externas
3.4. Spec-Driven Development (SDD)
Se evaluará la formalización del sistema antes de su implementación.
a. Artefactos requeridos
1o Agents.md o constitution.md
i. Principios del sistema
ii. Reglas globales
iii. Restricciones duras y blandas
2o Spec.md
i. Especificación formal del sistema
ii. Definición de:
Entradas
Salidas
Reglas de negocio
Casos límite
b. Análisis esperado
1o Coherencia entre:
i. Especificación
ii. Modelado del problema
iii. Implementación
2o Reducción de ambigüedad en requerimientos
3o Anticipación de conflictos (ej. solapamientos de horarios)
3.5. Gestión del Repositorio en GitHub
a. El repositorio debe evidenciar un proceso de desarrollo profesional.
b. Elementos obligatorios
1o Estrategia de ramas (Git Flow o equivalente)
2o Commits semánticos
3o Pull Requests con revisión
4o Desarrollo incremental
c. Artefactos mínimos
1o README.md completo:

Taller de proyectos 2 – Ingeniería de Sistemas e Informática

4/6
i. Descripción del sistema
ii. Instrucciones de instalación
iii. Arquitectura
2o Evidencia de:
i. Integración de funcionalidades
ii. Evolución del sistema
d. Análisis esperado
1o Trazabilidad entre:
i. Backlog (Jira)
ii. Commits
iii. Funcionalidades implementadas
2o Evidencia de trabajo colaborativo real

4. Consideraciones Metodológicas
4.1. El proyecto debe abordarse como un problema complejo, no como una solución trivial.
4.2. Se debe evidenciar:
a. Modelado
b. Análisis
c. Toma de decisiones fundamentadas
4.3. Se valorará:
a. Identificación de trade-offs técnicos
b. Propuestas de mejora
c. Evaluación
4.4. Los estudiantes deben revisar la rúbrica oficial del PFA, la cual define los criterios de evaluación
por competencias.
4.5. La evaluación considerará aspectos como:
a. Análisis del problema
b. Modelado formal
c. Diseño de solución
d. Implementación
e. Calidad del software
f. Documentación e impacto

Taller de proyectos 2 – Ingeniería de Sistemas e Informática

1/6
Rúbrica de evaluación -

Criterio / Indicador Sobresaliente (3) Suficiente (2) En desarrollo (1) Insatisfactorio (0)

Planificación del proyecto en Jira: backlog completo
con historias bien formuladas, priorización basada en
valor/riesgo/complejidad, relación con restricciones
del problema (CSP), épicas coherentes, releases
definidos, sprints con objetivos claros, cronograma con
dependencias y ruta crítica

Planificación integral, backlog
refinado y trazable al
problema CSP, priorización
justificada con métricas,
sprints y releases totalmente
coherentes, cronograma
optimizado con ruta crítica
validada

Cumple con backlog,
priorización y
estructura básica de
sprints/releases sin
inconsistencias críticas

Backlog incompleto o
mal formulado,
priorización débil,
sprints poco claros o
sin coherencia

No presenta
planificación o es
incoherente con
el problema

Métricas ágiles: inclusión de burndown, burnup,
velocidad y control; análisis de evolución del proyecto,
identificación de cuellos de botella y estabilidad del
equipo

Métricas completas con
interpretación profunda,
identifica patrones, cuellos de
botella y propone mejoras
basadas en datos

Incluye métricas
requeridas con
interpretación básica
sin errores relevantes

Métricas incompletas
o análisis superficial

No incluye
métricas o son
incorrectas

Presupuesto del proyecto: identificación de costos
(RRHH, infraestructura, indirectos), evolución
temporal, costo por sprint y acumulado, análisis de
sostenibilidad (Green Software)

Presupuesto detallado,
cuantificado y justificado;
análisis financiero profundo
con relación clara a
complejidad y sostenibilidad

Presupuesto completo
con estimaciones
razonables y análisis
básico

Presupuesto
incompleto o con
estimaciones poco
claras

No presenta
presupuesto o es
incorrecto

Análisis de costos: relación entre complejidad del
problema, identificación de factores de incremento y
evaluación de sostenibilidad

Relaciona costos con
complejidad del CSP, identifica
drivers de costo y propone
optimización sostenible

Relación general entre
costo y complejidad
sin profundidad
analítica

Análisis superficial o
parcialmente
incorrecto

No realiza
análisis

Gestión de riesgos y oportunidades: registro de riesgos
con probabilidad/impacto/mitigación, registro de
oportunidades con estrategias, relación con
restricciones y dependencias

Identificación exhaustiva de
riesgos y oportunidades,
análisis cuantitativo y
estrategias sólidas alineadas al

Registros completos
con análisis básico y
coherente

Registros
incompletos o poco
claros

No presenta
gestión de
riesgos

Taller de proyectos 2 – Ingeniería de Sistemas e Informática

2/6

Criterio / Indicador Sobresaliente (3) Suficiente (2) En desarrollo (1) Insatisfactorio (0)

problema

Spec-Driven Development (SDD):
Agents.md/constitution.md con principios y
restricciones, Spec.md con entradas, salidas, reglas y
casos límite, reducción de ambigüedad

Especificación formal
completa, consistente y sin
ambigüedades; anticipa
conflictos complejos del
sistema

Especificación
completa con ligera
ambigüedad pero
funcional

Especificación
incompleta o
inconsistente

No presenta
especificación

Coherencia SDD: alineación entre especificación,
modelado del problema e implementación,
anticipación de conflictos

Coherencia total entre
artefactos; evidencia
trazabilidad y resolución
anticipada de conflictos

Coherencia general
con pequeñas
inconsistencias

Inconsistencias
notorias entre
artefactos

No existe
coherencia

Gestión del repositorio en GitHub: uso de Git Flow,
commits semánticos, pull requests, desarrollo
incremental, README completo y evidencia de
evolución

Flujo profesional completo,
commits bien estructurados,
PR revisados, documentación
excelente y evolución clara del
sistema

Cumple con flujo,
commits y
documentación
mínima sin errores
graves

Uso parcial de buenas
prácticas o
documentación
incompleta

No cumple con
buenas prácticas
de repositorio

Trazabilidad del desarrollo: relación entre backlog
(Jira), commits y funcionalidades implementadas,
evidencia de trabajo colaborativo

Trazabilidad completa y
verificable; evidencia clara de
colaboración real del equipo

Trazabilidad general
con algunas omisiones

Trazabilidad débil o
poco clara

No existe
trazabilidad

Análisis del problema y toma de decisiones: modelado
del problema complejo, identificación de trade-offs
técnicos y justificación de decisiones

Análisis profundo del
problema, decisiones
justificadas con criterios

técnicos y evidencia de trade-
offs

Análisis adecuado con
justificación básica

Análisis superficial o
poco fundamentado

No analiza el
problema

Calidad global de los artefactos: coherencia, claridad,
integración entre planificación, costos, riesgos, SDD y
repositorio

Integración total de todos los
artefactos, alta calidad técnica
y consistencia global

Integración adecuada
con ligeras
inconsistencias

Integración parcial o
débil

Artefactos
inconexos o
inexistentes