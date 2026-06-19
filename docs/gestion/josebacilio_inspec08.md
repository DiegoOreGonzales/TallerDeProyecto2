# Guía de Ejecución Individual: José Anthony Bacilio De La Cruz (PO & QA Lead)

Esta guía detalla las tareas, comandos de consola y archivos de cierre que corresponden a tu asignación individual para la **Inspección 08 (Fase de Control y Cierre)** y la **Evaluación de Competencias (Consolidado 2)**. Debes utilizar este documento como evidencia de tu trabajo individual y como guía para tu exposición.

---

## 📋 1. Información de la Asignación
*   **Rol:** Product Owner / QA Lead
*   **Responsabilidad de Cierre (08_B):** Elaborar el **Registro de Riesgos (Risk Register)** y el **Registro de Defectos (Defect Log)**.
*   **Responsabilidad de Competencias (08_A):** Mapear y documentar en las lecciones el indicador "Aprendizaje Experiencial y Colaborativo" (sprints y Scrum).
*   **Nombre de la Rama Gitflow:** `feature/cierre-HU-8.1-risk-defect-logs`
*   **Archivos a cargo:** [registro_riesgos.md](../control_cierre/registro_riesgos.md) y [registro_defectos.md](../control_cierre/registro_defectos.md)

---

## 🛠️ 2. Guía de Ejecución Paso a Paso (Gitflow)

### Paso 1: Creación de tu rama de trabajo
Desde tu terminal local, partiendo de la última versión de `develop`, crea tu rama de cierre:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/cierre-HU-8.1-risk-defect-logs
```

### Paso 2: Redacción y Mantenimiento de Registros
Abre e inspecciona los archivos [registro_riesgos.md](../control_cierre/registro_riesgos.md) y [registro_defectos.md](../control_cierre/registro_defectos.md). Asegura que los riesgos documentados (conflicto infactible, cabeceras de seguridad, fugas de base de datos) y los defectos mapeados coincidan exactamente con el historial de incidentes reales del equipo y las métricas de SonarQube obtenidas.

### Paso 3: Confirmación y Envío a GitHub
Registra tus archivos de cierre en Git utilizando Conventional Commits y sube tu rama de funcionalidad individual al repositorio remoto:
```bash
git add docs/control_cierre/registro_riesgos.md docs/control_cierre/registro_defectos.md
git commit --author="José Anthony Bacilio De La Cruz <74934503@continental.edu.pe>" -m "feat(cierre): document risk register and software defect log for sprint 6"
git push origin feature/cierre-HU-8.1-risk-defect-logs
```

---

## 🔍 3. Sustentación Técnica para la Exposición (Mañana)

Durante la exposición, deberás sustentar los siguientes puntos:
1.  **¿Cómo se priorizaron los riesgos en el Risk Register?**
    *   *Respuesta:* Se utilizó una matriz de severidad estándar, multiplicando Probabilidad (1 a 5) por Impacto (1 a 5). Los riesgos con severidad ≥ 15 son críticos. En nuestro proyecto, el riesgo tecnológico más severo fue la infactibilidad matemática del motor de optimización (Severidad 10), mitigado añadiendo un switch de flexibilización de restricciones duras.
2.  **¿Qué defectos de software críticos reportaron en el Defect Log y cómo se validaron?**
    *   *Respuesta:* Registramos 4 defectos. Los más críticos fueron la fuga de conexiones en SQLAlchemy y el error de infeccibilidad de CP-SAT con docentes sobrecargados. Se corrigieron implementando sesiones contextuales `yield` en FastAPI y un validador de carga en la capa de lógica, y se validaron mediante el paso exitoso de los **84 tests unitarios de Pytest** y el Quality Gate limpio de SonarQube.
