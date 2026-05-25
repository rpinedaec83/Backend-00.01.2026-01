const mysql = require("mysql2/promise");

function createDbPool(config) {
  return mysql.createPool({
    host: config.MYSQL_HOST,
    port: config.MYSQL_PORT,
    database: config.MYSQL_DATABASE,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
  });
}

async function ensureSchema(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(80) NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);
}

async function getDbTime(pool) {
  const [rows] = await pool.query("SELECT NOW() AS now");
  return rows[0].now;
}

async function saveMessage(pool, payload) {
  const username = String(payload.username || "Anonimo").slice(0, 80);
  const body = String(payload.body || "").trim().slice(0, 500);

  if (!body) {
    throw new Error("Mensaje vacio");
  }

  const [result] = await pool.query(
    "INSERT INTO messages (username, body) VALUES (?, ?)",
    [username, body],
  );

  return {
    id: result.insertId,
    username,
    body,
    createdAt: new Date().toISOString(),
  };
}

async function getRecentMessages(pool, limit = 20) {
  const safeLimit = Math.max(1, Math.min(100, Number(limit) || 20));
  const [rows] = await pool.query(
    "SELECT id, username, body, created_at FROM messages ORDER BY id DESC LIMIT ?",
    [safeLimit],
  );

  return rows.reverse().map((row) => ({
    id: row.id,
    username: row.username,
    body: row.body,
    createdAt: row.created_at,
  }));
}

module.exports = {
  createDbPool,
  ensureSchema,
  getDbTime,
  saveMessage,
  getRecentMessages,
};
