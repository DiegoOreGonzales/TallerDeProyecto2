Universidad Continental — SGOHA v1.0
**SISTEMA DE GENERACIÓN ÓPTIMA DE HORARIOS ACADÉMICOS**

**8. LISTA PRELIMINAR DE REQUERIMIENTOS FUNCIONALES Y NO FUNCIONALES**

**8.1 Requerimientos Funcionales**

Los requerimientos funcionales describen comportamientos específicos que el sistema DEBE realizar. Cada uno incluye criterio de verificación y trazabilidad a la historia de usuario correspondiente.

|**ID**|**Descripción del Requerimiento**|**Criterio de Verificación**|**Prioridad**|**Traza HU**|
| :- | :- | :- | :- | :- |
|RF-01|El sistema debe permitir autenticar usuarios mediante credenciales (usuario + contraseña) y asignarles un rol (Administrador o Estudiante).|Login exitoso redirige al dashboard del rol correspondiente; credenciales incorrectas muestran mensaje de error.|Alta|HU-3.1|
|RF-02|El sistema debe permitir crear, leer, actualizar y eliminar (CRUD) registros de Cursos con campos: código, nombre y créditos.|Todas las operaciones CRUD responden correctamente; validación de código único; persistencia en PostgreSQL.|Alta|HU-1.1|
|RF-03|El sistema debe permitir gestionar (CRUD) Aulas físicas con campos: identificación, capacidad máxima y tipo (Laboratorio/Teoría).|CRUD completo operativo; capacidad no puede ser negativa o cero; tipo restringido a valores válidos.|Alta|HU-1.2|
|RF-04|El sistema debe permitir gestionar (CRUD) Secciones vinculando un Curso, un Docente asignado y la capacidad estimada de alumnos.|Sección requiere curso y docente existentes; capacidad estimada > 0; integridad referencial garantizada.|Alta|HU-1.3|
|RF-05|El sistema debe proveer funcionalidad de búsqueda y filtrado en las tablas de gestión de Cursos, Aulas y Secciones.|Búsqueda por nombre/código retorna resultados en tiempo real (<500ms); filtros combinables.|Media|HU-1.4|
|RF-06|El sistema debe ejecutar el algoritmo CP-SAT al presionar el botón 'Generar Optimización' del dashboard administrativo y mostrar indicador de progreso.|Botón visible solo para admin; indicador de carga activo durante ejecución; mensaje de éxito o error al finalizar.|Alta|HU-2.3|
|RF-07|El motor de optimización debe asignar aulas a secciones garantizando que no haya dos secciones en la misma aula en el mismo bloque horario.|En 100% de los horarios generados no existe ninguna colisión de aula; verificable con query de validación.|Alta|HU-2.1|
|RF-08|El motor de optimización debe garantizar que un docente no sea asignado a dos secciones distintas en el mismo bloque horario (día + hora).|En 100% de los horarios generados no existe ningún docente con dos secciones simultáneas; verificable.|Alta|HU-2.2|
|RF-09|El motor de optimización debe asignar aulas cuya capacidad sea mayor o igual a la demanda estimada de la sección (capac\_estimada).|Ningún aula asignada tiene capacidad < capac\_estimada de la sección; verificable con consulta JOIN en BD.|Alta|HU-2.4|
|RF-10|El dashboard del Estudiante debe mostrar su horario semanal de manera visual y gráfica, sin acceso a funciones administrativas.|Horario visible solo para el estudiante autenticado; sin botones de edición ni navegación a módulos admin.|Alta|HU-3.2|
|RF-11|La sesión del usuario debe persistir durante un tiempo definido (configurable) o hasta que el usuario cierre sesión manualmente.|Token JWT con expiración configurable; botón 'Cerrar sesión' invalida el token y redirige al login.|Media|HU-3.3|
|RF-12|El sistema debe notificar al administrador si el algoritmo no encuentra solución factible (infactibilidad), con un mensaje descriptivo.|Si CP-SAT retorna INFEASIBLE, el frontend muestra mensaje indicando la causa probable (ej: capacidad insuficiente).|Alta|HU-2.3|

**8.2 Requerimientos No Funcionales**

Los requerimientos no funcionales describen atributos de calidad del sistema que determinan cómo debe operar.

|**ID**|**Categoría**|**Descripción**|**Métrica de Verificación**|**Traza RF**|
| :- | :- | :- | :- | :- |
|RNF-01|Rendimiento|El algoritmo de optimización CP-SAT debe entregar una solución factible en un máximo de 10 segundos para un conjunto de datos estándar (≤100 secciones, ≤30 aulas).|Prueba de performance con dataset de 100 secciones; tiempo medido con pytest-benchmark; debe ser ≤10s en percentil 95.|RF-06, RF-07, RF-08, RF-09|
|RNF-02|Usabilidad|La interfaz debe ser responsiva y funcionar correctamente en dispositivos de escritorio y móviles (breakpoints: 768px, 1024px, 1280px).|Tests de UI en Chrome DevTools con viewports estándar; no debe haber elementos cortados o superpuestos.|RF-10, RF-06|
|RNF-03|Seguridad|Todas las rutas del backend que manipulen datos deben requerir autenticación JWT válida. Las rutas de admin deben verificar adicionalmente el rol.|Tests de seguridad: petición sin token retorna 401; petición de estudiante a endpoint admin retorna 403.|RF-01, RF-11|
|RNF-04|Mantenibilidad|El código TypeScript del frontend debe tener cobertura de tipos al 100% (sin uso de 'any'). El código Python debe seguir PEP-8 verificado con flake8.|Pipeline CI ejecuta ESLint (0 errores tipo 'any') y flake8 (0 violaciones PEP-8) en cada PR.|Todos los RF|
|RNF-05|Escalabilidad|La arquitectura Docker debe permitir escalar el servicio backend de manera independiente sin modificar el frontend o la base de datos.|docker compose scale backend=3 debe funcionar sin errores; el load balancer distribuye peticiones correctamente.|RF-06, RF-07|
|RNF-06|Disponibilidad|El sistema debe manejar reconexiones o respuestas claras cuando la base de datos no esté disponible temporalmente, sin crasheos silenciosos.|Simulación de caída de PostgreSQL: el API retorna 503 con mensaje 'Servicio temporalmente no disponible'; el frontend lo muestra.|RF-02, RF-03, RF-04|
|RNF-07|Compatibilidad|El frontend debe funcionar correctamente en Chrome 120+, Firefox 120+ y Edge 120+ sin plugins adicionales.|Testing manual y automatizado (Playwright) en los tres navegadores; 0 errores funcionales críticos.|RF-10, RF-06|

**8.3 Trazabilidad: Épicas → Historias de Usuario → Requerimientos**

|**Épica**|**Historia de Usuario**|**Requerimientos Funcionales**|
| :- | :- | :- |
|Épica 1: Gestión de Recursos|HU-1.1 Gestión de Cursos|RF-02, RF-05|
|Épica 1: Gestión de Recursos|HU-1.2 Gestión de Aulas|RF-03, RF-05|
|Épica 1: Gestión de Recursos|HU-1.3 Gestión de Secciones|RF-04, RF-05|
|Épica 1: Gestión de Recursos|HU-1.4 Búsqueda y Filtrado|RF-05|
|Épica 2: Motor de Optimización|HU-2.1 No-superposición de Aulas|RF-07|
|Épica 2: Motor de Optimización|HU-2.2 No-superposición de Docentes|RF-08|
|Épica 2: Motor de Optimización|HU-2.3 Botón de Generación + Feedback|RF-06, RF-12|
|Épica 2: Motor de Optimización|HU-2.4 Restricción de Capacidad|RF-09|
|Épica 3: Experiencia Estudiante|HU-3.1 Login con identidad institucional|RF-01|
|Épica 3: Experiencia Estudiante|HU-3.2 Dashboard de Horario|RF-10|
|Épica 3: Experiencia Estudiante|HU-3.3 Persistencia de sesión|RF-11|
