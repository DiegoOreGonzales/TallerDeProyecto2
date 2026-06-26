# Registro de Incidentes y Problemas (Issue Log)

Este registro documenta los problemas e incidentes reales que se materializaron durante el ciclo de vida del proyecto **SGOHA**, detallando el impacto, responsables, prioridad y las acciones correctivas aplicadas para su resolución.

---

## 📋 Registro de Incidentes

| ID | Fecha de Ocurrencia | Descripción del Incidente | Impacto | Prioridad | Responsable | Acción Correctiva Aplicada | Estado Final |
| :---: | :---: | :--- | :--- | :---: | :--- | :--- | :---: |
| **IS-01** | 22/05/2026 | **Doble Indexación en SonarQube:** El escáner estático fallaba al reportar métricas debido a que indexaba archivos de test duplicados. | Alto (Bloqueaba el Quality Gate) | Alta | José Bacilio | Se modificó el archivo `sonar-project.properties` para forzar la exclusión en `sonar.exclusions` de las suites de testing. | **Cerrado** |
| **IS-02** | 29/05/2026 | **Falta de visualización del Panel de Restricciones:** Al iniciar el frontend en Docker, los switches no aparecían debido a una base de datos vacía. | Alto (Bloqueaba la demo funcional) | Alta | Aldo Requena | Se construyó y ejecutó un script de seeder (`seed.py`) dentro del contenedor de base de datos PostgreSQL para precargar las restricciones. | **Cerrado** |
| **IS-03** | 05/06/2026 | **Ruptura de previsualización en GitHub:** Los diagramas e imágenes documentados usando la extensión `carousel` de Gemini se veían como texto plano en GitHub. | Medio (Afectaba la presentación de evidencias) | Media | Diego Oré | Se eliminó la sintaxis propietaria `carousel` de todos los archivos markdown de documentación y se reemplazó por markdown nativo e imágenes en bloque. | **Cerrado** |
| **IS-04** | 12/06/2026 | **Advertencias de compilación por scripts en Frontend:** Al ejecutar `npm run build` en el frontend, se producían warnings en consolas Linux de Git Bash. | Bajo (Advertencias no críticas) | Baja | Luis Gutierrez | Se ajustó el archivo `Dockerfile` del frontend inyectando el flag `--ignore-scripts` para omitir verificaciones externas de scripts obsoletos en dependencias de terceros. | **Cerrado** |
| **IS-05** | 18/05/2026 | **Agotamiento de memoria en WSL2 (Docker):** Durante el escaneo masivo de código estático por SonarQube, el motor WSL2 consumía el 100% de la RAM del host, causando congelamiento de la PC. | Alto (Bloqueaba la máquina del QA Lead) | Alta | José Bacilio | Se creó un archivo de configuración `.wslconfig` en el directorio de usuario de Windows limitando la memoria de la VM a un máximo de **4GB** y asignando 2 núcleos virtuales. | **Cerrado** |
| **IS-06** | 15/04/2026 | **Errores de CORS en la API en Local:** Al intentar conectar el frontend React (`http://localhost:5173`) con la API FastAPI (`http://localhost:8000`), el navegador bloqueaba las llamadas de red por violaciones de origen cruzado (CORS). | Alto (Bloqueaba el desarrollo integrado) | Alta | Aldo Requena | Se configuró explícitamente el middleware `CORSMiddleware` en `app/main.py` especificando los orígenes permitidos locales y los métodos HTTP autorizados. | **Cerrado** |

---

## 🔍 Conclusiones

El Issue Log se mantuvo como una herramienta dinámica de resolución rápida de problemas entre el Scrum Master y los desarrolladores. Todos los incidentes críticos fueron mitigados y cerrados antes de la finalización del Sprint 6, lo que comprueba el excelente flujo ágil y la comunicación efectiva del equipo.
