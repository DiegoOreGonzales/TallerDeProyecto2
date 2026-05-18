import sys
import os
import time

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import User, Aula, Curso, Seccion, Horario
from app.core.scheduler import SchedulerEngine

def run_benchmark():
    print("Iniciando Benchmarking SGOHA...")
    
    # Crear DB temporal en memoria (sqlite) u usar la de pruebas
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Cargar 10 Docentes
        docentes = []
        for i in range(10):
            d = User(username=f"doc_{i}", email=f"doc{i}@test.com", hashed_password="pw", role="docente", turno_preferido="COMPLETO")
            db.add(d)
            docentes.append(d)
        db.commit()
        
        # Cargar 30 Aulas
        aulas = []
        for i in range(30):
            a = Aula(nombre=f"Aula-{i}", capacidad=60, tipo="Teoría")
            db.add(a)
            aulas.append(a)
        db.commit()
        
        # Cargar 30 Cursos
        cursos = []
        for i in range(30):
            c = Curso(codigo=f"C{i}", nombre=f"Curso {i}", creditos=3, tipo="Teoría", periodo=1)
            db.add(c)
            cursos.append(c)
        db.commit()
        
        # Cargar 100 Secciones
        print("Cargando 100 secciones...")
        for i in range(100):
            curso_idx = i % 30
            docente_idx = i % 10
            s = Seccion(codigo=f"S{i}", curso_id=cursos[curso_idx].id, docente_id=docentes[docente_idx].id, capac_estimada=30, turno="COMPLETO")
            db.add(s)
        db.commit()
        
        # Ejecutar y Medir
        print("Ejecutando algoritmo CP-SAT...")
        start_time = time.time()
        engine = SchedulerEngine(db)
        result = engine.generate()
        end_time = time.time()
        
        elapsed_time = end_time - start_time
        
        status_res = "SUCCESS" if isinstance(result, list) else result.get("error", "ERROR")
        
        log_content = f"=== REPORTE DE BENCHMARK SGOHA ===\n"
        log_content += f"Configuracion: 10 Docentes, 30 Aulas, 30 Cursos, 100 Secciones\n"
        log_content += f"Status de Resolucion: {status_res}\n"
        log_content += f"Tiempo total de ejecucion: {elapsed_time:.4f} segundos\n"
        log_content += f"Cumple RNF-01 (<= 2.0s): {'SI' if elapsed_time <= 2.0 else 'NO'}\n"
        
        print(log_content)
        
        # Guardar en archivo
        evidencia_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "docs", "evidencias")
        os.makedirs(evidencia_dir, exist_ok=True)
        log_path = os.path.join(evidencia_dir, "benchmark_results.log")
        
        with open(log_path, "w") as f:
            f.write(log_content)
            
        print(f"Log guardado en {log_path}")

    finally:
        db.close()

if __name__ == "__main__":
    run_benchmark()
