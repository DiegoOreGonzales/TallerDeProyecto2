# Revisión de la Declaración de Trabajo (SOW Review) y Reporte de Competencias

Este documento detalla la auditoría de cierre sobre la **Declaración de Trabajo (Statement of Work - SOW)** del sistema **SGOHA**, verificando formalmente que cada uno de los entregables y alcances comprometidos contractualmente con el patrocinador del proyecto estén completados al 100%. Adicionalmente, incluye el mapeo de competencias individuales en "Diseño y Desarrollo de Soluciones" del Desarrollador Frontend.

---

## 📋 1. Estado de los Entregables del Contrato (SOW)

La siguiente tabla resume el estado de cumplimiento de los 6 entregables comprometidos contractualmente:

| ID | Entregable Comprometido | Descripción / Criterio de Aceptación | Estado | Evidencia y Ruta de Verificación |
| :---: | :--- | :--- | :---: | :--- |
| **ENT-01** | Core API (Backend) | API en FastAPI que expone endpoints REST, maneja lógica de negocio y se conecta con el solucionador matemático CP-SAT de Google OR-Tools para calcular horarios en < 30 segundos. | **Completado** | [test_scheduler.py](../../src/backend/tests/test_scheduler.py), [test_api.py](../../src/backend/tests/test_api.py) y [app/main.py](../../src/backend/app/main.py). |
| **ENT-02** | Dashboard UI (Frontend) | Panel de control web interactivo en React que presenta el horario en grilla y agenda, permite activar/desactivar restricciones y descargar reportes. | **Completado** | [Dashboard.tsx](../../src/frontend/src/pages/Dashboard.tsx) y componentes asociados en `src/frontend/src`. |
| **ENT-03** | Base de Datos Relacional | Base de datos PostgreSQL con tablas normalizadas para Cursos, Aulas, Secciones, Horarios y Restricciones. Inicializada mediante ORM SQLAlchemy. | **Completado** | [models.py](../../src/backend/app/models.py), [database.py](../../src/backend/app/database.py) y [seed.py](../../src/backend/seed.py). |
| **ENT-04** | Orquestación Docker | Entorno contenerizado y reproducible mediante servicios en paralelo (db, pgadmin, backend, frontend) orquestados mediante Docker Compose. | **Completado** | [docker-compose.yml](../../docker-compose.yml) y Dockerfiles correspondientes en el directorio `/docker`. |
| **ENT-05** | Informe de Calidad | Auditoría de código que evidencia una cobertura de pruebas unitarias superior al 80%, reporte de análisis estático de SonarQube sin vulnerabilidades críticas y métrica SUS. | **Completado** | [reporte_calidad_inspeccion07.md](../calidad/reporte_calidad_inspeccion07.md) y [sonar-project.properties](../../sonar-project.properties). |
| **ENT-06** | Manuales de Operación | Guías y manuales técnicos de instalación, manual de usuario administrador y comandos operativos de soporte y respaldo para TI. | **Completado** | [documentacion_capacitacion.md](documentacion_capacitacion.md). |

---

## 🛠️ 2. Control de Cambios y Adiciones al Alcance (PMBOK)

Para inyectar valor adicional al producto final sin alterar el cronograma crítico, se procesaron tres solicitudes de cambio formal bajo el protocolo de control de configuración integrado (PMBOK):

### CR-01: Adición de Accesibilidad Web (Normativa WCAG 2.1 - Nivel AA)
*   **Motivación:** Garantizar el acceso a la plataforma a usuarios con discapacidades visuales o de movilidad, alineándose con las políticas de inclusión de la Universidad Continental.
*   **Implementación:** Rediseño de componentes de control interactivo en React. Se sustituyeron contenedores genéricos (`div`) por etiquetas semánticas (`button` con `role="switch"`). Se añadieron atributos de estado dinámicos como `aria-checked` para representar en tiempo real si una restricción CP-SAT está activa y `aria-label` para dar contexto semántico a los lectores de pantalla.
*   **Impacto en Alcance/Costo:** Aumento marginal en horas de codificación frontend, mitigado mediante pruebas de usabilidad local. Cero costo en licenciamiento.

### CR-02: Mitigación OWASP y Seguridad en API (FastAPI Security Headers)
*   **Motivación:** Proteger la API de horarios de ataques comunes de denegación de servicio, inyecciones XSS y secuestro de clics (Clickjacking).
*   **Implementación:** Configuración de middleware CORS restrictivo (`CORSMiddleware` en FastAPI) que limita las solicitudes HTTP exclusivamente al origen del frontend (`localhost:5173`). Inyección de cabeceras HTTP de seguridad como `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` y directivas básicas de `Content-Security-Policy`.
*   **Impacto en Alcance/Costo:** Cambios a nivel de configuración en `app/main.py` validados con reportes de escaneo de seguridad.

### CR-03: Estudio Métrico Cuantitativo SUS (System Usability Scale)
*   **Motivación:** Medir científicamente la usabilidad y facilidad de aprendizaje de la interfaz de usuario generada.
*   **Metodología y Resultados:** Se administró el test estándar SUS a **10 usuarios** representativos (4 coordinadores académicos, 3 docentes y 3 estudiantes).
    *   La métrica SUS consta de 10 preguntas evaluadas con escala Likert de 1 a 5.
    *   Fórmula de puntuación: Para ítems impares, se resta 1 a la puntuación dada. Para ítems pares, se resta la puntuación dada a 5. El total se multiplica por 2.5.
    *   **Resultado Final:** Puntuación media de **82.5 / 100**, lo que cataloga a la interfaz en la categoría de **Excelente (Grado A)**. Los usuarios destacaron la velocidad del solucionador y la claridad del modal de detalles.

---

## 🔑 3. Declaración de Cumplimiento Contractual
Al haberse verificado que todos los entregables técnicos y administrativos (ENT-01 a ENT-06) fueron implementados, testeados y documentados en el repositorio del proyecto sin pendientes contractuales, se da por **aprobado y cerrado el Statement of Work (SOW)**.

---

## 💻 4. Evaluación de Competencias: "Diseño y Desarrollo de Soluciones"

Esta sección detalla cómo se aplicó los criterios de diseño accesible, control de cambios y adaptabilidad en la construcción del frontend:

### A) Diseño de Soluciones Accesibles e Inclusivas (WCAG)
Durante el desarrollo del Dashboard, se implementó accesibilidad a nivel de componentes interactivos en [Dashboard.tsx](../../src/frontend/src/pages/Dashboard.tsx):
*   **Controles Semánticos con Atributos ARIA:**
    ```tsx
    <button
      onClick={() => handleToggleConfig(cfg.key, !cfg.activa)}
      role="switch"
      aria-checked={cfg.activa}
      aria-label={`Restricción: ${cfg.nombre}`}
      ...
    ```
    Este bloque utiliza la semántica nativa del botón para garantizar la navegación mediante la tecla Tabulador, y los atributos `role="switch"` y `aria-checked` para que los lectores de pantalla (como NVDA o JAWS) anuncien claramente el estado de la restricción ("activo" o "inactivo").
*   **Paleta de Colores Contrastante:** El diseño de la interfaz premium combina un fondo ultra oscuro con acentos naranja (`orange-500`) y gris claro, manteniendo una relación de contraste superior a **4.5:1** exigido por WCAG para textos e iconos críticos de control.

#### Matriz de Cumplimiento de Pautas de Accesibilidad (WCAG 2.1 - Nivel AA)

| Criterio de Éxito WCAG | Nombre del Criterio | Tipo de Cumplimiento | Mecanismo de Implementación en Frontend |
| :---: | :--- | :---: | :--- |
| **1.4.3** | Contraste Mínimo | **Conforme** | Uso de colores de acento y tipografía clara sobre fondo oscuro. La relación de contraste supera 4.5:1 en todos los textos e iconos informativos. |
| **2.1.1** | Teclado | **Conforme** | Navegación completa mediante tabulador por todos los controles de restricciones y exportación. Operación con tecla `Espacio`/`Enter`. |
| **2.4.3** | Orden de Foco | **Conforme** | La secuencia de tabulación sigue el flujo visual natural (Panel superior de KPIs -> Configuración de Restricciones -> Acciones -> Grilla de Horarios). |
| **4.1.2** | Nombre, Función, Valor | **Conforme** | Uso explícito de `role="switch"`, `aria-checked` y `aria-label` en los botones dinámicos del Dashboard. |

### B) Adaptabilidad y Usabilidad Basada en Perfiles
La interfaz frontend de SGOHA no es un visor estático; se adapta dinámicamente según el rol y perfil cargado del usuario autenticado:
1.  **Rol Administrador:** Tiene visibilidad de los KPIs, acceso al panel de restricciones CP-SAT en tiempo real y el botón de generación.
2.  **Rol Estudiante:** El frontend oculta controles administrativos y aplica un algoritmo inteligente para de-duplicar asignaturas. Para estudiantes con turno `COMPLETO`, si una materia se ofrece en la mañana y tarde, la UI prioriza renderizar la sección de la mañana para evitar colisiones visuales de horarios en la misma asignatura.
3.  **Adaptabilidad de Diseño (Grid vs Agenda):** Permite cambiar con un solo clic entre la grilla clásica de horarios académicos y la vista de agenda lineal (lista con divisiones de horas pedagógicas), garantizando la comodidad de lectura tanto en computadoras de escritorio como en teléfonos móviles.

#### Técnicas de Optimización y Rendimiento de Renderizado en UI:
Debido a que el motor CP-SAT genera un volumen alto de bloques semanales (hasta 122 secciones), el frontend de React se optimizó para evitar degradación de FPS:
*   **Agrupamiento de Datos Eficiente:** En lugar de buscar secuencialmente en la matriz $O(N^2)$ por cada celda de la grilla horaria, el frontend implementa un agrupamiento previo clave-valor (`Record<number, HorarioResult[]>`) mapeado por día de la semana. Esto reduce la complejidad de renderizado de la tabla a $O(N)$ lineal.
*   **Lazy Rendering en Modales:** El modal [ScheduleDetailModal](../../src/frontend/src/components/ScheduleDetailModal.tsx) no reside de forma de forma persistente en el árbol del DOM, sino que se monta condicionalmente en memoria solo cuando el usuario selecciona una clase, reduciendo al mínimo el peso inicial del renderizador.

### C) Control de Configuración y Cambios en el Frontend
*   **Gestión de Dependencias:** El desarrollador frontend aisló y controló las versiones del ecosistema React utilizando archivos `package.json` y `package-lock.json` firmes, previniendo que actualizaciones de terceros rompan el empaquetador Vite.
*   **Gitflow y Trazabilidad:** Los cambios de accesibilidad y visualización se mantuvieron aislados en la rama de funcionalidad `feature/cierre-HU-8.3-sow-training-docs`, utilizando commits descriptivos estructurados bajo Conventional Commits (`feat(cierre): ...`), lo que asegura la trazabilidad del código y facilita la revisión entre pares antes del merge a `develop`.
