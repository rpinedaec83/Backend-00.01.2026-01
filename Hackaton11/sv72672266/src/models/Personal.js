const mongoose = require('mongoose');

const personalSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  cargo: {
    type: String,
    default: 'Operario'
  },
  horasDisponibles: {
    type: Number,
    required: true,
    default: 40
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Personal', personalSchema);