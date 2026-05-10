const sqlite3 = require('sqlite3').verbose();

function createDb(dbFile = ':memory:') {
  const raw = new sqlite3.Database(dbFile);

  const db = {
    run(sql, params = []) {
      return new Promise((resolve, reject) => {
        raw.run(sql, params, function onRun(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ lastID: this.lastID, changes: this.changes });
        });
      });
    },
    get(sql, params = []) {
      return new Promise((resolve, reject) => {
        raw.get(sql, params, (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        });
      });
    },
    all(sql, params = []) {
      return new Promise((resolve, reject) => {
        raw.all(sql, params, (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        });
      });
    },
    exec(sql) {
      return new Promise((resolve, reject) => {
        raw.exec(sql, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    },
    close() {
      return new Promise((resolve, reject) => {
        raw.close((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    },
  };

  return db;
}

async function initSchema(db) {
  await db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      oauth_provider TEXT NOT NULL,
      oauth_subject TEXT NOT NULL,
      email TEXT,
      name TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(oauth_provider, oauth_subject)
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price_cents INTEGER NOT NULL CHECK(price_cents >= 0),
      currency TEXT NOT NULL DEFAULT 'PEN',
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_cents INTEGER NOT NULL CHECK(total_cents >= 0),
      currency TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'created',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS purchase_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      purchase_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL CHECK(quantity > 0),
      unit_price_cents INTEGER NOT NULL CHECK(unit_price_cents >= 0),
      subtotal_cents INTEGER NOT NULL CHECK(subtotal_cents >= 0),
      FOREIGN KEY(purchase_id) REFERENCES purchases(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      purchase_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      provider TEXT NOT NULL,
      amount_cents INTEGER NOT NULL CHECK(amount_cents >= 0),
      currency TEXT NOT NULL,
      provider_payment_id TEXT NOT NULL,
      status TEXT NOT NULL,
      raw_response TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(purchase_id) REFERENCES purchases(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS refunds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      payment_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      amount_cents INTEGER NOT NULL CHECK(amount_cents > 0),
      provider_refund_id TEXT NOT NULL,
      status TEXT NOT NULL,
      raw_response TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(payment_id) REFERENCES payments(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TRIGGER IF NOT EXISTS trg_payments_updated_at
    AFTER UPDATE ON payments
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
    BEGIN
      UPDATE payments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

    CREATE VIEW IF NOT EXISTS vw_customer_payments AS
    SELECT
      p.id AS payment_id,
      u.id AS user_id,
      u.email AS user_email,
      p.provider,
      p.amount_cents,
      p.currency,
      p.status AS payment_status,
      p.created_at AS paid_at,
      COALESCE(SUM(r.amount_cents), 0) AS refunded_cents
    FROM payments p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN refunds r ON r.payment_id = p.id
    GROUP BY p.id;
  `);
}

module.exports = {
  createDb,
  initSchema,
};
