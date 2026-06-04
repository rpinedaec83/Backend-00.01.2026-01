const jwt = require("jsonwebtoken");

function initSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Token no enviado"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      return next(new Error("Token inválido"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.user.email);

    socket.join(`user:${socket.user.id}`);

    socket.emit("socket:connected", {
      message: "Conectado a notificaciones de pagos",
      userId: socket.user.id,
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.user.email);
    });
  });
}

module.exports = initSocket;