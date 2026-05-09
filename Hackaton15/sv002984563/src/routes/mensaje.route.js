const express = require("express");
const mensajeRouter = express.Router();

const controller = require("../controllers/mensajes.controller");

mensajeRouter.post("/", controller.addMensaje);
mensajeRouter.get("/", controller.getMensajes);

module.exports = mensajeRouter;