# Informe de Lecciones Aprendidas (Final Lessons Learned Report)

Este informe compila las lecciones aprendidas y retrospectivas obtenidas a lo largo de los 6 sprints de desarrollo del sistema **SGOHA**, documentando buenas prácticas y errores para enriquecer el aprendizaje organizacional de futuros proyectos.

---

## 🚀 1. Buenas Prácticas: Qué Funcionó Bien

*   **Integración del Solucionador Matemático (Google OR-Tools):**
    *   *Lección:* El uso del algoritmo **CP-SAT** permitió satisfacer al 100% las 9 restricciones duras complejas (HC) en un promedio de **30 segundos** por lote. La modularización del resolvedor facilitó añadir restricciones adicionales sin modificar la arquitectura general.
*   **Enfoque de Análisis Estático Local (Docker + SonarQube):**
    *   *Lección:* Desplegar SonarQube mediante contenedores locales de Docker permitió realizar auditorías continuas sin costos de licenciamiento en la nube, detectando fallos de mantenibilidad en etapas tempranas.
*   **Implementación de Accesibilidad WCAG Basada en Componentes Nativos:**
    *   *Lección:* El uso de elementos nativos de HTML (como `<button>` en React para switches) en lugar de divs estilizados redujo un 50% las líneas de código CSS necesarias y otorgó navegabilidad de teclado inmediata por defecto.

---

## ⚠️ 2. Errores y Qué No Funcionó (Retrospectiva)

*   **Falsos Positivos de Cobertura en SonarQube:**
    *   *Problema:* El motor de SonarQube escaneaba la carpeta de pruebas unitarias (`tests/`) y dependencias compiladas, reduciendo artificialmente el porcentaje de cobertura y alertando sobre Code Smells falsos.
    *   *Acción Correctiva:* Se definieron exclusiones estrictas en `sonar.exclusions` dentro de `sonar-project.properties`.
*   **Complejidad Inicial del Despliegue en Windows:**
    *   *Problema:* Diferencias en la sintaxis de variables de entorno y comandos entre entornos Linux (Bash) y Windows (PowerShell/CMD) rompían la inicialización de la base de datos de PostgreSQL.
    *   *Acción Correctiva:* Se estandarizó el despliegue a través de scripts multiplataforma (`.ps1` y `.sh`) y Docker Compose para aislar el entorno.
*   **Sintaxis de Documentación Propietaria en Git:**
    *   *Problema:* La inserción de bloques propietarios como ````carousel ... ```` en la documentación markdown impedía el renderizado correcto en GitHub y en la previsualización de VS Code local.
    *   *Acción Correctiva:* Se reemplazó por sintaxis markdown estándar multiplataforma (imágenes consecutivas y tablas HTML).

---

## 📈 3. Oportunidades de Mejora Futura (Roadmap)

1.  **Migrar a una Base de Datos NoSQL para Historiales:**
    *   Para optimizar la persistencia de configuraciones de horarios históricas, se sugiere implementar un almacén de documentos tipo MongoDB.
2.  **Soporte Multi-Turno en Solucionador CP-SAT:**
    *   Habilitar que el solucionador orqueste la asignación nocturna (turno noche) para alumnos que trabajan, balanceando la dispersión docente de forma automatizada.
3.  **Integración de Pipeline de CI/CD Completa:**
    *   Automatizar la ejecución de Pytest y ESLint al realizar commits en ramas de feature utilizando GitHub Actions, previniendo que código no verificado sea fusionado a `develop`.
