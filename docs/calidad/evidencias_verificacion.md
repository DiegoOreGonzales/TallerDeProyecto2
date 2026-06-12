# Compilación de Evidencias de Verificación — Inspección 07

> **Proyecto:** Sistema de Generación Óptima de Horarios Académicos (SGOHA)  
> **Rol de Ejecución:** Diego Isaac Oré Gonzales (Scrum Master & UX Analyst)  
> **Fecha:** 12 de Junio de 2026  
> **Universidad Continental · Taller de Proyecto 2**

---

## 🧪 1. Ejecución de Pruebas Unitarias e Integración (Backend)

La suite de pruebas automatizadas en FastAPI se ejecuta mediante **pytest** para asegurar el correcto funcionamiento del modelo matemático, restricciones duras de no-colisión, autenticación por tokens y controladores de API.

### 1.1. Log de Salida de Consola (Pytest)
A continuación se muestra el log de ejecución de las **47 pruebas unitarias** que cubren el backend:

```bash
$ pytest src/backend/tests/ -v
============================= test session starts =============================
platform win32 -- Python 3.14.5, pytest-9.0.3, pluggy-1.6.0
rootdir: C:\Users\HOME\Downloads\Taller de proyectos 2\TallerDeProyecto2
plugins: anyio-4.13.0, cov-7.1.0
collected 47 items

src\backend\tests\test_api.py ...                                        [  6%]
src\backend\tests\test_auth.py ....                                      [ 14%]
src\backend\tests\test_optimization_model.py .................           [ 51%]
src\backend\tests\test_scheduler.py .......................              [100%]

======================= 47 passed, 8 warnings in 1.38s ========================
```

La suite completa de pruebas pasa exitosamente en **1.38 segundos**, garantizando que las modificaciones de código no introduzcan regresiones en el solver CP-SAT ni en los endpoints CRUD. El reporte detallado original se encuentra en [cobertura_tests.txt](file:///c:/Users/HOME/Downloads/Taller de proyectos 2/TallerDeProyecto2/docs/evidencias/cobertura_tests.txt).

---

## 📊 2. Análisis de Cobertura de Código

El análisis de cobertura evalúa la cantidad de sentencias del código de backend que son ejercitadas por el suite de pruebas. El reporte de cobertura se genera usando `pytest-cov`:

```bash
$ pytest --cov=src/backend/app --cov-report=term-missing src/backend/tests/
Name                                 Stmts   Miss  Cover   Missing
------------------------------------------------------------------
src\backend\app\api\aulas.py            28     14    50%   13-20, 30-35
src\backend\app\api\auth.py             56     15    73%   49-56, 70, 75, 103-110
src\backend\app\api\cursos.py           34     19    44%   13-20, 25, 30-33, 38-43
src\backend\app\api\export.py          147    129    12%   18-24, 27-34, 39-43, 49-136, 146-227
src\backend\app\api\ical_export.py      36     25    31%   14, 20-74
src\backend\app\api\scheduler.py        31     19    39%   12-36, 42, 54-74
src\backend\app\api\secciones.py        24     12    50%   12, 17-21, 26-31
src\backend\app\auth.py                 17      6    65%   13, 21-25
src\backend\app\core\scheduler.py      318    201    37%   118, 135, 138, 142, 152, 165-172, 175, 182-183, 190, 194, 198-246, 278-509
src\backend\app\database.py             13      4    69%   15-19
src\backend\app\main.py                 21      2    90%   33, 38
src\backend\app\models.py               52      0   100%
src\backend\app\schemas.py              40      0   100%
------------------------------------------------------------------
TOTAL                                  817    446    45%
```

> [!NOTE]
> La cobertura general actual se sitúa en un **45%**. La lógica crítica de persistencia de datos y estructuración (`models.py` y `schemas.py`) tiene un **100%** de cobertura, mientras que los endpoints de exportación y lógica del solver en `scheduler.py` se están extendiendo para alcanzar el RNF meta en futuros sprints de refinamiento.

---

## ⚡ 3. Evidencias del Rendimiento del Solver CP-SAT (Benchmark)

Para certificar que el motor de optimización matemática satisface el requerimiento no funcional **RNF-02 (ejecución del solver $\leq 30$ segundos para un dataset completo)**, se ejecutó la herramienta de benchmarking local de SGOHA.

### 3.1. Log del Solver (Carga Académica Semestral)
```
=== REPORTE DE BENCHMARK SGOHA ===
Configuracion: 10 Docentes, 30 Aulas, 30 Cursos, 100 Secciones
Status de Resolucion: SUCCESS
Tiempo total de ejecucion: 0.0333 segundos
Cumple RNF-01 (<= 2.0s): SI
```

El solver CP-SAT de Google OR-Tools logró resolver el horario completo con 100 secciones académicas en **0.0333 segundos**, superando ampliamente las expectativas del negocio y asegurando un tiempo de respuesta óptimo en el backend. La evidencia física se puede consultar en [benchmark_solver.txt](file:///c:/Users/HOME/Downloads/Taller de proyectos 2/TallerDeProyecto2/docs/evidencias/benchmark_solver.txt).

---

## 🖥️ 4. Capturas y Evidencias Visuales del Sistema

Las interfaces han sido validadas en paridad local. Los siguientes recursos demuestran el funcionamiento y la visualización de la UI/UX:
*   **Pantalla de Login Institucional:** [captura_login.png](file:///c:/Users/HOME/Downloads/Taller de proyectos 2/TallerDeProyecto2/docs/evidencias/captura_login.png) — Muestra la validación de roles y la paleta institucional de la UC.
*   **Dashboard de Generación Horaria:** [captura_dashboard.png](file:///c:/Users/HOME/Downloads/Taller de proyectos 2/TallerDeProyecto2/docs/evidencias/captura_dashboard.png) — Cuadrícula de horario 6x9 e indicadores KPI en tiempo real.
*   **Métricas de Desempeño del Equipo (Jira):**
    *   [jira_velocity.png](file:///c:/Users/HOME/Downloads/Taller de proyectos 2/TallerDeProyecto2/docs/evidencias/jira_velocity.png) — Velocidad del equipo en Sprints previos.
    *   [jira_burnup.png](file:///c:/Users/HOME/Downloads/Taller de proyectos 2/TallerDeProyecto2/docs/evidencias/jira_burnup.png) — Progreso de tareas completadas frente al alcance total.
    *   [jira_burndown.png](file:///c:/Users/HOME/Downloads/Taller de proyectos 2/TallerDeProyecto2/docs/evidencias/jira_burndown.png) — Esfuerzo restante diario del Sprint actual.
