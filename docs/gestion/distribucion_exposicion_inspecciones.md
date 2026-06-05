# Guion de Exposición Detallado — Inspecciones 05 y 06

> **Proyecto:** Sistema de Generación Óptima de Horarios Académicos (SGOHA)  
> **Curso:** Taller de Proyectos 2 — Universidad Continental (2026)  
> **Equipo:**
> 1. **Jose Bacilio** — Product Owner (PO)
> 2. **Diego Oré** — Scrum Master (SM / QA Lead)
> 3. **Aldo Requena** — Backend Developer
> 4. **Luis Gutierrez** — Frontend Developer

---
---

# 🌿 PARTE 1: INSPECCIÓN 05 — Desarrollo Web Sostenible

**Documento fuente:** `docs/sostenibilidad/reporte_sostenibilidad.md`

---

## 🎙️ JOSE BACILIO — Criterios 1, 6 y 9

### Qué mostrar en pantalla:
- Abrir el archivo `docs/sostenibilidad/reporte_sostenibilidad.md`, sección 1 (Sensibilización).
- Tener visible la tabla de métricas CO2eq de la sección 4.

### Qué decir (guion literal):

> Buenos días/tardes, profesor y compañeros. Mi nombre es Jose Bacilio, soy el Product Owner del proyecto SGOHA — Sistema de Generación Óptima de Horarios Académicos.
>
> Voy a iniciar con el **Criterio 1** de la rúbrica, que corresponde al **análisis del impacto ambiental** de nuestro software.
>
> Actualmente, la industria digital es responsable de aproximadamente el 3 al 4 por ciento de las emisiones globales de gases de efecto invernadero, una cifra comparable a la aviación civil. Nuestro sistema no está exento de esta problemática, y hemos identificado **5 impactos ambientales concretos** en nuestro proyecto:
>
> **Primero: el consumo energético del servidor.** Cuando el administrador ejecuta la generación de horarios, nuestro motor CP-SAT de Google OR-Tools mantiene la CPU al 100 por ciento de carga durante varios segundos, resolviendo miles de variables binarias y restricciones. Cada ejecución consume energía eléctrica real en el servidor de despliegue, además de requerir refrigeración adicional en el centro de datos.
>
> **Segundo: la sobrecarga de transmisión en red.** Sin optimización, una consulta a la API de horarios generaba un JSON enorme con información redundante de secciones, docentes y aulas repetida cientos de veces. Cada estudiante o docente que consultaba el sistema transmitía megabytes innecesarios, lo cual consume aproximadamente 0.06 kilovatios-hora por cada gigabyte transferido.
>
> **Tercero: el problema N+1 en las consultas de base de datos.** Al consultar los horarios, el sistema realizaba un bucle que ejecutaba una consulta individual por cada sección para traer el nombre del docente. Si hay 500 bloques de horario, se generaban 500 consultas adicionales al disco, multiplicando el consumo energético del servidor de base de datos por operaciones de entrada-salida constantes.
>
> **Cuarto: el tamaño del bundle de JavaScript del frontend.** Nuestra aplicación es una SPA en React. Sin lazy loading, el navegador del estudiante descargaba todo el código administrativo — las pantallas de gestión de aulas, cursos y secciones — aunque él solo necesita ver su horario. Esto drena la batería de los celulares y consume procesador innecesariamente.
>
> **Y quinto: las imágenes institucionales sin comprimir.** El logo de la universidad y los banners se almacenaban en formato PNG sin optimizar, transfiriendo bytes redundantes en cada visita.
>
> *(Pasar a la tabla de métricas CO2eq)*
>
> Ahora, respecto al **Criterio 6**, que pide explicar los **beneficios obtenidos en sostenibilidad**:
>
> Para cuantificar el impacto real de nuestras mejoras, aplicamos la fórmula simplificada del modelo OneByte de CO2.js, que calcula las emisiones como los datos transmitidos en gigabytes multiplicados por 60 gramos de CO2 por gigabyte, más el tiempo de CPU activo multiplicado por la potencia del procesador.
>
> Con esta fórmula, estimamos que **por cada mil visitas al sistema**, las emisiones pasaron de 15.3 gramos de CO2 a solo **2.8 gramos de CO2**, lo que representa un ahorro del **81.7 por ciento** en huella de carbono. Esto demuestra que las optimizaciones no son solo mejoras de rendimiento, sino contribuciones reales a la sostenibilidad ambiental de nuestro software.
>
> Finalmente, respecto al **Criterio 9** de cumplimiento de recursos: nuestro equipo revisó el video "Viaje Full-Stack Sostenible", escuchó el audio "El Costo Físico del Mundo Digital", analizó la infografía de Sostenibilidad Web Móvil y las diapositivas "Green MERN Engineering". Además, todos los integrantes respondimos la encuesta estudiantil de co-creación de recursos educativos digitales con NotebookLM.
>
> Le paso la palabra a Diego Oré, quien va a explicar las oportunidades de mejora que identificamos y la validación de resultados.

---

## 🎙️ DIEGO ORÉ — Criterios 2, 5 y 7

### Qué mostrar en pantalla:
- Tabla de oportunidades de mejora (sección 2 del reporte).
- Tabla comparativa "Antes y Después" (sección 4).
- Captura de Lighthouse (sección 4.1.A).
- Historial de commits en GitHub.

### Qué decir (guion literal):

> Gracias, Jose. Mi nombre es Diego Oré, soy el Scrum Master del equipo y me encargué de la validación de resultados y la gestión del repositorio.
>
> Empiezo con el **Criterio 2**: la **identificación de oportunidades de mejora**.
>
> Tras analizar nuestro stack tecnológico — que usa FastAPI con SQLAlchemy en el backend y React con TypeScript en el frontend —, identificamos **3 oportunidades críticas de optimización**:
>
> *(Señalar la tabla en pantalla)*
>
> **Primera oportunidad:** Resolver el problema N+1 de consultas SQL usando `joinedload` de SQLAlchemy. El impacto esperado era pasar de "1 más 2N" queries a una sola consulta consolidada con JOIN.
>
> **Segunda oportunidad:** Implementar Code Splitting con `React.lazy` y `Suspense` en el frontend, dividiendo las rutas administrativas de las estudiantiles, con un impacto esperado de reducir el bundle inicial en un 40 por ciento.
>
> **Tercera oportunidad:** Implementar paginación en los endpoints de cursos y aulas con los parámetros `skip` y `limit`, para limitar las respuestas a 20 registros por página en lugar de retornar cientos de registros de golpe.
>
> Cada oportunidad fue justificada por su impacto en rendimiento y en sostenibilidad ambiental.
>
> *(Cambiar a la tabla de validación de resultados)*
>
> Ahora paso al **Criterio 5**: la **validación cuantitativa antes y después** de las mejoras.
>
> Implementamos un script automatizado llamado `sustainability_benchmark.py` que mide las métricas reales del sistema. Los resultados son contundentes:
>
> - Las **consultas SQL** pasaron de 201 para 100 horarios a **solo 1 consulta**. Eso es un ahorro del 99.5 por ciento.
> - El **tamaño del payload de red** bajó de 185 kilobytes a **28.2 kilobytes** gracias a la compresión Gzip y la limpieza de campos redundantes. Ahorro del 84.7 por ciento.
> - El **tiempo de respuesta de la API** cayó de 180 milisegundos a **12 milisegundos**. Eso es un 93.3 por ciento más rápido.
> - Las **imágenes estáticas** bajaron de 70.9 kilobytes a **19.6 kilobytes** al migrar de PNG a WebP. Ahorro del 72.3 por ciento.
> - El **consumo de red estimado por mil visitas** bajó de 255 megabytes a **47.8 megabytes**.
>
> *(Mostrar captura de Lighthouse)*
>
> Como evidencia visual, aquí pueden ver nuestro reporte de Lighthouse. El SEO subió a **100 puntos** y el rendimiento a **75 en modo desarrollo**. Cabe aclarar que en modo producción compilado, supera el 95 por ciento, porque en desarrollo Vite entrega los módulos sin minificar.
>
> Finalmente, respecto al **Criterio 7** de **gestión del repositorio**: cada mejora de sostenibilidad fue registrada con un commit descriptivo individual por cada integrante del equipo. Tenemos 4 commits trazables:
> - El mío registró el script de benchmark.
> - Jose registró el reporte de sensibilización.
> - Aldo las optimizaciones de backend.
> - Y Luis las optimizaciones de frontend.
>
> Todo está visible en el historial de GitHub con mensajes descriptivos que siguen la convención de commits del proyecto.
>
> Le paso la palabra a Aldo Requena, quien explicará las implementaciones técnicas del backend.

---

## 🎙️ ALDO REQUENA — Criterios 3 (Backend), 4 (Técnicas Backend) y 8

### Qué mostrar en pantalla:
- Código de `joinedload` en `scheduler.py` (sección 3.1 del reporte).
- Código del middleware Gzip en `main.py` (sección 3.8).
- Código de paginación en un endpoint de FastAPI.

### Qué decir (guion literal):

> Gracias, Diego. Mi nombre es Aldo Requena, soy el desarrollador backend del equipo.
>
> Me corresponde explicar el **Criterio 3**, que evalúa la **implementación de mejoras de sostenibilidad** en la parte del servidor, y el **Criterio 4**, que evalúa las **técnicas específicas de optimización** aplicadas.
>
> *(Mostrar código del joinedload)*
>
> **Primera mejora: Optimización de consultas SQL con `joinedload`.** En nuestro endpoint `/api/scheduler/`, el sistema antes hacía un bucle donde por cada horario ejecutaba una consulta para traer el nombre del docente y otra para traer los datos del curso. Si teníamos 100 bloques de horario, eso generaba 201 consultas al disco.
>
> La solución fue usar la función `joinedload` de SQLAlchemy. Con esta línea de código que ven en pantalla, le indicamos al ORM que precargue las relaciones de sección, curso, docente y aula en un único SELECT con JOINs internos. Resultado: pasamos de 201 consultas a **una sola consulta consolidada**. Esto reduce drásticamente las operaciones de entrada y salida en el disco del servidor, bajando el consumo eléctrico.
>
> *(Mostrar código del GzipMiddleware)*
>
> **Segunda mejora: Compresión Gzip a nivel de middleware.** Agregamos el middleware `GZipMiddleware` de FastAPI en el archivo `main.py`, configurado con un tamaño mínimo de 500 bytes. Esto significa que toda respuesta JSON que supere los 500 bytes es comprimida automáticamente antes de ser enviada por la red. El resultado medido fue una reducción del payload de 185 kilobytes a **28.2 kilobytes**, un ahorro del 84.7 por ciento en datos transmitidos.
>
> *(Mostrar código de paginación)*
>
> **Tercera mejora: Paginación de datos en los endpoints.** En los routers de cursos, aulas y secciones, agregamos los parámetros `skip` y `limit` con valores por defecto de 0 y 50 respectivamente. En lugar de retornar los cientos de registros completos en cada consulta, ahora el cliente solicita páginas específicas. Además, configuramos cabeceras HTTP `Cache-Control: public, max-age=3600` para que los catálogos estáticos como aulas y cursos se almacenen en la caché del navegador durante una hora, evitando recargas innecesarias.
>
> Estas tres implementaciones están correctamente documentadas en el reporte de sostenibilidad con fragmentos de código verificables y métricas de resultado.
>
> Le paso la palabra a Luis Gutierrez, quien explicará las optimizaciones del frontend.

---

## 🎙️ LUIS GUTIERREZ — Criterios 3 (Frontend), 4 (Técnicas Frontend) y 8

### Qué mostrar en pantalla:
- Código de `React.lazy` y `Suspense` en `App.tsx` (sección 3.4 del reporte).
- Captura de Lazy Loading en pestaña Network (sección 4.1.C).
- Comparación de tamaños de imágenes PNG vs WebP.

### Qué decir (guion literal):

> Gracias, Aldo. Mi nombre es Luis Gutierrez, soy el desarrollador frontend del equipo.
>
> Voy a explicar las mejoras de sostenibilidad que implementamos en el lado del cliente, que corresponden a los **Criterios 3 y 4** de la rúbrica.
>
> *(Mostrar código de React.lazy en App.tsx)*
>
> **Primera mejora: Lazy Loading con React.lazy y Suspense.** Nuestro sistema es una SPA — Single Page Application — en React. Antes, cuando cualquier usuario accedía, el navegador descargaba todo el código JavaScript de todas las pantallas: login, dashboard, gestión de cursos, gestión de aulas, gestión de secciones y docentes. Pero un estudiante solo necesita ver su horario. Estábamos obligándolo a descargar código que nunca usaría.
>
> La solución fue dividir el bundle con `React.lazy`. Como ven en pantalla, las vistas administrativas como `Courses`, `Classrooms`, `Sections` y `Teachers` ahora se importan dinámicamente. Solo se descargan cuando el usuario navega a esa ruta específica. Envolvemos todo en un componente `Suspense` que muestra un spinner de carga mientras el fragmento JavaScript se descarga.
>
> *(Mostrar captura de Network con lazy loading)*
>
> Aquí en la pestaña Network de Chrome DevTools pueden ver la evidencia: cuando el administrador hace clic en "Aulas", recién en ese momento aparece la solicitud de descarga del archivo `Classrooms-XXXX.js`. Antes de hacer clic, ese archivo no existía en la lista de recursos descargados. El bundle inicial se redujo en un **40 por ciento**.
>
> **Segunda mejora: Migración de imágenes a formato WebP.** El logo institucional de la Universidad Continental estaba en formato PNG y pesaba 26 kilobytes. Lo convertimos a WebP con compresión al 80 por ciento y ahora pesa solo **7.2 kilobytes**. El banner principal pasó de 44.9 kilobytes a **12.4 kilobytes**. Eso es un ahorro del **72 por ciento** en el peso de los assets visuales, lo que se traduce en menos datos descargados y menos consumo de batería en los dispositivos móviles de los estudiantes.
>
> **Tercera mejora: Consolidación de peticiones HTTP.** En el Dashboard, las estadísticas de KPIs — cantidad de cursos, aulas, secciones y docentes — se cargan ahora en una única llamada al endpoint `/api/scheduler/stats`, en lugar de hacer 4 llamadas separadas. Además, implementamos la interfaz paginada en los CRUDs del frontend para que el usuario navegue por páginas de 20 registros, evitando cargar miles de registros en memoria del navegador.
>
> Todo esto contribuye directamente a la sostenibilidad: menos datos en red, menos ciclos de CPU en el celular del estudiante, menos consumo de batería y menos emisiones de carbono.
>
> Con esto concluimos la exposición de la Inspección 05 sobre sostenibilidad. ¿Tiene alguna pregunta, profesor?

---
---

# 🧪 PARTE 2: INSPECCIÓN 06 — Testing y Aseguramiento de Calidad

**Documento fuente:** `docs/testing/estrategia_testing.md`

---

## 🎙️ ALDO REQUENA — Criterios 1, 2, 3, 7, 8 y 9

### Qué mostrar en pantalla:
- Código de `test_scheduler.py` (sección 1.1 de la estrategia de testing).
- Log de ejecución de pytest en terminal (sección 1.2).
- Código de `test_api.py` (sección 3.2).

### Qué decir (guion literal):

> Buenos días/tardes. Soy Aldo Requena, desarrollador backend. Voy a explicar la estrategia de **pruebas unitarias del backend** y las **pruebas de integración** de nuestra API.
>
> Empiezo con el **Criterio 1**: la **implementación de pruebas unitarias** sobre servicios, controladores y lógica de negocio.
>
> *(Mostrar código de test_scheduler.py)*
>
> Nuestro componente más crítico es el motor de optimización `SchedulerEngine`, que resuelve la asignación de horarios mediante el solver CP-SAT. Para probarlo de forma aislada — sin necesidad de una base de datos PostgreSQL real —, utilizamos **mocks** con la librería `unittest.mock` de Python. Creamos funciones helper como `make_curso`, `make_aula` y `make_seccion` que generan objetos simulados con datos controlados.
>
> Por ejemplo, en el test `test_scheduler_respects_classroom_capacity`, creamos un aula de laboratorio con capacidad para 20 alumnos y una sección que necesita 30 cupos. El test verifica que el motor no asigne esa sección a esa aula porque la capacidad es insuficiente. Estamos validando la **restricción dura HC-3** del modelo CSP.
>
> Tenemos también tests para verificar la **no-superposición de docentes** — restricción HC-5 —, la **no-colisión de aulas** — restricción HC-4 —, y el respeto de los **turnos mañana y tarde** — restricción HC-9.
>
> En total, la suite de pruebas unitarias del backend contiene **47 tests automatizados**, incluyendo 23 tests del scheduler, 17 tests del modelo de optimización, 4 tests de autenticación y 3 tests de API.
>
> *(Mostrar log de ejecución en terminal)*
>
> Aquí ven la ejecución real en terminal. Ejecutamos `pytest tests/ -v` y los 47 tests pasaron exitosamente en 1.14 segundos. No hay fallos ni warnings críticos.
>
> Respecto al **Criterio 2**, usamos **pytest** como herramienta obligatoria del backend, equivalente a Jest/Vitest que la rúbrica solicita para proyectos Node.js. La configuración está integrada en el archivo `conftest.py`, donde se define una base de datos SQLite en memoria para cada test y se limpian las tablas automáticamente al finalizar cada prueba.
>
> *(Mostrar código de test_api.py)*
>
> Ahora paso al **Criterio 7**: las **pruebas de integración**. Estas validan que el flujo completo entre la API REST de FastAPI y la persistencia en base de datos funcione correctamente.
>
> En el archivo `test_api.py`, usamos el `TestClient` de FastAPI — que es equivalente a Supertest en Node.js —. Aquí ven un test de integración completo del CRUD de cursos: primero hacemos un POST para crear un curso con datos específicos y verificamos que retorne un código 200. Luego hacemos un GET para listar todos los cursos y verificamos que nuestro curso aparezca en la lista. Después hacemos un DELETE para eliminarlo y verificamos que responda 200. Finalmente, intentamos un GET por el ID del curso eliminado y verificamos que retorne un **404 Not Found**.
>
> Esto cubre los escenarios del **Criterio 8**: peticiones válidas, peticiones inválidas y acceso a recursos inexistentes. Cada test corre dentro de una transacción que se revierte al finalizar con un rollback automático, para que los datos de un test no contaminen al siguiente.
>
> Le paso la palabra a Luis Gutierrez para las pruebas del frontend.

---

## 🎙️ LUIS GUTIERREZ — Criterios 4, 5 y 6

### Qué mostrar en pantalla:
- Código de `Courses.test.tsx` (sección 2.2 de la estrategia de testing).
- Diagrama conceptual de MSW interceptando peticiones HTTP.

### Qué decir (guion literal):

> Gracias, Aldo. Soy Luis Gutierrez, desarrollador frontend. Voy a explicar las **pruebas de componentes React** y el uso de **Mock Service Worker**.
>
> Empiezo con el **Criterio 4**: la **implementación de pruebas de componentes** que validan renderizado, interacción, estados y formularios.
>
> *(Mostrar código de Courses.test.tsx)*
>
> En el archivo `Courses.test.tsx`, implementamos pruebas sobre la vista de gestión de cursos usando **React Testing Library**, que nos permite interactuar con el DOM emulado como lo haría un usuario real.
>
> Pero aquí hay un problema técnico: la vista de Cursos hace llamadas a nuestra API REST para traer los datos del backend. En un entorno de pruebas, no queremos levantar el servidor FastAPI real. Entonces usamos **MSW — Mock Service Worker** — que es la herramienta que la rúbrica solicita en el **Criterio 6**.
>
> MSW funciona así: configuramos un servidor mock que intercepta las peticiones HTTP a nivel del navegador virtual de Jest. Cuando el componente de Cursos hace un `fetch` a `/api/cursos`, MSW intercepta esa petición y devuelve un JSON controlado con datos de prueba, sin que la petición salga nunca a la red real.
>
> Ahora, los escenarios que la rúbrica exige en el **Criterio 5** son: estados de carga, error, vacío y operaciones asincrónicas. Los cubrimos todos:
>
> **Escenario 1: Estado de carga.** El primer test verifica que al renderizar el componente, se muestre inmediatamente el texto "Cargando cursos". Esto confirma que el spinner de carga funciona antes de que la API responda.
>
> **Escenario 2: Carga asincrónica exitosa.** El segundo test usa `waitFor` para esperar que MSW responda con los datos del curso "Taller de Proyectos 2" y verifica que aparezca en pantalla con su código "CUR-01".
>
> **Escenario 3: Estado vacío.** Sobreescribimos el handler de MSW para que retorne un arreglo vacío y verificamos que el componente muestre el mensaje "No hay cursos registrados".
>
> **Escenario 4: Estado de error.** Sobreescribimos el handler para que retorne un error 500 del servidor y verificamos que se muestre el mensaje "Error al cargar los cursos".
>
> Estos 4 escenarios cubren completamente los requisitos obligatorios de la rúbrica para pruebas de componentes React.
>
> Le paso la palabra a Jose Bacilio para las pruebas de aceptación con Cypress.

---

## 🎙️ JOSE BACILIO — Criterios 10, 11, 12 y 18

### Qué mostrar en pantalla:
- Configuración de Cypress (`cypress.config.ts`, sección 4.1 de la estrategia).
- Script de aceptación `login_and_scheduling.cy.ts` (sección 4.2).
- Estructura del repositorio GitHub.

### Qué decir (guion literal):

> Gracias, Luis. Soy Jose Bacilio, Product Owner. Me corresponde explicar las **pruebas de aceptación** con Cypress y la **organización del repositorio**.
>
> Empiezo con el **Criterio 10**: la **automatización de escenarios funcionales** con Cypress.
>
> *(Mostrar configuración de Cypress)*
>
> Primero, la configuración. En el archivo `cypress.config.ts` definimos que la URL base es nuestro servidor de desarrollo local en el puerto 5173 de Vite. Habilitamos la grabación de video automática y configuramos las carpetas de capturas y videos.
>
> *(Mostrar script de aceptación)*
>
> Ahora, el script de prueba. Como Product Owner, mi responsabilidad es validar las historias de usuario del backlog. Entonces automaticé el flujo principal que un administrador ejecuta:
>
> **Escenario Happy Path — Login exitoso:** Cypress visita la página de login, escribe el usuario "admin_uc" en el campo de username, escribe la contraseña en el campo de password, selecciona el rol "admin" en el selector desplegable y hace clic en el botón de submit. Luego verificamos que la URL cambie a "/dashboard", que aparezca el título "Generación Óptima de Horarios" y que los indicadores KPI de aulas y cursos sean visibles en pantalla. Esto valida la historia de usuario HU-3.1 del backlog.
>
> **Escenario Unhappy Path — Acceso denegado:** En el segundo test, ingresamos la misma cuenta pero con una contraseña incorrecta "wrongpassword", hacemos clic en submit y verificamos que aparezca el mensaje de error "Credenciales inválidas". Esto confirma que el sistema rechaza correctamente los accesos no autorizados.
>
> Respecto al **Criterio 12**, las evidencias de Cypress: la herramienta genera automáticamente videos de cada ejecución en la carpeta `cypress/videos` y capturas de pantalla en `cypress/screenshots`. Estos archivos se pueden revisar directamente en el repositorio.
>
> *(Mostrar estructura del repositorio en GitHub)*
>
> Ahora el **Criterio 18**: la **organización del repositorio**. Nuestro repositorio en GitHub mantiene una estructura clara:
> - El código fuente está separado en `src/backend` y `src/frontend`.
> - Las pruebas del backend están aisladas en `src/backend/tests/`.
> - Las pruebas de Cypress están en `src/frontend/cypress/e2e/`.
> - La documentación técnica está organizada en `docs/` con subcarpetas por categoría: arquitectura, especificaciones, gestión, planificación, sostenibilidad y testing.
> - Usamos commits descriptivos que siguen la convención `tipo(alcance): descripción`, como por ejemplo `feat(backend): optimize DB queries` o `test(e2e): add Cypress acceptance tests`.
> - El `README.md` incluye una tabla de contenidos sincronizada con enlaces a todos los documentos del proyecto, e instrucciones de ejecución reproducibles.
>
> Le paso la palabra a Diego Oré para las pruebas E2E y el análisis de cobertura.

---

## 🎙️ DIEGO ORÉ — Criterios 13, 14, 15, 16 y 17

### Qué mostrar en pantalla:
- Script E2E de Playwright `scheduling_flow.spec.ts` (sección 5.1 de la estrategia).
- Reporte de cobertura de `pytest --cov` (sección 6.2).
- Tabla de exclusiones de cobertura (sección 6.3).

### Qué decir (guion literal):

> Gracias, Jose. Soy Diego Oré, Scrum Master y QA Lead del equipo. Voy a explicar las **pruebas End-to-End con Playwright** y el **análisis de cobertura de código**.
>
> Empiezo con el **Criterio 13**: la implementación de pruebas E2E que validan los **Golden Path, Happy Path y Unhappy Path**.
>
> *(Mostrar script de Playwright)*
>
> Playwright es un framework de automatización de navegadores creado por Microsoft, similar a Cypress pero con soporte nativo para múltiples navegadores. Lo usamos para validar los flujos completos de negocio más críticos del sistema.
>
> **El Golden Path** es el flujo principal del negocio: el camino dorado que un usuario ejecuta con éxito de inicio a fin. En nuestro caso es: el administrador abre la aplicación, inicia sesión, navega al dashboard, hace clic en el botón "Generar Horario" para ejecutar el algoritmo CP-SAT, espera a que el solver resuelva el problema, y verifica que la cuadrícula de horarios se renderice correctamente. Finalmente, descarga el archivo de exportación iCal con extensión `.ics` para importarlo en Google Calendar.
>
> En el código que ven en pantalla, esto se traduce en: `page.goto` al login, `page.fill` para username y password, `page.click` en submit, `page.click` en el botón de optimizar, `expect(page.locator('.schedule-grid')).toBeVisible` con un timeout de 10 segundos para esperar al solver, y `page.waitForEvent('download')` para verificar la descarga del archivo `.ics`.
>
> Este test cubre los escenarios del **Criterio 14**: navegación completa del sistema, persistencia de datos generados por el solver, y validación de que el flujo funcional de extremo a extremo opera sin errores.
>
> Respecto al **Criterio 15**, las evidencias E2E: Playwright genera videos de ejecución, capturas automáticas en puntos de fallo, logs detallados y reportes HTML exportables. Todo está disponible en el repositorio para verificación.
>
> *(Cambiar al reporte de cobertura)*
>
> Ahora paso al **Criterio 16**: el **análisis de cobertura y calidad del software**.
>
> Ejecutamos `pytest --cov=app --cov-report=term-missing` para generar el reporte de cobertura del backend. Los resultados que ven en pantalla son:
>
> - `app/models.py`: **100% de cobertura**. Todos los modelos de datos están validados.
> - `app/schemas.py`: **100% de cobertura**. Todos los esquemas Pydantic están cubiertos.
> - `app/core/scheduler.py`: **97% de cobertura**. Solo 4 líneas sin cubrir, que corresponden a ramas de diagnóstico del solver que se activan en escenarios extremos de infactibilidad.
> - `app/auth.py`: **95% de cobertura**. Las líneas sin cubrir son condiciones de expiración de tokens JWT.
>
> En resumen, la **cobertura global del proyecto** es del **92.4 por ciento**, y la **cobertura de la lógica crítica** — que incluye el solver CP-SAT y la autenticación — alcanza el **98.2 por ciento**.
>
> Esto cubre el **Criterio 17**: superamos ampliamente las métricas mínimas. La rúbrica exige un mínimo de 70 por ciento global — tenemos 92.4 —, y un mínimo de 85 por ciento en lógica crítica — tenemos 98.2.
>
> *(Mostrar exclusiones de cobertura)*
>
> Finalmente, respecto a las exclusiones de cobertura, las justificamos técnicamente:
>
> - `jira_manager.py` está excluido porque interactúa con la API externa de Jira Cloud mediante tokens OAuth. Hacer mocks estables de esa API de terceros es inviable y no aporta a la validación de la lógica interna del sistema de horarios.
> - `seed.py` está excluido porque es un script temporal que solo se usa en desarrollo local para poblar la base de datos con datos de prueba. No contiene lógica de negocio y no se ejecuta en producción.
>
> Con esto concluimos la exposición de las Inspecciones 05 y 06. ¿Tiene alguna pregunta, profesor?

---
---

# 📋 RESUMEN: DISTRIBUCIÓN POR INTEGRANTE

## Inspección 05 — Sostenibilidad

| Orden | Expositor | Criterios de Rúbrica | Tema Principal | Tiempo |
|:---:|:---|:---:|:---|:---:|
| 1 | **Jose Bacilio** | 1, 6, 9 | Sensibilización: 5 impactos ambientales + CO2eq + Encuesta | ~2.5 min |
| 2 | **Diego Oré** | 2, 5, 7 | Oportunidades de mejora + Validación antes/después + Commits | ~2 min |
| 3 | **Aldo Requena** | 3 (back), 4 (back), 8 | joinedload + GzipMiddleware + Paginación backend | ~2.5 min |
| 4 | **Luis Gutierrez** | 3 (front), 4 (front), 8 | React.lazy + WebP + Consolidación HTTP | ~2 min |

## Inspección 06 — Testing y Calidad

| Orden | Expositor | Criterios de Rúbrica | Tema Principal | Tiempo |
|:---:|:---|:---:|:---|:---:|
| 1 | **Aldo Requena** | 1, 2, 3, 7, 8, 9 | Pruebas unitarias backend (Pytest, Mocks) + Integración API (TestClient, CRUD) | ~2.5 min |
| 2 | **Luis Gutierrez** | 4, 5, 6 | Pruebas de componentes React (RTL) + MSW + 4 escenarios obligatorios | ~2 min |
| 3 | **Jose Bacilio** | 10, 11, 12, 18 | Pruebas de aceptación Cypress (Happy/Unhappy) + Organización de repositorio | ~2.5 min |
| 4 | **Diego Oré** | 13, 14, 15, 16, 17 | Pruebas E2E Playwright (Golden Path) + Cobertura 92.4% + Exclusiones | ~3 min |

---

## 💡 Recomendaciones Finales

1. **Antes de exponer:** Cada integrante debe leer su sección del reporte fuente (`reporte_sostenibilidad.md` o `estrategia_testing.md`) para dominar los datos y poder responder preguntas del profesor.
2. **Transiciones:** Al terminar, decir explícitamente *"Le paso la palabra a [nombre] para que explique [tema]"*.
3. **Demostración en vivo (si hay tiempo):** Tener lista una terminal con el comando `pytest tests/ -v` para ejecutar en vivo los 47 tests y demostrar que todos pasan.
4. **Dato impactante para cerrar:** Mencionar que el benchmark del solver resolvió 100 secciones en solo **0.033 segundos** y que las emisiones de CO2 del sistema se redujeron en un **81.7%**.
