const express = require("express");
const ubiRouter = express.Router();

const controller = require("../controllers/ubicacion.controller");

ubiRouter.post("/", controller.addUbicacion);
ubiRouter.get("/", controller.getUbicaciones);
ubiRouter.get("/paquete/:paqueteId", controller.getByPaquete);

module.exports = ubiRouter;