const db = require("../config/modeldb");
const Mensaje = db.Mensaje;

exports.addMensaje = (req, res) => {
    const nuevoMensaje = {
        mensaje: req.body.mensaje,
        UsuarioId: req.body.usuarioId,
        fecha: new Date()
    };

    Mensaje.create(nuevoMensaje)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(error => {
            res.status(500).send({
                message: error.message
            });
        });
};

exports.getMensajes = (req, res) => {
    Mensaje.findAll()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => {
            res.status(500).send({
                message: error.message
            });
        });
};