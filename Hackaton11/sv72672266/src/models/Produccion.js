const mongoose = require('mongoose');

const produccionSchema = new mongoose.Schema({
  producto: {
    type: String,
    default: 'Armario'
  },
  cantidadArmarios: {
    type: Number,
    required: true
  },
  tablonesUsados: {
    type: Number,
    required: true
  },
  gomaUsadaKg: {
    type: Number,
    required: true
  },
  horasHombreUsadas: {
    type: Number,
    required: true
  },
  fechaProduccion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Produccion', produccionSchema);