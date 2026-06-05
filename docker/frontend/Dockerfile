# Dockerfile for Frontend (Development)
FROM node:20-bookworm-slim

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Copiar el resto del código
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Ejecutar instalación y levantar en tiempo de ejecución para usar DNS de Docker Compose
CMD sh -c "npm config set registry http://registry.npmjs.org/ && npm install --no-audit --no-fund --legacy-peer-deps && npm run dev -- --host"
