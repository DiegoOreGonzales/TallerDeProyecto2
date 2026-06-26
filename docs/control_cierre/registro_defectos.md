# Registro de Defectos de Software (Defect Log)

Este registro documenta los defectos de software (bugs) que fueron identificados mediante pruebas automatizadas (Pytest/Vitest), análisis estático de código (SonarQube) o validaciones manuales durante las fases de aseguramiento de calidad del proyecto **SGOHA**.

---

## 📋 Registro de Defectos

| ID | Componente | Descripción del Defecto | Severidad | Origen de Detección | Estado de Corrección | Validación de Solución | Estado Final |
| :---: | :--- | :--- | :---: | :---: | :--- | :--- | :---: |
| **DF-01** | Backend | **Error de Infeccibilidad en CP-SAT:** El motor arrojaba un error interno del servidor si un docente tenía más de 30 bloques de clase semanales asignados. | Major | Pytest (`test_scheduler.py`) | Se añadió un validador previo de carga docente máxima en la capa de servicios del backend. | `pytest tests/test_scheduler.py` pasa con 100% de éxito. | **Cerrado** |
| **DF-02** | Frontend | **Foco invisible en controles ARIA:** Los interruptores deslizantes no mostraban un borde de enfoque al navegar con la tecla `Tab` en navegadores basados en Chromium. | Minor | Inspección manual del DOM | Se añadió la clase CSS utilitaria `focus:ring-2 focus:ring-orange-500` en los botones. | Validación visual manual con navegación por teclado exitosa. | **Cerrado** |
| **DF-03** | Backend | **Fuga de conexiones en Base de Datos:** SQLAlchemy mantenía conexiones inactivas en PostgreSQL local durante peticiones concurrentes de la API. | Major | SonarQube (Code Smell) | Se reestructuró la inyección de dependencias de la sesión de base de datos usando `yield` y cerrando explícitamente en `main.py`. | Reporte de SonarQube con 0 fugas y Deuda Técnica reducida. | **Cerrado** |
| **DF-04** | Frontend | **Inconsistencia de Tipos en Tablas:** La tabla CRUD fallaba al renderizar filas vacías de docentes si no poseían especialidad asignada. | Minor | ESLint (`npm run lint`) | Se inyectó validación condicional en la fila (`docente.especialidad || 'N/A'`) en React. | `npm run build` y `npm run lint` finalizan con 0 warnings. | **Cerrado** |
| **DF-05** | Backend | **Fallo de Carga de OR-Tools en Windows:** En entornos locales con Windows y Python 3.14, no se lograba cargar la biblioteca `ortools` por incompatibilidad de binarios C++. | Critical | Ejecución de API local | Se implementó un resolvedor fallback basado en Backtracking en Python puro para permitir la ejecución de pruebas sin CP-SAT compilado. | Validación de ejecución de API sin excepciones en consola. | **Cerrado** |
| **DF-06** | Frontend / API | **Bloqueo CSP de scripts y estilos en línea:** La directiva Content-Security-Policy (CSP) inyectada en el middleware bloqueaba la carga de los estilos dinámicos de Tailwind en el navegador. | Major | Navegador (Inspección) | Se configuraron directivas CSP más flexibles permitiendo la carga de estilos generados por Tailwind, adaptando las cabeceras HTTP. | Inspección de consola de Chrome con 0 violaciones de CSP. | **Cerrado** |
| **DF-07** | DevOps | **Colisión de puerto 5432 de PostgreSQL:** El contenedor de base de datos no lograba iniciar si la máquina anfitriona ya tenía un servicio PostgreSQL activo localmente. | Major | `docker-compose up` | Se parametrizaron las variables del puerto PostgreSQL en el archivo `.env` y se mapeó externamente al puerto `5433` de forma dinámica. | Contenedores docker inician en paralelo sin conflictos. | **Cerrado** |
| **DF-08** | Frontend | **Hydration Warning por duplicidad de IDs en DOM:** React arrojaba warnings debido a que múltiples bloques de clase en la grilla utilizaban IDs duplicados para referenciar elementos de celda. | Minor | Consola del Navegador | Se modificaron las claves dinámicas en el renderizador de React para concatenar `seccion_id` y `bloque_id` (`key={`${seccion.id}-${bloque.id}`}`). | Consola de React limpia de advertencias durante la navegación. | **Cerrado** |

---

## 🧪 Resumen Métrico de Calidad

*   **Total de Defectos Registrados:** 8
*   **Defectos Resueltos y Cerrados:** 8 (100% de efectividad de corrección)
*   **Defectos Abiertos:** 0
