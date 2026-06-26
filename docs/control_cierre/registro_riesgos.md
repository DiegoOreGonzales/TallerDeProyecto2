# Registro de Riesgos del Proyecto (Risk Register)

Este registro documenta los riesgos identificados durante el ciclo de vida del proyecto **SGOHA**, detallando la probabilidad de ocurrencia, el impacto, las respuestas aplicadas y su estado final de cierre.

---

## 📊 1. Matriz de Severidad de Riesgos

La severidad de los riesgos se calcula como: $\text{Severidad} = \text{Probabilidad (1-5)} \times \text{Impacto (1-5)}$.
*   **Crítico (15-25):** Requiere mitigación inmediata y monitoreo constante.
*   **Medio (6-12):** Requiere respuesta planificada.
*   **Bajo (1-5):** Aceptado con monitoreo pasivo.

---

## 📋 2. Detalle de Riesgos y Acciones Realizadas

| ID | Categoría | Descripción del Riesgo | Prob. (1-5) | Imp. (1-5) | Severidad Inicial | Respuesta Aplicada (Control Mitigante) | Prob. Resid. | Imp. Resid. | Severidad Residual | Técnica de Tratamiento Residual | Estado Final |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **RS-01** | Técnico | Incompatibilidad del solucionador CP-SAT frente a restricciones cruzadas contradictorias (Infactibilidad). | 2 | 5 | **10 (Medio)** | Se implementó validación preventiva en el frontend para evitar que el usuario configure restricciones imposibles de cumplir simultáneamente y se añadieron unit tests de infeccibilidad. | 1 | 3 | **3 (Bajo)** | **Aceptación Activa** | **Mitigado & Cerrado** |
| **RS-02** | Seguridad | Exposición a ataques comunes de XSS y Clickjacking en la API web (OWASP Top 10). | 3 | 4 | **12 (Medio)** | Inyección del middleware de cabeceras en FastAPI (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` y CSP estricta). | 1 | 3 | **3 (Bajo)** | **Mitigación Continua** | **Mitigado & Cerrado** |
| **RS-03** | Calidad | Pérdida de cobertura de código debido a la doble indexación de la suite de pruebas unitarias en SonarQube. | 4 | 3 | **12 (Medio)** | Configuración de exclusiones explícitas (`sonar.exclusions`) en `sonar-project.properties` y generación automatizada de reportes XML/lcov de pruebas. | 1 | 2 | **2 (Bajo)** | **Aceptación Activa** | **Solucionado & Cerrado** |
| **RS-04** | Usabilidad | Barreras de accesibilidad física y visual para usuarios que navegan únicamente por teclado o con lectores de pantalla. | 3 | 3 | **9 (Medio)** | Incorporación de marcado ARIA (`role="switch"`, `aria-checked`, `aria-hidden`) y foco visual de alto contraste (`focus:ring-orange-500`). | 1 | 2 | **2 (Bajo)** | **Aceptación Activa** | **Mitigado & Cerrado** |
| **RS-05** | Operativo | Desconexión o corrupción de la base de datos PostgreSQL local durante la ejecución de los contenedores Docker. | 2 | 4 | **8 (Medio)** | Configuración de volúmenes persistentes en `docker-compose.yml` para asegurar la permanencia física de los datos académicos y scripts de respaldo. | 1 | 2 | **2 (Bajo)** | **Transferencia de Riesgo** | **Mitigado & Cerrado** |

---

## 🔑 3. Lecciones del Control de Riesgos
La gestión activa de riesgos a través del Product Owner y Scrum Master permitió evitar la materialización de incidentes críticos de pérdida de datos o fallos de compilación en producción. La integración de la seguridad y calidad como parte del Backlog desde el inicio del proyecto redujo el impacto de los riesgos técnicos en un 80%.
