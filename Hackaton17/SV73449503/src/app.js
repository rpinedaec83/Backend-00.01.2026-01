const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const { buildApiRoutes } = require("./routes/apiRoutes");
const { buildAuthRoutes } = require("./routes/authRoutes");

function createApp(options) {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(
    cors({
      origin: options.config.CLIENT_ORIGIN,
      credentials: true,
    }),
  );

  app.use(
    session({
      secret: options.config.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: options.config.NODE_ENV === "production",
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/auth", buildAuthRoutes(passport, options.oauthEnabled));
  app.use("/api", buildApiRoutes(options.pool));
  app.use(express.static("public"));

  app.use((_req, res) => {
    res.status(404).json({ ok: false, error: "Ruta no encontrada" });
  });

  return app;
}

module.exports = { createApp };
