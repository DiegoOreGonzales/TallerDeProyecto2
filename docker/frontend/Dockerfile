# Dockerfile for Frontend (Development)
FROM node:20-bookworm-slim

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Copiar el resto del código
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Instalar solo dependencias de producción (excluir Cypress, Playwright, Sharp, etc.)
# Las devDependencies de testing no son necesarias para levantar Vite
CMD sh -c "npm config set registry https://registry.npmjs.org/ && npm install --omit=dev --no-audit --no-fund --legacy-peer-deps && npx --yes vite --host"
