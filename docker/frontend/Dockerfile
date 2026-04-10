# Dockerfile for Frontend (Development)
FROM node:20-bookworm-slim

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Ejecutar en modo desarrollo con host expuesto
CMD ["npm", "run", "dev", "--", "--host"]
