const express = require('express');
const router = express.Router();
const Personal = require('../models/Personal');

// Registrar personal
router.post('/', async (req, res) => {
  try {
    const personal = await Personal.create(req.body);
    res.status(201).json({
      message: 'Personal registrado correctamente',
      data: personal
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Listar personal
router.get('/', async (req, res) => {
  try {
    const personal = await Personal.find();
    res.json(personal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar personal
router.put('/:id', async (req, res) => {
  try {
    const personal = await Personal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: 'Personal actualizado',
      data: personal
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar personal
router.delete('/:id', async (req, res) => {
  try {
    await Personal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Personal eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;