require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const path = require("path");

const passport = require("../config/passport");
const { pool, initDB } = require("../config/database");

// Rutas
const authRoutes = require("../routes/auth");
const chatRoutes = require("../routes/chat");

// =============================================
// CONFIGURACIÓN DE LA APP
// =============================================
const app = express();
app.set("trust proxy", 1); // Para Render / proxies
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;

// =============================================
// MIDDLEWARES
// =============================================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-key-cambiar-en-produccion",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  })
);

// Inicializar Passport + sesiones
app.use(passport.initialize());
app.use(passport.session());

// Inyectar usuario actual en todas las vistas
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  next();
});

// =============================================
// RUTAS
// =============================================
app.get("/", (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/chat");
  res.redirect("/auth/login");
});

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

// 404
app.use((req, res) => {
  res.status(404).send("<h2>404 - Página no encontrada</h2><a href='/'>Volver al inicio</a>");
});

// =============================================
// SOCKET.IO — CHAT EN TIEMPO REAL
// =============================================
const onlineUsers = new Map(); // socketId -> { username, avatar, userId, room }

io.on("connection", (socket) => {
  console.log(`🔌 Socket conectado: ${socket.id}`);

  // Usuario se une a una sala
  socket.on("join-room", ({ username, avatar, userId, room = "general" }) => {
    socket.join(room);
    onlineUsers.set(socket.id, { username, avatar, userId, room });

    // Notificar a la sala
    socket.to(room).emit("user-joined", {
      username,
      message: `${username} se unió al chat`,
      timestamp: new Date().toISOString(),
    });

    // Enviar lista de usuarios conectados en la sala
    const usersInRoom = [...onlineUsers.values()].filter((u) => u.room === room);
    io.to(room).emit("online-users", usersInRoom);

    console.log(`👤 ${username} → sala: ${room}`);
  });

  // Recibir y persistir mensaje
  socket.on("send-message", async ({ content, room = "general" }) => {
    const userData = onlineUsers.get(socket.id);
    if (!userData || !content?.trim()) return;

    try {
      const [result] = await pool.query(
        "INSERT INTO messages (user_id, username, content, room) VALUES (?, ?, ?, ?)",
        [userData.userId, userData.username, content.trim(), room]
      );

      const messageData = {
        id: result.insertId,
        username: userData.username,
        avatar: userData.avatar,
        content: content.trim(),
        room,
        timestamp: new Date().toISOString(),
      };

      io.to(room).emit("new-message", messageData);
    } catch (err) {
      console.error("Error guardando mensaje:", err);
      socket.emit("error", { message: "Error al enviar el mensaje" });
    }
  });

  // Indicador de escritura
  socket.on("typing", ({ room = "general" }) => {
    const userData = onlineUsers.get(socket.id);
    if (userData) {
      socket.to(room).emit("user-typing", { username: userData.username });
    }
  });

  socket.on("stop-typing", ({ room = "general" }) => {
    const userData = onlineUsers.get(socket.id);
    if (userData) {
      socket.to(room).emit("user-stop-typing", { username: userData.username });
    }
  });

  // Desconexión
  socket.on("disconnect", () => {
    const userData = onlineUsers.get(socket.id);
    if (userData) {
      const { username, room } = userData;
      onlineUsers.delete(socket.id);

      socket.to(room).emit("user-left", {
        username,
        message: `${username} salió del chat`,
        timestamp: new Date().toISOString(),
      });

      const usersInRoom = [...onlineUsers.values()].filter((u) => u.room === room);
      io.to(room).emit("online-users", usersInRoom);

      console.log(`❌ ${username} desconectado`);
    }
  });
});

// =============================================
// ARRANQUE DEL SERVIDOR
// =============================================
async function startServer() {
  try {
    await initDB();
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📦 Entorno : ${process.env.NODE_ENV || "development"}`);
      console.log(`🔐 OAuth   : Google configurado`);
      console.log(`💬 Socket  : Socket.io activo`);
      console.log(`🗄️  MySQL   : ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}\n`);
    });
  } catch (err) {
    console.error("❌ Error al arrancar el servidor:", err.message);
    process.exit(1);
  }
}

startServer();
