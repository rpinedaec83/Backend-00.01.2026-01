# =============================================
# DOCKERFILE - HackChat App
# =============================================

# Etapa 1: Imagen base
FROM node:20-alpine

# Metadatos
LABEL maintainer="Hackathon Semanal"
LABEL description="Chat en tiempo real con Express, Socket.io, MySQL y OAuth"

# Crear directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias primero (aprovecha caché de Docker)
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install --omit=dev

# Copiar todo el código fuente
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 3000

# Variable de entorno por defecto
ENV NODE_ENV=production

# Comando de inicio
CMD ["node", "src/index.js"]
