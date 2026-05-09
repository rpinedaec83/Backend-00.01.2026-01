const controller = require('../controllers/controller.usuario');
const usuarioRouter = require('express').Router();

usuarioRouter.post('/',controller.addUsuario);
usuarioRouter.put('/:id',controller.updateUsuario);
usuarioRouter.delete('/:id',controller.deleteUsuario);

module.exports = usuarioRouter;