const db = require("../config/modeldb");
const Ubicacion = db.Ubicacion;

exports.addUbicacion = (req, res) => {
    const nuevaUbicacion = {
        ubicacion_actual: req.body.ubicacion_actual,
        PaqueteId: req.body.paqueteId
    };

    Ubicacion.create(nuevaUbicacion)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(error => {
            res.status(500).send({
                message: error.message
            });
        });
};

exports.getUbicaciones = (req, res) => {
    Ubicacion.findAll()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => {
            res.status(500).send({
                message: error.message
            });
        });
};

// VER UBICACIONES POR PAQUETE
exports.getByPaquete = (req, res) => {
    let id = req.params.paqueteId;

    Ubicacion.findAll({
        where: { PaqueteId: id }
    })
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => {
            res.status(500).send({
                message: error.message
            });
        });
};