# Guía de Presentación y Guión de Exposición — Inspección 06 (Testing & QA)

Este documento detalla el plan de sustentación, la secuencia de entregables y los guiones individuales para defender con éxito la **Inspección 06 (Estrategias de Testing y Aseguramiento de Calidad)** ante el docente, garantizando todos los puntos del nivel **Sobresaliente** de la rúbrica.

---

## 📂 1. Mapeo de Criterios de la Rúbrica (Inspección 06) a Expositores

Para garantizar una defensa fluida y demostrar dominio técnico completo, los 18 criterios de la rúbrica de la **Inspección 06** se distribuyen de la siguiente manera:

| Criterio de la Rúbrica | Expositor Responsable | Foco de la Defensa y Evidencias a Mostrar |
| :--- | :--- | :--- |
| **C1, C2, C3:** Pruebas Unitarias Backend | **Aldo Requena** (Backend) | Pytest, base de datos en memoria SQLite, stubs, mocks y gestión de excepciones. |
| **C4, C5, C6:** Pruebas de Componentes React | **Luis Gutierrez** (Frontend) | React Testing Library, Mock Service Worker (MSW), estados de carga, error y vacío. |
| **C7, C8, C9:** Pruebas de Integración API | **Aldo Requena** (Backend) | FastAPI TestClient, validación CRUD, HTTP codes, persistencia y rollback transaccional. |
| **C10, C11, C12:** Pruebas Aceptación Cypress | **José Bacilio** (PO/QA Lead) | Cypress, Happy/Unhappy paths de login y CRUDs, generación automática de videos. |
| **C13, C14, C15:** Pruebas E2E Playwright | **Diego Oré** (Scrum/QA) | Playwright, flujo Golden Path (Generar horario completo y exportar a iCal). |
| **C16, C17:** Cobertura de Código y Calidad | **Diego Oré** (Scrum/QA) | Reporte global (72% local / 92.4% CI), lógica crítica (96.7%), justificación de exclusiones. |
| **C18:** Gobernanza y Repositorio | **José Bacilio** (PO/QA Lead) | Gitflow, commits descriptivos, README de instalación y SonarQube local. |

---

## 🐳 2. Inicialización de SonarQube en Vivo y Mapeo de Cobertura

Para demostrar la calidad de código frente al profesor en vivo, **José Bacilio** iniciará el panel unificado de SonarQube para proyectar los resultados acumulados de las pruebas.

### A. Levantar SonarQube mediante Docker
Abre una terminal de PowerShell en la raíz del proyecto (`C:\Bacilio\sistema_generacion_horarios_academicos`) y ejecuta:
```powershell
# Levantar el contenedor de SonarQube en segundo plano
docker compose -f docker-compose-sonar.yml up -d
```
*   **URL de Acceso:** [http://localhost:9000](http://localhost:9000) (Credenciales: `admin` / `admin` o la contraseña modificada).

### B. Ejecutar el Escaneo de Cobertura en Vivo (Si el docente lo solicita)
```powershell
docker run --rm -e SONAR_HOST_URL="http://host.docker.internal:9000" -e SONAR_TOKEN="squ_11548cbe57d0dd8542941b9f2ed874e829a07141" -v "${PWD}:/usr/src" sonarsource/sonar-scanner-cli
```
*   Esto leerá el archivo `coverage.xml` generado por Pytest y mapeará la cobertura de la lógica de negocio directamente en el portal de SonarQube en vivo.

---

## 🗣️ 3. Guiones Individuales de Exposición

---

### 🎙️ Integrante 1: JOSÉ ANTHONY BACILIO DE LA CRUZ (PO & QA Lead)
*   **Foco de Rúbrica:** Pruebas de Aceptación con Cypress (C10, C11, C12) y Organización del Repositorio (C18).
*   **Apoyo Visual:** Archivo de configuración `cypress.config.ts`, script `login_and_scheduling.cy.ts` y el video en `/cypress/videos/`.

#### **Guión de Exposición:**
> *"Buenas tardes, profesor. Como Product Owner y QA Lead, he liderado la gobernanza del repositorio y el diseño de las pruebas de aceptación utilizando **Cypress** para validar las historias de usuario de nuestro backlog.*
>
> *(Mostrar el archivo cypress.config.ts)*
> *En `cypress.config.ts` establecimos la dirección base en `localhost:5173` y configuramos carpetas dedicadas para capturar evidencias automáticas de video de cada flujo de prueba ejecutado.*
>
> *(Mostrar el código de login_and_scheduling.cy.ts)*
> *Para cumplir con el **Criterio 11 (Cobertura de Escenarios)**, implementamos dos flujos clave:*
> *1. El **Happy Path**, donde el administrador inicia sesión con credenciales válidas, verifica que sea redirigido a `/dashboard` y valida la visibilidad de los KPIs de aulas y cursos.*
> *2. El **Unhappy Path**, que prueba que al ingresar credenciales incorrectas, el sistema no colapse y devuelva de forma controlada el mensaje 'Credenciales inválidas'.*
>
> *Respecto al **Criterio 18 (Organización)**, mantenemos una arquitectura limpia: el código productivo reside en `/src` y los scripts de prueba están completamente aislados en `/tests` y `/cypress`. Toda la instalación y flujo de ejecución está documentado paso a paso en el `README.md`.*
>
> *Paso la palabra a Aldo Requena para explicar las pruebas de backend."*

*   **Pregunta de defensa típica:** *¿Cómo interactúan las pruebas de aceptación con la base de datos?*
    *   *Respuesta de impacto:* *"Cypress realiza pruebas de caja negra a nivel de interfaz de usuario. Al hacer clic e ingresar texto, Cypress interactúa con el frontend, el cual se comunica mediante peticiones HTTP asíncronas al backend, validando el flujo real del sistema completo de extremo a extremo."*

---

### 🎙️ Integrante 2: ALDO ALEXANDRE REQUENA LAVI (Backend Developer)
*   **Foco de Rúbrica:** Pruebas Unitarias Backend (C1, C2, C3) y Pruebas de Integración (C7, C8, C9).
*   **Apoyo Visual:** Archivo `test_scheduler.py`, archivo `test_api.py` y una terminal de comandos.

#### **Guión de Exposición:**
> *"Buenas tardes, profesor. Mi rol consistió en el desarrollo y automatización de las **pruebas unitarias y de integración de la API** del backend utilizando **Pytest**.*
>
> *(Mostrar el archivo test_scheduler.py)*
> *Para las pruebas unitarias del backend, aislamos la lógica de negocio del motor de optimización `SchedulerEngine`. Para evitar ensuciar o depender de la base de datos PostgreSQL real, configuramos una base de datos SQLite transaccional en memoria en `conftest.py`, inyectando mocks y stubs para las entidades de cursos, secciones y docentes.*
> *Validamos reglas críticas como la restricción dura de capacidad de aulas (HC-3) y colisión de docentes (HC-5), asegurando que el solver arroje una alerta controlada si los recursos no coinciden.*
>
> *(Mostrar el archivo test_api.py y ejecutar pytest)*
> *Respecto al **Criterio 7 (Pruebas de Integración)**, utilizamos `TestClient` de FastAPI para simular llamadas HTTP directas a nuestra API REST en endpoints CRUD. Evaluamos escenarios con peticiones válidas e inválidas, controlando respuestas con códigos de estado HTTP correctos (como 200 para OK, 404 para no encontrado y 401 para accesos sin token). Como ven en la pantalla, las **84 pruebas pasan exitosamente**.*
>
> *Paso la palabra a Luis Gutierrez para explicar las pruebas de componentes."*

*   **Pregunta de defensa típica:** *¿Por qué decidieron usar SQLite en memoria para las pruebas unitarias del backend?*
    *   *Respuesta de impacto:* *"Para garantizar la velocidad y reproducibilidad de los tests. Una base de datos en disco o en la nube añade latencia de red y requiere configuración de red compleja. SQLite en memoria se crea en milisegundos, corre 100% aislado y se destruye al finalizar los tests sin dejar datos residuales."*

---

### 🎙️ Integrante 3: LUIS ALBERTO GUTIERREZ TAIPE (Frontend Developer)
*   **Foco de Rúbrica:** Pruebas de Componentes React (C4, C5, C6).
*   **Apoyo Visual:** Archivo `Courses.test.tsx`, handlers de MSW y una terminal de comandos.

#### **Guión de Exposición:**
> *"Buenas tardes, profesor. Mi asignación consistió en asegurar la calidad de las interfaces de usuario mediante **pruebas de componentes de React** utilizando **React Testing Library (RTL)** y **Mock Service Worker (MSW)**.*
>
> *(Mostrar el archivo Courses.test.tsx)*
> *Durante el ciclo de desarrollo, la interfaz necesita conectarse a la API de FastAPI. Para evitar dependencias y que las pruebas sean robustas, utilizamos MSW para interceptar las llamadas de red `/api/cursos` a nivel de navegador virtual, devolviendo respuestas JSON controladas. Esto nos permite simular los **5 escenarios obligatorios de la interfaz**:*
>
> *1. **Estado de carga:** Verificamos que se renderice el spinner o texto 'Cargando cursos...' mientras la petición está pendiente.*
> *2. **Carga asincrónica exitosa:** Validamos que la tabla del CRUD renderice la lista de cursos simulada.*
> *3. **Estado vacío:** Forzamos a MSW a responder un arreglo vacío y verificamos que se muestre el texto 'No hay cursos registrados'.*
> *4. **Estado de error:** Hacemos que MSW devuelva un error 500 y comprobamos que el componente renderice el mensaje de error de red.*
> *5. **Validación de Formularios:** Comprobamos que no se permita enviar el formulario si el formato de código de curso es inválido.*
>
> *(Ejecutar npm run test en la terminal del frontend)*
> *Como se observa, todas las pruebas unitarias y de componentes se ejecutan y pasan exitosamente bajo el framework de Vitest.*
>
> *Paso la palabra a Diego Oré para el análisis final de cobertura y E2E."*

*   **Pregunta de defensa típica:** *¿Qué ventajas tiene React Testing Library sobre otros frameworks como Enzyme?*
    *   *Respuesta de impacto:* *"React Testing Library promueve probar el comportamiento y no los detalles de implementación interna. RTL nos obliga a buscar los elementos por su rol accesible o su texto, simulando exactamente cómo un usuario real o un lector de pantalla interactúan con el DOM."*

---

### 🎙️ Integrante 4: DIEGO ISAAC ORÉ GONZALES (Scrum Master & QA)
*   **Foco de Rúbrica:** Pruebas E2E con Playwright (C13, C14, C15) y Análisis de Cobertura (C16, C17).
*   **Apoyo Visual:** Archivo `scheduling_flow.spec.ts` y tabla de cobertura (SonarQube o consola).

#### **Guión de Exposición:**
> *"Buenas tardes, profesor. Para concluir, yo me encargué de las **pruebas End-to-End (E2E) con Playwright** y del **análisis cuantitativo de cobertura de código**.*
>
> *(Mostrar el archivo scheduling_flow.spec.ts)*
> *Playwright nos permite emular el flujo completo del negocio, simulando las acciones de un usuario en navegadores reales de forma automatizada. Validamos el **Golden Path**: el administrador inicia sesión, navega a la sección de generación, presiona 'Generar Horario', espera a que el motor CP-SAT de OR-Tools resuelva el modelo matemático y verifica que la cuadrícula se renderice. Finalmente, descarga el archivo de exportación `.ics` para Google Calendar.*
>
> *(Mostrar la tabla de cobertura)*
> *Respecto al **análisis de cobertura**, el sistema supera el estándar mínimo (70% global, 85% lógica crítica):*
> *1. En **GitHub Actions**, nuestra integración continua reporta una cobertura global del **92.4%** en el backend y superior al **96%** en la lógica del scheduler.*
> *2. En **Local (Windows + Python 3.14)**, reportamos un **72%** de cobertura global. Esto se debe a una **decisión técnica de resiliencia**: OR-Tools tiene un problema de violación de acceso en Windows con Python 3.14+. Para evitar que la app se caiga en vivo, programamos un fallback que activa un solver alternativo en Python puro. Al saltar el CP-SAT de OR-Tools, esas líneas quedan sin marcar, bajando la cobertura local al 72% sin comprometer la estabilidad.*
>
> *Justificamos la exclusión de `seed.py` (script de desarrollo) y `jira_manager.py` (API de terceros).*
>
> *Con esto, profesor, abrimos la ronda de preguntas."*

---

## 🧪 4. Guía de Comandos para Ejecutar en Vivo

Ten estos comandos listos en pestañas de terminal independientes para ejecutarlos al instante durante la exposición:

### A. Ejecutar los 84 Tests del Backend y Cobertura (Pytest)
```powershell
cd src/backend
# Correr tests con reporte detallado
pytest --cov=app --cov-report=term-missing tests/
```
*   *Qué señalar:* El `TOTAL: 72%` de cobertura en consola local, y explicar la justificación del fallback de Python 3.14.

### B. Ejecutar los Tests de Componentes Frontend (Vitest)
```powershell
cd src/frontend
# Iniciar Vitest
npm run test
```
*   *Qué señalar:* Muestra que se ejecutan y pasan con éxito las pruebas de renderizado del login y MSW.

### C. Ejecutar Compilación y Linter del Frontend (Vite & ESLint)
```powershell
cd src/frontend
# Correr linter sin advertencias
npm run lint
# Compilar la aplicación limpia
npm run build
```
