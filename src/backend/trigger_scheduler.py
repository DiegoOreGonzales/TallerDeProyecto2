import sys
import os

# Asegurar que el path alcance a app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.core.scheduler import SchedulerEngine
from app.models import Horario

def trigger():
    print("Iniciando Proceso de Optimización de Horarios...")
    db = SessionLocal()
    try:
        # Limpiar horarios previos
        print("Limpiando registros de horarios antiguos...")
        db.query(Horario).delete()
        db.commit()

        engine = SchedulerEngine(db)
        result = engine.generate()
        
        if isinstance(result, dict) and "error" in result:
            print(f"Error en el motor: {result['error']}")
            return

        print(f"Éxito: Se generaron {len(result)} asignaciones óptimas.")
        
        # Guardar nuevos horarios
        for h in result:
            new_horario = Horario(
                seccion_id=h["seccion_id"],
                aula_id=h["aula_id"],
                dia_semana=h["dia"],
                hora_inicio=800 + (h["slot"] * 100),
                hora_fin=900 + (h["slot"] * 100)
            )
            db.add(new_horario)
        
        db.commit()
        print("Proceso finalizado. Los horarios han sido persistidos en la DB.")
        
    except Exception as e:
        print(f"Error durante el proceso: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    trigger()
