# Informe Final del Proyecto (Final Project Report)
**Sistema de Generación Óptima de Horarios Académicos (SGOHA)**

---

## 1. Identificación del Proyecto

| Campo | Detalle |
| :--- | :--- |
| **Nombre del Proyecto** | Sistema de Generación Óptima de Horarios Académicos (SGOHA) |
| **Patrocinador** | Universidad Continental — Dirección de Tecnologías de la Información |
| **Cliente Principal** | Coordinación Académica de la Universidad Continental |
| **Líder del Proyecto (Scrum Master)** | Diego Isaac Oré Gonzales |
| **Fecha de Inicio** | Marzo 2026 |
| **Fecha de Cierre** | Julio 2026 |
| **Versión del Informe** | 1.0 (Final) |
| **Estado** | Completado y Entregado |

---

## 2. Resumen Ejecutivo

El proyecto **SGOHA** ha culminado exitosamente con la entrega de un sistema web integral y automatizado para la generación de horarios académicos sin conflictos de recursos. Mediante el uso del motor de optimización matemática **Google OR-Tools CP-SAT**, el sistema ha logrado reducir el tiempo de elaboración de horarios de semanas de trabajo manual a un procesamiento automatizado de menos de **2 segundos** para el conjunto de datos estándar. La arquitectura implementada en contenedores **Docker** garantiza la portabilidad y consistencia del entorno de ejecución tanto localmente como en la nube.

---

## 3. Objetivos Alcanzados vs. Planificados

| Objetivo Planificado | Estado | Evidencia / Logro |
| :--- | :--- | :--- |
| **1. Arquitectura en Contenedores** | **100% Logrado** | Configuración completa de `docker-compose.yml` que orquesta Frontend (React), Backend (FastAPI) y Base de Datos (PostgreSQL). |
| **2. API RESTful con FastAPI** | **100% Logrado** | Endpoints de alta velocidad documentados con Swagger/OpenAPI para CRUDs y optimización de horarios. |
| **3. Interfaz Web React SPA** | **100% Logrado** | Interfaz de usuario intuitiva con roles diferenciados para Administrador y Estudiante, optimizada para resolución web y móvil. |
| **4. Integración del Motor CP-SAT** | **100% Logrado** | Modelo matemático que resuelve de manera exacta las restricciones de no-superposición de docentes, coincidencia de aulas y capacidad. |
| **5. Tiempo de Respuesta < 2s** | **100% Logrado** | Pruebas de rendimiento demuestran la resolución del modelo en menos de 2 segundos en escenarios estándar (hasta 100 secciones). |

---

## 4. Costo del Ciclo de Vida del Software (LCC)

Para evaluar la sostenibilidad financiera y el impacto a largo plazo de la solución, se calculó el **Costo del Ciclo de Vida (Life Cycle Cost - LCC)** a un horizonte temporal de **3 años**.

El LCC consolida los costos de adquisición, operación y mantenimiento bajo la siguiente estructura:

$$LCC = \text{Costo de Adquisición y Desarrollo} + \text{Costo de Operación (Cloud)} + \text{Costo de Mantenimiento}$$

### Desglose del Cálculo (Horizonte de 3 años):

1. **Adquisición y Desarrollo (Fase de Proyecto):**
   * **Costo de Desarrollo:** **$12,450 USD** (incluye horas de ingeniería de software, análisis de UX, gestión de proyecto y aseguramiento de la calidad).
2. **Operación y Nube (AWS Cloud):**
   * **Costo mensual estimado:** $120 USD (servicios de computación EC2, base de datos RDS administrada y transferencia de datos).
   * **Costo a 36 meses:** $120 USD $\times$ 36 meses = **$4,320 USD**.
3. **Mantenimiento (Bugs, Smells y Actualizaciones):**
   * **Costo anual estimado:** $500 USD (soporte técnico preventivo y correctivo, resolución de bugs menores y optimizaciones de deuda técnica).
   * **Costo a 3 años:** $500 USD $\times$ 3 = **$1,500 USD**.

### Resumen del LCC:

| Rubro | Costo Parcial (USD) | Porcentaje del LCC |
| :--- | :--- | :--- |
| **Desarrollo y Adquisición** | $12,450.00 | 68.1% |
| **Operación y Cloud (AWS)** | $4,320.00 | 23.6% |
| **Mantenimiento Técnico** | $1,500.00 | 8.3% |
| **TOTAL LCC (3 Años)** | **$18,270.00** | **100.0%** |

> [!NOTE]
> La implementación de una arquitectura basada en contenedores **Docker** garantiza una alta portabilidad local y minimiza los costos de infraestructura en la nube. Al permitir ejecuciones locales eficientes para la simulación inicial de horarios, el consumo de cómputo en AWS se mantiene bajo, logrando un LCC sumamente ecoeficiente y económicamente sostenible para la institución.

---

## 5. Verificación de Criterios de Aceptación

El software fue sometido a pruebas funcionales, unitarias y de estrés, verificando los siguientes resultados:
* **Conflictos Cero:** El motor de optimización matemática no reportó colisiones de docentes ni de aulas en ninguna de las pruebas unitarias y de integración.
* **Resiliencia ante Infactibilidad:** Ante la falta de aulas físicas adecuadas para el procesamiento masivo, el sistema activa de forma controlada el *switch de flexibilización* en la interfaz administrativa, evitando bloqueos en la generación.
* **Seguridad:** Autenticación basada en JWT que bloquea el acceso de estudiantes a las opciones de edición y configuración de restricciones del administrador.

---

## 6. Conclusión de Cierre

El proyecto ha cumplido con los plazos establecidos y se encuentra listo para su despliegue final en el servidor institucional. La adopción de metodologías ágiles (Scrum) y el estricto control de calidad del código han permitido entregar un producto robusto, documentado y con alta viabilidad económica reflejada en su óptimo costo de ciclo de vida.
