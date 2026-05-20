require('dotenv').config();

const { createApp } = require('./app');

const port = Number(process.env.PORT || 3000);
const dbFile = process.env.DB_FILE || './payments.db';

createApp({
  dbFile,
  mockGateways: process.env.MOCK_PAYMENT_GATEWAYS === 'true',
  disableOAuth: process.env.DISABLE_OAUTH === 'true',
})
  .then((app) => {
    app.listen(port, () => {
      console.log(`Servidor iniciado en http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('No se pudo iniciar la aplicación', err);
    process.exit(1);
  });
