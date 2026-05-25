const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createApp } = require("../src/app");

const fakeConfig = {
  CLIENT_ORIGIN: "http://localhost:3000",
  SESSION_SECRET: "test-secret",
  NODE_ENV: "test",
};

test("Prueba 2: GET /api/db-time valida conexión MySQL", async () => {
  const pool = {
    query: async (sql) => {
      if (sql.includes("SELECT NOW()")) {
        return [[{ now: "2026-05-24T00:00:00.000Z" }]];
      }
      return [[]];
    },
  };

  const app = createApp({ config: fakeConfig, oauthEnabled: false, pool });

  const response = await request(app).get("/api/db-time").expect(200);

  assert.equal(response.body.connected, true);
  assert.ok(response.body.dbTime);
});
