# Guía Maestra de Presentación y Guión de Exposición — Inspección 07 (Calidad, Seguridad y Usabilidad)

Este documento sirve como la guía de planificación, distribución y guión exacto para la defensa de la **Inspección 07 (Revisión de Calidad, Seguridad y Usabilidad)** del sistema **SGOHA (Sistema de Generación de Horarios Académicos)**. El objetivo es estructurar una presentación coordinada, fluida y técnicamente rigurosa para obtener la máxima calificación (**Sobresaliente**) según la rúbrica establecida.

---

## 📂 1. Mapeo de Rúbrica y Estructura del Equipo

Para asegurar la calificación **Sobresaliente**, la exposición se divide en 4 bloques de 2.5 minutos de acuerdo a las responsabilidades individuales y criterios evaluados:

```mermaid
graph TD
    A["José Bacilio (PO & QA)<br>1. SonarQube & Gobernanza Git"] --> B["Aldo Requena (Backend)<br>2. Seguridad OWASP & Pytest"]
    B --> C["Luis Gutierrez (Frontend)<br>3. Accesibilidad WCAG & Linters"]
    C --> D["Diego Oré (Scrum Master & UX)<br>4. Usabilidad SUS & Playwright E2E"]
```

### Tabla de Responsabilidades e Indicadores de Rúbrica

| Bloque / Presentador | Criterio de la Rúbrica | Componentes y Archivos Clave | Comandos y Herramientas Live |
| :--- | :--- | :--- | :--- |
| **1. José Bacilio** | SonarQube Quality Gate, Deuda Técnica, Duplicación y Gobernanza. | `sonar-project.properties`<br>`docker-compose-sonar.yml` | Servidor SonarQube: `http://localhost:9000`<br>Docker: `docker ps` |
| **2. Aldo Requena** | Mitigación OWASP Top 10, Cabeceras HTTP de red y Pytest Backend. | `src/backend/app/main.py`<br>`src/backend/tests/` | Petición de Cabeceras: `curl.exe -I` <br>Pytest: `pytest --cov=app` |
| **3. Luis Gutierrez** | Accesibilidad WCAG 2.2 AA (Foco, ARIA), Linter y Build. | `src/frontend/src/pages/Dashboard.tsx`<br>`vitest.config.ts` | Navegación por teclado (`Tab`) en UI<br>Linters: `npm run lint` y `npm run build` |
| **4. Diego Oré** | Métricas y Base SUS (Usabilidad), Golden Path E2E Playwright. | `scheduling_flow.spec.ts`<br>`reporte_calidad_inspeccion07.md` | Matriz Likert en Excel/PDF<br>Vitest Run: `npm run test` / `npx vitest run` |

---

## 🛠️ 2. Protocolo de Ejecución en Vivo Paso a Paso (Secuencia de Demostración)

Durante la sustentación, ejecuten los comandos en este orden estricto para validar los entregables en tiempo real ante el docente:

### 🚀 Paso A: Preparación de Entorno (Antes de iniciar la llamada/exposición)
Asegurarse de que todos los servicios y contenedores estén levantados de manera segura en la máquina local.
1. **Levantar contenedores de la aplicación (Frontend, Backend, DB, PgAdmin):**
   ```powershell
   docker compose up -d
   ```
2. **Levantar el contenedor de SonarQube:**
   ```powershell
   docker compose -f docker-compose-sonar.yml up -d
   ```
3. **Verificar que todos los servicios están en ejecución:**
   ```powershell
   docker ps
   ```
   *Se deben ver listados 5 contenedores activos: `scheduling_frontend` (5173), `scheduling_backend` (8000), `local_sonarqube` (9000), `scheduling_db` (5432) y `scheduling_pgadmin` (5050).*

---

### 🔍 Paso B: Demostración de Calidad de Código (José Bacilio)
1. **Mostrar archivo de propiedades de SonarQube en VS Code:**
   * Abrir [sonar-project.properties](file:///C:/Bacilio/sistema_generacion_horarios_academicos/sonar-project.properties).
   * Resaltar las exclusiones (`sonar.exclusions`) para demostrar cómo se previene la indexación de dependencias de terceros (`node_modules`) o archivos de distribución (`dist/`).
2. **Navegar al Dashboard de SonarQube:**
   * Abrir en el navegador: [http://localhost:9000](http://localhost:9000) (Ingresar con credenciales `admin` / `admin` o la contraseña cambiada).
   * **Qué mostrar:** 
     * El estado general **Quality Gate: Passed** en color verde.
     * **0 Bugs**, **0 Vulnerabilidades** de seguridad.
     * Deuda técnica baja (Rating A - 11.8 horas de deuda).
     * Densidad de duplicados en **2.1%** (por debajo del límite del 3.0%).
     * Rating A en Mantenibilidad, Confiabilidad y Seguridad.

---

### 🛡️ Paso C: Validación de Seguridad OWASP y Pruebas Unitarias Backend (Aldo Requena)
1. **Mostrar el Middleware de Seguridad en VS Code:**
   * Abrir [main.py](file:///C:/Bacilio/sistema_generacion_horarios_academicos/src/backend/app/main.py).
   * Mostrar el middleware `@app.middleware("http") def add_security_headers` donde se inyectan las cabeceras de seguridad.
2. **Ejecutar Inspección de Cabeceras con curl en Vivo:**
   * Abrir una terminal de PowerShell y correr:
     ```powershell
     curl.exe -I http://localhost:8000/api/scheduler/config
     ```
   * **Qué señalar:** Mostrar las cabeceras devueltas por el backend:
     * `X-Frame-Options: DENY` (Mitiga Clickjacking).
     * `X-Content-Type-Options: nosniff` (Previene MIME Sniffing).
     * `Content-Security-Policy` (CSP estricta).
     * `Strict-Transport-Security: max-age=31536000` (Fuerza HTTPS).
3. **Ejecutar Suite de Tests Unitarios de Backend (Pytest):**
   * En la terminal, posicionarse en `src/backend` y ejecutar:
     ```powershell
     cd src/backend
     pytest --cov=app --cov-report=term-missing tests/
     ```
   * **Qué señalar:** 
     * El paso exitoso de los **84 tests unitarios** en color verde.
     * Reportar la cobertura local del **72%**.
     * **Defensa de la Cobertura Local (Windows + Python 3.14):** Explicar que para prevenir la violación de segmento (`access violation`) nativa de Google OR-Tools en Windows con Python 3.14, implementamos un *motor de backtracking nativo de fallback*. Este motor corre la suite local al 100%, pero al obviar la ejecución de la lógica del solver CP-SAT de OR-Tools, la cobertura local baja a 72%. En GitHub Actions (Linux + Python 3.11), donde el solver CP-SAT se ejecuta sin problemas de segmentación, la cobertura global se eleva al **92.4%**.

---

### ♿ Paso D: Validación de Accesibilidad WCAG y Calidad Frontend (Luis Gutierrez)
1. **Navegación por Teclado en el Dashboard:**
   * Ir al navegador en [http://localhost:5173](http://localhost:5173), iniciar sesión (`admin` / `admin`).
   * Ir al panel de restricciones y presionar la tecla `Tab` repetidamente.
   * **Qué demostrar:** Mostrar cómo el foco de navegación selecciona secuencialmente cada botón y switch de restricciones, resaltando visualmente con un anillo naranja de alto contraste (`focus:ring-orange-500`).
2. **Inspección del DOM ARIA en las DevTools:**
   * Hacer clic derecho sobre uno de los switches de restricciones y seleccionar "Inspeccionar".
   * **Qué demostrar:** Mostrar las etiquetas semánticas:
     * `role="switch"` (Le dice al lector de pantalla que es un interruptor).
     * `aria-checked="true"` o `false` (Cambia de forma interactiva cuando se activa/desactiva).
     * `aria-label="Restricción: Minimizar ventanas libres"` (Proporciona descripción semántica).
     * `aria-hidden="true"` en los Material Icons contiguos (Evita que el lector lee código técnico del icono).
3. **Ejecutar Linter y Build de Frontend:**
   * En la terminal, posicionarse en `src/frontend` y ejecutar:
     ```powershell
     cd src/frontend
     npm run lint
     npm run build
     ```
   * **Qué señalar:** 
     * `npm run lint` finaliza con **0 errores y 0 advertencias**, certificando la sanidad estática.
     * `npm run build` compila con éxito los 43 módulos a través de Vite en ~1.2 segundos sin errores de tipado de TypeScript.

---

### 📈 Paso E: Demostración de Usabilidad SUS y E2E Testing (Diego Oré)
1. **Exposición del Estudio Métrico de Usabilidad SUS:**
   * Mostrar el documento o diapositiva de la matriz Likert de 10 usuarios.
   * **Qué señalar:** Explicar el cálculo aritmético por usuario (Preguntas impares: $X-1$, Preguntas pares: $5-X$, total $\times 2.5$). Mostrar que el puntaje final promedio fue de **83.75 / 100**, lo que equivale a un **Grado A (Excelente usabilidad percibida)**.
   * Mostrar las mejoras implementadas gracias al feedback: *micro-animaciones CSS de retroalimentación* en el dashboard y *mensajes de infactibilidad descriptivos* en lugar de errores crudos del servidor.
2. **Ejecutar Suite de Tests Unitarios Frontend (Vitest):**
   * En la terminal en la carpeta `src/frontend`, ejecutar:
     ```powershell
     npx vitest run
     ```
   * **Qué señalar:** El paso de los **7 tests unitarios** de Vitest utilizando mocks de MSW para simular llamadas API seguras.
3. **Mostrar Archivo de Pruebas de Extremo a Extremo (Playwright E2E):**
   * Abrir [scheduling_flow.spec.ts](file:///C:/Bacilio/sistema_generacion_horarios_academicos/src/frontend/tests/e2e/scheduling_flow.spec.ts) en VS Code.
   * **Qué explicar:** Explicar cómo Playwright intercepta la red con mocks de API deterministas y prueba el "Golden Path": Login del admin $\rightarrow$ Entrada al panel $\rightarrow$ Simulación de generación del horario $\rightarrow$ Descarga y exportación.

---

## 🗣️ 3. Guiones Literales de Exposición (Detallados y Sincronizados)

---

### 🎙️ Integrante 1: JOSÉ ANTHONY BACILIO DE LA CRUZ (Product Owner & QA Lead)
* **Tema:** SonarQube, Calidad Estática, Deuda Técnica y Gobernanza del Repositorio.
* **Apoyo Visual:** Dashboard local de SonarQube en `http://localhost:9000` y archivo `sonar-project.properties`.

#### **Guión de Exposición:**
> *"Buenas tardes, profesor. Como Product Owner y QA Lead, he configurado las políticas de calidad y el análisis estático continuo local para el sistema SGOHA. Para esto, creamos un contenedor dedicado de SonarQube detallado en `docker-compose-sonar.yml` y definimos las reglas de gobernanza mediante el archivo `sonar-project.properties`.*
>
> *(Mostrar en pantalla sonar-project.properties)*
> *En este archivo de propiedades definimos la clave de proyecto `sgoha-taller2` e indexamos las fuentes de código de backend y frontend. Una decisión clave de arquitectura fue la directiva `sonar.exclusions`: excluimos carpetas de dependencias como `node_modules`, archivos de build compilados en `/dist`, migraciones de base de datos y bases de datos locales sqlite. Esto evita falsos positivos e indexaciones redundantes, enfocando las reglas del analizador únicamente en nuestro desarrollo original.*
>
> *(Navegar al navegador y mostrar Dashboard en localhost:9000)*
> *Como pueden observar en la interfaz de administración local, el proyecto ha obtenido la calificación **Quality Gate: Passed** (Aprobado). Cumplimos con éxito todos los umbrales de gobernanza establecidos:*
>
> *1. **0 Bugs** y **0 Vulnerabilidades** en el sistema, logrando un Rating A en Confiabilidad y Seguridad.*
> *2. **Densidad de Duplicación del 2.1%**, cumpliendo con la meta de no sobrepasar el 3% de código duplicado, lo que previene problemas de mantenibilidad futura.*
> *3. **Deuda Técnica de 11.8 horas** en total para las 940 sentencias lógicas analizadas, lo que califica al proyecto con un Rating A en Mantenibilidad.*
>
> *Estos resultados demuestran la limpieza de nuestra arquitectura de software. Ahora le doy el pase a Aldo Requena para detallar la seguridad de la API y las pruebas de backend."*

---

### 🎙️ Integrante 2: ALDO ALEXANDRE REQUENA LAVI (Backend Developer)
* **Tema:** Seguridad OWASP Top 10, Cabeceras HTTP de Seguridad, Pytest y Defensa de Cobertura.
* **Apoyo Visual:** Middleware de seguridad en `main.py`, terminal ejecutando `curl -I` y consola de `pytest`.

#### **Guión de Exposición:**
> *"Buenas tardes, profesor. Mi trabajo se centró en la seguridad lógica del backend de acuerdo con los estándares de OWASP Top 10, mitigando riesgos de Diseño Inseguro (A04) y Errores de Configuración (A05) en la API FastAPI.*
>
> *(Mostrar en VS Code el middleware de main.py)*
> *Implementé un middleware en FastAPI que inyecta cinco cabeceras restrictivas en cada petición realizada por el cliente:*
> *1. **X-Frame-Options: DENY:** Para mitigar ataques de **Clickjacking**, impidiendo que la aplicación sea enmarcada en iframes externos.*
> *2. **X-Content-Type-Options: nosniff:** Para obligar al navegador a ceñirse al Content-Type de la respuesta, previniendo el secuestro de tipos MIME.*
> *3. **Content-Security-Policy (CSP):** Establece directivas de orígenes seguros (`self`), permitiendo únicamente scripts y conexiones de fuentes confiables de la API.*
>
> *(Mostrar en la terminal la ejecución de curl -I http://localhost:8000/api/scheduler/config)*
> *Como se observa en el volcado de cabeceras HTTP de red en la terminal, todas las peticiones a la API responden de forma segura adjuntando CSP y cabeceras HSTS.*
>
> *(Mostrar en la terminal la ejecución de pytest)*
> *Para validar el comportamiento correcto de la API, corrimos los **84 tests unitarios de Pytest**, los cuales se ejecutan de manera exitosa en 18.46 segundos.*
>
> *Un aspecto técnico muy importante es la cobertura. En local reportamos un **72% de cobertura global**. Esto responde a un diseño de resiliencia: Google OR-Tools CP-SAT presenta una falla crítica de segmentación en Windows bajo Python 3.14. Para evitar que el sistema colapse en la demostración local, implementamos un **solver backtracking nativo de fallback** en `scheduler.py` que toma el control automáticamente. En GitHub Actions, que corre sobre Linux con Python 3.11, la cobertura total sube al **92.4%** ya que el solver CP-SAT se ejecuta directamente. Doy pase a Luis para la accesibilidad."*

---

### 🎙️ Integrante 3: LUIS ALBERTO GUTIERREZ TAIPE (Frontend Developer)
* **Tema:** Accesibilidad WCAG 2.2 AA, Navegación por teclado, Marcado ARIA, Linter y Vite Build.
* **Apoyo Visual:** Dashboard del sistema, DevTools de Chrome con el DOM inspeccionado y terminal con comandos npm.

#### **Guión de Exposición:**
> *"Buenas tardes, profesor. Mi asignación consistió en adecuar la interfaz de usuario en React a las pautas de accesibilidad WCAG 2.2 AA, garantizando que el dashboard pueda ser operado por usuarios con limitaciones visuales o motoras.*
>
> *(Mostrar la pantalla del dashboard en localhost:5173 y navegar usando la tecla Tab)*
> *En primer lugar, garantizamos la **Navegación por Teclado (Criterio 2.1.1)**. Usando la tecla `Tab`, el usuario puede recorrer secuencialmente todos los interruptores del motor de horarios. El foco es claramente visible gracias a un anillo naranja de alto contraste (`focus:ring-orange-500`), cumpliendo con el Criterio 2.4.7 de foco visible.*
>
> *(Inspeccionar el DOM del interruptor en las DevTools del navegador)*
> *En segundo lugar, implementamos **Semántica ARIA (Criterio 4.1.2)**. Los lectores de pantalla no entienden por defecto un interruptor estilizado con CSS. Por ello, añadimos `role="switch"` y el atributo reactivo `aria-checked` para que las herramientas de asistencia anuncien el estado activo o inactivo del switch en vivo. Además, inyectamos `aria-hidden="true"` a los Material Icons decorativos, evitando lecturas redundantes por el lector de voz.*
>
> *(Mostrar la terminal ejecutando npm run lint y npm run build)*
> *Para asegurar la calidad en la compilación, ejecutamos el linter de TypeScript, el cual termina limpio con **0 errores**, y compilamos la aplicación para producción mediante Vite de forma ultra-rápida y libre de bugs de tipado. Doy pase a Diego para las métricas de usabilidad."*

---

### 🎙️ Integrante 4: DIEGO ISAAC ORÉ GONZALES (Scrum Master & UX Analyst)
* **Tema:** Estudio Métrico SUS (Usabilidad), Tests Vitest y Automatización E2E con Playwright.
* **Apoyo Visual:** Tabla métrica SUS en el reporte, ejecución de `npx vitest run` y el script de Playwright en VS Code.

#### **Guión de Exposición:**
> *"Buenas tardes, profesor. Para concluir, mi rol consistió en liderar el aseguramiento de la usabilidad percibida y la automatización de pruebas de extremo a extremo.*
>
> *(Mostrar el reporte de usabilidad SUS en pantalla)*
> *Para medir cuantitativamente la usabilidad del sistema, aplicamos el instrumento estandarizado **SUS** a 10 participantes de la comunidad universitaria. Tras recolectar las escalas Likert de los 10 ítems y procesar la fórmula de normalización matemática, obtuvimos una puntuación global de **83.75 / 100**.*
>
> *Bajo el estándar científico de SUS, este puntaje nos sitúa en un **Grado A (Excelente)** y en el rango de **Aceptable**. A partir de este estudio, implementamos mejoras clave de experiencia de usuario: micro-animaciones CSS de transición en botones y mensajes de error interactivos que le informan detalladamente al usuario qué colisión de docentes o aulas impidió generar un horario, en lugar de lanzar una excepción de base de datos.*
>
> *(Mostrar en la terminal la ejecución de npx vitest run)*
> *En el lado del frontend, ejecutamos **Vitest** con **7 pruebas aprobadas**, validando el renderizado de login y formularios de cursos.*
>
> *(Mostrar en VS Code el script scheduling_flow.spec.ts)*
> *Finalmente, en `scheduling_flow.spec.ts` automatizamos las pruebas de extremo a extremo usando **Playwright**. Este script automatiza el **Golden Path** o flujo crítico del negocio: inicia sesión con el rol de administrador, entra al dashboard principal, navega a través de las rutas del sidebar de aulas y cursos, y comprueba que la renderización de la malla curricular sea correcta. Con esto, garantizamos que las funcionalidades esenciales no sufran regresiones."*

---

## 🎯 4. Banco de Respuestas y Estrategia de Defensa (Preguntas Trampa)

Preparen estas respuestas técnicas para responder a las preguntas habituales del jurado y asegurar los puntos de **Sobresaliente**:

### Pregunta 1 (Para José): *¿Por qué decidieron usar SonarQube en local con Docker en lugar de SonarCloud en la nube?*
*   **Respuesta de Impacto:** *"Utilizar SonarQube Community Edition en Docker nos da soberanía total sobre el código y permite análisis estáticos en entornos locales sin depender de conectividad a la nube o de límites de uso. Además, se integra directamente en nuestro flujo de desarrollo local mediante contenedores, simulando el mismo entorno de compilación de forma reproducible por cualquier desarrollador del equipo simplemente corriendo `docker-compose up`."*

### Pregunta 2 (Para Aldo): *¿Cuál es la diferencia entre el 72% de cobertura local y el 92% en GitHub Actions? ¿Es aceptable?*
*   **Respuesta de Impacto:** *"Sí, es completamente aceptable y está justificado por diseño. La suite de optimización matemática Google OR-Tools CP-SAT tiene una incompatibilidad nativa en Windows con Python 3.14 (genera un fallo de segmentación). En local (Windows), para asegurar la resiliencia de la demostración, el código activa un guard de fallback usando backtracking. Esto significa que las líneas específicas que configuran el solver CP-SAT no se ejecutan localmente, marcando un 72% de cobertura. Sin embargo, en el workflow de GitHub Actions (que corre sobre Linux y Python 3.11), no existe esta restricción, por lo que se ejecuta todo el motor CP-SAT, logrando una cobertura del 92.4%. Esto demuestra un diseño arquitectónico robusto frente a fallos de plataforma."*

### Pregunta 3 (Para Luis): *Si no usaran botones nativos en los switches, ¿cómo habrían resuelto el foco de teclado para WCAG?*
*   **Respuesta de Impacto:** *"Si hubiéramos usado elementos no interactivos como `<div>` o `<span>` para estilizar los switches, habríamos tenido que añadir obligatoriamente el atributo `tabIndex={0}` para incluirlos en el orden de tabulación del navegador, y programar un manejador de eventos `onKeyDown` en React para interceptar las teclas `Space` y `Enter` y simular el comportamiento de activación del botón. Al usar el elemento nativo `<button>`, el navegador maneja el foco y el evento de teclado de forma nativa, reduciendo código redundante y aumentando la compatibilidad."*

### Pregunta 4 (Para Diego): *¿Por qué el cuestionario SUS consta de preguntas alternadas (positivas y negativas)?*
*   **Respuesta de Impacto:** *"La alternancia de preguntas de tono positivo e impar con preguntas de tono negativo y par es una medida metodológica de la escala SUS para mitigar el **sesgo de aquiescencia** y el **sesgo de respuesta rápida** de los usuarios. Esto obliga al usuario a leer atentamente cada pregunta en lugar de marcar sistemáticamente la misma puntuación en toda la encuesta, lo que asegura que el resultado de 83.75 puntos sea estadísticamente confiable."*

---

## 🛑 5. Guía de Solución de Problemas en Vivo (Troubleshooting)

Si algo falla durante la presentación en vivo, sigan estas instrucciones rápidas:

*   **Problema A: El contenedor de SonarQube no inicia o sale con código de error (ES Bootstrap).**
    *   *Causa:* SonarQube incluye una base de datos Elasticsearch interna que requiere configuraciones de memoria virtual de kernel elevadas en Linux/WSL.
    *   *Solución:* El archivo `docker-compose-sonar.yml` ya tiene inyectada la variable `SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true` para omitir esta validación local en entornos Docker de Windows. Si persiste, reinicien Docker Desktop y ejecuten `docker compose -f docker-compose-sonar.yml restart`.
*   **Problema B: El comando `curl -I` retorna error de conexión.**
    *   *Solución:* Comprobar que el contenedor del backend está corriendo (`docker ps`). Si no es así, levanten el backend de desarrollo local ejecutando `cd src/backend && uvicorn app.main:app --reload` en una consola independiente.
*   **Problema C: Vite o npm run build fallan debido a dependencias.**
    *   *Solución:* Eliminar la carpeta `node_modules` y correr `npm install --ignore-scripts` para evitar descargar Cypress/Playwright binarios que causan fallos de descarga tras cortafuegos de red.
