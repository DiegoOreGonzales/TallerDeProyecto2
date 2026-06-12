# Guía de Ejecución Individual: Aldo Alexandre Requena Lavi (Backend Developer)

Esta guía detalla los pasos exactos, comandos de consola y archivos modificados que corresponden a tu asignación para la **Inspección 07**. Debes utilizar este documento como evidencia de tu trabajo individual y como guía para tu exposición técnica de mañana.

---

## 📋 1. Información de la Asignación
* **Rol:** Desarrollador Backend
* **Responsabilidad principal:** Mitigación de vulnerabilidades de seguridad según OWASP Top 10 2025 en la API FastAPI.
* **Nombre de la Rama Gitflow:** `feature/HU-7.2-owasp-security`
* **Archivos Modificados:** [main.py](../../src/backend/app/main.py) y [.gitignore]../../.gitignore

---

## 🛠️ 2. Guía de Ejecución Paso a Paso (Gitflow)

### Paso 1: Creación de la rama de trabajo
Desde tu terminal local, partiendo de la última versión de `develop`, crea tu rama de funcionalidad:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/HU-7.2-owasp-security
```

### Paso 2: Implementación de Cabeceras de Seguridad en la API FastAPI
En tu archivo [main.py](../../src/backend/app/main.py), inyecta el middleware HTTP `add_security_headers` de la siguiente manera:
```python
from fastapi import FastAPI, Request
# ... otras importaciones ...

app = FastAPI(title="Sistema de Generación de Horarios API")

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: https://api.qrserver.com; "
        "connect-src 'self' http://localhost:8000 http://127.0.0.1:8000;"
    )
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response
```

### Paso 3: Validación Local de Cabeceras de Seguridad
Levanta la API FastAPI y ejecuta una petición HEAD utilizando `curl` para corroborar la inyección:
```bash
curl -I http://localhost:8000/api/scheduler/config
```
**Salida esperada:**
Debes verificar la presencia de `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` y `Content-Security-Policy` en los encabezados HTTP.

**Evidencias Visuales de la Validación (Ejecución):**
*   **Inicio del Servidor Uvicorn y petición interceptada:**
    ![Inicio Uvicorn](../evidencias/capturas_inspeccion07/Evidencia%201%20OWASP.png)
*   **Volcado de las Cabeceras HTTP de Seguridad (curl):**
    ![Cabeceras en la terminal](../evidencias/capturas_inspeccion07/Evidencia%202%20OWASP.png)
*   **Validación de HSTS, CSP y directivas OWASP:**
    ![Respuesta OWASP](../evidencias/capturas_inspeccion07/Evidencia%203%20OWASP.png)

### Paso 4: Confirmación y Envío a GitHub
Registra los cambios en Git utilizando la estructura de Conventional Commits y sube tu rama al repositorio remoto:
```bash
git add src/backend/app/main.py .gitignore
git commit --author="Aldo Requena <aldo.requena@continental.edu.pe>" -m "feat(security): implement secure HTTP headers middleware (OWASP Top 10) and export endpoints"
git push origin feature/HU-7.2-owasp-security
```

---

## 🔍 3. Sustentación Técnica para la Exposición (Mañana)

Durante la exposición, deberás sustentar los siguientes puntos:
1. **¿Qué mitiga `X-Frame-Options: DENY`?**
   * *Respuesta:* Mitiga ataques de **Clickjacking** (Securing Design / OWASP A04). Evita que un sitio web malicioso cargue nuestra aplicación web dentro de un `<iframe>` invisible, engañando al administrador para que realice clics no deseados (ej. borrar horarios o modificar la base de datos).
2. **¿Cuál es la función de `X-Content-Type-Options: nosniff`?**
   * *Respuesta:* Protege contra el **MIME Sniffing** (OWASP A05: Security Misconfiguration). Fuerza a los navegadores a respetar estrictamente las cabeceras `Content-Type` enviadas por la API, previniendo que archivos estáticos subidos de forma maliciosa sean interpretados como código JavaScript ejecutable.
3. **¿Cómo configuraste la CSP (Content-Security-Policy)?**
   * *Respuesta:* Se configuró una directiva CSP restrictiva que solo permite la carga de scripts, estilos y conexiones que provengan del mismo servidor (`'self'`) y de dominios autorizados de confianza (ej. la generación de QR en `https://api.qrserver.com`), mitigando ataques de **Cross-Site Scripting (XSS)**.
