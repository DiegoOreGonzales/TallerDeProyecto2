from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from io import BytesIO
from fpdf import FPDF
from fpdf.enums import XPos, YPos
import textwrap
import os
from collections import defaultdict
from ..database import get_db
from ..models import Horario, Seccion, Curso, User, Aula
from ..core.scheduler import SLOT_TIME_MAP

router = APIRouter(prefix="/export", tags=["Exportación"])

DAY_HEADERS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
LOGO_PATH = "d:/jose/sistema_taller_proyectos/TallerDeProyecto2/logo-universidad-continental-transparente-1.png"


class HorarioPDF(FPDF):
    def header(self):
        # Colores institucionales UC (azul oscuro y acento naranja)
        self.set_fill_color(30, 41, 59)  # Slate 800 (#1E293B)
        self.rect(0, 0, 297, 20, 'F')  # Landscape A4 = 297mm width
        
        # Accent Line (Continental Orange)
        self.set_fill_color(249, 115, 22)  # Orange 500 (#F97316)
        self.rect(0, 20, 297, 1.5, 'F')

        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(255, 255, 255)
        self.cell(0, 15, 'SGOHA - Horario Académico | Universidad Continental', new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')
        self.set_text_color(0, 0, 0)
        self.ln(5)

    def footer(self):
        self.set_y(-10)
        self.set_font('Helvetica', 'I', 7.5)
        self.set_text_color(148, 163, 184)  # Slate 400 (#94A3B8)
        footer_text = (
            f"Página {self.page_no()} | "
            "SGOHA - Sistema de Generación Óptima de Horarios Académicos © 2026"
        )
        self.cell(0, 6, footer_text, new_x=XPos.RIGHT, new_y=YPos.TOP, align='C')


def build_schedule_grid(horarios_data):
    """Organizar los horarios en una grilla día x slot."""
    grid = {}
    for h in horarios_data:
        key = (h["dia"], h["slot"])
        grid[key] = h
    return grid


def generate_pdf_stream(db: Session, pages_data: list, filename: str):
    pdf = HorarioPDF(orientation='L', unit='mm', format='A4')
    pdf.set_auto_page_break(auto=False)

    logo_exists = os.path.exists(LOGO_PATH)

    for title, page_horarios in pages_data:
        pdf.add_page()

        # 1. Logo UC in top right white zone
        if logo_exists:
            try:
                pdf.image(LOGO_PATH, x=250, y=22.5, w=37, h=12)
            except Exception as e:
                print("Error loading Continental logo:", e)

        # 2. Title & Subtitle under header bar
        pdf.set_font('Helvetica', 'B', 12)
        pdf.set_text_color(30, 41, 59)
        pdf.set_xy(10, 24)
        pdf.cell(0, 6, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='L')

        pdf.set_font('Helvetica', '', 8.5)
        pdf.set_text_color(100, 116, 139)
        pdf.set_xy(10, 30)
        pdf.cell(0, 5, f'Total de bloques asignados: {len(page_horarios)}', new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='L')

        # Organize grid
        data = []
        for h in page_horarios:
            slot_info = SLOT_TIME_MAP.get(h.bloque, {})
            docente = db.query(User).filter(User.id == h.seccion.docente_id).first()
            data.append({
                "dia": h.dia_semana,
                "slot": h.bloque,
                "hora": f"{slot_info.get('inicio', '')} - {slot_info.get('fin', '')}",
                "curso": h.seccion.curso.nombre,
                "seccion": h.seccion.codigo,
                "aula": h.aula.nombre,
                "tipo_curso": h.seccion.curso.tipo,
                "docente": docente.username if docente else "Sin asignar",
            })

        grid = build_schedule_grid(data)

        col_time_w = 30
        col_day_w = 41
        row_h = 15

        # Table Header Row
        pdf.set_font('Helvetica', 'B', 8)
        pdf.set_fill_color(30, 41, 59)
        pdf.set_text_color(255, 255, 255)
        pdf.set_draw_color(15, 23, 42)

        pdf.set_xy(10, 37)
        pdf.cell(col_time_w, 8, 'Hora', border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align='C', fill=True)
        for day in DAY_HEADERS:
            pdf.cell(col_day_w, 8, day, border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align='C', fill=True)

        # Table Data Rows
        for sl in range(9):
            slot_info = SLOT_TIME_MAP.get(sl, {})
            current_y = 45 + sl * row_h

            # Time column
            pdf.set_draw_color(203, 213, 225)
            pdf.set_font('Helvetica', 'B', 7)
            pdf.set_fill_color(248, 250, 252)
            pdf.set_text_color(71, 85, 105)
            pdf.set_xy(10, current_y)
            pdf.cell(col_time_w, row_h, f"{slot_info.get('inicio', '')}-{slot_info.get('fin', '')}", border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align='C', fill=True)

            for d in range(6):
                entry = grid.get((d, sl))
                x = 10 + col_time_w + d * col_day_w
                y = current_y

                pdf.set_xy(x, y)
                if entry:
                    tipo = entry.get("tipo_curso", "Teoría")
                    if tipo == "Laboratorio":
                        pdf.set_fill_color(240, 253, 244)
                        pdf.set_draw_color(187, 247, 208)
                    elif tipo == "Taller":
                        pdf.set_fill_color(254, 243, 199)
                        pdf.set_draw_color(253, 230, 138)
                    else:
                        pdf.set_fill_color(224, 242, 254)
                        pdf.set_draw_color(186, 230, 253)

                    # Draw filled cell rect
                    pdf.rect(x, y, col_day_w, row_h, 'DF')

                    # Wrap course name
                    curso_name = entry['curso']
                    wrapped_lines = textwrap.wrap(curso_name, width=22)
                    line1 = wrapped_lines[0] if len(wrapped_lines) > 0 else ""
                    line2 = wrapped_lines[1] if len(wrapped_lines) > 1 else ""
                    if len(wrapped_lines) > 2:
                        line2 = line2[:17] + "..."

                    pdf.set_font('Helvetica', 'B', 6.5)
                    pdf.set_text_color(15, 23, 42)

                    # Line 1
                    pdf.set_xy(x + 1.5, y + 2.5)
                    pdf.cell(col_day_w - 3, 3.2, line1, align='C')

                    # Line 2
                    if line2:
                        pdf.set_xy(x + 1.5, y + 5.5)
                        pdf.cell(col_day_w - 3, 3.2, line2, align='C')

                    # Classroom and teacher details
                    pdf.set_font('Helvetica', 'I', 5.5)
                    pdf.set_text_color(100, 116, 139)
                    pdf.set_xy(x + 1.5, y + 10.0)

                    docente_text = entry['docente']
                    if len(docente_text) > 15:
                        docente_text = docente_text[:13] + ".."
                    pdf.cell(col_day_w - 3, 3, f"{entry['aula']} | {docente_text}", align='C')
                else:
                    if sl % 2 == 0:
                        pdf.set_fill_color(248, 250, 252)
                    else:
                        pdf.set_fill_color(255, 255, 255)
                    pdf.set_draw_color(241, 245, 249)
                    pdf.cell(col_day_w, row_h, '', border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align='C', fill=True)

        # 4. Legend at bottom left
        pdf.set_text_color(71, 85, 105)
        pdf.set_font('Helvetica', 'B', 7)
        pdf.set_xy(10, 188)
        pdf.cell(15, 4, "Leyenda:", align='L')

        # Teoría box
        pdf.set_fill_color(224, 242, 254)
        pdf.set_draw_color(186, 230, 253)
        pdf.rect(26, 188.5, 4, 3, 'DF')
        pdf.set_xy(31, 188)
        pdf.set_font('Helvetica', '', 7)
        pdf.cell(15, 4, "Teoría", align='L')

        # Laboratorio box
        pdf.set_fill_color(240, 253, 244)
        pdf.set_draw_color(187, 247, 208)
        pdf.rect(50, 188.5, 4, 3, 'DF')
        pdf.set_xy(55, 188)
        pdf.cell(20, 4, "Laboratorio", align='L')

        # Taller box
        pdf.set_fill_color(254, 243, 199)
        pdf.set_draw_color(253, 230, 138)
        pdf.rect(78, 188.5, 4, 3, 'DF')
        pdf.set_xy(83, 188)
        pdf.cell(15, 4, "Taller", align='L')

        # 5. QR Code at bottom right (validation link)
        qr_url = f"https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://sgoha.continental.edu.pe/verify?doc={filename}"
        try:
            pdf.image(qr_url, x=272, y=183, w=15, h=15)
        except Exception as e:
            pdf.set_draw_color(148, 163, 184)
            pdf.rect(272, 183, 15, 15)
            pdf.set_font('Helvetica', '', 5)
            pdf.set_xy(272, 189)
            pdf.cell(15, 3, "[QR Offline]", align='C')

        pdf.set_font('Helvetica', 'I', 6)
        pdf.set_text_color(148, 163, 184)
        pdf.set_xy(235, 189)
        pdf.cell(35, 3, "Horario Verificado", align='R')

    buffer = BytesIO()
    pdf.output(buffer)
    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/pdf")
def export_pdf_all(db: Session = Depends(get_db)):
    """Exportar el horario completo en formato PDF (landscape A4, una página por ciclo)."""
    horarios = db.query(Horario).all()
    if not horarios:
        raise HTTPException(status_code=404, detail="No hay horarios generados para exportar.")
    
    # Agrupar por periodo (ciclo)
    horarios_by_ciclo = defaultdict(list)
    for h in horarios:
        ciclo = h.seccion.curso.periodo if h.seccion.curso.periodo else 1
        horarios_by_ciclo[ciclo].append(h)

    pages_data = []
    for ciclo in sorted(horarios_by_ciclo.keys()):
        pages_data.append((f"Horario del Ciclo {ciclo} - Ciclo 2026-I", horarios_by_ciclo[ciclo]))

    return generate_pdf_stream(db, pages_data, "horario_sgoha.pdf")


@router.get("/pdf/ciclo/{ciclo}")
def export_pdf_by_ciclo(ciclo: int, db: Session = Depends(get_db)):
    """Exportar horario filtrado por ciclo académico."""
    horarios = db.query(Horario).join(Seccion).join(Curso).filter(
        Curso.periodo == ciclo
    ).all()

    if not horarios:
        raise HTTPException(status_code=404, detail=f"No hay horarios para el ciclo {ciclo}.")
    
    pages_data = [(f"Horario del Ciclo {ciclo} - Ciclo 2026-I", horarios)]
    return generate_pdf_stream(db, pages_data, f"horario_ciclo_{ciclo}.pdf")


@router.get("/pdf/docente/{docente_id}")
def export_pdf_docente(docente_id: int, db: Session = Depends(get_db)):
    """Exportar horario de un docente específico en formato PDF."""
    docente = db.query(User).filter(User.id == docente_id).first()
    if not docente:
        raise HTTPException(status_code=404, detail=f"No se encontró el docente con ID {docente_id}.")

    horarios = db.query(Horario).join(Seccion).filter(
        Seccion.docente_id == docente_id
    ).all()

    if not horarios:
        raise HTTPException(status_code=404, detail=f"No hay horarios asignados para el docente {docente.username}.")

    pages_data = [(f"Horario del Docente: {docente.username} - Ciclo 2026-I", horarios)]
    return generate_pdf_stream(db, pages_data, f"horario_docente_{docente_id}.pdf")


@router.get("/pdf/aula/{aula_id}")
def export_pdf_aula(aula_id: int, db: Session = Depends(get_db)):
    """Exportar horario de un aula específica en formato PDF."""
    aula = db.query(Aula).filter(Aula.id == aula_id).first()
    if not aula:
        raise HTTPException(status_code=404, detail=f"No se encontró el aula con ID {aula_id}.")

    horarios = db.query(Horario).filter(
        Horario.aula_id == aula_id
    ).all()

    if not horarios:
        raise HTTPException(status_code=404, detail=f"No hay horarios asignados para el aula {aula.nombre}.")

    pages_data = [(f"Horario del Aula: {aula.nombre} - Ciclo 2026-I", horarios)]
    return generate_pdf_stream(db, pages_data, f"horario_aula_{aula_id}.pdf")
