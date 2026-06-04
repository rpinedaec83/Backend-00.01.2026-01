require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const { sequelize } = require("./models");
const initSocket = require("./sockets/socket");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

initSocket(io);

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log("Conexión a MySQL correcta");

    await sequelize.sync({
      alter: true,
    });

    console.log("Modelos sincronizados");

    server.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar servidor:", error);
  }
}

startServer();
