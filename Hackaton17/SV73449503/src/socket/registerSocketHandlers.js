const { getRecentMessages, saveMessage } = require("../config/database");

function registerSocketHandlers(io, pool) {
  io.on("connection", async (socket) => {
    const initialMessages = await getRecentMessages(pool, 20).catch(() => []);
    socket.emit("chat:history", initialMessages);

    io.emit("chat:users", io.engine.clientsCount);

    socket.on("chat:send", async (payload, ack) => {
      try {
        const item = await saveMessage(pool, {
          username: payload?.username,
          body: payload?.body,
        });

        io.emit("chat:new", item);
        if (typeof ack === "function") ack({ ok: true });
      } catch (error) {
        if (typeof ack === "function") ack({ ok: false, error: error.message });
      }
    });

    socket.on("disconnect", () => {
      io.emit("chat:users", io.engine.clientsCount);
    });
  });
}

module.exports = { registerSocketHandlers };
