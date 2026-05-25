# ⚡ HackChat — Hackathon Semanal

Chat en tiempo real con **Express.js · Socket.io · MySQL · OAuth 2.0 (Google)**  
Desplegable con **Docker** y **Render**.

---

## 📁 Estructura del Proyecto

```
hackathon-app/
├── src/
│   └── index.js              ← Servidor principal (Express + Socket.io)
├── config/
│   ├── database.js           ← Conexión y creación de tablas MySQL
│   └── passport.js           ← Estrategia OAuth con Google
├── routes/
│   ├── auth.js               ← Rutas de login/logout OAuth
│   └── chat.js               ← Rutas del chat + API REST
├── middleware/
│   └── auth.js               ← Protección de rutas
├── views/
│   ├── login.ejs             ← Página de inicio de sesión
│   └── chat.ejs              ← Interfaz del chat
├── public/
│   ├── css/style.css         ← Estilos
│   └── js/chat.js            ← Cliente Socket.io
├── Dockerfile                ← Imagen Docker de la app
├── docker-compose.yml        ← App + MySQL juntos
├── render.yaml               ← Configuración de Render
├── .env.example              ← Variables de entorno de ejemplo
└── package.json
```

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Node.js + Express** | Servidor HTTP, rutas REST |
| **Socket.io** | Chat en tiempo real |
| **MySQL** | Persistencia de mensajes y usuarios |
| **Passport + Google OAuth 2.0** | Autenticación sin contraseña |
| **EJS** | Motor de plantillas |
| **Docker** | Contenedorización |
| **Render** | Despliegue en la nube |

---

## ⚙️ Instalación Local (sin Docker)

### 1. Clonar e instalar dependencias
```bash
git clone https://github.com/tu-usuario/hackathon-app.git
cd hackathon-app
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Crear la base de datos en MySQL
```sql
CREATE DATABASE hackathon_db;
```
> Las tablas se crean automáticamente al iniciar la app.

### 4. Obtener credenciales de Google OAuth
1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Crear un proyecto nuevo
3. Habilitar **Google+ API** o **Google Identity**
4. Ir a **Credenciales → Crear credenciales → ID de cliente OAuth 2.0**
5. Tipo de aplicación: **Aplicación web**
6. URI de redirección autorizada: `http://localhost:3000/auth/google/callback`
7. Copiar **Client ID** y **Client Secret** al `.env`

### 5. Ejecutar la app
```bash
npm run dev    # Desarrollo (con nodemon)
npm start      # Producción
```

Abrir: **http://localhost:3000**

---

## 🐳 Despliegue con Docker

### Opción A: Solo la app (requiere MySQL externo)
```bash
# Construir la imagen
docker build -t hackchat-app .

# Ejecutar el contenedor
docker run -p 3000:3000 \
  -e DB_HOST=tu_host_mysql \
  -e DB_USER=tu_usuario \
  -e DB_PASSWORD=tu_password \
  -e DB_NAME=hackathon_db \
  -e SESSION_SECRET=secreto_seguro \
  -e GOOGLE_CLIENT_ID=tu_client_id \
  -e GOOGLE_CLIENT_SECRET=tu_client_secret \
  -e GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback \
  hackchat-app
```

### Opción B: App + MySQL con Docker Compose ✅ (recomendado)
```bash
# 1. Copiar y configurar el .env
cp .env.example .env
# Editar .env con tus credenciales de Google OAuth

# 2. Levantar todos los servicios
docker-compose up --build

# 3. Para ejecutar en background
docker-compose up --build -d

# 4. Ver logs
docker-compose logs -f app

# 5. Detener
docker-compose down

# 6. Detener y eliminar volúmenes (borra datos MySQL)
docker-compose down -v
```

### Comandos útiles de Docker
```bash
# Ver contenedores corriendo
docker ps

# Ver imágenes
docker images

# Entrar al contenedor
docker exec -it hackchat_app sh

# Ver logs del contenedor MySQL
docker logs hackchat_mysql
```

---

## ☁️ Despliegue en Render

### Paso 1: Subir código a GitHub
```bash
git init
git add .
git commit -m "Initial commit - HackChat"
git remote add origin https://github.com/tu-usuario/hackathon-app.git
git push -u origin main
```

### Paso 2: Crear cuenta en Render
- Ir a [render.com](https://render.com) y registrarse

### Paso 3: Crear la base de datos MySQL en Render
1. Dashboard → **New +** → **MySQL**
2. Anotar: **Host, Port, Database, Username, Password**

### Paso 4: Crear el servicio web
1. Dashboard → **New +** → **Web Service**
2. Conectar tu repositorio de GitHub
3. Configurar:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
   - **Plan**: Free

### Paso 5: Agregar variables de entorno en Render
En la sección **Environment**, agregar:

| Variable | Valor |
|---|---|
| `NODE_ENV` | `production` |
| `DB_HOST` | Host de MySQL en Render |
| `DB_PORT` | `3306` |
| `DB_USER` | Usuario de MySQL en Render |
| `DB_PASSWORD` | Password de MySQL en Render |
| `DB_NAME` | Nombre de la base de datos |
| `SESSION_SECRET` | Un string aleatorio largo |
| `GOOGLE_CLIENT_ID` | Tu Google Client ID |
| `GOOGLE_CLIENT_SECRET` | Tu Google Client Secret |
| `GOOGLE_CALLBACK_URL` | `https://tu-app.onrender.com/auth/google/callback` |

### Paso 6: Actualizar Google OAuth con la URL de Render
1. Volver a [console.cloud.google.com](https://console.cloud.google.com)
2. Ir a tu credencial OAuth
3. Agregar en **URI de redirección**: `https://tu-app.onrender.com/auth/google/callback`

### Paso 7: Deploy
- Render despliega automáticamente al hacer push a `main`
- Ir a **Logs** para verificar que todo funcione

---

## 🔌 API REST

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `GET` | `/` | Redirige a login o chat | No |
| `GET` | `/auth/login` | Página de login | No |
| `GET` | `/auth/google` | Inicia OAuth con Google | No |
| `GET` | `/auth/google/callback` | Callback de Google | No |
| `GET` | `/auth/logout` | Cerrar sesión | Sí |
| `GET` | `/chat` | Interfaz del chat | Sí |
| `GET` | `/chat/api/messages?room=general&limit=50` | Mensajes por sala | Sí |

## 📡 Eventos Socket.io

| Evento | Dirección | Descripción |
|---|---|---|
| `join-room` | Cliente → Servidor | Unirse a una sala |
| `send-message` | Cliente → Servidor | Enviar mensaje |
| `typing` | Cliente → Servidor | Usuario escribiendo |
| `stop-typing` | Cliente → Servidor | Dejó de escribir |
| `new-message` | Servidor → Cliente | Nuevo mensaje en sala |
| `user-joined` | Servidor → Cliente | Alguien entró |
| `user-left` | Servidor → Cliente | Alguien salió |
| `online-users` | Servidor → Cliente | Lista de usuarios online |
| `user-typing` | Servidor → Cliente | Indicador de escritura |

---

## 🗄️ Esquema de Base de Datos

```sql
-- Usuarios (creados via OAuth)
CREATE TABLE users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  google_id    VARCHAR(255) UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  avatar       VARCHAR(500),
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mensajes del chat
CREATE TABLE messages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  username   VARCHAR(255) NOT NULL,
  content    TEXT NOT NULL,
  room       VARCHAR(100) DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 👨‍💻 Autor
Proyecto desarrollado para el Hackathon Semanal  
Stack: **Node.js · Express · Socket.io · MySQL · OAuth · Docker · Render**
