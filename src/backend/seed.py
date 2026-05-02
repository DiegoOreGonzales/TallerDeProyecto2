import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import User, Aula, Curso, Seccion, Horario
from app.auth import get_password_hash

def run_seeder():
    print("=" * 60)
    print("  SGOHA — Seeder de Datos Académicos UC (Malla Completa)")
    print("  Plan de Estudios: Ingeniería de Sistemas e Informática")
    print("=" * 60)
    
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # USUARIOS
        print("\n📌 Usuarios...")
        usuarios = [
            User(username="admin", email="admin@ucontinental.edu.pe",
                 hashed_password=get_password_hash("admin"), role="admin", turno_preferido="COMPLETO"),
            User(username="docente_demo", email="docente@ucontinental.edu.pe",
                 hashed_password=get_password_hash("docente"), role="docente", turno_preferido="COMPLETO"),
        ]
        
        # 10 Estudiantes con Ciclos y Turnos Variados
        for i in range(1, 11):
            turno = "MAÑANA" if i % 2 != 0 else "TARDE"
            if i % 3 == 0: turno = "COMPLETO"
            usuarios.append(User(
                username=f"estudiante_c{i}", 
                email=f"c{i}@ucontinental.edu.pe",
                hashed_password=get_password_hash("ucontinental"), 
                role="estudiante", 
                turno_preferido=turno, 
                ciclo=i
            ))
            
        # Docentes Adicionales (25 docentes para balancear la carga de 122 secciones)
        for i in range(1, 26):
            usuarios.append(User(
                username=f"docente_{i}", 
                email=f"doc{i}@ucontinental.edu.pe",
                hashed_password=get_password_hash("docente"), 
                role="docente", 
                turno_preferido="COMPLETO"
            ))
        
        db.add_all(usuarios)
        db.commit()
        
        # AULAS (Aumentado a 15 aulas para evitar saturación)
        print("🏫 Aulas...")
        aulas = [
            Aula(nombre="A-101", capacidad=50, tipo="Teoría"), Aula(nombre="A-102", capacidad=50, tipo="Teoría"),
            Aula(nombre="A-103", capacidad=50, tipo="Teoría"), Aula(nombre="A-201", capacidad=50, tipo="Teoría"),
            Aula(nombre="A-202", capacidad=50, tipo="Teoría"), Aula(nombre="A-203", capacidad=50, tipo="Teoría"),
            Aula(nombre="A-301", capacidad=50, tipo="Teoría"), Aula(nombre="A-302", capacidad=50, tipo="Teoría"),
            Aula(nombre="A-303", capacidad=50, tipo="Teoría"), Aula(nombre="A-304", capacidad=50, tipo="Teoría"),
            Aula(nombre="L-101", capacidad=50, tipo="Laboratorio"), Aula(nombre="L-102", capacidad=50, tipo="Laboratorio"),
            Aula(nombre="L-103", capacidad=50, tipo="Laboratorio"), Aula(nombre="L-104", capacidad=50, tipo="Laboratorio"),
            Aula(nombre="L-105", capacidad=50, tipo="Laboratorio"), Aula(nombre="L-106", capacidad=50, tipo="Laboratorio"),
            Aula(nombre="L-107", capacidad=50, tipo="Laboratorio"), Aula(nombre="L-108", capacidad=50, tipo="Laboratorio"),
            Aula(nombre="L-109", capacidad=50, tipo="Laboratorio"), Aula(nombre="L-110", capacidad=50, tipo="Laboratorio"),
            Aula(nombre="L-111", capacidad=50, tipo="Laboratorio"), Aula(nombre="L-112", capacidad=50, tipo="Laboratorio"),
            Aula(nombre="L-113", capacidad=50, tipo="Laboratorio"), Aula(nombre="L-114", capacidad=50, tipo="Laboratorio"),
            Aula(nombre="L-115", capacidad=50, tipo="Laboratorio"), Aula(nombre="L-116", capacidad=50, tipo="Laboratorio"),
            Aula(nombre="L-117", capacidad=50, tipo="Laboratorio"), Aula(nombre="L-118", capacidad=50, tipo="Laboratorio"),
            Aula(nombre="T-101", capacidad=40, tipo="Taller"),
            Aula(nombre="T-102", capacidad=40, tipo="Taller"), Aula(nombre="T-103", capacidad=40, tipo="Taller"),
        ]
        db.add_all(aulas)
        db.commit()

        # CURSOS (Malla Completa)
        print("📚 Cargando Malla Curricular Completa...")
        malla = [
            # P1
            (1, "ASUC01113", "MATEMÁTICA SUPERIOR", 5, "Teoría"),
            (1, "ASUC01083", "HABILIDADES COMUNICATIVAS", 4, "Teoría"),
            (1, "ASUC01082", "GESTIÓN DEL APRENDIZAJE", 3, "Teoría"),
            (1, "ASUC00512", "INTRODUCCIÓN A LA ING. DE SISTEMAS", 3, "Teoría"),
            (1, "ASUC01117", "QUÍMICA 1", 3, "Laboratorio"),
            (1, "ASUC01086", "LABORATORIO DE LIDERAZGO", 2, "Teoría"),
            (1, "ASUC01700", "HERRAMIENTAS VIRTUALES", 1, "Teoría"),
            # P2
            (2, "ASUC01108", "ÁLGEBRA MATRICIAL", 4, "Teoría"),
            (2, "ASUC01110", "FUNDAMENTOS DEL CÁLCULO", 4, "Teoría"),
            (2, "ASUC00562", "MATEMÁTICA DISCRETA", 4, "Teoría"),
            (2, "ASUC01075", "COMUNICACIÓN EFECTIVA", 3, "Teoría"),
            (2, "ASUC01079", "ÉTICA, CIUDADANÍA Y GLOBALIZACIÓN", 3, "Teoría"),
            (2, "ASUC01112", "GESTIÓN BASADA EN PROCESOS", 3, "Teoría"),
            # P3
            (3, "ASUC01160", "CÁLCULO DIFERENCIAL", 5, "Teoría"),
            (3, "ASUC01296", "FÍSICA 1", 4, "Teoría"),
            (3, "ASUC01312", "FUNDAMENTOS DE PROGRAMACIÓN", 4, "Laboratorio"),
            (3, "ASUC00798", "SISTEMAS DE INFORMACIÓN", 4, "Teoría"),
            (3, "ASUC01275", "ESTADÍSTICA GENERAL", 3, "Teoría"),
            (3, "ASUC01389", "LABORATORIO DE INNOVACIÓN", 1, "Teoría"),
            # P4
            (4, "ASUC01161", "CÁLCULO INTEGRAL", 5, "Teoría"),
            (4, "ASUC01297", "FÍSICA 2", 4, "Teoría"),
            (4, "ASUC01482", "PROG. ORIENTADA A OBJETOS", 4, "Laboratorio"),
            (4, "ASUC01183", "COMUNICACIÓN Y ARGUMENTACIÓN", 3, "Teoría"),
            (4, "ASUC01273", "ESTADÍSTICA APLICADA", 3, "Teoría"),
            (4, "ASUC00316", "ESTRUCTURA DE DATOS", 3, "Laboratorio"),
            # P5
            (5, "ASUC01255", "ECUACIONES DIFERENCIALES", 5, "Teoría"),
            (5, "ASUC01136", "ANÁLISIS Y REQ. DE SOFTWARE", 4, "Teoría"),
            (5, "ASUC00051", "BASE DE DATOS", 4, "Laboratorio"),
            (5, "ASUC01541", "SISTEMAS DIGITALES", 4, "Laboratorio"),
            (5, "ASUC01511", "REALIDAD NACIONAL Y REGIONAL", 3, "Teoría"),
            (5, "ASUC01388", "LAB. AVANZADO DE INNOVACIÓN", 1, "Teoría"),
            # P6
            (6, "ASUC01140", "ARQUITECTURA DEL COMPUTADOR", 4, "Teoría"),
            (6, "ASUC00957", "DISEÑO DE SOFTWARE", 4, "Teoría"),
            (6, "ASUC01386", "INVESTIGACIÓN OPERATIVA", 4, "Teoría"),
            (6, "ASUC00006", "ADMINISTRACIÓN DE BD", 3, "Laboratorio"),
            (6, "ASUC01532", "SEMINARIO DE INVESTIGACIÓN", 3, "Teoría"),
            (6, "ASUC01061", "SISTEMAS OPERATIVOS", 3, "Teoría"),
            # P7
            (7, "ASUC01141", "ARQUITECTURA EMPRESARIAL", 5, "Teoría"),
            (7, "ASUC00947", "CONSTRUCCIÓN DE SOFTWARE", 5, "Laboratorio"),
            (7, "ASUC00754", "REDES DE COMPUTADORES", 4, "Laboratorio"),
            (7, "ASUC00466", "INGENIERÍA ECONÓMICA", 3, "Teoría"),
            (7, "ASUC01365", "INNOVACIÓN SOCIAL", 2, "Teoría"),
            (7, "ASUC01341", "GESTIÓN PROFESIONAL", 1, "Teoría"),
            # P8
            (8, "ASUC00123", "CONMUTACIÓN Y ENRUTAMIENTO", 4, "Laboratorio"),
            (8, "ASUC01235", "DIRECCIÓN DE PROYECTOS", 4, "Teoría"),
            (8, "ASUC01006", "PRUEBAS Y CALIDAD DE SW", 4, "Laboratorio"),
            (8, "ASUC01534", "SIMULACIÓN", 4, "Teoría"),
            (8, "ASUC01203", "CONVERSATION CLASS", 3, "Teoría"),
            (8, "ASUC01545", "SUPERVISIÓN PRÁCTICAS", 1, "Teoría"),
            # P9
            (9, "ASUC01228", "APP MÓVILES", 4, "Laboratorio"),
            (9, "ASUC00469", "INGENIERÍA WEB", 4, "Laboratorio"),
            (9, "ASUC01580", "TALLER DE INVESTIGACIÓN 1", 4, "Teoría"),
            (9, "ASUC01584", "TALLER DE PROYECTOS 1", 4, "Laboratorio"),
            (9, "ASUC00413", "GESTIÓN DE SERVICIOS TI", 3, "Teoría"),
            (9, "ASUC00769", "SEGURIDAD DE INFORMACIÓN", 3, "Teoría"),
            # P10
            (10, "ASUC00941", "AUDITORÍA DE SISTEMAS", 4, "Teoría"),
            (10, "ASUC01581", "TALLER DE INVESTIGACIÓN 2", 4, "Teoría"),
            (10, "ASUC01585", "TALLER DE PROYECTOS 2", 4, "Laboratorio"),
            (10, "ASUC00097", "CLOUD COMPUTING", 3, "Laboratorio"),
            (10, "ASUC00490", "INTELIGENCIA DE NEGOCIOS", 3, "Teoría"),
            (10, "ASUC00210", "VIDEOJUEGOS", 3, "Teoría"),
        ]
        
        cursos_inst = []
        for p, code, name, cred, tipo in malla:
            cursos_inst.append(Curso(periodo=p, codigo=code, nombre=name, creditos=cred, tipo=tipo))
        db.add_all(cursos_inst)
        db.commit()

        # SECCIONES
        print("📋 Creando Secciones (Mañana/Tarde)...")
        all_cursos = db.query(Curso).all()
        all_docentes = db.query(User).filter(User.role == "docente").all()
        num_docs = len(all_docentes)
        
        doc_idx = 0
        for cur in all_cursos:
            # Docente diferente para mañana y tarde → evita colisión de no-superposición
            doc_m = all_docentes[doc_idx % num_docs]
            doc_t = all_docentes[(doc_idx + 1) % num_docs]
            doc_idx += 2
            
            db.add(Seccion(codigo=f"{cur.codigo}-M", curso_id=cur.id, docente_id=doc_m.id, capac_estimada=40, turno="MAÑANA"))
            db.add(Seccion(codigo=f"{cur.codigo}-T", curso_id=cur.id, docente_id=doc_t.id, capac_estimada=40, turno="TARDE"))
        
        db.commit()
        print(f"✅ Seeder Finalizado: {len(all_cursos)} cursos y {len(all_cursos)*2} secciones creadas.")


    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seeder()
