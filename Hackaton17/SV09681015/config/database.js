
const mysql2 = require("mysql2/promise");

// Pool de conexiones a MySQL
const pool = mysql2.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hackathon_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Esperar a que MySQL esté listo (reintenta hasta 10 veces)
async function waitForDB(retries = 10, delay = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await pool.getConnection();
      conn.release();
      console.log("✅ Conexión a MySQL establecida");
      return true;
    } catch (err) {
      console.log(`⏳ MySQL no está listo (intento ${i}/${retries}), reintentando en ${delay/1000}s...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("❌ No se pudo conectar a MySQL después de varios intentos");
}

// Inicializar tablas si no existen
async function initDB() {
  await waitForDB(); // Esperar a que MySQL esté disponible

  const conn = await pool.getConnection();
  try {
    // Tabla de usuarios (via OAuth)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE,
        display_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        avatar VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de mensajes del chat
    await conn.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        username VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        room VARCHAR(100) DEFAULT 'general',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log("✅ Base de datos inicializada correctamente");
  } catch (err) {
    console.error("❌ Error inicializando la base de datos:", err);
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { pool, initDB };