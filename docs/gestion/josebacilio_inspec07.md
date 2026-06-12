# Guía de Ejecución Individual: José Anthony Bacilio De La Cruz (PO & QA Lead)

Esta guía detalla los pasos exactos, comandos de consola y archivos modificados que corresponden a tu asignación para la **Inspección 07**. Debes utilizar este documento como evidencia de tu trabajo individual y como guía para tu exposición técnica de mañana.

---

## 📋 1. Información de la Asignación
* **Rol:** Product Owner / QA Lead
* **Responsabilidad principal:** Configuración del análisis estático de código en SonarQube, gobernanza de calidad e integración continua.
* **Nombre de la Rama Gitflow:** `feature/HU-7.1-sonarqube-qa`
* **Entregable:** [sonar-project.properties](file:///d:/jose/sistema_taller_proyectos/TallerDeProyecto2/sonar-project.properties)

---

## 🛠️ 2. Guía de Ejecución Paso a Paso (Gitflow)

### Paso 1: Creación de la rama de trabajo
Desde tu terminal local, partiendo de la última versión de `develop`, crea tu rama de funcionalidad:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/HU-7.1-sonarqube-qa
```

### Paso 2: Configuración del archivo de propiedades de SonarQube
Crea el archivo [sonar-project.properties](file:///d:/jose/sistema_taller_proyectos/TallerDeProyecto2/sonar-project.properties) en la raíz del proyecto con el siguiente contenido:
```ini
sonar.projectKey=sgoha-taller2
sonar.projectName=SGOHA
sonar.projectVersion=1.0

# Rutas de código fuente a ser analizadas
sonar.sources=src/backend,src/frontend/src
sonar.tests=src/backend/tests,src/frontend/src/pages/__tests__

# Idiomas del proyecto
sonar.language=py,ts,tsx
sonar.sourceEncoding=UTF-8

# Exclusiones de archivos irrelevantes o autogenerados
sonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/*.test.tsx,**/*.test.ts,**/tests/**,**/migrations/**,src/backend/local_scheduler.db,src/backend/test.db

# Reporte de cobertura de pruebas unitarias
sonar.python.coverage.reportPaths=src/backend/coverage.xml
sonar.javascript.lcov.reportPath=src/frontend/coverage/lcov.info
```

### Paso 3: Confirmación y Envío a GitHub
Registra el cambio en Git utilizando la estructura de Conventional Commits y sube tu rama al repositorio remoto:
```bash
git add sonar-project.properties
git commit --author="José Anthony Bacilio De La Cruz <74934503@continental.edu.pe>" -m "feat(qa): configure SonarQube project properties for static analysis"
git push origin feature/HU-7.1-sonarqube-qa
```

### Paso 4: Fusión en la rama `develop` (Pull Request)
Una vez validado el análisis estático en la rama, se realiza la integración en la rama de desarrollo:
```bash
git checkout develop
git merge feature/HU-7.1-sonarqube-qa
git push origin develop
```

---

## 🔍 3. Sustentación Técnica para la Exposición (Mañana)

Durante la exposición, deberás sustentar los siguientes puntos:
1. **¿Por qué se configuraron exclusiones en SonarQube?**
   * *Respuesta:* Para evitar "ruido" en el análisis estático. Librerías dentro de `node_modules` o archivos de build de React (`dist/`) dispararían miles de falsos positivos que no corresponden al desarrollo propio del equipo.
2. **¿Cuál es el objetivo del Quality Gate propuesto?**
   * *Respuesta:* El Quality Gate bloquea la integración si el código nuevo tiene bugs, si la duplicación de código supera el 3% (evitando redundancias y mala mantenibilidad) o si la cobertura de pruebas de código nuevo baja del 80%.
3. **¿Cómo se mide la cobertura?**
   * *Respuesta:* Mediante las directivas de cobertura de Pytest (`coverage.xml` en backend) y Vitest (`lcov.info` en frontend), las cuales SonarQube parsea para mapear qué líneas de código fueron efectivamente cubiertas por los tests unitarios.
