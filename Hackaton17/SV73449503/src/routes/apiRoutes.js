const { Router } = require("express");
const { getDbTime, getRecentMessages, saveMessage } = require("../config/database");

function buildApiRoutes(pool) {
  const router = Router();

  router.get("/health", (_req, res) => {
    res.json({ ok: true, service: "hackaton17-api", timestamp: new Date().toISOString() });
  });

  router.get("/db-time", async (_req, res) => {
    try {
      const now = await getDbTime(pool);
      res.json({ connected: true, dbTime: now });
    } catch (error) {
      res.status(500).json({ connected: false, error: error.message });
    }
  });

  router.get("/messages", async (_req, res) => {
    try {
      const messages = await getRecentMessages(pool, 20);
      res.json({ ok: true, items: messages });
    } catch (error) {
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  router.post("/messages", async (req, res) => {
    try {
      const saved = await saveMessage(pool, {
        username: req.body.username,
        body: req.body.body,
      });
      res.status(201).json({ ok: true, item: saved });
    } catch (error) {
      res.status(400).json({ ok: false, error: error.message });
    }
  });

  return router;
}

module.exports = { buildApiRoutes };
