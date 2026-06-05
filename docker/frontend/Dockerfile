# Dockerfile for Frontend (Development)
FROM node:20-bookworm-slim

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Copiar el resto del código
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Limpiar node_modules viejo (volumen Docker persistente) e instalar desde cero
# Solo instala dependencies (excluye Cypress, Playwright, Sharp, etc.)
CMD sh -c "rm -rf node_modules/.package-lock.json node_modules/.baseline* 2>/dev/null; npm config set registry https://registry.npmjs.org/ && npm install --omit=dev --no-audit --no-fund --legacy-peer-deps && npx --yes vite --host"

