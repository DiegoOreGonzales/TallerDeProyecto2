import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import User, Aula, Curso, Seccion, Horario
from app.auth import get_password_hash

def run_seeder():
    print("=" * 60)
    print("  SGOHA — Seeder de Datos Académicos UC")
    print("  Plan de Estudios: Ingeniería de Sistemas e Informática")
    print("=" * 60)
    
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # ══════════════════════════════════════════════════════════
        # USUARIOS (Admin + 8 Docentes + 5 Estudiantes)
        # ══════════════════════════════════════════════════════════
        print("\n📌 Usuarios...")
        usuarios = [
            # Administrador
            User(username="admin", email="admin@ucontinental.edu.pe",
                 hashed_password=get_password_hash("admin"), role="admin", turno_preferido="COMPLETO"),
            # Docentes con preferencias de turno reales
            User(username="juan_perez", email="jperez@ucontinental.edu.pe",
                 hashed_password=get_password_hash("docente"), role="docente", turno_preferido="MAÑANA"),
            User(username="maria_gomez", email="mgomez@ucontinental.edu.pe",
                 hashed_password=get_password_hash("docente"), role="docente", turno_preferido="COMPLETO"),
            User(username="carlos_ruiz", email="cruiz@ucontinental.edu.pe",
                 hashed_password=get_password_hash("docente"), role="docente", turno_preferido="TARDE"),
            User(username="ana_flores", email="aflores@ucontinental.edu.pe",
                 hashed_password=get_password_hash("docente"), role="docente", turno_preferido="MAÑANA"),
            User(username="roberto_silva", email="rsilva@ucontinental.edu.pe",
                 hashed_password=get_password_hash("docente"), role="docente", turno_preferido="COMPLETO"),
            User(username="lucia_vargas", email="lvargas@ucontinental.edu.pe",
                 hashed_password=get_password_hash("docente"), role="docente", turno_preferido="TARDE"),
            User(username="pedro_ramos", email="pramos@ucontinental.edu.pe",
                 hashed_password=get_password_hash("docente"), role="docente", turno_preferido="MAÑANA"),
            User(username="elena_torres", email="etorres@ucontinental.edu.pe",
                 hashed_password=get_password_hash("docente"), role="docente", turno_preferido="COMPLETO"),
            # Estudiantes
            User(username="estudiante", email="estudiante@ucontinental.edu.pe",
                 hashed_password=get_password_hash("ucontinental"), role="estudiante", turno_preferido="COMPLETO"),
            User(username="bacilio_jose", email="jbacilio@ucontinental.edu.pe",
                 hashed_password=get_password_hash("ucontinental"), role="estudiante", turno_preferido="COMPLETO"),
        ]
        db.add_all(usuarios)
        db.commit()
        
        # Recuperar docentes
        d = {}
        for u in db.query(User).filter(User.role == "docente").all():
            d[u.username] = u

        # ══════════════════════════════════════════════════════════
        # AULAS (Teoría + Laboratorio + Taller)
        # ══════════════════════════════════════════════════════════
        print("🏫 Aulas...")
        aulas = [
            Aula(nombre="A-101", capacidad=45, tipo="Teoría"),
            Aula(nombre="A-102", capacidad=50, tipo="Teoría"),
            Aula(nombre="A-103", capacidad=40, tipo="Teoría"),
            Aula(nombre="A-201", capacidad=60, tipo="Teoría"),
            Aula(nombre="A-202", capacidad=35, tipo="Teoría"),
            Aula(nombre="B-101", capacidad=45, tipo="Teoría"),
            Aula(nombre="B-102", capacidad=50, tipo="Teoría"),
            Aula(nombre="L-101", capacidad=30, tipo="Laboratorio"),
            Aula(nombre="L-102", capacidad=25, tipo="Laboratorio"),
            Aula(nombre="L-103", capacidad=30, tipo="Laboratorio"),
            Aula(nombre="T-101", capacidad=35, tipo="Taller"),
        ]
        db.add_all(aulas)
        db.commit()

        # ══════════════════════════════════════════════════════════
        # CURSOS — Plan de Estudios Real UC (Ing. Sistemas)
        # 3 cursos representativos por período × 10 períodos = 30 cursos
        # ══════════════════════════════════════════════════════════
        print("📚 Cursos (Plan UC - Ing. Sistemas)...")
        cursos_data = [
            # Período 1
            {"codigo": "ASUC01113", "nombre": "Matemática Superior", "creditos": 5, "tipo": "Teoría", "periodo": 1},
            {"codigo": "ASUC01083", "nombre": "Habilidades Comunicativas", "creditos": 4, "tipo": "Teoría", "periodo": 1},
            {"codigo": "ASUC00512", "nombre": "Introducción a la Ing. de Sistemas", "creditos": 3, "tipo": "Teoría", "periodo": 1},
            # Período 2
            {"codigo": "ASUC01108", "nombre": "Álgebra Matricial y Geometría Analítica", "creditos": 4, "tipo": "Teoría", "periodo": 2},
            {"codigo": "ASUC01110", "nombre": "Fundamentos del Cálculo", "creditos": 4, "tipo": "Teoría", "periodo": 2},
            {"codigo": "ASUC00562", "nombre": "Matemática Discreta", "creditos": 4, "tipo": "Teoría", "periodo": 2},
            # Período 3
            {"codigo": "ASUC01160", "nombre": "Cálculo Diferencial", "creditos": 5, "tipo": "Teoría", "periodo": 3},
            {"codigo": "ASUC01312", "nombre": "Fundamentos de Programación", "creditos": 4, "tipo": "Laboratorio", "periodo": 3},
            {"codigo": "ASUC01275", "nombre": "Estadística General", "creditos": 3, "tipo": "Teoría", "periodo": 3},
            # Período 4
            {"codigo": "ASUC01161", "nombre": "Cálculo Integral", "creditos": 5, "tipo": "Teoría", "periodo": 4},
            {"codigo": "ASUC01482", "nombre": "Programación Orientada a Objetos", "creditos": 4, "tipo": "Laboratorio", "periodo": 4},
            {"codigo": "ASUC00316", "nombre": "Estructura de Datos", "creditos": 3, "tipo": "Laboratorio", "periodo": 4},
            # Período 5
            {"codigo": "ASUC01255", "nombre": "Ecuaciones Diferenciales", "creditos": 5, "tipo": "Teoría", "periodo": 5},
            {"codigo": "ASUC00051", "nombre": "Base de Datos", "creditos": 4, "tipo": "Laboratorio", "periodo": 5},
            {"codigo": "ASUC01136", "nombre": "Análisis y Requerimientos de Software", "creditos": 4, "tipo": "Teoría", "periodo": 5},
            # Período 6
            {"codigo": "ASUC00957", "nombre": "Diseño de Software", "creditos": 4, "tipo": "Teoría", "periodo": 6},
            {"codigo": "ASUC01386", "nombre": "Investigación Operativa", "creditos": 4, "tipo": "Teoría", "periodo": 6},
            {"codigo": "ASUC00006", "nombre": "Administración de Base de Datos", "creditos": 3, "tipo": "Laboratorio", "periodo": 6},
            # Período 7
            {"codigo": "ASUC00947", "nombre": "Construcción de Software", "creditos": 5, "tipo": "Laboratorio", "periodo": 7},
            {"codigo": "ASUC00754", "nombre": "Redes de Computadores", "creditos": 4, "tipo": "Laboratorio", "periodo": 7},
            {"codigo": "ASUC01141", "nombre": "Arquitectura Empresarial", "creditos": 5, "tipo": "Teoría", "periodo": 7},
            # Período 8
            {"codigo": "ASUC00123", "nombre": "Conmutación y Enrutamiento", "creditos": 4, "tipo": "Laboratorio", "periodo": 8},
            {"codigo": "ASUC01235", "nombre": "Dirección de Proyectos", "creditos": 4, "tipo": "Teoría", "periodo": 8},
            {"codigo": "ASUC01006", "nombre": "Pruebas y Calidad de Software", "creditos": 4, "tipo": "Laboratorio", "periodo": 8},
            # Período 9
            {"codigo": "ASUC00469", "nombre": "Ingeniería Web", "creditos": 4, "tipo": "Laboratorio", "periodo": 9},
            {"codigo": "ASUC01580", "nombre": "Taller de Investigación 1", "creditos": 4, "tipo": "Teoría", "periodo": 9},
            {"codigo": "ASUC00413", "nombre": "Gestión de Servicios TI", "creditos": 3, "tipo": "Teoría", "periodo": 9},
            # Período 10
            {"codigo": "ASUC01585", "nombre": "Taller de Proyectos 2", "creditos": 4, "tipo": "Laboratorio", "periodo": 10},
            {"codigo": "ASUC00097", "nombre": "Cloud Computing", "creditos": 3, "tipo": "Laboratorio", "periodo": 10},
            {"codigo": "ASUC00490", "nombre": "Inteligencia de Negocios", "creditos": 3, "tipo": "Teoría", "periodo": 10},
        ]
        cursos_obj = []
        for cd in cursos_data:
            cursos_obj.append(Curso(**cd))
        db.add_all(cursos_obj)
        db.commit()
        
        # Recuperar cursos
        c = {}
        for curso in db.query(Curso).all():
            c[curso.codigo] = curso

        # ══════════════════════════════════════════════════════════
        # SECCIONES — Algunas con turno MAÑANA y otras TARDE
        # ══════════════════════════════════════════════════════════
        print("📋 Secciones...")
        docentes_list = list(d.values())
        secciones = [
            # Período 1 — Turno mañana y tarde
            Seccion(codigo="AS1N1", curso_id=c["ASUC01113"].id, docente_id=d["juan_perez"].id, capac_estimada=40, turno="MAÑANA"),
            Seccion(codigo="AS1T1", curso_id=c["ASUC01113"].id, docente_id=d["elena_torres"].id, capac_estimada=35, turno="TARDE"),
            Seccion(codigo="AS1N2", curso_id=c["ASUC01083"].id, docente_id=d["maria_gomez"].id, capac_estimada=40, turno="MAÑANA"),
            Seccion(codigo="AS1N3", curso_id=c["ASUC00512"].id, docente_id=d["roberto_silva"].id, capac_estimada=45, turno="COMPLETO"),
            # Período 2
            Seccion(codigo="AS2N1", curso_id=c["ASUC01108"].id, docente_id=d["juan_perez"].id, capac_estimada=40, turno="MAÑANA"),
            Seccion(codigo="AS2N2", curso_id=c["ASUC01110"].id, docente_id=d["ana_flores"].id, capac_estimada=40, turno="MAÑANA"),
            Seccion(codigo="AS2N3", curso_id=c["ASUC00562"].id, docente_id=d["pedro_ramos"].id, capac_estimada=35, turno="COMPLETO"),
            # Período 3
            Seccion(codigo="AS3N1", curso_id=c["ASUC01160"].id, docente_id=d["ana_flores"].id, capac_estimada=40, turno="MAÑANA"),
            Seccion(codigo="AS3N2", curso_id=c["ASUC01312"].id, docente_id=d["carlos_ruiz"].id, capac_estimada=25, turno="TARDE"),
            Seccion(codigo="AS3N3", curso_id=c["ASUC01275"].id, docente_id=d["maria_gomez"].id, capac_estimada=40, turno="COMPLETO"),
            # Período 4
            Seccion(codigo="AS4N1", curso_id=c["ASUC01161"].id, docente_id=d["pedro_ramos"].id, capac_estimada=40, turno="MAÑANA"),
            Seccion(codigo="AS4N2", curso_id=c["ASUC01482"].id, docente_id=d["lucia_vargas"].id, capac_estimada=25, turno="TARDE"),
            Seccion(codigo="AS4N3", curso_id=c["ASUC00316"].id, docente_id=d["carlos_ruiz"].id, capac_estimada=25, turno="TARDE"),
            # Período 5
            Seccion(codigo="AS5N1", curso_id=c["ASUC01255"].id, docente_id=d["juan_perez"].id, capac_estimada=40, turno="MAÑANA"),
            Seccion(codigo="AS5N2", curso_id=c["ASUC00051"].id, docente_id=d["roberto_silva"].id, capac_estimada=25, turno="COMPLETO"),
            Seccion(codigo="AS5N3", curso_id=c["ASUC01136"].id, docente_id=d["elena_torres"].id, capac_estimada=40, turno="COMPLETO"),
            # Período 6
            Seccion(codigo="AS6N1", curso_id=c["ASUC00957"].id, docente_id=d["maria_gomez"].id, capac_estimada=35, turno="MAÑANA"),
            Seccion(codigo="AS6N2", curso_id=c["ASUC01386"].id, docente_id=d["pedro_ramos"].id, capac_estimada=40, turno="MAÑANA"),
            Seccion(codigo="AS6N3", curso_id=c["ASUC00006"].id, docente_id=d["lucia_vargas"].id, capac_estimada=25, turno="TARDE"),
            # Período 7
            Seccion(codigo="AS7N1", curso_id=c["ASUC00947"].id, docente_id=d["carlos_ruiz"].id, capac_estimada=25, turno="TARDE"),
            Seccion(codigo="AS7N2", curso_id=c["ASUC00754"].id, docente_id=d["roberto_silva"].id, capac_estimada=25, turno="COMPLETO"),
            Seccion(codigo="AS7N3", curso_id=c["ASUC01141"].id, docente_id=d["elena_torres"].id, capac_estimada=40, turno="MAÑANA"),
            # Período 8
            Seccion(codigo="AS8N1", curso_id=c["ASUC00123"].id, docente_id=d["roberto_silva"].id, capac_estimada=25, turno="COMPLETO"),
            Seccion(codigo="AS8N2", curso_id=c["ASUC01235"].id, docente_id=d["maria_gomez"].id, capac_estimada=40, turno="MAÑANA"),
            Seccion(codigo="AS8N3", curso_id=c["ASUC01006"].id, docente_id=d["lucia_vargas"].id, capac_estimada=25, turno="TARDE"),
            # Período 9
            Seccion(codigo="AS9N1", curso_id=c["ASUC00469"].id, docente_id=d["carlos_ruiz"].id, capac_estimada=25, turno="TARDE"),
            Seccion(codigo="AS9N2", curso_id=c["ASUC01580"].id, docente_id=d["ana_flores"].id, capac_estimada=40, turno="MAÑANA"),
            Seccion(codigo="AS9N3", curso_id=c["ASUC00413"].id, docente_id=d["elena_torres"].id, capac_estimada=35, turno="COMPLETO"),
            # Período 10
            Seccion(codigo="AS10N1", curso_id=c["ASUC01585"].id, docente_id=d["lucia_vargas"].id, capac_estimada=25, turno="TARDE"),
            Seccion(codigo="AS10N2", curso_id=c["ASUC00097"].id, docente_id=d["roberto_silva"].id, capac_estimada=25, turno="COMPLETO"),
            Seccion(codigo="AS10N3", curso_id=c["ASUC00490"].id, docente_id=d["pedro_ramos"].id, capac_estimada=35, turno="MAÑANA"),
        ]
        db.add_all(secciones)
        db.commit()

        total_bloques = sum(c[sec.curso.codigo if hasattr(sec, 'curso') else ''].creditos for sec in [])
        n_secciones = db.query(Seccion).count()
        n_cursos = db.query(Curso).count()
        n_aulas = db.query(Aula).count()
        n_docentes = db.query(User).filter(User.role == "docente").count()

        print(f"\n{'=' * 60}")
        print(f"  ✅ Seeder completado con éxito!")
        print(f"  📊 Cursos: {n_cursos} | Secciones: {n_secciones}")
        print(f"  🏫 Aulas: {n_aulas} | Docentes: {n_docentes}")
        print(f"{'=' * 60}")
        print("  Credenciales de prueba:")
        print("    Admin:      admin / admin")
        print("    Estudiante: estudiante / ucontinental")
        print("    Docente:    juan_perez / docente")
        print(f"{'=' * 60}")
        
    except Exception as e:
        print(f"❌ Error durante el seeding: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seeder()
