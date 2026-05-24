# imagen 
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (usar npm install en lugar de npm ci)
RUN npm install --omit=dev && \
    npm rebuild sqlite3

# Copiar el código fuente
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Crear directorio para la base de datos con permisos
RUN mkdir -p /app/backend/data && \
    chmod -R 777 /app/backend

# Variables de entorno por defecto
ENV PORT=3000
ENV NODE_ENV=production
ENV DB_PATH=./backend/data/chat.db

# Exponer el puerto
EXPOSE 3000

# Health check para Render
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/test', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

# Comando para iniciar la aplicación
CMD ["node", "backend/server.js"]