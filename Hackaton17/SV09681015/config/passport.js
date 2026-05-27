const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { pool } = require("./database");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const conn = await pool.getConnection();

        // Buscar si el usuario ya existe
        const [rows] = await conn.query(
          "SELECT * FROM users WHERE google_id = ?",
          [profile.id]
        );

        if (rows.length > 0) {
          // Usuario existente -> actualizar datos y retornar
          await conn.query(
            "UPDATE users SET display_name = ?, avatar = ? WHERE google_id = ?",
            [profile.displayName, profile.photos[0]?.value, profile.id]
          );
          conn.release();
          return done(null, rows[0]);
        }

        // Usuario nuevo -> insertar en DB
        const [result] = await conn.query(
          "INSERT INTO users (google_id, display_name, email, avatar) VALUES (?, ?, ?, ?)",
          [
            profile.id,
            profile.displayName,
            profile.emails[0].value,
            profile.photos[0]?.value,
          ]
        );

        const [newUser] = await conn.query(
          "SELECT * FROM users WHERE id = ?",
          [result.insertId]
        );
        conn.release();
        return done(null, newUser[0]);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serializar usuario en sesión (solo guardar ID)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializar usuario desde sesión (buscar por ID)
passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    done(null, rows[0] || null);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
