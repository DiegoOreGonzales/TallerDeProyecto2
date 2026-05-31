$email = "TU_EMAIL_DE_JIRA@continental.edu.pe"
$token = "TU_ATLASSIAN_API_TOKEN_AQUI"
# ====================================
# CAMBIAR ESTA CLAVE SI ES NECESARIO
$projectKey = "SGOHA"
# ====================================
$baseUrl = "https://continental-team-nt6xyagx.atlassian.net/rest/api/3"
$auth = [Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes("${email}:${token}"))
$headers = @{ Authorization = "Basic $auth"; "Content-Type" = "application/json" }

function Create-Issue {
    param($summary, $type, $parentKey, $sp, $desc)
    $body = @{ fields = @{
        project = @{ key = $projectKey }
        summary = $summary
        issuetype = @{ name = $type }
    }}
    if ($parentKey) { $body.fields.parent = @{ key = $parentKey } }
    if ($sp) { $body.fields.customfield_10016 = [double]$sp }
    if ($desc) {
        $body.fields.description = @{
            type = "doc"; version = 1
            content = @(@{ type = "paragraph"; content = @(@{ type = "text"; text = $desc }) })
        }
    }
    $json = $body | ConvertTo-Json -Depth 10
    $result = Invoke-RestMethod -Method Post -Uri "$baseUrl/issue" -Headers $headers -Body $json
    Write-Host "  Created: $($result.key) - $summary"
    return $result.key
}

Write-Host "=== PASO 1: Crear 5 Epicas ===" -ForegroundColor Cyan

$e1 = Create-Issue "Epica 1: Gestion de Datos Maestros (Administracion)" "Epic" $null $null "Centralizar la informacion base para la generacion de horarios: aulas, cursos, secciones."
$e2 = Create-Issue "Epica 2: Proceso de Matricula y Restricciones" "Epic" $null $null "Capturar la demanda y las limitaciones de los actores del sistema."
$e3 = Create-Issue "Epica 3: Motor de Generacion de Horarios (Core)" "Epic" $null $null "Ejecutar el algoritmo CSP CP-SAT para generar soluciones validas y optimas."
$e4 = Create-Issue "Epica 4: Visualizacion y Exportacion" "Epic" $null $null "Publicar y consumir los horarios mediante dashboards interactivos."
$e5 = Create-Issue "Epica 5: Seguridad y Perfiles" "Epic" $null $null "Autenticacion JWT por roles, testing y documentacion del proyecto."

Write-Host "`n=== PASO 2: Crear 15 Historias de Usuario ===" -ForegroundColor Cyan

# Sprint 0 (13 SP)
$h6  = Create-Issue "HU-1.1: CRUD Cursos" "Story" $e1 5 "Como Administrador, quiero gestionar cursos para mantener actualizado el plan academico. Criterio 1: Soporte CRUD completo. Criterio 2: Validacion de campos obligatorios."
$h7  = Create-Issue "HU-1.2: CRUD Aulas" "Story" $e1 3 "Como Administrador, quiero registrar aulas con capacidad y tipo (LAB/TEO) para asegurar asignacion adecuada. Criterio 1: Validar capacidad positiva. Criterio 2: Permitir edicion y eliminacion."
$h8  = Create-Issue "HU-3.1: Autenticacion JWT por Roles" "Story" $e5 5 "Como Usuario, quiero iniciar sesion para acceder a las funcionalidades de mi rol (Admin/Docente/Estudiante). Criterio 1: JWT con expiracion configurable. Criterio 2: Redireccion por rol."

# Sprint 1 (13 SP)
$h9  = Create-Issue "HU-1.3: CRUD Secciones" "Story" $e1 5 "Como Administrador, quiero agregar secciones estableciendo el curso, docente y capacidad estimada. Criterio 1: Relacion FK con Cursos. Criterio 2: Validacion de cupos."
$h10 = Create-Issue "HU-03: Disponibilidad Docente" "Story" $e2 5 "Como Docente, quiero marcar mis bloques horarios de disponibilidad. Criterio 1: Interfaz de calendario intuitiva. Criterio 2: Persistencia por semestre."
$h11 = Create-Issue "HU-04: Validacion de Creditos" "Story" $e2 3 "Como Estudiante, quiero que el sistema impida matricularme en mas de 22 creditos. Criterio 1: Alerta visual al exceder limite."

# Sprint 2 (13 SP)
$h12 = Create-Issue "HU-2.1: Motor CP-SAT Base (Restricciones Duras)" "Story" $e3 8 "Como Coordinador, quiero ejecutar el motor CSP para obtener un horario sin solapamientos. Criterio 1: Tiempo de ejecucion menor a 2s para 50 cursos. Criterio 2: 9 restricciones duras implementadas."
$h13 = Create-Issue "HU-2.2: Restricciones Blandas (Soft Constraints)" "Story" $e3 5 "Como Coordinador, quiero que el motor optimice preferencias de turno y minimice huecos. Criterio 1: Funcion objetivo multi-componente. Criterio 2: Penalizacion de fin de semana."

# Sprint 3 (18 SP)
$h14 = Create-Issue "HU-3.2: Dashboard Estudiante" "Story" $e4 5 "Como Estudiante, quiero ver un tablero con mi horario grafico y facil de leer. Criterio 1: Colores semanticos por curso. Criterio 2: Responsividad movil."
$h15 = Create-Issue "HU-07: Vista de Horario Individual" "Story" $e4 5 "Como Estudiante, quiero ver mi horario semanal con colores semanticos. Criterio 1: Paleta institucional. Criterio 2: Vista movil responsiva."
$h16 = Create-Issue "HU-06: Ajuste Manual Drag and Drop" "Story" $e3 8 "Como Coordinador, quiero mover bloques de horario manualmente con feedback de conflicto. Criterio 1: Drag and Drop. Criterio 2: Colorear en rojo las celdas en conflicto."

# Sprint 4 (8 SP)
$h17 = Create-Issue "HU-08: Exportacion a PDF" "Story" $e4 3 "Como Usuario, quiero descargar mi horario en PDF para tenerlo disponible offline."
$h18 = Create-Issue "HU-TDD: Suite de Tests Automatizados" "Story" $e5 5 "Como Equipo, queremos 40+ tests automatizados con 99 porciento de cobertura. Criterio 1: Pipeline CI/CD. Criterio 2: Cobertura del motor CP-SAT."

# Sprint 5 (13 SP)
$h19 = Create-Issue "HU-OPT: Optimizacion y Benchmark" "Story" $e3 5 "Como Equipo, queremos que el solver responda en menos de 2 segundos. Criterio 1: Pre-filtrado de variables. Criterio 2: Workers paralelos."
$h20 = Create-Issue "HU-DOC: Documentacion Final y CI/CD" "Story" $e5 8 "Como Equipo, queremos documentacion completa para la inspeccion. Criterio 1: README con arquitectura. Criterio 2: Metricas agiles, presupuesto, riesgos."

Write-Host "`n=== PASO 3: Resumen ===" -ForegroundColor Cyan
Write-Host "Epicas creadas: $e1, $e2, $e3, $e4, $e5"
Write-Host "Historias creadas: 15"
Write-Host "Story Points totales: 83 SP"
Write-Host "`nPROYECTO LISTO!"
Write-Host "URL del Backlog: https://continental-team-nt6xyagx.atlassian.net/jira/software/projects/$projectKey/boards/"
