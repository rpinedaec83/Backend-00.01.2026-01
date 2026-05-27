const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { Server } = require("socket.io");
const { io: createClient } = require("socket.io-client");
const { createApp } = require("../src/app");
const { registerSocketHandlers } = require("../src/socket/registerSocketHandlers");

const fakeConfig = {
  CLIENT_ORIGIN: "http://localhost:3000",
  SESSION_SECRET: "test-secret",
  NODE_ENV: "test",
};

function once(socket, eventName) {
  return new Promise((resolve) => {
    socket.once(eventName, resolve);
  });
}

test("Prueba 3: Socket.io recibe historial y nuevo mensaje", async () => {
  const pool = {
    query: async (sql, params) => {
      if (sql.includes("SELECT id, username, body, created_at")) {
        return [[{ id: 1, username: "Admin", body: "Hola", created_at: new Date() }]];
      }

      if (sql.includes("INSERT INTO messages")) {
        return [{ insertId: 2 }];
      }

      if (sql.includes("SELECT NOW()")) {
        return [[{ now: new Date().toISOString() }]];
      }

      return [[]];
    },
  };

  const app = createApp({ config: fakeConfig, oauthEnabled: false, pool });
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, { cors: { origin: "*" } });

  registerSocketHandlers(io, pool);

  await new Promise((resolve) => httpServer.listen(0, resolve));

  const port = httpServer.address().port;
  const client = createClient(`http://127.0.0.1:${port}`);

  const historyPromise = once(client, "chat:history");
  const newMessagePromise = once(client, "chat:new");

  await new Promise((resolve) => client.on("connect", resolve));

  const history = await historyPromise;
  assert.equal(Array.isArray(history), true);
  assert.equal(history.length, 1);

  client.emit("chat:send", { username: "Ana", body: "Mensaje test" });

  const newMessage = await newMessagePromise;
  assert.equal(newMessage.username, "Ana");
  assert.equal(newMessage.body, "Mensaje test");

  client.disconnect();
  await io.close();
  await new Promise((resolve) => httpServer.close(resolve));
});
