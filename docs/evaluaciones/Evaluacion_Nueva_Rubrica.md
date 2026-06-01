# Evaluación del Proyecto SGOHA frente a la Nueva Rúbrica

## 📊 Estado Actual vs. Requerimientos "Sobresaliente"

Tras analizar exhaustivamente el repositorio y la documentación actual en `C:\Bacilio\sistema_generacion_horarios_academicos\docs`, se presenta la evaluación del proyecto frente a la nueva consigna, identificando las brechas (gaps) y las acciones necesarias para alcanzar la máxima calificación (Sobresaliente - 3 puntos).

---

### 1. Organización del Entorno
*   **Requerimiento (Rubrica):** Repositorio estructurado con ramas, README técnico, **configuración MERN operativa**; integración funcional.
*   **Estado Actual:** El repositorio está estructurado (Docker, Github), pero el stack tecnológico actual es **FastAPI + React + PostgreSQL**. No es el stack MERN (MongoDB, Express, React, Node.js) que pide explícitamente la consigna.
*   **Nivel Actual:** ⚠️ **En Desarrollo (1)** - Incumple la definición del stack requerido.
*   **Acción Requerida:** 
    *   **Opción A (Recomendada si es estricto):** Refactorizar el backend a Node.js/Express y migrar la base de datos a MongoDB para cumplir estrictamente con "MERN". El motor CP-SAT (Python) tendría que exponerse como un microservicio interno o ejecutarse mediante scripts desde Node.js.
    *   **Opción B:** Negociar/Justificar con el evaluador que el stack actual (React + Python/FastAPI) es superior para problemas matemáticos intensivos (CP-SAT) que un backend en Node.js, adaptando la documentación para defender esta decisión técnica.

### 2. Modelado del Problema
*   **Requerimiento (Rubrica):** Restricciones completas y formalizadas; criterios de optimización claros y medibles; modelo consistente.
*   **Estado Actual:** Completamente cumplido. El documento `Restricciones_Sistema.md` detalla matemáticamente el modelo, restricciones duras/blandas y el uso de CP-SAT.
*   **Nivel Actual:** ✅ **Sobresaliente (3)**.
*   **Acción Requerida:** Ninguna. Mantener la documentación actual.

### 3. Especificación Técnica (Spec-Driven Development)
*   **Requerimiento (Rubrica):** Casos completamente especificados, trazables y verificables; uso adecuado de **Spec-Driven Development** y sustento claro con **Google Antigravity**.
*   **Estado Actual:** No existen documentos explícitos con formato de Especificación (ej. Gherkin/Cucumber, Historias de Usuario BDD). Tampoco se menciona formalmente el uso de Antigravity como soporte conceptual en la documentación.
*   **Nivel Actual:** ❌ **Insatisfactorio (0)**.
*   **Acción Requerida:** 
    *   Crear un nuevo documento `Especificacion_SDD.md` definiendo los casos de prueba (Given/When/Then).
    *   Añadir una sección en la documentación detallando cómo Antigravity (IA) ha guiado el diseño de validaciones y estructuración de componentes.

### 4. Implementación con TDD
*   **Requerimiento (Rubrica):** Pruebas completas, automatizadas, con **cobertura ≥70%**; ciclo **TDD** (red-green-refactor) evidenciado.
*   **Estado Actual:** La carpeta `src/backend/tests/` está vacía. No hay pruebas unitarias ni de integración automatizadas (ni en frontend ni en backend).
*   **Nivel Actual:** ❌ **Insatisfactorio (0)**.
*   **Acción Requerida:** 
    *   Escribir tests unitarios (con `pytest` para backend y `Jest` para frontend).
    *   Generar un reporte de cobertura de código (coverage > 70%).
    *   Documentar el proceso de desarrollo Red-Green-Refactor utilizado.

### 5. Desarrollo del Algoritmo
*   **Requerimiento (Rubrica):** Algoritmo funcional optimizado; cumple todas las restricciones; resultados validados con múltiples casos.
*   **Estado Actual:** El motor CP-SAT ya está implementado, es funcional, maneja bloques y turnos, y ha sido probado visualmente en el dashboard.
*   **Nivel Actual:** ✅ **Sobresaliente (3)** (Sujeto a aportar los logs de múltiples casos que se generarán en el punto anterior de TDD).
*   **Acción Requerida:** Integrar las validaciones del algoritmo dentro de las pruebas automatizadas (TDD).

### 6. Requisitos No Funcionales
*   **Requerimiento (Rubrica):** Requisitos definidos con métricas claras (**tiempo ≤ 2s**, escalabilidad demostrada); validación.
*   **Estado Actual:** Los requerimientos no funcionales (RNF) actuales en el `SGOHA_Documentacion_Inicio_Proyecto.md` establecen un tiempo de respuesta de **≤ 10 segundos**.
*   **Nivel Actual:** ⚠️ **Suficiente (2)**.
*   **Acción Requerida:**
    *   Actualizar toda la documentación para reflejar un límite de **≤ 2 segundos**.
    *   Ejecutar pruebas de rendimiento (benchmarks) y guardar capturas/logs que demuestren que el algoritmo retorna resultados en menos de 2s.

### 7. Entregable Final
*   **Requerimiento (Rubrica):** Prototipo completamente funcional; **evidencias completas (logs, capturas, test)**; documentación clara y técnica.
*   **Estado Actual:** Prototipo funcional y buena documentación. Faltan las evidencias formales (reportes de tests y logs).
*   **Nivel Actual:** ⚠️ **Suficiente (2)**.
*   **Acción Requerida:** Consolidar una carpeta de `evidencias/` con pantallazos, reportes de coverage y logs del solver.

---

## 📝 Plan de Acción Inmediato

Para alinear el repositorio a las exigencias de esta nueva rúbrica, se propone el siguiente plan de trabajo:

1.  **Resolver la Incompatibilidad MERN (CRÍTICO):** Decidir si migramos el backend a Node.js/MongoDB o documentamos la justificación técnica de la variante PERN+FastAPI usada actualmente.
2.  **Actualizar la Documentación General:** Cambiar la métrica de RNF de 10s a 2s.
3.  **Redactar la Especificación SDD:** Crear un documento con las especificaciones Gherkin y la justificación de Antigravity.
4.  **Implementar Pruebas (TDD):** Crear la suite de pruebas y capturar cobertura >= 70%.
5.  **Recopilar Evidencias:** Guardar capturas de los tests, logs y rendimiento.
