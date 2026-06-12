from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..core.scheduler import SchedulerEngine, SLOT_TIME_MAP, DAY_LABELS
from ..models import Horario, Seccion, Aula, Curso, User, ConfigRestriccion

router = APIRouter(prefix="/scheduler", tags=["Scheduler"])


@router.get("/")
def get_schedules(db: Session = Depends(get_db)):
    # Optimizamos cargando de manera ansiosa (eager loading) las relaciones
    # Esto reduce el número de consultas a base de datos de 1+2N a 1 (Green Software optimization)
    horarios = db.query(Horario).options(
        joinedload(Horario.seccion).joinedload(Seccion.curso),
        joinedload(Horario.seccion).joinedload(Seccion.docente),
        joinedload(Horario.aula)
    ).all()
    
    result = []
    for h in horarios:
        slot_info = SLOT_TIME_MAP.get(h.bloque, {})
        # Usamos la relación ya precargada en vez de hacer una query adicional por cada iteración
        docente = h.seccion.docente
        result.append({
            "seccion_id": h.seccion_id,
            "seccion_codigo": h.seccion.codigo,
            "aula_id": h.aula_id,
            "dia": h.dia_semana,
            "dia_nombre": DAY_LABELS[h.dia_semana] if h.dia_semana < len(DAY_LABELS) else "?",
            "slot": h.bloque,
            "hora_inicio": slot_info.get("inicio", ""),
            "hora_fin": slot_info.get("fin", ""),
            "horas_pedagogicas": slot_info.get("hp", []),
            "nombre_curso": h.seccion.curso.nombre,
            "nombre_aula": h.aula.nombre,
            "tipo_curso": h.seccion.curso.tipo,
            "periodo": h.seccion.curso.periodo,
            "creditos": h.seccion.curso.creditos,
            "turno_seccion": h.seccion.turno,
            "docente_nombre": docente.username if docente else "Sin asignar",
            "codigo_curso": h.seccion.curso.codigo,
        })
    return {"data": result}


@router.get("/config")
def get_config(db: Session = Depends(get_db)):
    """Obtener lista de restricciones y su estado actual."""
    configs = db.query(ConfigRestriccion).all()
    return [{
        "key": c.key,
        "nombre": c.nombre,
        "descripcion": c.descripcion,
        "activa": c.activa,
        "es_dura": c.es_dura
    } for c in configs]


@router.post("/config")
def update_config(updates: dict, db: Session = Depends(get_db)):
    """Actualizar el estado (activa: true/false) de las restricciones."""
    for key, val in updates.items():
        config = db.query(ConfigRestriccion).filter(ConfigRestriccion.key == key).first()
        if config:
            config.activa = val
    db.commit()
    return {"message": "Configuración actualizada correctamente"}


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """KPIs dinámicos para el Dashboard."""
    return {
        "cursos": db.query(Curso).count(),
        "aulas": db.query(Aula).count(),
        "secciones": db.query(Seccion).count(),
        "docentes": db.query(User).filter(User.role == "docente").count(),
        "horarios_generados": db.query(Horario).count(),
    }



@router.post("/generate")
def generate_schedule(db: Session = Depends(get_db)):
    # Limpiar horarios previos
    db.query(Horario).delete()
    db.commit()

    engine = SchedulerEngine(db)
    result = engine.generate()

    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    # Persistir cada bloque asignado
    for h in result:
        new_horario = Horario(
            seccion_id=h["seccion_id"],
            aula_id=h["aula_id"],
            dia_semana=h["dia"],
            bloque=h["slot"],
        )
        db.add(new_horario)

    db.commit()
    return {"message": f"Horario generado: {len(result)} bloques asignados", "data": result}
