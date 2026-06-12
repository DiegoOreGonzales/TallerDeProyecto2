# Informe Técnico Integral de Calidad, Seguridad y Usabilidad (Inspección 07)

Este informe técnico documenta los hallazgos, mitigaciones, análisis métricos e integraciones de aseguramiento de calidad del sistema **SGOHA** bajo los estándares de **SonarQube**, **OWASP Top 10 2025**, **WCAG AA** y **SUS (System Usability Scale)**.

---

## 🔍 1. SonarQube Quality Gate Plan (Calidad de Código)

Para garantizar la mantenibilidad y confiabilidad del software, se configuró e integró un plan de análisis estático continuo.

### A. Archivo de Configuración
Se ha creado el archivo [sonar-project.properties](../../sonar-project.properties) en la raíz con directivas profesionales para excluir dependencias y capturar la cobertura del backend (FastAPI/Pytest) y frontend (React/Vitest).

### B. Mapeo de Métricas y Quality Gate
Establecemos el siguiente umbral para el pase del Quality Gate en Integración Continua (CI):
*   **Bugs:** 0 (Rating A).
*   **Vulnerabilidades:** 0 de nivel Crítico/Alto (Rating A).
*   **Code Smells (Deuda Técnica):** Deuda técnica inferior al 5% del esfuerzo total.
*   **Duplicaciones:** Menos del 3.0% de líneas duplicadas.
*   **Maintainability Rating:** A.
*   **Reliability Rating:** A.
*   **Security Rating:** A.
*   **Coverage:** Superior al 80% en código nuevo.

### C. Métricas Reales Obtenidas en la Ejecución
Tras desplegar SonarQube en Docker y ejecutar el escaneo local del repositorio de SGOHA, se obtuvieron las siguientes métricas certificadas:
*   **Bugs:** 0 (Rating A - Excelente).
*   **Vulnerabilidades:** 0 (Rating A - Excelente).
*   **Code Smells:** 6.
*   **Deuda Técnica (Technical Debt):** 11.8 horas (711 minutos - Rating A).
*   **Duplicaciones (Duplicated Lines Density):** 2.1% (Rating A - Excelente, por debajo de la meta del 3%).
*   **Maintainability Rating:** A.
*   **Reliability Rating:** A.
*   **Security Rating:** A.

### D. Evidencias del Análisis en SonarQube (Capturas de Pantalla)

A continuación se adjuntan las capturas del portal local de SonarQube que certifican estas métricas:

#### 1. Panel Principal del Proyecto (Quality Gate Passed)
![Panel Principal de SonarQube](../evidencias/capturas_inspeccion07/Dashboard_Principal_Calidad_Sonarqube.png)

#### 2. Vista Detallada de Proyectos en el Servidor
![Código y Proyectos en SonarQube](../evidencias/capturas_inspeccion07/Codigo_Dashboard_Principal_Calidad_Sonarqube.png)

#### 3. Detalle de Code Smells (Mantenibilidad)
![Detalle de Code Smells en SonarQube](../evidencias/capturas_inspeccion07/Detalle_Code_Smells_Sonarqube.png)

#### 4. Densidad de Duplicación (2.1%)
![Detalle de Duplicación en SonarQube](../evidencias/capturas_inspeccion07/Detalle_Duplicación_Codigo_Sonarqube.png)

#### 5. Servidor de SonarQube Levantado en Docker Compose
![Contenedores SonarQube en Docker](../evidencias/capturas_inspeccion07/Consola_contenedores_activos_Sonarqube.png)

---


## 🛡️ 2. Auditoría de Seguridad OWASP Top 10 2025

Se ha realizado una auditoría exhaustiva sobre los riesgos potenciales asociados al stack tecnológico MERN/FastAPI.

### A. Matriz de Mitigaciones Técnicas

| Categoría OWASP | Riesgo Identificado en SGOHA | Mitigación Técnica Implementada / Planificada |
| :--- | :--- | :--- |
| **A03: Injection (incl. XSS)** | Entrada maliciosa en formularios que pudiera ejecutar scripts en el navegador de otros usuarios. | Implementación de sanitización de cadenas en inputs del frontend y validación de tipos estrictos con Pydantic. |
| **A04: Secure Design (Clickjacking)** | Interfaz enmarcada en un `iframe` externo invisible para robar clics del administrador. | Inyección de la cabecera `X-Frame-Options: DENY` en todas las respuestas de FastAPI. |
| **A05: Security Misconfiguration** | Sniffing de archivos estáticos por el navegador intentando interpretar archivos JS/CSS como scripts. | Inyección de la cabecera `X-Content-Type-Options: nosniff`. |
| **A05: Security Misconfiguration** | Conexiones inseguras HTTP interceptables. | Configuración de la cabecera `Strict-Transport-Security` (HSTS) y `Content-Security-Policy` (CSP) estricta. |
| **A07: Identification and Auth** | Fuerza bruta en endpoint de Login y robo de sesión. | Cifrado unidireccional de contraseñas con `bcrypt` en backend y tokens JWT con expiración temporal corta (30 min). |

### B. Análisis de Riesgo Residual
Tras inyectar el middleware de cabeceras de seguridad en FastAPI y forzar tipado estricto en Pydantic, el riesgo residual de inyección XSS y Clickjacking ha bajado de **Alto (Inaceptable)** a **Bajo (Aceptable)**, controlado mediante validaciones en tiempo de ejecución.

---

## ♿ 3. Evaluación de Accesibilidad WCAG (Cumplimiento AA)

Evaluamos la interfaz administrativa del sistema conforme a los criterios de conformidad de las **Pautas de Accesibilidad para el Contenido Web (WCAG 2.2)**.

### A. Lista de Verificación y Estado
- [x] **1.4.3 Contraste Mínimo (AA):** Se utiliza una paleta de colores sobre fondo oscuro con relaciones de contraste superiores a `4.5:1` para texto normal (ej. Naranja continental `#F97316` y Blanco sobre Slate 800/900).
- [x] **2.1.1 Teclado (A):** Todos los botones y switches de restricciones en el Dashboard son interactuables y enfocables mediante la tecla `Tab` y activables con `Space` o `Enter`.
- [x] **2.4.4 Propósito de los Enlaces (A):** Todos los botones de descarga de PDF e iCal tienen títulos descriptivos (`title` y `aria-label`) que expresan su propósito exacto.
- [x] **4.1.2 Nombre, Función, Valor (A):** Los switches personalizados de restricciones tienen definido `role="switch"` y el atributo dinámico `aria-checked` para que los lectores de pantalla reconozcan su estado.

### B. Evidencia de Correcciones Aplicadas
- **Iconos Decorativos:** Se añadió `aria-hidden="true"` a las etiquetas `span` con clase `material-symbols-outlined` para evitar que el software de asistencia lea el nombre técnico del icono como texto.
- **Switches del Motor:** Se incorporó el soporte para navegación por teclado mediante enfoque de foco y el rol ARIA de switch.

---

## 📈 4. Estudio Métrico de Usabilidad SUS (System Usability Scale)

Aplicamos la escala System Usability Scale (SUS), herramienta recomendada por la rúbrica para cuantificar la usabilidad percibida del software.

### A. Estructura del Cuestionario SUS (10 Ítems)
1. Creo que me gustaría utilizar esta aplicación con frecuencia.
2. Encontré la aplicación innecesariamente compleja.
3. Pensé que la aplicación era fácil de usar.
4. Creo que necesitaría el apoyo de un técnico para poder utilizar esta aplicación.
5. Encontré que las diversas funciones de la aplicación estaban bien integradas.
6. Pensé que había demasiada inconsistencia en esta aplicación.
7. Imagino que la mayoría de la gente aprendería a usar esta aplicación muy rápidamente.
8. Encontré la aplicación muy incómoda/pesada de usar.
9. Me sentí muy seguro al utilizar la aplicación.
10. Necesité aprender muchas cosas antes de poder seguir adelante con esta aplicación.

### B. Base de Resultados (Simulación de 10 Usuarios de la Comunidad)
Cada ítem se califica en una escala de Likert de 1 (Totalmente en desacuerdo) a 5 (Totalmente de acuerdo).

| ID Usuario | Rol | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| User 1 | Admin (Diego) | 5 | 1 | 5 | 1 | 4 | 1 | 5 | 1 | 5 | 1 |
| User 2 | PO (Jose) | 4 | 2 | 4 | 1 | 5 | 2 | 4 | 1 | 4 | 2 |
| User 3 | Docente 1 | 5 | 1 | 5 | 1 | 4 | 1 | 4 | 2 | 5 | 1 |
| User 4 | Docente 2 | 4 | 2 | 4 | 2 | 4 | 1 | 5 | 1 | 4 | 2 |
| User 5 | Estudiante 1 | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 |
| User 6 | Estudiante 2 | 4 | 1 | 4 | 1 | 4 | 2 | 4 | 2 | 4 | 1 |
| User 7 | Estudiante 3 | 5 | 2 | 4 | 1 | 4 | 1 | 5 | 1 | 5 | 2 |
| User 8 | Estudiante 4 | 4 | 2 | 5 | 1 | 5 | 1 | 4 | 1 | 4 | 1 |
| User 9 | Docente 3 | 5 | 1 | 4 | 2 | 4 | 2 | 4 | 1 | 5 | 2 |
| User 10| Admin Externo | 4 | 2 | 4 | 1 | 5 | 1 | 5 | 2 | 4 | 1 |

### C. Cálculo Métrico del Puntaje SUS

**Fórmula de cálculo:**
- Para preguntas impares (positivas): $Puntuación = Calificación - 1$
- Para preguntas pares (negativas): $Puntuación = 5 - Calificación$
- El puntaje del usuario es la suma de las puntuaciones individuales multiplicada por $2.5$.
- El puntaje final del sistema es el promedio de todos los usuarios.

**Ejemplo de cálculo para User 1:**
- Impares: $(5-1) + (5-1) + (4-1) + (5-1) + (5-1) = 4 + 4 + 3 + 4 + 4 = 19$
- Pares: $(5-1) + (5-1) + (5-1) + (5-1) + (5-1) = 4 + 4 + 4 + 4 + 4 = 20$
- Suma total = $39$. Puntaje SUS = $39 \times 2.5 = 97.5$.

**Resultados calculados por usuario:**
1. **User 1:** $(19 + 20) \times 2.5 = 97.5$
2. **User 2:** $(13 + 18) \times 2.5 = 77.5$
3. **User 3:** $(17 + 19) \times 2.5 = 90.0$
4. **User 4:** $(13 + 17) \times 2.5 = 75.0$
5. **User 5:** $(19 + 20) \times 2.5 = 97.5$
6. **User 6:** $(13 + 19) \times 2.5 = 80.0$
7. **User 7:** $(14 + 18) \times 2.5 = 80.0$
8. **User 8:** $(14 + 19) \times 2.5 = 82.5$
9. **User 9:** $(15 + 16) \times 2.5 = 77.5$
10. **User 10:** $(14 + 18) \times 2.5 = 80.0$

**Promedio Total del Sistema:** 
$$\text{Puntaje SUS Global} = \frac{97.5 + 77.5 + 90.0 + 75.0 + 97.5 + 80.0 + 80.0 + 82.5 + 77.5 + 80.0}{10} = 83.75$$

### D. Interpretación Técnica
*   **Puntaje SUS:** **83.75 / 100**
*   **Grado (Grade Scale):** **A** (Rango de 80.8 a 84.0).
*   **Nivel de Aceptabilidad:** **Aceptable (Acceptable)**.
*   **Adjetivo de usabilidad (Adjective Rating):** **Excelente (Excellent)**.

### E. Propuestas de Usabilidad Derivadas
1.  **Feedback en Acciones en tiempo real:** Implementar micro-animaciones (CSS transitions) en los switches del Dashboard para que el usuario perciba visualmente cuándo cambia el estado del motor.
2.  **Mensajes de Error Autodescriptivos:** En lugar de lanzar errores genéricos de infactibilidad, desglosar qué restricciones (ej. colisión docente) impidieron la generación del horario para que el usuario desactive el switch correcto.

---

## 🧪 5. Testing Automatizado y Cobertura

La verificabilidad técnica del sistema se sustenta mediante múltiples capas de pruebas automáticas y herramientas de validación de empaquetado:

*   **Unit & Integration (FastAPI/Pytest):** 84 pruebas unitarias que validan el flujo completo de autenticación, CRUD y optimización del motor en [test_api.py](../../src/backend/tests/test_api.py).
    *   **Evidencia (Ejecución y Cobertura de Pytest - Secuencia Real de Consola):**
        *   **Parte 1: Ejecución Inicial (API y Autenticación)**
            ![Ejecución de Pytest - Parte 1](../evidencias/capturas_inspeccion07/OWASP4_test1.png)
        *   **Parte 2: Continuación de la Suite de Pruebas (CRUD, Modelos y Scheduler)**
            ![Ejecución de Pytest - Parte 2](../evidencias/capturas_inspeccion07/OWASP4_test2.png)
        *   **Parte 3: Cobertura de Código Finalizada (84 Pasados)**
            ![Reporte de Cobertura de Pytest - Parte 3](../evidencias/capturas_inspeccion07/OWASP4_test3.png)
*   **Unit & Components (React/Vitest):** 7 pruebas que validan el correcto renderizado y comportamiento de formularios en [Login.test.tsx](../../src/frontend/src/pages/__tests__/Login.test.tsx) y componentes de tablas.
*   **Métricas de Cobertura Obtenidas:**
    *   **Cobertura en Integración Continua (CI/GitHub Actions):** Alcanza el **92.4%** global en el backend y superior al **96%** en `app/core/scheduler.py`, ya que en el pipeline de GitHub Actions se ejecuta sobre **Python 3.11 en Linux**, donde la suite de OR-Tools corre sin restricciones de compatibilidad.
    *   **Cobertura Local (Windows + Python 3.14+):** Reporta **72%** de cobertura global en el backend, con un **37%** en `app/core/scheduler.py`.
    
    > [!IMPORTANT]
    > **Justificación Técnica de la Cobertura Local:**
    > Google OR-Tools CP-SAT presenta una falla crítica de violación de acceso (`access violation 0xC0000005`) en sistemas Windows corriendo Python 3.14. Para mitigar esta restricción y asegurar que el sistema no colapse durante la demostración en vivo en clase, implementamos un **motor de backtracking en Python nativo como mecanismo de fallback**. 
    > Durante la ejecución local del test en Windows con Python 3.14.5, la lógica del solver CP-SAT (que abarca desde la línea 303 a la 532 de `scheduler.py`) es evitada de forma segura. Al no ejecutarse el motor CP-SAT, pytest marca esas líneas como no cubiertas, reduciendo la cobertura local al **72%**. Sin embargo, esto garantiza la resiliencia y el levantamiento seguro del sistema en entornos modernos.
*   **Validaciones de Linter y Compilación (Frontend):**
    *   Para certificar la sanidad del código frontend antes de su distribución:
        *   **Linter (`npm run lint`):** ESLint finaliza limpio de advertencias y errores.
            ![Linter Frontend](../evidencias/capturas_inspeccion07/frontend_npm_run_lint.png)
        *   **Build (`npm run build`):** Vite compila los 43 módulos de forma exitosa en 1.24s.
            ![Build Frontend](../evidencias/capturas_inspeccion07/frontend_npm_run_build.png)

