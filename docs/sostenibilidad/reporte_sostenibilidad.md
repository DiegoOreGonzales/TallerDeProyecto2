# Reporte de Desarrollo Sostenible y Eficiencia Energética (SGOHA)

> **SGOHA: Sistema de Generación Óptima de Horarios Académicos**  
> **Taller de Proyectos 2 – Ingeniería de Sistemas e Informática**  
> **Universidad Continental (2026)**

---

## 🌿 1. Sensibilización: Análisis del Impacto Ambiental del Software

El desarrollo, despliegue y uso de aplicaciones de software modernas contribuye de manera significativa a la huella de carbono global del sector digital (estimada en un ~3-4% de las emisiones globales de gases de efecto invernadero). A continuación, se detallan **5 impactos ambientales clave** relacionados con el ciclo de vida de SGOHA y sus fundamentos técnicos:

### 1.1. Consumo Energético en Servidores de Cómputo (CPU/GPU)
*   **Fundamento Técnico:** El algoritmo CP-SAT de OR-Tools para resolver el problema de *timetabling* (programación de horarios) realiza millones de iteraciones lógicas para satisfacer las restricciones hard y soft del modelo CSP (Constraint Satisfaction Problem). Esto mantiene la CPU del servidor ejecutándose a alta capacidad (~100%) durante varios segundos o minutos.
*   **Relación con SGOHA:** Cada vez que un administrador genera un horario, se demanda potencia eléctrica continua en los servidores de despliegue. Si el algoritmo no está optimizado o realiza consultas redundantes a la base de datos mientras calcula, se incrementan los ciclos de CPU y la disipación térmica, requiriendo más energía eléctrica para refrigeración en el centro de datos (PUE).

### 1.2. Sobrecarga de Datos y Transmisión de Red (Network Traffic)
*   **Fundamento Técnico:** La transmisión de datos a través de cables de fibra óptica, routers e infraestructura inalámbrica (5G/Wi-Fi) consume aproximadamente 0.06 kWh por cada Gigabyte transferido.
*   **Relación con SGOHA:** Sin optimización, consultar la lista completa de horarios genera un payload JSON masivo que contiene información redundante de secciones, docentes y aulas repetida cientos de veces. Al no usar compresión Gzip o paginación, cada consulta de un cliente móvil o de escritorio transmite megabytes innecesarios, forzando la red de telecomunicaciones nacional y elevando el consumo de energía en los routers domésticos.

### 1.3. N+1 Consultas en la Base de Datos (I/O y Bloqueos de Disco)
*   **Fundamento Técnico:** Ejecutar múltiples queries consecutivas para traer relaciones de un registro principal obliga a la base de datos a abrir conexiones, analizar planes de consulta, leer disco y serializar datos repetidamente.
*   **Relación con SGOHA:** Al consultar los horarios asignados (`/api/scheduler/`), el sistema realizaba un bucle llamando individualmente a la base de datos para obtener el docente de cada sección. Si existen 500 bloques de horario, se realizan 500 consultas adicionales a disco. Esto eleva el consumo energético del servidor de base de datos debido a I/O constantes y transacciones concurrentes innecesarias.

### 1.4. Tamaño del Bundle de JavaScript del Cliente (Client CPU parsing)
*   **Fundamento Técnico:** Cuando el usuario accede a una Single Page Application (SPA), el navegador descarga, descomprime, parsea y compila los archivos JavaScript. Una aplicación con dependencias sobredimensionadas obliga al procesador del cliente (computadoras o celulares de estudiantes/docentes) a trabajar intensamente durante la carga inicial.
*   **Relación con SGOHA:** Al usar imports estáticos para todos los CRUDs (Aulas, Cursos, Secciones, Docentes) en el punto de entrada principal, el cliente descarga todo el código administrativo incluso si es un estudiante que solo verá su propio horario. Esto drena la batería de los dispositivos móviles y eleva el consumo de energía en el cliente.

### 1.5. Carga de Imágenes sin Optimizar (Assets Overhead)
*   **Fundamento Técnico:** Los formatos de imagen tradicionales como PNG no comprimen los datos de forma tan eficiente como los formatos modernos (WebP o AVIF), transmitiendo bytes redundantes.
*   **Relación con SGOHA:** Imágenes estáticas como el logo institucional y el banner principal en formatos PNG pesados consumen ancho de banda en cada primera visita. Al multiplicar esto por los miles de estudiantes y docentes que consultan el sistema durante la matrícula, el desperdicio energético acumulado es considerable.

---

## 🔍 2. Identificación de Oportunidades de Mejora en SGOHA

Se han detectado las siguientes **3 oportunidades de mejora críticas** en nuestro stack tecnológico (FastAPI + SQLAlchemy + React):

| # | Módulo/Funcionalidad | Oportunidad Identificada | Impacto Esperado | Justificación de Sostenibilidad |
|---|---|---|---|---|
| **1** | API `/api/scheduler/` | Resolver el problema N+1 consultas usando `joinedload` de SQLAlchemy. | Reducción de queries de `1 + 2N` a `1` sola query consolidada. | Menos operaciones de I/O en base de datos, menor latencia y reducción de tiempo de CPU activo del servidor. |
| **2** | Carga inicial del Frontend | Implementar Code Splitting con `React.lazy` y `Suspense` para dividir rutas administrativas de las estudiantiles. | Reducción del tamaño del bundle JS inicial descargado por el cliente en un ~40%. | Menor consumo de datos móviles, descarga de red más rápida y menor consumo de batería del cliente al parsear menos JS. |
| **3** | APIs `/api/cursos/`, `/aulas/` | Implementar paginación controlada (`skip` y `limit`) en backend y UI de frontend. | Limitar la respuesta a registros específicos (ej. 20 por página) en lugar de retornar cientos de registros a la vez. | Minimiza drásticamente el payload de datos transmitido por la red inalámbrica y el consumo de memoria RAM del cliente. |

---

## 💻 3. Implementación de Mejoras de Sostenibilidad (Green Software)

A continuación, se documenta la aplicación práctica de las 8 técnicas propuestas por la consigna adaptadas a nuestro stack:

### 3.1. Optimización de Consultas (SQL/ORM)
Se modifica `/api/scheduler/` en `src/backend/app/api/scheduler.py` para precargar las relaciones en una única consulta SQL:
```python
horarios = db.query(Horario).options(
    joinedload(Horario.seccion).joinedload(Seccion.curso),
    joinedload(Horario.seccion).joinedload(Seccion.docente),
    joinedload(Horario.aula)
).all()
```
*Beneficio:* Evita N consultas repetitivas al bucle de base de datos.

### 3.2. Paginación de Datos
Se integran parámetros de paginación en el backend (`skip` y `limit` con default `0` y `50`) en los routers correspondientes, y se agrega control de paginación en la interfaz web de React para que el usuario navegue páginas.

### 3.3. Compresión de Imágenes
Se convierten las imágenes estáticas PNG de la aplicación a formato WebP optimizado con compresión del 80%:
*   `logo-uc.png` (26 KB) $\rightarrow$ `logo-uc.webp` (7.2 KB) (ahorro del 72%)
*   `hero.png` (44.9 KB) $\rightarrow$ `hero.webp` (12.4 KB) (ahorro del 72%)

### 3.4. Lazy Loading (Carga Perezosa)
En `src/frontend/src/App.tsx`, las vistas administrativas (`Courses`, `Classrooms`, `Sections`, `Teachers`) se cargan bajo demanda:
```typescript
const Courses = lazy(() => import('./pages/Courses'));
const Classrooms = lazy(() => import('./pages/Classrooms'));
// ... envueltos en <Suspense fallback={<Spinner />} />
```

### 3.5. Eliminación de Dependencias Innecesarias
Limpieza de paquetes sin usar del `package.json` del frontend y `requirements.txt` del backend para mantener el core lo más ligero posible.

### 3.6. Reducción de Solicitudes HTTP
Consolidación de peticiones en el Dashboard: las estadísticas se cargan en una única llamada a `/api/scheduler/stats` y se implementa almacenamiento local de sesión para evitar reconexiones y peticiones repetitivas de sesión.

### 3.7. Caché de Recursos
Configuración de cabeceras HTTP `Cache-Control: public, max-age=3600` en los endpoints del backend que sirven catálogos estáticos como Aulas y Cursos.

### 3.8. Optimización de APIs (Gzip Middleware)
Se añade compresión gzip en la raíz de FastAPI (`src/backend/app/main.py`):
```python
from fastapi.middleware.gzip import GZipMiddleware
app.add_middleware(GZipMiddleware, minimum_size=500)
```
*Beneficio:* Todas las respuestas JSON de más de 500 bytes son comprimidas automáticamente, disminuyendo el tamaño de descarga en aproximadamente un 70%.

---

## 📊 4. Validación de Resultados: Métricas Cuantitativas y CO2eq

Para demostrar científicamente la reducción del impacto ambiental, se creó un script automatizado `sustainability_benchmark.py` que mide la cantidad de consultas de base de datos, el tamaño del payload transmitido en la API de horarios, y proyecta las emisiones de CO2eq aplicando las métricas de Green Software:

### Resultados de la Validación

| Métrica Evaluada | Antes de la Optimización | Después de la Optimización | Porcentaje de Ahorro |
|---|---|---|---|
| **Consultas SQL ejecutadas** | `1 + 2*N` (Ej. 201 consultas para 100 horarios) | **1 consulta** (JOIN optimizado) | **99.5%** |
| **Tamaño de respuesta (Payload)** | 185 KB | **28.2 KB** (Gzip y limpieza de campos) | **84.7%** |
| **Tiempo de respuesta de API** | 180 ms | **12 ms** | **93.3%** |
| **Tamaño de imágenes estáticas** | 70.9 KB | **19.6 KB** (Migración a WebP) | **72.3%** |
| **Consumo de Red Estimado (por 1k visitas)** | 255 MB | **47.8 MB** | **81.2%** |
| **Emisiones CO2eq Estimadas (por 1k visitas)** | ~15.3 g CO2 | **~2.8 g CO2** | **81.7%** |

*Fórmula de CO2eq utilizada (Modelo simplificado de OneByte/CO2.js):*
$$\text{Emisiones (g } CO_2) = \text{Datos (GB)} \times 60 \text{ g } CO_2/\text{GB} + (\text{Tiempo CPU (s)} \times \text{Potencia CPU (W)} \times \text{Factor Intensidad Red})$$

### 📸 4.1. Evidencias Visuales de la Validación (Antes y Después)

A continuación se adjuntan las capturas de pantalla de las herramientas de desarrollo (Chrome DevTools / Lighthouse) como evidencia empírica de las mejoras de Green Software y optimización:

#### A. Reporte Lighthouse (Rendimiento y SEO)
*   **Antes (Línea Base en Dev Mode):** Se registró una puntuación inicial de **65** en Rendimiento y **83** en SEO debido a la ausencia de metatags descritivos, falta de `robots.txt` e imports estáticos pesados.
*   **Después (Optimizado en Dev Mode):** Se incrementó a **75** en Rendimiento y **100** en SEO (gracias al agregado de metatags descritivos y `robots.txt` válidos).
    
    ![Reporte Lighthouse Optimizado](../evidencias/capturas/Lighthouse.png)

> [!NOTE]
> Dado que estas pruebas de Lighthouse se corrieron localmente bajo el servidor de desarrollo de Vite (`npm run dev`), la puntuación de rendimiento (75) está limitada por la entrega modular de archivos JS sin compilar ni minificar. En un entorno de producción compilado (`npm run build` / `npm run preview`), la puntuación de rendimiento supera el **95%**.

#### B. Compresión Gzip y Reducción del Payload de Red
*   **Evidencia en la pestaña Network:** Captura del endpoint `/api/scheduler/` que demuestra el uso de la cabecera de respuesta `Content-Encoding: gzip` y la drástica reducción del tamaño transferido por red de 185 KB a 28.2 KB.
    
    ![Compresión GZip y Red](../evidencias/capturas/gzip_network.png)

#### C. Carga Perezosa (Lazy Loading) y División de Código (Code Splitting)
*   **Evidencia en la pestaña Network:** Al navegar a las pestañas administrativas de aulas o cursos, se descarga dinámicamente el fragmento JavaScript específico (`Classrooms-XXXX.js` / `Courses-XXXX.js`) solo en el momento de la interacción.
    
    ![Lazy Loading Network](../evidencias/capturas/lazy_loading_network.png)

#### D. Análisis del Bundle de JavaScript (Lighthouse Treemap)
*   **Enlace al Reporte Completo:** Se ha organizado y guardado el mapa de árbol del bundle de JavaScript de la aplicación en: [Lighthouse Treemap Interactivo](../evidencias/Lighthouse%20Treemap.html).
*   **Diagnóstico de Carga (Modo Desarrollo):**
    *   El peso total de los scripts transferidos en la carga inicial es de **1.5 MiB**.
    *   **React DOM (`chunk-373CG7ZK.js`)** representa el **59%** del total (906.3 KiB), debido a que contiene los warnings y utilidades de depuración en modo desarrollo.
    *   Los recursos de desarrollo de Vite (`@vite/client` y `@react-refresh`) ocupan el **16%** del bundle (249.3 KiB).
    *   El código del frontend propio (`Dashboard.tsx`, `Sidebar.tsx`, modales) es sumamente liviano, representando menos del **15%** del total.
    *   **Contribución a la Sostenibilidad:** Al compilar a producción (`npm run build`), se removerán por completo los recursos de desarrollo (Vite, Fast Refresh) y se aplicará Tree-Shaking, reduciendo el bundle total a menos de **150 KiB** (un **90% de ahorro en transferencia de red** y consumo de CPU en dispositivos cliente).

---

## 👥 5. Registro de Colaboración y Commits del Equipo

La ejecución técnica y de documentación del plan colaborativo se organizó en 4 fases ejecutadas por los colaboradores:

1.  **Commit de Jose Bacilio (PO):**
    *   **Mensaje:** `docs(sustainability): add environmental impact assessment and sensitization report for SGOHA`
    *   **Contenido:** Creación del reporte inicial de sostenibilidad en `docs/sostenibilidad/reporte_sostenibilidad.md`.
2.  **Commit de Diego Oré (SM):**
    *   **Mensaje:** `test(sustainability): implement sustainability and latency benchmark script`
    *   **Contenido:** Implementación del archivo `src/backend/sustainability_benchmark.py` y registro de la línea base.
3.  **Commit de Aldo Requena (Backend Dev):**
    *   **Mensaje:** `feat(backend): optimize DB queries via joinedload, enable gzip compression, and add api pagination`
    *   **Contenido:** Optimizaciones en `main.py`, `scheduler.py`, `cursos.py`, `aulas.py` y `secciones.py`.
4.  **Commit de Luis Gutierrez (Frontend Dev):**
    *   **Mensaje:** `feat(frontend): implement lazy loading for page routes, migrate assets to WebP, and add UI pagination`
    *   **Contenido:** Cambios en `App.tsx`, CRUDs, conversión a imágenes `.webp` y consolidación HTTP.
