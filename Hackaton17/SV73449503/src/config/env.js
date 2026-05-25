const path = require("node:path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function toInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: toInteger(process.env.PORT, 3000),
  SESSION_SECRET: process.env.SESSION_SECRET || "hackaton17-session-secret",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  MYSQL_HOST: process.env.MYSQL_HOST || "localhost",
  MYSQL_PORT: toInteger(process.env.MYSQL_PORT, 3306),
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || "hackaton17",
  MYSQL_USER: process.env.MYSQL_USER || "root",
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || "root",
  OAUTH_GOOGLE_CLIENT_ID: process.env.OAUTH_GOOGLE_CLIENT_ID || "",
  OAUTH_GOOGLE_CLIENT_SECRET: process.env.OAUTH_GOOGLE_CLIENT_SECRET || "",
  OAUTH_GOOGLE_CALLBACK_URL:
    process.env.OAUTH_GOOGLE_CALLBACK_URL ||
    "http://localhost:3000/auth/google/callback",
};
