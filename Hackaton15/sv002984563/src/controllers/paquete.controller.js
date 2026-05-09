const { where } = require("sequelize");
const db = require("../config/modeldb");
const Paquete = db.Paquete;


exports.addPaquete = (req, res) => {
    const nuevoPaquete = {
        remitente: req.body.remitente,
        destinatario: req.body.destinatario,
        descripcion: req.body.descripcion,
        entregado: false,
        fecha: new Date(),
        UsuarioId: req.body.usuarioId
    };

    Paquete.create(nuevoPaquete)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(error => {
            res.status(500).send({
                message: error.message
            });
        });
};


exports.getPaquetes = (req, res) => {
    Paquete.findAll()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => {
            res.status(500).send({
                message: error.message
            });
        });
};


exports.getPaqueteById = (req, res) => {
    let id = req.params.id;

    Paquete.findByPk(id)
        .then(data => {
            if (!data) {
                return res.status(404).send({ message: "Paquete no encontrado" });
            }
            res.status(200).send(data);
        })
        .catch(error => {
            res.status(500).send({
                message: error.message
            });
        });
};


exports.updatePaquete = (req, res) => {
    let id = req.params.id;

    Paquete.update(req.body, {
        where: { id: id }
    })
        .then(() => {
            res.status(200).send({ message: "Paquete actualizado ✔" });
        })
        .catch(error => {
            res.status(500).send({
                message: error.message
            });
        });
};

exports.deletePaquete = (req, res) => {
    let id = req.params.id;

    Paquete.destroy({
        where: { id: id }
    })
        .then(() => {
            res.status(200).send({ message: "Paquete eliminado ✔" });
        })
        .catch(error => {
            res.status(500).send({
                message: error.message
            });
        });
};

exports.cambiarEstado = (req, res) => {
    const id = req.params.id;

    const nuevoEstado = {
        estado: req.body.estado
    };

    paqueteRouter.update(nuevoEstado, {
        where: { id: id }
    })
    .then(() => {
        res.status(200).send({ message: "Estado actualizado"});
    })
    .catch(error => {
        res,status(500).send({
            message: error.message
        });
    });
};