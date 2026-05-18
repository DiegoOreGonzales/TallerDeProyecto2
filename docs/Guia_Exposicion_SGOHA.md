# 🎤 Guía de Exposición: SGOHA (Calificación Objetivo: 20)

Esta guía está diseñada para una presentación de **5 minutos** de alto impacto, cubriendo todos los puntos de la rúbrica de evaluación "Sobresaliente".

---

## 🕒 Cronograma de la Exposición (5 Minutos)

| Tiempo | Parte | Responsable | Objetivo Rúbrica |
| :--- | :--- | :--- | :--- |
| **0:00 - 1:00** | Intro y Modelado | Integrante 1 | Modelado del problema y Restricciones |
| **1:00 - 2:00** | SDD y Soporte IA | Integrante 2 | Spec-Driven Development y Antigravity |
| **2:00 - 3:00** | TDD y Backend | Integrante 3 | Implementación TDD y Algoritmo CP-SAT |
| **3:00 - 5:00** | Demo y Cierre | Integrante 4 | Entregable Final y RNF (≤ 2s) |

---

## 📋 Guion Detallado por Integrante

### 👤 Integrante 1: El Estratega (Modelado y Organización)
*   **Qué decir:** "Nuestro proyecto SGOHA resuelve el problema de la generación de horarios mediante programación por restricciones. Hemos estructurado el entorno en Docker para garantizar paridad entre desarrollo y producción."
*   **Puntos Clave:**
    *   Formalización de **Restricciones Duras** (no colisiones) y **Blandas** (preferencias).
    *   **Enlace Rápido:** [Restricciones_Sistema.md](./planificacion/Restricciones_Sistema.md)
*   **Tip Rúbrica:** Resalta que el modelo es consistente y matemáticamente sólido.

### 👤 Integrante 2: El Diseñador de Especificaciones (SDD & IA)
*   **Qué decir:** "Adoptamos un enfoque **Spec-Driven Development**. Antes de codificar, definimos el comportamiento esperado usando Gherkin. Todo este proceso fue potenciado por **Google Antigravity**, que nos guio en la selección de CP-SAT y la validación de UX."
*   **Puntos Clave:**
    *   Uso de historias de usuario (Given/When/Then).
    *   Justificación del soporte de la IA Antigravity.
    *   **Enlace Rápido:** [Especificacion_SDD.md](./especificaciones/Especificacion_SDD.md)
*   **Tip Rúbrica:** Menciona explícitamente cómo Antigravity ayudó a reducir errores de diseño.

### 👤 Integrante 3: El Ingeniero de Calidad (TDD & Algoritmo)
*   **Qué decir:** "Garantizamos la calidad mediante **TDD**. Tenemos una suite de pruebas automatizadas con cobertura superior al 70%. El motor de optimización usa el algoritmo CP-SAT de Google, procesando 122 secciones en tiempo récord."
*   **Puntos Clave:**
    *   Demostración de pruebas unitarias.
    *   Eficiencia del algoritmo para manejar la complejidad académica.
    *   **Enlace Rápido:** [test_scheduler.py](../src/backend/tests/test_scheduler.py)
*   **Tip Rúbrica:** Habla del ciclo Red-Green-Refactor.

### 👤 Integrante 4: El Presentador (Demo y Cierre)
*   **Qué decir:** "Finalmente, veamos el sistema en acción. El RNF más crítico es el tiempo: generamos el horario completo en **menos de 2 segundos**."
*   **Puntos Clave:**
    *   **Demo en vivo:** Login → Dashboard → Generar Horario.
    *   Muestra el **Modal de Horas Pedagógicas** (detalle 40 min).
    *   Muestra el filtro de **Turno Completo** (deduplicación).
    *   **Evidencias:** [Carpeta de Evidencias](./evidencias)
*   **Tip Rúbrica:** Enfócate en el acabado "Premium" del frontend y la velocidad del backend.

---

## 💡 Consideraciones Críticas para el Éxito (Para los 4)

1.  **Dominio del Stack:** Si preguntan por qué no es MERN (MongoDB), la respuesta es: *"Elegimos PostgreSQL por su integridad referencial y FastAPI porque CP-SAT corre nativamente en Python, logrando el RNF de 2s que Node.js difícilmente alcanzaría en procesamiento matemático puro."*
2.  **Fluidez:** No lean diapositivas. Usen los documentos de Git como apoyo visual.
3.  **Cohesión:** Cada integrante debe dar paso al siguiente de forma natural.
4.  **Enfoque en el Problema:** Recuerden que están resolviendo la dispersión de horarios y la falta de bloques contiguos en la UC.

---

## 🎯 Lista de Verificación (Checklist) para el 20
- [ ] Docker corriendo y sistema funcional.
- [ ] Documento de Restricciones abierto.
- [ ] Documento de Especificación SDD abierto.
- [ ] Terminal lista para mostrar la ejecución de tests (`pytest`).
- [ ] Dashboard abierto con un usuario de Ciclo 10 (Turno Tarde).
- [ ] Documentación técnica en el README.md actualizada.
