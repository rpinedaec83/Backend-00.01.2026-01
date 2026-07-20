const mysql = require("mysql2/promise");

// Pool de conexiones MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hackchat_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Crear tablas si no existen
async function initDB() {
  try {
    const conn = await pool.getConnection();

    // Tabla de usuarios (creados via Google OAuth)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        google_id    VARCHAR(255) UNIQUE NOT NULL,
        display_name VARCHAR(255) NOT NULL,
        email        VARCHAR(255) UNIQUE NOT NULL,
        avatar       VARCHAR(500),
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de mensajes del chat
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        user_id    INT NOT NULL,
        username   VARCHAR(255) NOT NULL,
        content    TEXT NOT NULL,
        room       VARCHAR(100) DEFAULT 'general',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    conn.release();
    console.log("✅ Base de datos inicializada correctamente");
  } catch (err) {
    console.error("❌ Error inicializando la base de datos:", err.message);
    throw err;
  }
}

module.exports = { pool, initDB };
