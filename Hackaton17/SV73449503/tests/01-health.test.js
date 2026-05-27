const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createApp } = require("../src/app");

const fakeConfig = {
  CLIENT_ORIGIN: "http://localhost:3000",
  SESSION_SECRET: "test-secret",
  NODE_ENV: "test",
};

test("Prueba 1: GET /api/health responde ok", async () => {
  const pool = {
    query: async () => [[{ now: new Date().toISOString() }]],
  };

  const app = createApp({ config: fakeConfig, oauthEnabled: false, pool });

  const response = await request(app).get("/api/health").expect(200);

  assert.equal(response.body.ok, true);
  assert.equal(response.body.service, "hackaton17-api");
});
