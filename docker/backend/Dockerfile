# Dockerfile for Backend (Development)
FROM python:3.11-slim-bookworm

# Evitar que Python genere archivos .pyc y use el buffer para logs
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Copiar y ejecutar la instalación de requisitos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente
COPY . .

# Exponer el puerto de FastAPI
EXPOSE 8000

# Ejecutar con reload para desarrollo
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
