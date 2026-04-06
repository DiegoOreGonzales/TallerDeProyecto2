from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .api import auth, cursos, aulas, scheduler, secciones

# Crear las tablas en la base de datos (PMV simple)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sistema de Generación de Horarios API")

# Incluir rutas
app.include_router(auth.router, prefix="/api")
app.include_router(cursos.router, prefix="/api")
app.include_router(aulas.router, prefix="/api")
app.include_router(scheduler.router, prefix="/api")
app.include_router(secciones.router, prefix="/api")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ajustar para producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Bienvenido al Sistema de Generación Óptima de Horarios"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
