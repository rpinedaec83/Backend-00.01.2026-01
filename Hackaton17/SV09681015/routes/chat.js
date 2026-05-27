const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const { isAuthenticated } = require("../middleware/auth");

// GET /chat - Página principal del chat (protegida)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    // Cargar los últimos 50 mensajes de la sala "general"
    const [messages] = await pool.query(
      `SELECT m.*, u.avatar 
       FROM messages m 
       JOIN users u ON m.user_id = u.id 
       WHERE m.room = 'general' 
       ORDER BY m.created_at DESC 
       LIMIT 50`
    );

    res.render("chat", {
      title: "Chat en tiempo real",
      user: req.user,
      messages: messages.reverse(), // Mostrar del más antiguo al más nuevo
    });
  } catch (err) {
    console.error("Error cargando chat:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// GET /chat/api/messages - API REST para obtener mensajes (JSON)
router.get("/api/messages", isAuthenticated, async (req, res) => {
  try {
    const room = req.query.room || "general";
    const limit = parseInt(req.query.limit) || 50;

    const [messages] = await pool.query(
      `SELECT m.id, m.username, m.content, m.room, m.created_at, u.avatar
       FROM messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.room = ?
       ORDER BY m.created_at DESC
       LIMIT ?`,
      [room, limit]
    );

    res.json({ success: true, messages: messages.reverse() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
