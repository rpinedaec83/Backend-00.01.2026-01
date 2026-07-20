const express = require("express");
const { pool } = require("../config/database");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

// GET /chat — Interfaz principal del chat (requiere autenticación)
router.get("/", isAuthenticated, (req, res) => {
  res.render("chat", { user: req.user });
});

// GET /chat/api/messages — Obtener mensajes de una sala (API REST)
// Query params: room (default: general), limit (default: 50)
router.get("/api/messages", isAuthenticated, async (req, res) => {
  const room = req.query.room || "general";
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);

  try {
    const [messages] = await pool.query(
      `SELECT m.id, m.username, m.content, m.room, m.created_at,
              u.avatar
       FROM messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.room = ?
       ORDER BY m.created_at DESC
       LIMIT ?`,
      [room, limit]
    );

    res.json({
      ok: true,
      room,
      messages: messages.reverse(), // Orden cronológico
    });
  } catch (err) {
    console.error("Error obteniendo mensajes:", err);
    res.status(500).json({ ok: false, error: "Error al obtener mensajes" });
  }
});

module.exports = router;
