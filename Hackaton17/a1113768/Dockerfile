# =============================================
# DOCKERFILE — HackChat App
# Hackathon 17 · Node.js + Express + Socket.io
# =============================================

# Imagen base ligera con Node 20
FROM node:20-alpine

# Metadatos
LABEL maintainer="Hackathon 17"
LABEL description="Chat en tiempo real: Express, Socket.io, MySQL y Google OAuth"

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar dependencias primero (aprovecha la caché de capas Docker)
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm install --omit=dev

# Copiar el resto del código fuente
COPY . .

# Puerto que expone la aplicación
EXPOSE 3000

# Variable de entorno de producción
ENV NODE_ENV=production

# Comando de arranque
CMD ["node", "src/index.js"]
