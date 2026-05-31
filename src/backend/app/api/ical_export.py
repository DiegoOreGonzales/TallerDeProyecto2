from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..database import get_db
from ..models import Horario, Seccion, Curso, User
from ..core.scheduler import SLOT_TIME_MAP, DAY_LABELS

router = APIRouter(prefix="/export", tags=["Exportación"])


def escape_ical(text: str) -> str:
    """Escapar caracteres especiales para iCal."""
    return text.replace('\\', '\\\\').replace(';', '\\;').replace(',', '\\,').replace('\n', '\\n')


@router.get("/ical/ciclo/{ciclo}")
def export_ical(ciclo: int, db: Session = Depends(get_db)):
    """Exportar horario del ciclo como archivo .ics para Google Calendar / Outlook."""
    horarios = db.query(Horario).join(Seccion).join(Curso).filter(
        Curso.periodo == ciclo
    ).all()

    if not horarios:
        raise HTTPException(status_code=404, detail=f"No hay horarios para el ciclo {ciclo}.")

    # Fecha base: próximo lunes
    today = datetime.now()
    days_until_monday = (7 - today.weekday()) % 7
    if days_until_monday == 0:
        days_until_monday = 7
    base_monday = today + timedelta(days=days_until_monday)
    base_monday = base_monday.replace(hour=0, minute=0, second=0, microsecond=0)

    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//SGOHA//Universidad Continental//ES",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        f"X-WR-CALNAME:Horario Ciclo {ciclo} - SGOHA",
    ]

    for h in horarios:
        slot_info = SLOT_TIME_MAP.get(h.bloque, {})
        docente = db.query(User).filter(User.id == h.seccion.docente_id).first()
        docente_name = docente.username if docente else "Sin asignar"

        # Calcular fecha/hora del evento
        event_date = base_monday + timedelta(days=h.dia_semana)
        inicio_parts = slot_info.get("inicio", "07:00").split(":")
        fin_parts = slot_info.get("fin", "08:30").split(":")

        dt_start = event_date.replace(hour=int(inicio_parts[0]), minute=int(inicio_parts[1]))
        dt_end = event_date.replace(hour=int(fin_parts[0]), minute=int(fin_parts[1]))

        uid = f"sgoha-{h.seccion.curso.codigo}-d{h.dia_semana}-s{h.bloque}@continental.edu.pe"

        lines.extend([
            "BEGIN:VEVENT",
            f"UID:{uid}",
            f"DTSTART:{dt_start.strftime('%Y%m%dT%H%M%S')}",
            f"DTEND:{dt_end.strftime('%Y%m%dT%H%M%S')}",
            f"SUMMARY:{escape_ical(h.seccion.curso.nombre)}",
            f"LOCATION:{escape_ical(h.aula.nombre)}",
            f"DESCRIPTION:Sección: {h.seccion.codigo}\\nDocente: {docente_name}\\nTipo: {h.seccion.curso.tipo}",
            "RRULE:FREQ=WEEKLY;COUNT=16",
            "END:VEVENT",
        ])

    lines.append("END:VCALENDAR")
    ical_content = "\r\n".join(lines)

    return Response(
        content=ical_content,
        media_type="text/calendar",
        headers={"Content-Disposition": f"attachment; filename=horario_ciclo_{ciclo}.ics"}
    )
