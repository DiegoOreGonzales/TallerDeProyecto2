# Guía de Ejecución Individual: Luis Alberto Gutierrez Taipe (Frontend Developer)

Esta guía detalla las tareas, comandos de consola y archivos de cierre que corresponden a tu asignación individual para la **Inspección 08 (Fase de Control y Cierre)** y la **Evaluación de Competencias (Consolidado 2)**. Debes utilizar este documento como evidencia de tu trabajo individual y como guía para tu exposición.

---

## 📋 1. Información de la Asignación
*   **Rol:** Desarrollador Frontend
*   **Responsabilidad de Cierre (08_B):** Elaborar la **Documentación de Capacitación (Training & Ops Manual)** y revisar la **Declaración de Trabajo (SOW)**.
*   **Responsabilidad de Competencias (08_A):** Mapear e indicar en las lecciones el cumplimiento de "Diseño y Desarrollo de Soluciones" en el frontend (diseño accesible, control de cambios y adaptabilidad).
*   **Nombre de la Rama Gitflow:** `feature/cierre-HU-8.3-sow-training-docs`
*   **Archivos a cargo:** [documentacion_capacitacion.md](../control_cierre/documentacion_capacitacion.md) y [revision_declaracion_trabajo.md](../control_cierre/revision_declaracion_trabajo.md)

---

## 🛠️ 2. Guía de Ejecución Paso a Paso (Gitflow)

### Paso 1: Creación de tu rama de trabajo
Desde tu terminal local, partiendo de la última versión de `develop`, crea tu rama de cierre:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/cierre-HU-8.3-sow-training-docs
```

### Paso 2: Redacción y Mantenimiento de Documentos
Abre e inspecciona los archivos [documentacion_capacitacion.md](../control_cierre/documentacion_capacitacion.md) y [revision_declaracion_trabajo.md](../control_cierre/revision_declaracion_trabajo.md). Asegura que el manual de usuario, instalación y operaciones sea 100% reproducible y que los entregables descritos en la revisión del SOW (Core API, Dashboard UI, Postgres DB, Docker y Reportes de Calidad) correspondan exactamente con el alcance real del producto final.

### Paso 3: Confirmación y Envío a GitHub
Registra tus archivos de cierre en Git utilizando Conventional Commits y sube tu rama de funcionalidad individual al repositorio remoto:
```bash
git add docs/control_cierre/documentacion_capacitacion.md docs/control_cierre/revision_declaracion_trabajo.md
git commit --author="LUIS ALBERTO GUTIERREZ TAIPE <71850190@continental.edu.pe>" -m "feat(cierre): document training ops manual and SOW contract review"
git push origin feature/cierre-HU-8.3-sow-training-docs
```

---

## 🔍 3. Sustentación Técnica para la Exposición (Mañana)

Durante la exposición, deberás sustentar los siguientes puntos:
1.  **¿Qué consideraciones de soporte e instalación incluiste en la Documentación de Capacitación y por qué son importantes?**
    *   *Respuesta:* Incluí guías de instalación basadas en Docker (`docker-compose up -d --build`) y un script de semilla (`seed.py`) para precargar restricciones en la base de datos relacional. Asimismo, detallé comandos de operaciones para monitorear logs (`docker logs`) y generar copias de respaldo de PostgreSQL (`pg_dump`). Esto garantiza que el equipo de operaciones pueda heredar, mantener y restaurar la infraestructura sin depender de los desarrolladores.
2.  **¿Cómo se verifica el cumplimiento del alcance contractual (SOW) y cómo impactó el control de cambios?**
    *   *Respuesta:* El SOW se auditó verificando que los 6 entregables comprometidos (API, UI, BD, Docker, Calidad, Manuales) estén presentes, funcionando y documentados en el repositorio. El control de cambios formal (PMBOK) nos permitió inyectar exitosamente las HU de accesibilidad WCAG y seguridad de cabeceras en FastAPI, agregando valor al producto bajo un riesgo residual controlado y documentado.
