# Informe de Lecciones Aprendidas (Final Lessons Learned Report)

Este informe compila las lecciones aprendidas, desafíos técnicos y retrospectivas obtenidas a lo largo de los 6 sprints de desarrollo del sistema **SGOHA**. Se documentan buenas prácticas, problemas reales ocurridos y sus respectivas soluciones para enriquecer el aprendizaje organizacional de futuros proyectos.

---

## 🚀 1. Buenas Prácticas: Qué Funcionó Bien

*   **Integración del Solucionador CP-SAT (Google OR-Tools):**
    *   *Lección:* El uso del resolvedor **CP-SAT** permitió modelar y resolver de forma óptima las 9 restricciones duras (como disponibilidad docente, capacidad de aulas y no-superposición) en un tiempo promedio de **30 segundos** para 122 secciones y 61 asignaturas. Modularizar la lógica matemática del backend separada de la capa de API REST facilitó el testeo y mantenimiento del modelo.
*   **Análisis Estático Continuo Contenerizado (SonarQube):**
    *   *Lección:* Levantar SonarQube mediante Docker Compose local facilitó que el QA Lead realizara escaneos periódicos del repositorio sin incurrir en costos de licencias en la nube, detectando fallos de mantenibilidad e inyecciones de código muerto antes del despliegue.
*   **Accesibilidad WCAG Integrada en Componentes Nativos:**
    *   *Lección:* Desarrollar los interruptores y controles interactivos en React usando elementos semánticos de HTML (`button` con `role="switch"` y `aria-checked`) en lugar de divs genéricos redujo un 50% el código CSS necesario y garantizó de forma nativa la navegación por teclado con foco visible.

---

## ⚠️ 2. Desafíos Técnicos y Retrospectiva (Qué No Funcionó y Cómo se Solucionó)

### A. Incompatibilidad de Google OR-Tools en Entornos Locales de Windows
*   **Problema:** Durante el Sprint 2, algunos integrantes del equipo que no usaban WSL2 (Windows Subsystem for Linux) experimentaron fallos críticos de instalación de `ortools` en Windows debido a que los binarios compilados de C++ no eran compatibles con la versión de Python instalada localmente (Python 3.14 / 3.11) (ver [Registro de Defectos: DF-05](registro_defectos.md)).
*   **Solución:** Se estandarizó el uso de Docker. Toda la ejecución y compilación del backend se delegó al contenedor Docker ejecutándose sobre una imagen base Linux estable (`python:3.11-slim`). Adicionalmente, se construyó un solucionador simple de backtracking en Python puro como fallback para que los desarrolladores pudieran probar la API de forma local sin requerir OR-Tools compilado.

### B. Latencia de E/S en Bind Mounts de Docker en Windows (WSL2)
*   **Problema:** Al levantar el frontend en un contenedor Docker con bind mounts para habilitar el desarrollo en tiempo real, se detectó una gran latencia (de 5 a 10 segundos) en el reflejo de los cambios (*hot-reload* de Vite) al editar archivos de React en VS Code desde Windows (ver [Registro de Impedimentos: IM-04](registro_impedimentos.md)). Esto se debía al retardo en la sincronización de archivos entre el sistema de archivos NTFS de Windows y el sistema virtual de WSL2 Ext4.
*   **Solución:** Se movió el código fuente del frontend al sistema de archivos nativo de la máquina virtual de WSL2 (`\\wsl$\ubuntu\home\...`) y se configuró Vite para usar encuestas de cambio de archivos (`usePolling: true` en `vite.config.ts`) en los sistemas de archivos compartidos.

### C. Bucles Infinitos y Consumo Excesivo de Memoria en CP-SAT por Datos Infactibles
*   **Problema:** En las primeras ejecuciones del resolvedor matemático, si la base de datos se alimentaba con restricciones duras físicamente imposibles de satisfacer (por ejemplo, asignar a un docente más horas semanales que las disponibles en toda la semana), el solucionador CP-SAT entraba en estados de búsqueda exhaustiva que consumían el 100% de la CPU y la RAM de la máquina local, bloqueando la API (ver [Registro de Defectos: DF-01](registro_defectos.md)).
*   **Solución:** Se implementó una capa de pre-validación de datos en FastAPI antes de invocar a OR-Tools. Esta capa comprueba matemáticamente si los recursos son suficientes (por ejemplo: $\text{Capacidad Aulas} \geq \text{Demanda Secciones}$) y rechaza la petición con un error HTTP 400 descriptivo si detecta infactibilidad obvia, previniendo el desbordamiento de memoria.

### D. Cuellos de Botella en las Revisiones de Código (Code Reviews Bottleneck)
*   **Problema:** Durante el Sprint 2 y Sprint 3, la entrega de historias de usuario se retrasaba frecuentemente en el estado "Ready for Review" en Jira. La regla de exigir que el Scrum Master revisara todas las ramas de Git creó un cuello de botella que demoraba la integración del código entre 1 y 2 días (ver [Registro de Impedimentos: IM-05](registro_impedimentos.md)).
*   **Solución:** Se adoptó una política de revisión cruzada por pares (peer-review). Cualquier desarrollador del equipo podía revisar y aprobar un Pull Request siempre que se cumpliera con una checklist automatizada (cobertura Pytest > 80%, eslint sin errores, y compilación Vite exitosa).

---

## 📈 3. Oportunidades de Mejora Futura (Roadmap)

1.  **Integración de base de datos NoSQL para historial de mallas:** Utilizar MongoDB para almacenar las simulaciones horarias descartadas por el usuario, evitando sobrecargar la base de datos transaccional PostgreSQL.
2.  **Soporte Multi-Turno Avanzado:** Habilitar un resolvedor CP-SAT que orqueste la asignación de horarios en turnos nocturnos y mixtos, balanceando automáticamente las horas de descanso de los docentes.
3.  **Pipeline CI/CD Automatizado:** Implementar GitHub Actions para que, al realizar un commit en la rama `develop`, se ejecuten de manera automática las pruebas unitarias de Pytest y Vitest, impidiendo fusiones de código que rompan el sistema.
