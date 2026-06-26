# Informe Final de Lecciones Aprendidas (Lessons Learned)
**Sistema de Generación Óptima de Horarios Académicos (SGOHA)**

---

## 1. Introducción

El presente documento recopila las lecciones aprendidas y retrospectivas consolidadas durante la ejecución del proyecto **SGOHA**. Como parte de la Inspección 08 (Fase de Control y Cierre), este informe sirve para transferir el conocimiento adquirido a futuros proyectos de desarrollo de software y optimización matemática de la Universidad Continental.

---

## 2. Gestión de Proyecto y Metodología Ágil (Scrum)

El rol de Scrum Master y analista UX desempeñó un papel crucial en mantener la velocidad del equipo y asegurar que la interfaz de usuario respondiera a las necesidades reales del personal de Coordinación Académica.

### Lecciones Clave en Gestión:
* **Planificación del Sprint y Sizing Realista:** Inicialmente subestimamos la complejidad de integrar Google OR-Tools con el backend de FastAPI. A partir del Sprint 2, adoptamos técnicas de estimación basadas en puntos de historia más realistas, lo que estabilizó nuestra velocidad de entrega.
* **Daily Standups Efectivos:** Las reuniones de sincronización diaria permitieron identificar tempranamente cuellos de botella (como la integración de esquemas relacionales en PostgreSQL), permitiendo al Líder Técnico Backend y al Líder Técnico Frontend trabajar en parejas para resolver bloqueos rápidamente.
* **Importancia de la Prototipación UX:** Diseñar wireframes interactivos en la fase inicial evitó costosos cambios de interfaz en etapas avanzadas de codificación. La retroalimentación temprana del cliente final validó la disposición de los paneles CRUD antes de su desarrollo en React.

---

## 3. Desarrollo Técnico y Arquitectura

La implementación de un stack moderno y contenerizado trajo importantes ventajas, pero también retos de ingeniería.

### Lecciones Técnicas:
* **Dockerización Total:** El uso de Docker y Docker Compose eliminó por completo el problema de "funciona en mi máquina". La homogeneidad entre los entornos de desarrollo local de los integrantes y el entorno de despliegue en la nube facilitó la integración continua.
* **Optimización del Solver CP-SAT:** Google OR-Tools CP-SAT es sumamente eficiente, pero sensible al modelado de variables. Aprendimos que representar los bloques horarios como variables enteras continuas en lugar de booleanos dispersos redujo drásticamente el uso de memoria y el tiempo de resolución a menos de 2 segundos.

---

## 4. Gestión de Supuestos y el Incidente de la Incompatibilidad de Aulas

La lección más importante y crítica del proyecto provino del proceso de validación del **Assumption Log** (Registro de Supuestos).

### El Incidente de Infactibilidad por Escasez de Aulas:
* **El Supuesto Erróneo:** Asumimos inicialmente que la infraestructura física de la universidad disponía en todo momento de suficientes aulas y laboratorios especializados para cubrir cualquier distribución de asignaturas.
* **La Realidad:** Al iniciar las pruebas con conjuntos de datos reales y masivos en el motor de optimización, el solucionador CP-SAT retornaba constantemente un estado de **INFACTIBLE** (no resoluble). Al analizar los logs detallados del motor, descubrimos que la escasez de laboratorios de cómputo especializados provocaba un conflicto matemático irresoluble: las restricciones duras impedían asignar múltiples secciones que requerían el mismo tipo de aula en el mismo bloque horario.
* **Acción de Contingencia Técnica:** Para resolver esta limitación sin comprometer la viabilidad del software, se diseñó e implementó un **switch de flexibilización** en la interfaz del frontend de React. Este botón permite al administrador desactivar temporalmente o relajar la restricción dura de compatibilidad del tipo de aula de forma segura. Si el switch está activo, el motor de optimización puede sugerir aulas comunes para resolver la infactibilidad, notificando al usuario mediante una alerta visual.
* **Lección Aprendida:** En sistemas basados en modelos matemáticos de optimización, las restricciones duras del mundo real deben diseñarse con mecanismos de flexibilidad. Un modelo matemáticamente "perfecto" es inútil si la escasez de recursos físicos del mundo real impide encontrar una solución. Los ingenieros de software deben proveer siempre switches o mecanismos de tolerancia que permitan al usuario de negocio flexibilizar restricciones críticas bajo su propio criterio.

> [!WARNING]
> Nunca se debe asumir que los recursos físicos de una organización serán infinitos o siempre suficientes. Diseñar resiliencia en el software implica preparar al sistema para fallar de manera controlada y ofrecer alternativas de flexibilización al usuario.

---

## 5. Recomendaciones para Proyectos Futuros

1. **Establecer un Buffer de Flexibilización desde el Diseño:** En cualquier sistema de optimización de recursos, mapear cuáles restricciones son "duras" (inviolables, como cruces de docentes) y cuáles son "blandas" o flexibilizables (como el tipo específico de aula).
2. **Backups y Migraciones con Alembic:** Mantener un control estricto de las versiones de base de datos relacionales para evitar inconsistencias de datos estructurados que puedan confundir al motor matemático.
3. **Validación Temprana de Datos de Entrada:** Implementar esquemas de validación rigurosos en el backend (Pydantic) para filtrar datos corruptos o incompletos antes de enviarlos a la pila del solucionador.
