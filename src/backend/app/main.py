from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from .database import engine
from . import models
from .api import auth, cursos, aulas, scheduler, secciones, export, ical_export

# Crear las tablas en la base de datos (PMV simple)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sistema de Generación de Horarios API")

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: https://api.qrserver.com; "
        "connect-src 'self' http://localhost:8000 http://127.0.0.1:8000;"
    )
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Habilitar compresión GZip para reducir la huella de transferencia de red (Green Software)
app.add_middleware(GZipMiddleware, minimum_size=500)

# Incluir rutas
app.include_router(auth.router, prefix="/api")
app.include_router(cursos.router, prefix="/api")
app.include_router(aulas.router, prefix="/api")
app.include_router(scheduler.router, prefix="/api")
app.include_router(secciones.router, prefix="/api")
app.include_router(export.router, prefix="/api")
app.include_router(ical_export.router, prefix="/api")

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
