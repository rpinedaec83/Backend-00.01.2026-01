const express = require("express");
const paqueteRouter = express.Router();

const controller = require("../controllers/paquete.controller");

paqueteRouter.post("/", controller.addPaquete);
paqueteRouter.get("/", controller.getPaquetes);
paqueteRouter.get("/:id", controller.getPaqueteById);
paqueteRouter.put("/:id", controller.updatePaquete);
paqueteRouter.delete("/:id", controller.deletePaquete);
paqueteRouter.patch("/:id/estado", controller.cambiarEstado);

module.exports = paqueteRouter;