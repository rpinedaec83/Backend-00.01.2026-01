const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const materiaPrimaRoutes = require('./routes/materiaPrima.routes');
const insumoRoutes = require('./routes/insumo.routes');
const personalRoutes = require('./routes/personal.routes');
const produccionRoutes = require('./routes/produccion.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/materia-prima', materiaPrimaRoutes);
app.use('/api/insumos', insumoRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/produccion', produccionRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');

    app.listen(process.env.PORT, () => {
      console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.error('Error al conectar a MongoDB:', error);
  });