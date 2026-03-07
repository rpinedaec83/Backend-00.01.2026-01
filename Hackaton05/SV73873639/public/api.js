/**
 * api.js
 * Capa de acceso HTTP (Fetch).
 *
 * Regla clave (para tu caso):
 * - Si abres index.html en file:// o con Live Server (5500),
 *   el backend DEBE correr en http://localhost:3000
 *   y aquí se enruta automáticamente.
 */

const DEFAULT_BACKEND = "http://localhost:3000";

const API_BASE =
  location.protocol === "file:"
    ? DEFAULT_BACKEND
    : location.origin.includes("localhost:3000")
      ? ""
      : DEFAULT_BACKEND;

export const api = {
  health: () => request("/api/health"),

  seed: () => request("/api/seed", { method: "POST" }),

  checkReported: (imei, serial) =>
    request(`/api/devices/reported?imei=${encodeURIComponent(imei)}&serial=${encodeURIComponent(serial)}`),

  createRepair: (payload) => request("/api/repairs", { method: "POST", body: payload }),
  getRepair: (id) => request(`/api/repairs/${encodeURIComponent(id)}`),

  initialDiagnosis: (id, payload) =>
    request(`/api/repairs/${encodeURIComponent(id)}/initial-diagnosis`, { method: "POST", body: payload }),

  addPart: (id, payload) =>
    request(`/api/repairs/${encodeURIComponent(id)}/parts`, { method: "POST", body: payload }),

  authorize: (id, payload) =>
    request(`/api/repairs/${encodeURIComponent(id)}/authorize`, { method: "POST", body: payload }),

  assignTechnician: (id, payload) =>
    request(`/api/repairs/${encodeURIComponent(id)}/assign-technician`, { method: "POST", body: payload }),

  advance: (id) => request(`/api/repairs/${encodeURIComponent(id)}/advance`, { method: "POST" }),
};

async function request(path, { method = "GET", body } = {}) {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error ? `${data.error} (${data.code ?? "NO_CODE"})` : `HTTP ${res.status}`;
    const details = data?.details ? `\nDetalles: ${JSON.stringify(data.details, null, 2)}` : "";
    throw new Error(`${msg}\nURL: ${url}${details}`);
  }

  return data;
}