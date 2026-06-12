# Reporte de Calidad, Seguridad y Usabilidad — Inspección 07

> **Proyecto:** Sistema de Generación Óptima de Horarios Académicos (SGOHA)  
> **Rol de Ejecución:** Diego Isaac Oré Gonzales (Scrum Master & UX Analyst)  
> **Fecha:** 12 de Junio de 2026  
> **Universidad Continental · Taller de Proyecto 2**

---

## 👥 1. Resumen Ejecutivo y Roles de Calidad

Este informe consolida la evaluación de calidad de la versión estable del sistema SGOHA. Como **Scrum Master & UX Analyst**, este documento detalla la validación cuantitativa y cualitativa del sistema a través de la métrica estándar **SUS (System Usability Scale)**, un análisis de seguridad basado en el estándar **OWASP Top 10**, y la auditoría de conformidad de accesibilidad bajo la directiva **WCAG 2.1 AA**.

---

## 📐 2. Evaluación de Usabilidad: System Usability Scale (SUS)

### 2.1. Metodología de Medición
El instrumento **System Usability Scale (SUS)** es un estándar industrial creado por John Brooke en 1996 que consta de 10 preguntas respondidas en una escala Likert de 5 puntos (desde *Totalmente en desacuerdo* (1) hasta *Totalmente de acuerdo* (5)).

**Cálculo aritmético del puntaje SUS:**
1. Para las **preguntas impares** (declaraciones positivas: 1, 3, 5, 7, 9), el puntaje asignado es:
   $$\text{Puntaje} = \text{Valor seleccionado} - 1$$
2. Para las **preguntas pares** (declaraciones negativas: 2, 4, 6, 8, 10), el puntaje asignado es:
   $$\text{Puntaje} = 5 - \text{Valor seleccionado}$$
3. La suma de las puntuaciones de las 10 preguntas se multiplica por **2.5** para normalizar el puntaje total en un rango de **0 a 100**.
4. El puntaje final del sistema corresponde a la media aritmética de los puntajes de todos los participantes.

### 2.2. Datos del Test de Usabilidad
El test se aplicó a una muestra representativa de **8 usuarios**:
*   **2 Coordinadores Académicos** (Usuarios clave del Dashboard de Optimización).
*   **3 Docentes** (Gestión de preferencias y turnos).
*   **3 Estudiantes** (Consulta del horario semestral).

#### Matriz de Respuestas Individuales (Escala Likert 1-5):
| ID | Rol | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Suma Ajustada | Puntaje SUS |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| P1 | Coordinador | 5 | 1 | 5 | 1 | 4 | 2 | 5 | 1 | 4 | 2 | 36 | **90.0** |
| P2 | Coordinador | 4 | 2 | 4 | 1 | 5 | 1 | 4 | 2 | 5 | 2 | 34 | **85.0** |
| P3 | Docente | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 1 | 31 | **77.5** |
| P4 | Docente | 5 | 1 | 5 | 2 | 4 | 1 | 5 | 2 | 4 | 2 | 35 | **87.5** |
| P5 | Docente | 4 | 2 | 4 | 1 | 4 | 2 | 4 | 1 | 4 | 2 | 32 | **80.0** |
| P6 | Estudiante | 5 | 1 | 5 | 1 | 5 | 2 | 5 | 1 | 5 | 3 | 37 | **92.5** |
| P7 | Estudiante | 4 | 3 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 1 | 30 | **75.0** |
| P8 | Estudiante | 5 | 2 | 4 | 1 | 4 | 2 | 4 | 2 | 5 | 2 | 33 | **82.5** |
| | **Promedio** | | | | | | | | | | | **33.5** | **83.75** |

### 2.3. Interpretación de Resultados
Con una puntuación promedio de **83.75 puntos sobre 100**, el sistema SGOHA se clasifica dentro de las siguientes categorías según la literatura científica de usabilidad:
*   **Grado de Calidad:** **Clase A (Excelente)** (Puntajes $> 80.3$).
*   **Aceptabilidad:** **Altamente Aceptable** (Puntajes $> 70$).
*   **Net Promoter Score (NPS):** Promotor (altamente recomendado).

### 2.4. Propuestas de Usabilidad UI/UX Derivadas
A partir del análisis cualitativo y observaciones de los participantes durante la prueba, se identificaron dos mejoras críticas de usabilidad:
1.  **Feedback en tiempo real con micro-animaciones:** Proporcionar transiciones visuales suaves en la UI (duración $\leq 200\text{ms}$) al pulsar los switches de configuración de optimización, previniendo clics repetidos involuntarios.
2.  **Advertencias descriptivas de infactibilidad:** En lugar de retornar errores de servidor genéricos ante configuraciones imposibles (ej. sobrecarga de un docente), mostrar un modal explicativo con el diagnóstico específico del Algoritmo CP-SAT (qué docente/aula causa el cuello de botella).

---

## 🔒 3. Análisis de Seguridad: OWASP Top 10

El backend construido en **FastAPI** y el frontend en **React + TypeScript** se auditaron con respecto al estándar **OWASP Top 10 (2021)**:

| Categoría OWASP | Riesgo Identificado | Mitigación Implementada en SGOHA |
|:---|:---|:---|
| **A01:2021-Broken Access Control** | Acceso no autorizado a endpoints CRUD administrativos. | Control de acceso basado en roles (`admin` / `estudiante` / `docente`) a nivel de ruta y decoración de API en FastAPI con tokens JWT. |
| **A02:2021-Cryptographic Failures** | Exposición de contraseñas de usuarios en base de datos. | Encriptación unidireccional de contraseñas usando **bcrypt** (`pbkdf2_sha256`) antes de almacenar en la base de datos PostgreSQL. |
| **A03:2021-Injection** | Inyección SQL mediante parámetros de búsqueda en cursos/aulas. | Uso exclusivo del ORM **SQLAlchemy** con parameterized queries, evitando SQL plano y neutralizando inyecciones. |
| **A04:2021-Insecure Design** | Algoritmo CP-SAT sobrecargado por peticiones maliciosas (DDoS al solver). | Rate Limiting y validación estricta de variables de entrada con modelos Pydantic antes de instanciar el solver. |
| **A05:2021-Security Misconfiguration** | Exposición de llaves secretas y credenciales en código. | Externalización de variables de entorno mediante archivos `.env` (excluidos en `.gitignore`) y configuración segura de CORS. |

### 3.1. Matriz de Riesgos Residuales de Seguridad
La matriz evalúa la Probabilidad (P) y el Impacto (I) en una escala de 1 a 5 (Riesgo = P × I).

```
   Probabilidad (P)
      5 │ [Insignificante]
      4 │ 
      3 │ 
      2 │                    [R1: Fuga de Sesión]
      1 │ [R3: Inyección SQL]                     [R2: DDoS Solver]
        └──────────────────────────────────────────────────────────
                       1          2          3          4          5  Impacto (I)
```

*   **R1: Secuestro de token JWT en cliente (Fuga de Sesión):**
    *   *Mitigación:* Almacenamiento seguro, expiración corta de token (30 min) y uso de HTTPS obligatorio en producción.
    *   *Riesgo Residual:* **Bajo** (Probabilidad 2, Impacto 3 $\rightarrow$ Score 6).
*   **R2: Denegación de Servicio (DDoS) en el Solver CP-SAT:**
    *   *Mitigación:* Timeout del solver configurado en 30s y límite de ejecuciones concurrentes por IP.
    *   *Riesgo Residual:* **Medio-Bajo** (Probabilidad 1, Impacto 4 $\rightarrow$ Score 4).
*   **R3: Inyección SQL en grillas de búsqueda:**
    *   *Mitigación:* Uso estricto del ORM SQLAlchemy.
    *   *Riesgo Residual:* **Despreciable** (Probabilidad 1, Impacto 1 $\rightarrow$ Score 1).

---

## ♿ 4. Directivas de Accesibilidad: WCAG 2.1 AA

SGOHA se diseñó y auditó bajo las directivas del estándar **WCAG 2.1 Nivel AA**, garantizando la inclusión de usuarios con capacidades visuales o motoras limitadas.

### 4.1. Diagnóstico y Correcciones Realizadas
*   **Navegación mediante Teclado (Criterio 2.1.1 - Teclado):** Se auditó la cuadrícula horaria y los modales para asegurar que no existan trampas de teclado. El foco visual (`:focus-visible`) fue estilizado explícitamente en el CSS global con un anillo de contraste de alta visibilidad.
*   **Contraste de Colores (Criterio 1.4.3 - Contraste Mínimo):** Se validó que el contraste de la paleta institucional (azul marino y blanco) cumpla con la relación de contraste mínima de **4.5:1** para texto normal y **3:1** para texto grande.
*   **Lectores de Pantalla (Criterio 4.1.2 - Nombre, Función, Valor):** Se agregaron etiquetas semánticas de HTML5 (`<main>`, `<nav>`, `<header>`) y atributos descriptivos ARIA (`aria-label`, `aria-expanded`, `aria-live`) en elementos interactivos como los interruptores y modales de optimización.
