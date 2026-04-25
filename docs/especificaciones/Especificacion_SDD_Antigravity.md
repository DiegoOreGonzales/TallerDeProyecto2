# Especificación Técnica: Spec-Driven Development (SDD) y Soporte IA

## 1. Justificación Arquitectónica: PERN vs MERN

El proyecto SGOHA, si bien comparte similitudes con una aplicación web tradicional, tiene en su núcleo un requerimiento altamente intensivo de cómputo matemático: la **Generación Óptima de Horarios usando Programación con Restricciones (CP-SAT)**.

### Por qué Python (FastAPI) en lugar de Node.js (MERN)
La rúbrica inicial sugería el stack MERN (MongoDB, Express, React, Node.js). Sin embargo, se ha adoptado una variante orientada a datos y algoritmos: **React + FastAPI (Python) + PostgreSQL**. 

La decisión técnica se fundamenta en lo siguiente:
1. **Soporte de Google OR-Tools:** La librería de optimización CP-SAT tiene una integración nativa, madura y altamente optimizada para Python. Intentar ejecutar CP-SAT en Node.js requeriría wrappers ineficientes o microservicios paralelos, aumentando la complejidad y latencia.
2. **PostgreSQL vs MongoDB:** El dominio académico es estrictamente relacional (Docentes dictan Secciones de Cursos en Aulas). Una base de datos relacional (PostgreSQL) garantiza la integridad referencial (ACID) de manera nativa, previniendo datos huérfanos, a diferencia de una base NoSQL (MongoDB).
3. **Rendimiento Algorítmico:** El requerimiento no funcional **RNF-01** exige tiempos de respuesta **≤ 2 segundos**. Python procesa el modelo CP-SAT de manera óptima, delegando el cómputo pesado al backend de C++ de OR-Tools.

---

## 2. Soporte Conceptual: Google Antigravity

El diseño arquitectónico, la estructuración de la base de datos y la redacción de pruebas (TDD) del presente sistema han sido guiados con el soporte de **Google Antigravity**.

*   **Modelado de Restricciones:** Antigravity ayudó a traducir reglas de negocio ambiguas ("los profesores no pueden cruzarse") en restricciones matemáticas estrictas de OR-Tools (`AddNoOverlap`).
*   **Diseño de Pruebas TDD:** La definición de casos límite (edge cases) en el registro de estudiantes (validación por ciclos) se modeló utilizando las capacidades heurísticas de Antigravity.
*   **Refactorización:** Antigravity asistió en el proceso de optimización del código, asegurando el cumplimiento de la métrica de ≤ 2 segundos y el paso del ciclo Red-Green-Refactor.

---

## 3. Casos de Uso Formales (Gherkin / SDD)

A continuación, se especifican los casos de uso principales utilizando la notación *Given/When/Then* propia del Spec-Driven Development.

### Escenario 1: Generación de Horario Exitoso
```gherkin
Feature: Generación de Horarios
  As a Administrador Académico
  I want to generar horarios para el semestre
  So that los docentes y aulas se asignen sin conflictos

  Scenario: Algoritmo encuentra una solución factible
    Given que existen "30" cursos, "10" aulas y "8" docentes registrados
    And las aulas tienen capacidad suficiente para todas las secciones
    When el administrador presiona "Generar Horarios"
    Then el sistema debe ejecutar el motor CP-SAT
    And el sistema debe retornar el horario en menos de "2" segundos
    And ninguna aula debe tener dos secciones en el mismo bloque de tiempo
    And ningún docente debe enseñar dos secciones en el mismo bloque de tiempo
```

### Escenario 2: Registro de Estudiante con Validación de Ciclo y Tiempo
```gherkin
Feature: Registro y Filtrado de Estudiantes
  As a Estudiante
  I want to registrarme en el sistema indicando mi ciclo y turno preferido
  So that el sistema me asigne cursos acordes a mi nivel y disponibilidad

  Scenario: Registro exitoso con datos válidos
    Given que un nuevo usuario accede al formulario de registro
    When selecciona el rol "estudiante"
    And proporciona "ciclo_actual" igual a "5"
    And proporciona "disponibilidad_tiempo" igual a "TARDE"
    And envía el formulario
    Then el sistema debe crear la cuenta en la base de datos
    And el perfil del estudiante debe restringirse a asignaturas del ciclo 5 o inferiores
    
  Scenario: Registro fallido por ciclo inválido
    Given que un nuevo usuario accede al formulario de registro
    When selecciona el rol "estudiante"
    And proporciona "ciclo_actual" igual a "12"
    And envía el formulario
    Then el sistema debe rechazar el registro
    And debe retornar un error HTTP 400 indicando "Ciclo inválido. Debe ser entre 1 y 10."
```

### Escenario 3: Generación Infactible (Recursos Insuficientes)
```gherkin
Feature: Validación de Recursos
  As a Administrador Académico
  I want to recibir un aviso si no hay aulas suficientes
  So that pueda ajustar la carga académica

  Scenario: Faltan aulas para las secciones requeridas
    Given que hay "50" secciones que requieren dictarse al mismo tiempo
    But solo hay "10" aulas disponibles
    When el administrador ejecuta la generación
    Then el sistema debe detener la ejecución antes del límite de tiempo
    And retornar un código de estado indicando "Infactible"
```
