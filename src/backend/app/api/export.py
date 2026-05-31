from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from io import BytesIO
from fpdf import FPDF
from ..database import get_db
from ..models import Horario, Seccion, Aula, Curso, User
from ..core.scheduler import SLOT_TIME_MAP, DAY_LABELS

router = APIRouter(prefix="/export", tags=["Exportación"])

DAY_HEADERS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

class HorarioPDF(FPDF):
    def header(self):
        # Colores institucionales UC (azul oscuro)
        self.set_fill_color(0, 51, 102)
        self.rect(0, 0, 297, 20, 'F')  # Landscape A4 = 297mm width
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(255, 255, 255)
        self.cell(0, 15, 'SGOHA - Horario Académico | Universidad Continental', 0, 1, 'C')
        self.set_text_color(0, 0, 0)
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Página {self.page_no()} | Generado por SGOHA - Sistema de Generación Óptima de Horarios Académicos', 0, 0, 'C')


def build_schedule_grid(horarios_data):
    """Organizar los horarios en una grilla día x slot."""
    grid = {}
    for h in horarios_data:
        key = (h["dia"], h["slot"])
        grid[key] = h
    return grid


@router.get("/pdf")
def export_pdf_all(db: Session = Depends(get_db)):
    """Exportar el horario completo en formato PDF (landscape A4)."""
    horarios = db.query(Horario).all()
    if not horarios:
        raise HTTPException(status_code=404, detail="No hay horarios generados para exportar.")

    # Convertir a lista de dicts
    data = []
    for h in horarios:
        slot_info = SLOT_TIME_MAP.get(h.bloque, {})
        docente = db.query(User).filter(User.id == h.seccion.docente_id).first()
        data.append({
            "dia": h.dia_semana,
            "slot": h.bloque,
            "hora": f"{slot_info.get('inicio', '')} - {slot_info.get('fin', '')}",
            "curso": h.seccion.curso.nombre[:25],
            "seccion": h.seccion.codigo,
            "aula": h.aula.nombre,
            "docente": docente.username[:15] if docente else "N/A",
        })

    grid = build_schedule_grid(data)

    pdf = HorarioPDF(orientation='L', unit='mm', format='A4')
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()

    # Subtítulo
    pdf.set_font('Helvetica', '', 10)
    pdf.cell(0, 6, f'Total de bloques asignados: {len(data)}', 0, 1, 'L')
    pdf.ln(3)

    # Tabla de horarios
    col_time_w = 30
    col_day_w = 42  # (297 - 30 - margins) / 6 ≈ 42
    row_h = 14

    # Header row
    pdf.set_font('Helvetica', 'B', 8)
    pdf.set_fill_color(0, 51, 102)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(col_time_w, row_h, 'Hora', 1, 0, 'C', True)
    for day in DAY_HEADERS:
        pdf.cell(col_day_w, row_h, day, 1, 0, 'C', True)
    pdf.ln()

    # Data rows (9 slots)
    pdf.set_text_color(0, 0, 0)
    for sl in range(9):
        slot_info = SLOT_TIME_MAP.get(sl, {})
        time_str = f"{slot_info.get('inicio', '')}\n{slot_info.get('fin', '')}"

        # Alternar colores de fila
        if sl % 2 == 0:
            pdf.set_fill_color(240, 245, 250)
        else:
            pdf.set_fill_color(255, 255, 255)

        x_start = pdf.get_x()
        y_start = pdf.get_y()

        # Time column
        pdf.set_font('Helvetica', 'B', 7)
        pdf.cell(col_time_w, row_h, f"{slot_info.get('inicio', '')}-{slot_info.get('fin', '')}", 1, 0, 'C', True)

        for d in range(6):
            entry = grid.get((d, sl))
            if entry:
                pdf.set_font('Helvetica', 'B', 6)
                text = f"{entry['curso']}\n{entry['aula']} | {entry['docente']}"
                # Colored cell for assigned slot
                pdf.set_fill_color(200, 230, 255)
                x = pdf.get_x()
                y = pdf.get_y()
                pdf.rect(x, y, col_day_w, row_h, 'DF')
                pdf.set_xy(x + 1, y + 1)
                pdf.set_font('Helvetica', 'B', 5.5)
                pdf.cell(col_day_w - 2, 5, entry['curso'], 0, 2, 'C')
                pdf.set_font('Helvetica', '', 5)
                pdf.cell(col_day_w - 2, 4, f"{entry['aula']} | {entry['docente']}", 0, 0, 'C')
                pdf.set_xy(x + col_day_w, y)
            else:
                # Empty cell
                if sl % 2 == 0:
                    pdf.set_fill_color(240, 245, 250)
                else:
                    pdf.set_fill_color(255, 255, 255)
                pdf.cell(col_day_w, row_h, '', 1, 0, 'C', True)

        pdf.ln()

    # Generate PDF bytes
    buffer = BytesIO()
    pdf.output(buffer)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=horario_sgoha.pdf"}
    )


@router.get("/pdf/ciclo/{ciclo}")
def export_pdf_by_ciclo(ciclo: int, db: Session = Depends(get_db)):
    """Exportar horario filtrado por ciclo académico."""
    horarios = db.query(Horario).join(Seccion).join(Curso).filter(
        Curso.periodo == ciclo
    ).all()

    if not horarios:
        raise HTTPException(status_code=404, detail=f"No hay horarios para el ciclo {ciclo}.")

    data = []
    for h in horarios:
        slot_info = SLOT_TIME_MAP.get(h.bloque, {})
        docente = db.query(User).filter(User.id == h.seccion.docente_id).first()
        data.append({
            "dia": h.dia_semana,
            "slot": h.bloque,
            "hora": f"{slot_info.get('inicio', '')} - {slot_info.get('fin', '')}",
            "curso": h.seccion.curso.nombre[:25],
            "seccion": h.seccion.codigo,
            "aula": h.aula.nombre,
            "docente": docente.username[:15] if docente else "N/A",
        })

    grid = build_schedule_grid(data)

    pdf = HorarioPDF(orientation='L', unit='mm', format='A4')
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()

    pdf.set_font('Helvetica', 'B', 11)
    pdf.cell(0, 8, f'Horario del Ciclo {ciclo}', 0, 1, 'L')
    pdf.set_font('Helvetica', '', 9)
    pdf.cell(0, 5, f'Bloques asignados: {len(data)}', 0, 1, 'L')
    pdf.ln(3)

    col_time_w = 30
    col_day_w = 42
    row_h = 14

    pdf.set_font('Helvetica', 'B', 8)
    pdf.set_fill_color(0, 51, 102)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(col_time_w, row_h, 'Hora', 1, 0, 'C', True)
    for day in DAY_HEADERS:
        pdf.cell(col_day_w, row_h, day, 1, 0, 'C', True)
    pdf.ln()

    pdf.set_text_color(0, 0, 0)
    for sl in range(9):
        slot_info = SLOT_TIME_MAP.get(sl, {})
        if sl % 2 == 0:
            pdf.set_fill_color(240, 245, 250)
        else:
            pdf.set_fill_color(255, 255, 255)

        pdf.set_font('Helvetica', 'B', 7)
        pdf.cell(col_time_w, row_h, f"{slot_info.get('inicio', '')}-{slot_info.get('fin', '')}", 1, 0, 'C', True)

        for d in range(6):
            entry = grid.get((d, sl))
            if entry:
                pdf.set_fill_color(200, 230, 255)
                x = pdf.get_x()
                y = pdf.get_y()
                pdf.rect(x, y, col_day_w, row_h, 'DF')
                pdf.set_xy(x + 1, y + 1)
                pdf.set_font('Helvetica', 'B', 5.5)
                pdf.cell(col_day_w - 2, 5, entry['curso'], 0, 2, 'C')
                pdf.set_font('Helvetica', '', 5)
                pdf.cell(col_day_w - 2, 4, f"{entry['aula']} | {entry['docente']}", 0, 0, 'C')
                pdf.set_xy(x + col_day_w, y)
            else:
                if sl % 2 == 0:
                    pdf.set_fill_color(240, 245, 250)
                else:
                    pdf.set_fill_color(255, 255, 255)
                pdf.cell(col_day_w, row_h, '', 1, 0, 'C', True)
        pdf.ln()

    buffer = BytesIO()
    pdf.output(buffer)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=horario_ciclo_{ciclo}.pdf"}
    )
