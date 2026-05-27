# HACKATON 17

Proyecto backend completo con:
- ExpressJS + NodeJS
- Socket.io (chat en tiempo real)
- MySQL (persistencia)
- OAuth Google con Passport
- Docker (app + mysql)
- Render (archivo `render.yaml`)

## 1. Requisitos
- Node.js 20+
- npm
- Docker Desktop (para despliegue local con contenedores)

## 2. Instalación local
```bash
npm install
cp .env.example .env
npm start
```

Abrir: [http://localhost:3000](http://localhost:3000)

## 3. Estructura principal
- `src/server.js`: arranque del servidor HTTP + Socket.io.
- `src/app.js`: configuración de Express y rutas.
- `src/config/database.js`: pool MySQL + funciones SQL.
- `src/config/passport.js`: estrategia OAuth Google.
- `src/socket/registerSocketHandlers.js`: eventos de chat.
- `tests/`: 3 pruebas automatizadas.

## 4. Variables de entorno
Usa `.env` basado en `.env.example`.

Variables críticas:
- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`
- `OAUTH_GOOGLE_CLIENT_ID`, `OAUTH_GOOGLE_CLIENT_SECRET`, `OAUTH_GOOGLE_CALLBACK_URL`

## 5. Docker
```bash
docker compose up --build
```

Servicios:
- App: [http://localhost:3000](http://localhost:3000)
- MySQL: puerto local `3307` (interno contenedor `3306`)

## 6. Render
`render.yaml` ya está preparado.

Pasos:
1. Subir proyecto a GitHub.
2. En Render: `New +` -> `Blueprint`.
3. Conectar repo y desplegar.
4. Completar variables `MYSQL_*` y `OAUTH_GOOGLE_*` en panel de Render.

## 7. OAuth Google
1. En Google Cloud crear credenciales OAuth 2.0.
2. Agregar redirect URI:
- Local: `http://localhost:3000/auth/google/callback`
- Render: `https://TU-SERVICIO.onrender.com/auth/google/callback`
3. Copiar client id/secret a `.env` o variables de Render.

## 8. Pruebas (3)
```bash
npm test
```

Pruebas implementadas:
1. `GET /api/health` responde `ok`.
2. `GET /api/db-time` valida integración de base de datos.
3. `Socket.io` recibe historial y nuevo mensaje en tiempo real.
