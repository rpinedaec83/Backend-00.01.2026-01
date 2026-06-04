const router = require("express").Router();
const { Product } = require("../models");
const authMiddleware = require("../middleware/auth.middleware");

// Crear producto
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, priceInCents, currency, stock } = req.body;

    if (!name || !priceInCents) {
      return res.status(400).json({
        message: "El nombre y el precio son obligatorios",
      });
    }

    const product = await Product.create({
      name,
      description,
      priceInCents,
      currency: currency || "usd",
      stock: stock || 0,
    });

    return res.status(201).json({
      message: "Producto creado correctamente",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear producto",
      error: error.message,
    });
  }
});

// Listar productos activos
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        active: true,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al listar productos",
      error: error.message,
    });
  }
});

module.exports = router;
