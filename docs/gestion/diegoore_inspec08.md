# Guía de Ejecución Individual: Diego Isaac Oré Gonzales (Scrum Master & UX Analyst)

Esta guía detalla las tareas, comandos de consola y archivos de cierre que corresponden a tu asignación individual para la **Inspección 08 (Fase de Control y Cierre)** y la **Evaluación de Competencias (Consolidado 2)**. Debes utilizar este documento como evidencia de tu trabajo individual y como guía para tu exposición.

---

## 📋 1. Información de la Asignación
*   **Rol:** Scrum Master / UX Analyst
*   **Responsabilidad de Cierre (08_B):** Redactar el **Informe Final del Proyecto (Final Project Report)**, el **Informe Final de Lecciones Aprendidas (Lessons Learned)**, el **Registro de Supuestos (Assumption Log)** y la revisión del **Acta de Constitución (Project Charter)**.
*   **Responsabilidad de Competencias (08_A):** Consolidar el mapeo y defensa de las competencias genéricas del Consolidado 2 (Glocal, Comunicación, Sostenibilidad, Soluciones).
*   **Nombre de la Rama Gitflow:** `feature/cierre-HU-8.4-final-reports-charter`
*   **Archivos a cargo:** [informe_final_proyecto.md](../control_cierre/informe_final_proyecto.md), [lecciones_aprendidas.md](../control_cierre/lecciones_aprendidas.md), [registro_supuestos.md](../control_cierre/registro_supuestos.md), [revision_acta_constitucion.md](../control_cierre/revision_acta_constitucion.md)

---

## 🛠️ 2. Guía de Ejecución Paso a Paso (Gitflow)

### Paso 1: Creación de tu rama de trabajo
Desde tu terminal local, partiendo de la última versión de `develop`, crea tu rama de cierre:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/cierre-HU-8.4-final-reports-charter
```

### Paso 2: Redacción y Consolidación de Reportes
Abre e inspecciona los archivos [informe_final_proyecto.md](../control_cierre/informe_final_proyecto.md), [lecciones_aprendidas.md](../control_cierre/lecciones_aprendidas.md), [registro_supuestos.md](../control_cierre/registro_supuestos.md) y [revision_acta_constitucion.md](../control_cierre/revision_acta_constitucion.md). Asegura que el cálculo del costo del ciclo de vida (LCC), las retrospectivas y el estado de los supuestos coincidan con la ejecución ágil llevada a cabo.

### Paso 3: Confirmación y Envío a GitHub
Registra tus archivos de cierre en Git utilizando Conventional Commits y sube tu rama de funcionalidad individual al repositorio remoto:
```bash
git add docs/control_cierre/informe_final_proyecto.md docs/control_cierre/lecciones_aprendidas.md docs/control_cierre/registro_supuestos.md docs/control_cierre/revision_acta_constitucion.md
git commit --author="DiegoOreGonzales <72409984@continental.edu.pe>" -m "feat(cierre): document final reports, assumptions log and charter review"
git push origin feature/cierre-HU-8.4-final-reports-charter
```

---

## 🔍 3. Sustentación Técnica para la Exposición (Mañana)

Durante la exposición, deberás sustentar los siguientes puntos:
1.  **¿Qué es el Costo del Ciclo de Vida (LCC) del software y cómo lo calcularon?**
    *   *Respuesta:* El LCC (Life Cycle Cost) es el total de recursos económicos asociados al software desde su concepción hasta su retiro. Lo calculamos a un horizonte de **3 años** sumando: Adquisición/Desarrollo ($12,450 USD), Operación y Cloud en AWS ($120/mes $\times$ 36 = $4,320 USD) y Mantenimiento de Bugs/Smells ($500/año $\times$ 3 = $1,500 USD), resultando en un LCC de **$18,270 USD**. Esto demuestra que los costos de operación a largo plazo son mínimos debido a la ecoeficiencia y portabilidad local de Docker.
2.  **¿Cómo se validaron los supuestos iniciales del Assumption Log y qué impacto tuvieron?**
    *   *Respuesta:* Validamos 4 supuestos. El supuesto más crítico que resultó **falso** fue asumir que la universidad disponía de aulas físicas suficientes en todo momento. Al procesar lotes grandes de asignaturas, la escasez de laboratorios especializados provocaba infactibilidad matemática en el motor. Como plan de contingencia técnico, agregamos un switch de flexibilización en el frontend para permitir al administrador omitir restricciones de compatibilidad del tipo de aula de forma segura, garantizando la resiliencia del software.
