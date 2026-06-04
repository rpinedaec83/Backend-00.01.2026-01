const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { pool } = require("./database");

// Serializar usuario: guarda el ID en la sesión
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializar usuario: recupera el usuario desde el ID guardado en sesión
passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    done(null, rows[0] || null);
  } catch (err) {
    done(err, null);
  }
});

// Estrategia Google OAuth 2.0
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Buscar si el usuario ya existe
        const [rows] = await pool.query(
          "SELECT * FROM users WHERE google_id = ?",
          [profile.id]
        );

        if (rows.length > 0) {
          // Usuario existente — actualizar avatar si cambió
          await pool.query(
            "UPDATE users SET display_name = ?, avatar = ? WHERE google_id = ?",
            [
              profile.displayName,
              profile.photos?.[0]?.value || null,
              profile.id,
            ]
          );
          return done(null, rows[0]);
        }

        // Usuario nuevo — crear en la base de datos
        const [result] = await pool.query(
          "INSERT INTO users (google_id, display_name, email, avatar) VALUES (?, ?, ?, ?)",
          [
            profile.id,
            profile.displayName,
            profile.emails?.[0]?.value || "",
            profile.photos?.[0]?.value || null,
          ]
        );

        const [newUser] = await pool.query(
          "SELECT * FROM users WHERE id = ?",
          [result.insertId]
        );

        return done(null, newUser[0]);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
