# Registro de Supuestos (Assumption Log)

Este registro documenta los supuestos de negocio, técnicos y operativos establecidos al inicio del proyecto **SGOHA**, detallando su impacto en las decisiones de diseño y su estado final de validación al cierre del proyecto.

---

## 📋 Registro de Supuestos y Validación

| ID | Categoría | Descripción del Supuesto Inicial | Impacto en el Proyecto | Validación al Cierre (¿Fue Verdadero?) | Sustento y Resultados |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **AS-01** | Negocio | La Universidad Continental dispone de aulas físicas suficientes y compatibles para abastecer la demanda académica de todas las secciones en un semestre. | Alto (Afecta la viabilidad matemática de la optimización) | **Falso** | El resolvedor detectaba infactibilidad al procesar lotes grandes debido a la escasez de laboratorios especializados. Se requirió implementar un switch para "ignorar compatibilidad de tipo de aula" como plan de contingencia administrativo. |
| **AS-02** | Técnico | El motor matemático Google OR-Tools (CP-SAT) se ejecuta localmente de forma eficiente dentro de un contenedor Docker estándar de 1GB de RAM. | Alto (Define los límites de hardware del entorno de producción) | **Verdadero** | Las ejecuciones de optimización del motor CP-SAT se completaron en menos de 30 segundos, manteniendo un uso de RAM del contenedor inferior a **450 MB**. |
| **AS-03** | Usabilidad | Los estudiantes que acceden al sistema únicamente necesitan visualizar su horario asignado de manera gráfica y pasiva, sin controles de edición. | Medio (Define la arquitectura de roles y accesos de la aplicación UI) | **Verdadero** | Las pruebas de usuarios con estudiantes confirmaron que habilitar vistas de solo lectura previene modificaciones no autorizadas y optimiza la legibilidad del Dashboard. |
| **AS-04** | Integración| El motor de base de datos relacional PostgreSQL local persistirá los datos y se mantendrá estable sin fugas de memoria en Docker. | Alto (Garantiza la integridad referencial de cursos, aulas y secciones) | **Verdadero** | El uso de volúmenes persistentes de Docker impidió pérdidas de datos y las pruebas de SQLAlchemy con sesiones `yield` cerradas mitigaron fugas en la API. |
| **AS-05** | Negocio / Datos | Se dispondría de toda la información histórica limpia y estructurada de los docentes, cursos y secciones de la carrera de Ingeniería de Sistemas desde el primer día. | Alto (Evita retrasos en la carga inicial de datos del sistema) | **Falso** | La información real presentaba inconsistencias y vacíos en los perfiles de docentes. Esto obligó a construir un módulo Database Seeder (`seed.py`) para simular y normalizar el catálogo académico de los 10 ciclos. |
| **AS-06** | Técnico | El resolvedor CP-SAT escalará de forma lineal y eficiente al procesar la combinación de restricciones blandas (soft constraints) sin entrar en timeouts. | Alto (Define la experiencia de usuario y rendimiento del sistema) | **Verdadero** | Al pre-filtrar variables del solucionador y aplicar pesos balanceados en las restricciones blandas, el tiempo de respuesta del solucionador se estabilizó en un promedio de **30 segundos** para la carga completa. |

---

## 💡 Impacto Organizacional

El Assumption Log demuestra que la flexibilidad del software para adaptarse a supuestos falsos (como la disponibilidad física de aulas y la consistencia de los datos académicos) es un requisito clave para la viabilidad de la solución en entornos reales cambiantes de la Universidad Continental.
