Universidad Continental — SGOHA v1.0
**SISTEMA DE GENERACIÓN ÓPTIMA DE HORARIOS ACADÉMICOS**

**2. DECLARACIÓN DE LA VISIÓN DEL PROYECTO**

**2.1 Enunciado de Visión**

*"Para la Universidad Continental, que necesita optimizar la programación académica semestral, el Sistema de Generación Óptima de Horarios es una plataforma web inteligente que automatiza la creación de horarios libres de conflictos en menos de 10 segundos, a diferencia de los procesos rígidos e ineficientes del sistema actual (Banner) que genera horarios con cruces y discrepancias, nuestro producto provee un motor matemático basado en Programación con Restricciones que garantiza asignaciones correctas de aulas, docentes y secciones, generando valor medible en reducción de tiempo administrativo (≥80%) y eliminación de conflictos de horarios (100%)."*

**2.2 Componentes de la Visión**

|**Componente**|**Descripción**|
| :- | :- |
|PARA (Cliente)|Universidad Continental — área de Coordinación Académica, docentes y estudiantes|
|QUE (Necesidad)|Requiere automatizar la programación semestral de horarios académicos sin conflictos de recursos|
|EL (Producto)|Sistema de Generación Óptima de Horarios Académicos (SGOHA)|
|ES UN (Categoría)|Aplicación web SPA con motor de inteligencia operativa basado en CP-SAT|
|QUE (Beneficio clave)|Genera horarios factibles en <10 segundos, eliminando conflictos de aulas y docentes al 100%|
|A DIFERENCIA DE (Alternativa)|El sistema actual (Banner) que genera horarios con cruces de recursos y discrepancias de disponibilidad|
|NUESTRO PRODUCTO (Diferenciador)|Garantía matemática de factibilidad + interfaz institucional moderna + acceso por roles|

**2.3 Valor Medible del Proyecto**

|**Indicador de Valor**|**Métrica Objetivo**|
| :- | :- |
|Reducción del tiempo de procesamiento y validación|De días de revisión a < 10 segundos (reducción significativa)|
|Tasa de conflictos de horarios post-generación|0% de conflictos en aulas y docentes (garantía matemática)|
|Adopción por rol administrativo|100% de coordinadores académicos utilizan el sistema|
|Satisfacción estudiantil con consulta de horarios|Acceso 24/7 desde cualquier dispositivo (SPA responsiva)|
|Tiempo de respuesta del algoritmo|≤ 10 segundos para conjuntos de datos estándar (≤ 100 secciones)|

**2.4 Alcance de la Versión 1.0**

- Gestión CRUD de Cursos, Aulas y Secciones con interfaz administrativa.
- Autenticación por roles: Administrador y Estudiante.
- Motor CP-SAT para generación automática de horarios sin conflictos.
- Dashboard de visualización del horario para estudiantes.
- Dashboard de control con botón de generación para administradores.

**2.5 Fuera del Alcance (Versión 1.0)**

- Exportación a PDF/Excel del horario generado.
- Módulo de pre-matrícula estudiantil.
- Notificaciones push o correo electrónico.
- Ajustes manuales drag-and-drop sobre el horario generado.
- Restricciones blandas (preferencias de docentes).
