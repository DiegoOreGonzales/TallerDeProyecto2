# Dockerfile for Frontend (Development)
FROM node:20-bookworm-slim

WORKDIR /app

# Copiar package.json y lock primero (capa cacheada)
COPY package.json package-lock.json* ./

# Instalar dependencias durante el BUILD (no en cada arranque)
# --ignore-scripts evita que Cypress/Playwright descarguen binarios pesados en el contenedor
RUN npm config set registry https://registry.npmjs.org/ && \
    npm install --no-audit --no-fund --legacy-peer-deps --ignore-scripts

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Solo levantar Vite (deps ya están instaladas)
CMD ["npm", "run", "dev"]
