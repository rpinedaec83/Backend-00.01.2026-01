const express = require('express');
const router = express.Router();
const MateriaPrima = require('../models/MateriaPrima');

// Crear compra de materia prima
router.post('/', async (req, res) => {
  try {
    const materia = await MateriaPrima.create(req.body);
    res.status(201).json({
      message: 'Materia prima registrada correctamente',
      data: materia
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Listar materia prima
router.get('/', async (req, res) => {
  try {
    const materias = await MateriaPrima.find();
    res.json(materias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar materia prima
router.put('/:id', async (req, res) => {
  try {
    const materia = await MateriaPrima.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: 'Materia prima actualizada',
      data: materia
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar materia prima
router.delete('/:id', async (req, res) => {
  try {
    await MateriaPrima.findByIdAndDelete(req.params.id);
    res.json({ message: 'Materia prima eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;