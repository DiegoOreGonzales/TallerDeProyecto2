# Dockerfile for Frontend (Development)
FROM node:20-bookworm-slim

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias durante el BUILD (no en cada arranque)
RUN npm config set registry https://registry.npmjs.org/ && \
    npm install --no-audit --no-fund --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# 1. Borrar node_modules completo del volumen Docker persistente para evitar ENOTEMPTY
# 2. Instalar TODAS las dependencias (vite + plugin-react necesitan estar disponibles)
# 3. Levantar el dev server de Vite
CMD sh -c "rm -rf /app/node_modules && npm config set registry https://registry.npmjs.org/ && npm install --no-audit --no-fund --legacy-peer-deps --ignore-scripts && npm run dev"
