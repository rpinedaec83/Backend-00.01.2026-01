const mongoose = require('mongoose');

const insumoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  unidad: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    default: 0
  },
  costoUnitario: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Insumo', insumoSchema);