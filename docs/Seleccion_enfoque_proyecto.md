Universidad Continental — SGOHA v1.0
**SISTEMA DE GENERACIÓN ÓPTIMA DE HORARIOS ACADÉMICOS**

**1. DOCUMENTO DE SELECCIÓN DEL ENFOQUE DEL PROYECTO**

**1.1 Descripción del Problema Central**

La Universidad Continental enfrenta un proceso manual y propenso a errores en la elaboración de horarios académicos cada semestre. Actualmente, los coordinadores académicos dedican entre 2 y 4 semanas para construir horarios que satisfagan restricciones de aulas, docentes y demanda estudiantil. Este proceso genera conflictos frecuentes: superposición de docentes, asignación de aulas con capacidad insuficiente y desbalance en la distribución de carga horaria.

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
