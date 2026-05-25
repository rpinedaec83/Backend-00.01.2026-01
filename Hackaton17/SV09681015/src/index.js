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
app.set("trust proxy", 1);
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
    secret: process.env.SESSION_SECRET || "secret-dev-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.RENDER === "true",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Variable global: usuario actual disponible en todas las vistas
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

// =============================================
// SOCKET.IO - CHAT EN TIEMPO REAL
// =============================================
const onlineUsers = new Map(); // socketId -> { username, avatar, room }

io.on("connection", (socket) => {
  console.log(`🔌 Socket conectado: ${socket.id}`);

  // Usuario se une a una sala
  socket.on("join-room", ({ username, avatar, room = "general" }) => {
    socket.join(room);
    onlineUsers.set(socket.id, { username, avatar, room });

    // Notificar a la sala que alguien entró
    socket.to(room).emit("user-joined", {
      username,
      message: `${username} se unió al chat`,
      timestamp: new Date().toISOString(),
    });

    // Enviar lista actualizada de usuarios en línea
    const usersInRoom = [...onlineUsers.values()].filter(
      (u) => u.room === room
    );
    io.to(room).emit("online-users", usersInRoom);

    console.log(`👤 ${username} se unió a la sala: ${room}`);
  });

  // Recibir y guardar mensaje
  socket.on("send-message", async ({ content, room = "general" }) => {
    const userData = onlineUsers.get(socket.id);
    if (!userData) return;

    try {
      // Guardar en MySQL
      const [result] = await pool.query(
        "INSERT INTO messages (user_id, username, content, room) VALUES ((SELECT id FROM users WHERE display_name = ? LIMIT 1), ?, ?, ?)",
        [userData.username, userData.username, content, room]
      );

      const messageData = {
        id: result.insertId,
        username: userData.username,
        avatar: userData.avatar,
        content,
        room,
        timestamp: new Date().toISOString(),
      };

      // Broadcast a todos en la sala (incluido el emisor)
      io.to(room).emit("new-message", messageData);
    } catch (err) {
      console.error("Error guardando mensaje:", err);
      socket.emit("error", { message: "Error al enviar el mensaje" });
    }
  });

  // Usuario está escribiendo...
  socket.on("typing", ({ room = "general" }) => {
    const userData = onlineUsers.get(socket.id);
    if (userData) {
      socket.to(room).emit("user-typing", { username: userData.username });
    }
  });

  // Usuario dejó de escribir
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

      // Actualizar usuarios en línea
      const usersInRoom = [...onlineUsers.values()].filter(
        (u) => u.room === room
      );
      io.to(room).emit("online-users", usersInRoom);

      console.log(`❌ ${username} desconectado`);
    }
  });
});

// =============================================
// INICIO DEL SERVIDOR
// =============================================
async function startServer() {
  await initDB(); // Inicializar tablas en MySQL
  server.listen(PORT, () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📦 Entorno: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔐 OAuth Google: Configurado`);
    console.log(`💬 Socket.io: Activo`);
    console.log(`🗄️  MySQL: ${process.env.DB_HOST}:${process.env.DB_PORT}\n`);
  });
}

startServer();
