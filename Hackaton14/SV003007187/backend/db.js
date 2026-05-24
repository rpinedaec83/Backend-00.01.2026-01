const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Determinar la ruta de la base de datos
let dbPath;

if (process.env.NODE_ENV === 'production') {
    // En producción (Docker/Render), usar /app/backend/data/
    const dataDir = '/app/backend/data';
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    dbPath = path.join(dataDir, 'chat.db');
} else {
    // En desarrollo local
    dbPath = path.resolve(__dirname, 'chat.db');
}

console.log(`🗄️ Ruta DB: ${dbPath}`);

// Abrir base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(' Error conectando a DB:', err.message);
        console.error(' Ruta intentada:', dbPath);
        process.exit(1);
    } else {
        console.log('+ Conectado a SQLite correctamente');
    }
});

// Crear tabla
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            author TEXT DEFAULT 'user',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error(' Error al crear tabla:', err.message);
        } else {
            console.log(' Tabla "messages" lista');
        }
    });
});

const getAllMessages = (callback) => {
    db.all('SELECT * FROM messages ORDER BY createdAt ASC', callback);
};

const insertMessage = (text, author, callback) => {
    db.run(
        'INSERT INTO messages (text, author) VALUES (?, ?)',
        [text, author],
        function(err) {
            callback(err, this?.lastID);
        }
    );
};

const updateMessage = (id, newText, callback) => {
    db.run('UPDATE messages SET text = ? WHERE id = ?', [newText, id], callback);
};

const deleteMessage = (id, callback) => {
    db.run('DELETE FROM messages WHERE id = ?', [id], callback);
};

const deleteAllMessages = (callback) => {
    db.run('DELETE FROM messages', callback);
};

module.exports = {
    getAllMessages,
    insertMessage,
    updateMessage,
    deleteMessage,
    deleteAllMessages
};