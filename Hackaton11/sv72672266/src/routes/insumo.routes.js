const express = require('express');
const router = express.Router();
const Insumo = require('../models/Insumo');

// Crear compra de insumo
router.post('/', async (req, res) => {
  try {
    const insumo = await Insumo.create(req.body);
    res.status(201).json({
      message: 'Insumo registrado correctamente',
      data: insumo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Listar insumos
router.get('/', async (req, res) => {
  try {
    const insumos = await Insumo.find();
    res.json(insumos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar insumo
router.put('/:id', async (req, res) => {
  try {
    const insumo = await Insumo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: 'Insumo actualizado',
      data: insumo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar insumo
router.delete('/:id', async (req, res) => {
  try {
    await Insumo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Insumo eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;