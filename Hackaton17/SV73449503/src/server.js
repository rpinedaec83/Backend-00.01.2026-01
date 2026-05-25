const http = require("node:http");
const { Server } = require("socket.io");
const passport = require("passport");
const config = require("./config/env");
const { createDbPool, ensureSchema } = require("./config/database");
const { configurePassport } = require("./config/passport");
const { registerSocketHandlers } = require("./socket/registerSocketHandlers");
const { createApp } = require("./app");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDatabase(pool, retries = 20, delayMs = 1500) {
  let lastError = null;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await ensureSchema(pool);
      return;
    } catch (error) {
      lastError = error;
      console.warn(`MySQL no disponible (intento ${attempt}/${retries})...`);
      await sleep(delayMs);
    }
  }

  throw lastError;
}

async function bootstrap() {
  const pool = createDbPool(config);
  await waitForDatabase(pool);

  const oauthEnabled = configurePassport(passport, config);

  const app = createApp({ config, oauthEnabled, pool });
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: config.CLIENT_ORIGIN,
      credentials: true,
    },
  });

  registerSocketHandlers(io, pool);

  server.listen(config.PORT, () => {
    const oauthStatus = oauthEnabled ? "ACTIVO" : "NO CONFIGURADO";
    console.log(`Servidor listo en http://localhost:${config.PORT}`);
    console.log(`OAuth Google: ${oauthStatus}`);
  });
}

bootstrap().catch((error) => {
  console.error("Error al iniciar servidor:", error);
  process.exit(1);
});
