const { Pool } = require(`pg`);

const db = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME
});

const initDatabase = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS producto (
            id SERIAL PRIMARY KEY,
            description TEXT,
            productname VARCHAR(256)
        )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            username VARCHAR(256) UNIQUE,
            password VARCHAR(256),
            email VARCHAR(256) UNIQUE
        )
    `);
};

initDatabase()
    .then(() => console.log('Conexion a PostgreSQL lista'))
    .catch((err) => {
        console.error('Error al conectar con PostgreSQL:', err);
        process.exit(1);
    });
    
module.exports = db;





