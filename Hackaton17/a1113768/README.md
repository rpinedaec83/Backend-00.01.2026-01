# HACKATHON SEMANAL

## LOGRO: Utilizar ExpressJS NodeJS Socket.io Mysql OAUTH.

### I. Es hora de demostrar lo aprendido:
Demostrarás todo lo aprendido en este reto que se basará en las clases dictadas durante la semana.

### II. Insumos para resolver el Reto:
- Conocimientos adquiridos en las semanas anteriores
- Documentación de las semanas anteriores

### III. Descripción del reto
- Investigar y resolver las preguntas y ejercicios planteados
- Resolver problemas, definir algoritmos, utilizando las nuevas funcionalidades NodeJS, API, Docker y Render

### IV. Pasos a seguir para resolver los retos:
- El docente indicará si este reto se resolverá de manera individual o grupal

---

## Reto 1: Despliegue de aplicaciones

### TÍTULO: Despliegue de aplicaciones
Vamos a crear una aplicacion y desplegarla como Docker y como Render.

---

## V. Solución del reto

Se desarrolló **HackChat**, una aplicación de chat en tiempo real que integra todas las tecnologías del reto:

### 📁 Estructura del Proyecto

```
hackaton17/
├── src/
│   └── index.js              ← Servidor principal (Express + Socket.io)
├── config/
│   ├── database.js           ← Conexión MySQL y creación de tablas
│   └── passport.js           ← Estrategia Google OAuth 2.0
├── routes/
│   ├── auth.js               ← Rutas de login/logout
│   └── chat.js               ← Rutas del chat + API REST
├── middleware/
│   └── auth.js               ← Protección de rutas
├── views/
│   ├── login.ejs             ← Página de inicio de sesión
│   └── chat.ejs              ← Interfaz del chat
├── public/
│   ├── css/style.css         ← Estilos
│   └── js/chat.js            ← Cliente Socket.io
├── Dockerfile                ← Imagen Docker de la aplicación
├── docker-compose.yml        ← App + MySQL en contenedores
├── render.yaml               ← Configuración para Render.com
├── .env.example              ← Variables de entorno de ejemplo
└── package.json
```

### 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Node.js + Express** | Servidor HTTP, rutas REST, middleware |
| **Socket.io** | Chat en tiempo real (WebSockets) |
| **MySQL** | Persistencia de usuarios y mensajes |
| **Passport + Google OAuth 2.0** | Autenticación con cuenta de Google |
| **EJS** | Motor de plantillas para las vistas |
| **Docker + Docker Compose** | Contenedorización de la app y BD |
| **Render** | Despliegue en la nube (cloud) |

---

## ⚙️ Instalación Local (sin Docker)

### 1. Clonar e instalar dependencias
```bash
git clone <repositorio>
cd hackaton17
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales reales
```

### 3. Crear la base de datos en MySQL
```sql
CREATE DATABASE hackchat_db;
```
> Las tablas `users` y `messages` se crean automáticamente al arrancar la app.

### 4. Obtener credenciales de Google OAuth
1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Crear un proyecto nuevo
3. Habilitar **Google Identity / OAuth 2.0 API**
4. Ir a **Credenciales → Crear credenciales → ID de cliente OAuth 2.0**
5. Tipo: **Aplicación web**
6. URI de redirección: `http://localhost:3000/auth/google/callback`
7. Copiar **Client ID** y **Client Secret** al `.env`

### 5. Arrancar la app
```bash
npm run dev    # Desarrollo (nodemon)
npm start      # Producción
```

Abrir: **http://localhost:3000**

---

## 🐳 Despliegue con Docker

### Opción A: Solo la app (MySQL externo)
```bash
# Construir la imagen
docker build -t hackchat-app .

# Ejecutar el contenedor
docker run -p 3000:3000 \
  -e DB_HOST=tu_host_mysql \
  -e DB_USER=root \
  -e DB_PASSWORD=tu_password \
  -e DB_NAME=hackchat_db \
  -e SESSION_SECRET=clave_secreta \
  -e GOOGLE_CLIENT_ID=tu_client_id \
  -e GOOGLE_CLIENT_SECRET=tu_client_secret \
  -e GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback \
  hackchat-app
```

### Opción B: App + MySQL con Docker Compose ✅ (recomendado)
```bash
# 1. Configurar el .env
cp .env.example .env
# Editar con credenciales de Google OAuth

# 2. Levantar todos los servicios
docker-compose up --build

# En background:
docker-compose up --build -d

# Ver logs:
docker-compose logs -f app

# Detener:
docker-compose down

# Detener y borrar datos MySQL:
docker-compose down -v
```

### Comandos útiles de Docker
```bash
docker ps                          # Ver contenedores corriendo
docker images                      # Ver imágenes
docker exec -it hackchat_app sh    # Entrar al contenedor de la app
docker logs hackchat_mysql         # Ver logs de MySQL
```

---

## ☁️ Despliegue en Render

### Paso 1: Subir código a GitHub
```bash
git init
git add .
git commit -m "HackChat - Hackaton 17"
git remote add origin https://github.com/tu-usuario/hackchat-app.git
git push -u origin main
```

### Paso 2: Crear cuenta en Render
- Ir a [render.com](https://render.com) y registrarse con GitHub

### Paso 3: Crear la base de datos MySQL en Render
1. Dashboard → **New +** → **MySQL**
2. Anotar: Host, Port, Database, Username, Password

### Paso 4: Crear el servicio web
1. Dashboard → **New +** → **Web Service**
2. Conectar el repositorio de GitHub
3. Configurar:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
   - **Plan**: Free

### Paso 5: Variables de entorno en Render
En la sección **Environment**, agregar:

| Variable | Valor |
|---|---|
| `NODE_ENV` | `production` |
| `DB_HOST` | Host del MySQL de Render |
| `DB_PORT` | `3306` |
| `DB_USER` | Usuario de MySQL en Render |
| `DB_PASSWORD` | Password de MySQL en Render |
| `DB_NAME` | Nombre de la base de datos |
| `SESSION_SECRET` | String aleatorio largo |
| `GOOGLE_CLIENT_ID` | Tu Google Client ID |
| `GOOGLE_CLIENT_SECRET` | Tu Google Client Secret |
| `GOOGLE_CALLBACK_URL` | `https://tu-app.onrender.com/auth/google/callback` |

### Paso 6: Actualizar URI de Google OAuth para producción
1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Editar la credencial OAuth
3. Agregar en **URI de redirección**: `https://hackchat-app.onrender.com/auth/google/callback`

### Paso 7: Deploy
- Render despliega automáticamente al hacer push a `main`
- Ir a **Logs** para verificar que todo funcione correctamente

---

## 🔌 API REST

| Método | Ruta | Descripción | Auth requerido |
|---|---|---|---|
| `GET` | `/` | Redirige a login o chat | No |
| `GET` | `/auth/login` | Página de inicio de sesión | No |
| `GET` | `/auth/google` | Iniciar OAuth con Google | No |
| `GET` | `/auth/google/callback` | Callback de Google | No |
| `GET` | `/auth/logout` | Cerrar sesión | Sí |
| `GET` | `/chat` | Interfaz del chat | Sí |
| `GET` | `/chat/api/messages?room=general&limit=50` | Historial de mensajes | Sí |

## 📡 Eventos Socket.io

| Evento | Dirección | Descripción |
|---|---|---|
| `join-room` | Cliente → Servidor | Unirse a una sala |
| `send-message` | Cliente → Servidor | Enviar mensaje |
| `typing` | Cliente → Servidor | Indicar que el usuario escribe |
| `stop-typing` | Cliente → Servidor | Indicar que dejó de escribir |
| `new-message` | Servidor → Cliente | Nuevo mensaje en la sala |
| `user-joined` | Servidor → Cliente | Alguien entró a la sala |
| `user-left` | Servidor → Cliente | Alguien salió de la sala |
| `online-users` | Servidor → Cliente | Lista actualizada de usuarios online |
| `user-typing` | Servidor → Cliente | Indicador de quién escribe |
| `user-stop-typing` | Servidor → Cliente | Apagar indicador de escritura |

---

## 🗄️ Esquema de Base de Datos

```sql
-- Usuarios autenticados con Google OAuth
CREATE TABLE IF NOT EXISTS users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  google_id    VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  avatar       VARCHAR(500),
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mensajes del chat persistidos en MySQL
CREATE TABLE IF NOT EXISTS messages (
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

### VI. Presentación del Reto
- El documento debe ser presentado de manera individual o grupal (según se coordine con el docente)
- El tiempo de cada presentación lo definirá el docente a cargo

### VII. Feedback
- El docente dará feedback a los estudiantes sobre los ejercicios realizados
