# Guía de Ejecución Individual: Aldo Alexandre Requena Lavi (Backend Developer)

Esta guía detalla las tareas, comandos de consola y archivos de cierre que corresponden a tu asignación individual para la **Inspección 08 (Fase de Control y Cierre)** y la **Evaluación de Competencias (Consolidado 2)**. Debes utilizar este documento como evidencia de tu trabajo individual y como guía para tu exposición.

---

## 📋 1. Información de la Asignación
*   **Rol:** Desarrollador Backend
*   **Responsabilidad de Cierre (08_B):** Elaborar el **Registro de Incidentes o Problemas (Issue Log)** y el **Registro de Impedimentos (Impediment Log)**.
*   **Responsabilidad de Competencias (08_A):** Mapear y documentar en las lecciones el indicador de "Medio Ambiente y Sostenibilidad" (Green Software y ecoeficiencia).
*   **Nombre de la Rama Gitflow:** `feature/cierre-HU-8.2-issue-impediment-logs`
*   **Archivos a cargo:** [registro_incidentes.md](../control_cierre/registro_incidentes.md) y [registro_impedimentos.md](../control_cierre/registro_impedimentos.md)

---

## 🛠️ 2. Guía de Ejecución Paso a Paso (Gitflow)

### Paso 1: Creación de tu rama de trabajo
Desde tu terminal local, partiendo de la última versión de `develop`, crea tu rama de cierre:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/cierre-HU-8.2-issue-impediment-logs
```

### Paso 2: Redacción y Mantenimiento de Registros
Abre e inspecciona los archivos [registro_incidentes.md](../control_cierre/registro_incidentes.md) y [registro_impedimentos.md](../control_cierre/registro_impedimentos.md). Asegura que los incidentes (doble indexación de tests en SonarQube, base de datos vacía en Docker) y los impedimentos (hardware limitado para el análisis estático, cambios de rúbrica) correspondan a las vivencias técnicas reales ocurridas y solucionadas en el equipo.

### Paso 3: Confirmación y Envío a GitHub
Registra tus archivos de cierre en Git utilizando Conventional Commits y sube tu rama de funcionalidad individual al repositorio remoto:
```bash
git add docs/control_cierre/registro_incidentes.md docs/control_cierre/registro_impedimentos.md
git commit --author="Aldo Requena <aldo.requena@continental.edu.pe>" -m "feat(cierre): document issue log and impediment register for sprint 6"
git push origin feature/cierre-HU-8.2-issue-impediment-logs
```

---

## 🔍 3. Sustentación Técnica para la Exposición (Mañana)

Durante la exposición, deberás sustentar los siguientes puntos:
1.  **¿Cuál es la diferencia entre un Incidente (Issue) y un Impedimento (Impediment) en tu gestión?**
    *   *Respuesta:* Un **Incidente** es un problema real que ya ocurrió en el software o infraestructura y requiere una acción correctiva inmediata (ej. la base de datos PostgreSQL vacía en Docker que no renderizaba restricciones). Un **Impedimento** es un obstáculo externo o interno que bloquea o frena la velocidad de entrega del equipo (ej. la escasez de RAM en equipos locales para levantar SonarQube, lo cual resolvimos centralizando la ejecución en un servidor local contenerizado del QA Lead).
2.  **¿Cómo se aborda la sostenibilidad ecológica y ecoeficiencia (Green Software) en la solución?**
    *   *Respuesta:* Se aborda a nivel de arquitectura y software verde. El motor matemático **CP-SAT de Google OR-Tools** es altamente ecoeficiente: resuelve problemas complejos de programación lineal entera en menos de 30 segundos usando algoritmos de búsqueda podada que minimizan el consumo de CPU. Esto reduce la huella de carbono y el costo de energía en comparación con motores genéricos ineficientes o procesamiento cloud continuo.
