const express = require('express');
const router = express.Router();

const Produccion = require('../models/Produccion');
const MateriaPrima = require('../models/MateriaPrima');
const Insumo = require('../models/Insumo');
const Personal = require('../models/Personal');

// Registrar producción de armarios
router.post('/', async (req, res) => {
  try {
    const { cantidadArmarios } = req.body;

    if (!cantidadArmarios || cantidadArmarios <= 0) {
      return res.status(400).json({
        message: 'La cantidad de armarios debe ser mayor a 0'
      });
    }

    const tablonesNecesarios = cantidadArmarios * 1;
    const gomaNecesaria = cantidadArmarios * 0.25;
    const horasNecesarias = cantidadArmarios * 8;

    const materiaPrima = await MateriaPrima.findOne({ nombre: 'Tablon' });
    const insumo = await Insumo.findOne({ nombre: 'Goma' });
    const personal = await Personal.findOne();

    if (!materiaPrima || materiaPrima.cantidad < tablonesNecesarios) {
      return res.status(400).json({
        message: 'No hay suficiente materia prima: tablones'
      });
    }

    if (!insumo || insumo.cantidad < gomaNecesaria) {
      return res.status(400).json({
        message: 'No hay suficiente insumo: goma'
      });
    }

    if (!personal || personal.horasDisponibles < horasNecesarias) {
      return res.status(400).json({
        message: 'No hay suficientes horas hombre disponibles'
      });
    }

    materiaPrima.cantidad -= tablonesNecesarios;
    insumo.cantidad -= gomaNecesaria;
    personal.horasDisponibles -= horasNecesarias;

    await materiaPrima.save();
    await insumo.save();
    await personal.save();

    const produccion = await Produccion.create({
      cantidadArmarios,
      tablonesUsados: tablonesNecesarios,
      gomaUsadaKg: gomaNecesaria,
      horasHombreUsadas: horasNecesarias
    });

    res.status(201).json({
      message: 'Producción registrada correctamente',
      data: produccion
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Listar producción
router.get('/', async (req, res) => {
  try {
    const producciones = await Produccion.find();
    res.json(producciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;