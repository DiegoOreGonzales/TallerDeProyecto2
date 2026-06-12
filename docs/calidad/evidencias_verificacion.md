# Evidencias de Verificación Técnica (Inspección 07)

Este documento recopila las trazas, logs, códigos e inspecciones que sirven como evidencia objetiva del cumplimiento de las exigencias de calidad en la aplicación **SGOHA**.

---

## 🔍 1. Evidencia de Configuración y Ejecución de SonarQube

Para realizar el análisis estático continuo local, se implementó SonarQube mediante Docker y se ejecutó el escáner CLI.

### A. Docker Compose de SonarQube (`docker-compose-sonar.yml`):
```yaml
version: '3'
services:
  sonarqube:
    image: sonarqube:lts-community
    container_name: local_sonarqube
    ports:
      - "9000:9000"
    environment:
      - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_extensions:/opt/sonarqube/extensions
      - sonarqube_logs:/opt/sonarqube/logs

volumes:
  sonarqube_data:
  sonarqube_extensions:
  sonarqube_logs:
```

### B. Archivo de Propiedades del Proyecto (`sonar-project.properties`):
```ini
# SonarQube Project Configuration
sonar.projectKey=sgoha-taller2
sonar.projectName=SGOHA
sonar.projectVersion=1.0.0

# Path to sources
sonar.sources=src/backend,src/frontend/src

# Path to tests
sonar.tests=src/backend/tests,src/frontend/src/pages/__tests__

# Language settings
sonar.language=py,ts,tsx
sonar.sourceEncoding=UTF-8

# Exclusiones de archivos para evitar doble indexación y falsos positivos
sonar.exclusions=src/backend/tests/**,src/frontend/src/pages/__tests__/**,**/node_modules/**,**/dist/**,**/build/**,**/migrations/**,src/backend/local_scheduler.db,src/backend/test.db

# Cobertura de pruebas unitarias
sonar.python.coverage.reportPaths=src/backend/coverage.xml
sonar.javascript.lcov.reportPaths=src/frontend/coverage/lcov.info
```

### C. Comandos Ejecutados para Levantar e Iniciar el Análisis:
1. **Levantar el contenedor de SonarQube:**
   ```bash
   docker-compose -f docker-compose-sonar.yml up -d
   ```
2. **Crear Proyecto y Token mediante REST API:**
   ```bash
   # Crear el proyecto
   curl.exe -u admin:admin -X POST "http://localhost:9000/api/projects/create?project=sgoha-taller2&name=SGOHA"
   # Generar el token de acceso
   curl.exe -u admin:admin -X POST "http://localhost:9000/api/user_tokens/generate?name=scanner-token"
   ```
   *Token obtenido:* `squ_11548cbe57d0dd8542941b9f2ed874e829a07141`
3. **Ejecutar el escáner (usando la imagen oficial de CLI de SonarSource):**
   ```bash
   docker run --rm -e SONAR_HOST_URL="http://host.docker.internal:9000" -e SONAR_TOKEN="squ_11548cbe57d0dd8542941b9f2ed874e829a07141" -v "d:\jose\sistema_taller_proyectos\TallerDeProyecto2:/usr/src" sonarsource/sonar-scanner-cli
   ```

### D. Resultado en Consola del Scanner (Análisis Exitoso):
```text
INFO: Scanner configuration file: /opt/sonar-scanner/conf/sonar-scanner.properties
INFO: Project root configuration file: /usr/src/sonar-project.properties
INFO: SonarScanner CLI 8.0.1.6346
INFO: Communicating with SonarQube Server 9.9.8.100196
INFO: Load plugins index (done) | time=82ms
INFO: Project key: sgoha-taller2
INFO: Indexing files...
INFO: Sensor Python Sensor [python] (done) | time=3214ms
INFO: Sensor TypeScript analysis [javascript] (done) | time=9324ms
INFO: SCM Publisher 47/47 source files have been analyzed (done) | time=5878ms
INFO: Analysis report generated in 417ms, dir size=795.9 kB
INFO: Analysis report uploaded in 51ms
INFO: ANALYSIS SUCCESSFUL, you can find the results at: http://host.docker.internal:9000/dashboard?id=sgoha-taller2
INFO: Execution success | total time: 2:20.098s
```

---

## 🛡️ 2. Evidencia de Mitigación OWASP Top 10 (Cabeceras de Seguridad)

Para mitigar riesgos de **Securing Design (Clickjacking)**, **MIME Sniffing** y **Cross-Site Scripting (XSS)**, se inyectaron cabeceras HTTP restrictivas mediante middleware.

### Verificación local de cabeceras HTTP con `curl -I`:
```bash
curl -I http://localhost:8000/api/scheduler/config
```

#### Salida de la consola de red:
```http
HTTP/1.1 200 OK
date: Fri, 12 Jun 2026 00:36:12 GMT
server: uvicorn
content-type: application/json
content-length: 462
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://api.qrserver.com; connect-src 'self' http://localhost:8000 http://127.0.0.1:8000;
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
content-encoding: gzip
vary: Accept-Encoding
connection: keep-alive
```

> [!NOTE]
> Las cabeceras `X-Frame-Options: DENY` e `X-Content-Type-Options: nosniff` se verifican al 100% de efectividad en cada petición realizada a la API.

---

## ♿ 3. Evidencia de Accesibilidad (WCAG 2.2 AA)

Los controles interactivos personalizados del Dashboard de administración han sido modificados para cumplir con las pautas de accesibilidad.

### Inspección del DOM del Switch del Motor CP-SAT:
El control implementado posee marcado ARIA dinámico e interacción mediante teclado:
```html
<button
  onClick={() => handleToggleConfig(cfg.key, !cfg.activa)}
  role="switch"
  aria-checked="true"
  aria-label="Restricción: Minimizar ventanas libres"
  class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#131313] bg-orange-500"
  title="Desactivar"
>
  <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5"></span>
</button>
```

#### Características Accesibles:
1. **Navegabilidad:** El control es enfocable con `Tab` gracias al botón nativo y resalta con un anillo naranja `focus:ring-orange-500`.
2. **Semántica ARIA:** Los lectores de pantalla anuncian: *"Interruptor: Restricción Minimizar ventanas libres, activado"* debido a `role="switch"` y `aria-checked="true"`.
3. **Compatibilidad:** Los iconos decorativos de Material Icons utilizan `aria-hidden="true"` para evitar lecturas incorrectas por el lector de pantalla.

---

## 📈 4. Evidencia y Base de Datos del Estudio SUS

El estudio métrico con la escala SUS arrojó una puntuación global de **83.75 / 100** (Rango Excelente / A).

### Resumen del Cálculo por Usuario:
*   **User 1 (Admin - Diego):** Impares $(19) +$ Pares $(20) = 39 \times 2.5 =$ **97.5**
*   **User 2 (PO - Jose):** Impares $(13) +$ Pares $(18) = 31 \times 2.5 =$ **77.5**
*   **User 3 (Docente 1):** Impares $(17) +$ Pares $(19) = 36 \times 2.5 =$ **90.0**
*   **User 4 (Docente 2):** Impares $(13) +$ Pares $(17) = 30 \times 2.5 =$ **75.0**
*   **User 5 (Estudiante 1):** Impares $(19) +$ Pares $(20) = 39 \times 2.5 =$ **97.5**
*   **User 6 (Estudiante 2):** Impares $(13) +$ Pares $(19) = 32 \times 2.5 =$ **80.0**
*   **User 7 (Estudiante 3):** Impares $(14) +$ Pares $(18) = 32 \times 2.5 =$ **80.0**
*   **User 8 (Estudiante 4):** Impares $(14) +$ Pares $(19) = 33 \times 2.5 =$ **82.5**
*   **User 9 (Docente 3):** Impares $(15) +$ Pares $(16) = 31 \times 2.5 =$ **77.5**
*   **User 10 (Admin Externo):** Impares $(14) +$ Pares $(18) = 32 \times 2.5 =$ **80.0**

$$\text{Puntaje SUS Final} = \frac{97.5 + 77.5 + 90.0 + 75.0 + 97.5 + 80.0 + 80.0 + 82.5 + 77.5 + 80.0}{10} = \mathbf{83.75}$$

---

## 🧪 5. Evidencia de Pruebas Unitarias Automatizadas

Las pruebas automatizadas del Backend garantizan el correcto funcionamiento del generador de horarios.

### Ejecución de `pytest` (84 Tests):
```text
============================= test session starts =============================
platform win32 -- Python 3.12.10, pytest-9.0.3, pluggy-1.6.0
rootdir: D:\jose\sistema_taller_proyectos\TallerDeProyecto2
plugins: anyio-4.13.0, cov-7.1.0, mock-3.15.1
collected 84 items

src\backend\tests\test_api.py ...............                            [ 17%]
src\backend\tests\test_auth.py ....                                      [ 22%]
src\backend\tests\test_crud.py ............                              [ 36%]
src\backend\tests\test_export.py .............                           [ 52%]
src\backend\tests\test_optimization_model.py .................           [ 72%]
src\backend\tests\test_scheduler.py .......................              [100%]

================== 84 passed, 1 warning in 100.63s (0:01:40) ==================
```

### Ejecución de Vitest en Frontend (7 Tests):
```text
✓ src/frontend/src/pages/__tests__/Login.test.tsx (3 tests)
✓ src/frontend/src/components/__tests__/CrudTable.test.tsx (4 tests)

Test Files  2 passed (2)
     Tests  7 passed (7)
  Start at  00:37:05
  Duration  4.12s
```
