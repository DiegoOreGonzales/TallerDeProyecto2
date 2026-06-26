# Registro de Supuestos Validado (Assumption Log)
**Sistema de Generación Óptima de Horarios Académicos (SGOHA)**

---

## 1. Introducción

El **Registro de Supuestos (Assumption Log)** es una herramienta de gestión del proyecto que documenta las premisas que el equipo de desarrollo consideró como verdaderas para la planificación, estimación y diseño técnico. Durante la **Fase de Control y Cierre (Inspección 08)**, evaluamos y validamos de forma retrospectiva cada uno de estos supuestos para determinar su veracidad, el impacto real que tuvieron sobre el proyecto y las acciones de contingencia ejecutadas.

---

## 2. Matriz de Validación de Supuestos

A continuación se presenta el estado de validación final de los supuestos identificados en el ciclo de vida del proyecto:

| ID | Supuesto Inicial | Método de Validación | Estado Final | Impacto / Acción Tomada |
| :--- | :--- | :--- | :--- | :--- |
| **SUP-01** | La Universidad Continental dispone de datos estructurados y limpios de docentes, aulas y cursos al inicio del proyecto. | Análisis de archivos CSV de carga provistos por la Coordinación Académica. | **VALIDADO** | **Bajo:** Los datos entregados contaban con la estructura mínima requerida para alimentar el esquema relacional de PostgreSQL. |
| **SUP-02** | El equipo de desarrollo tiene acceso continuo a computadoras con Python 3.11, Node.js 18+ y Docker instalados. | Verificación de entornos de desarrollo de los miembros del equipo durante el Sprint 0. | **VALIDADO** | **Bajo:** Todo el equipo configuró sus entornos locales correctamente, permitiendo el uso de contenedores sin fricción. |
| **SUP-03** | Los usuarios administradores poseen conocimientos básicos de informática para operar un sistema web moderno. | Pruebas de usabilidad UX y entrevistas guiadas con coordinadores académicos. | **VALIDADO** | **Bajo:** Los administradores se adaptaron fácilmente a la interfaz React SPA debido a la simplicidad del diseño y los flujos intuitivos. |
| **SUP-04** | **Suficiencia de Infraestructura Física:** La universidad dispone de aulas físicas y laboratorios especializados suficientes en todo momento para cubrir la demanda de asignaturas. | Pruebas de estrés y procesamiento de lotes reales de asignaturas con alta demanda horaria. | **FALSO** | **Alto:** La escasez de laboratorios especializados provocó infactibilidad matemática irresoluble en el motor de optimización CP-SAT. <br><br>**Acción de Contingencia:** Se implementó un *switch de flexibilización* en el frontend de React para omitir de forma segura las restricciones de compatibilidad del tipo de aula, logrando sugerir soluciones viables. |
| **SUP-05** | Las restricciones de horarios se limitan a: no-superposición de aulas, no-superposición de docentes y capacidad física (sin reglas ocultas). | Contraste de especificaciones del motor con las políticas institucionales de la Dirección Académica. | **VALIDADO** | **Bajo:** El modelo CP-SAT cubrió con éxito todas las restricciones de negocio necesarias sin necesidad de rediseñar las fórmulas del solver. |
| **SUP-06** | El servidor de producción donde se desplegará el sistema tendrá acceso a internet para descarga de imágenes y actualizaciones. | Pruebas de despliegue en la infraestructura AWS configurada. | **VALIDADO** | **Bajo:** La infraestructura cloud en AWS permitió la descarga y orquestación de imágenes directamente desde Docker Hub. |
| **SUP-07** | El número máximo de secciones por semestre no superará las 200 unidades, manteniendo la eficiencia del solucionador CP-SAT. | Pruebas de carga masiva en el backend con datasets sintéticos de 100, 150 y 200 secciones. | **VALIDADO** | **Bajo:** El tiempo de resolución en el peor de los casos (200 secciones) se mantuvo por debajo de los 2.0 segundos límite, garantizando la UX. |

---

## 3. Análisis de Supuestos Críticos y Plan de Contingencia

### El Caso Crítico: Falsedad de la Suficiencia de Aulas (SUP-04)

El supuesto **SUP-04** asumía que la universidad siempre contaría con suficientes aulas físicas y laboratorios especializados para albergar todas las secciones sin conflicto. 

#### 1. Cómo se detectó la falla:
Durante las pruebas de integración del Sprint 3, al procesar lotes reales de asignaturas correspondientes a la facultad de Ingeniería, el motor CP-SAT de Google OR-Tools retornaba constantemente un estado de `INFEASIBLE` (infactible). Esto significa que las restricciones duras del modelo matemático impedían hallar cualquier combinación horaria válida. Al analizar la matriz de recursos, confirmamos que el número de secciones que requerían laboratorios de cómputo en bloques coincidentes superaba la cantidad real de laboratorios disponibles.

#### 2. Impacto técnico:
El motor matemático se bloqueaba e impedía que el administrador pudiera generar un borrador de horario, dejando al sistema inoperativo para cargas de trabajo densas.

#### 3. Solución y Contingencia Implementada:
Para garantizar la resiliencia del software, se introdujo una solución a nivel de frontend y backend:
* **Frontend React:** Se integró un control interactivo del tipo switch denominado **"Flexibilizar Tipos de Aula"** en la consola de generación.
* **Backend FastAPI:** Al activarse este switch, el backend intercepta el payload y relaja de forma controlada la restricción de tipo de aula en el modelo CP-SAT, permitiendo al solver asignar un aula regular a clases de laboratorio si no hay laboratorios disponibles.
* **Resultado:** El motor resuelve el problema de forma exitosa en < 2 segundos, y la UI resalta con una alerta visual de advertencia aquellas secciones que fueron reasignadas temporalmente a aulas comunes para que el administrador tome acción manual si lo desea.

---

## 4. Conclusiones para el Cierre

El monitoreo continuo del Registro de Supuestos durante los Sprints permitió reaccionar rápidamente ante supuestos falsos que habrían representado un fracaso rotundo en el despliegue del sistema. La lección aprendida clave es que **toda restricción dura en un motor de optimización matemática debe poseer un switch de tolerancia o flexibilización** que garantice la continuidad operativa del software en situaciones de escasez de recursos físicos reales.
