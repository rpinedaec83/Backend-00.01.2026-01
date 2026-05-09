const db = require(`../config/modeldb`);
const bcrypt = require('bcrypt');

const Usuario = db.Usuario;

exports.addUsuario = (req,res)=>{
    const usuarioNuevo = {
        nombre: req.body.nombre,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 8)
    };
    Usuario.create(usuarioNuevo)
    .then(data=>{
        res.status(201).send(data);
    }).catch(error=>{
        res.status(500).send(error);
    })

}

exports.updateUsuario = (req,res)=>{
    let usuarioId = req.params.id
    const usuarioNuevo = {
        nombre: req.body.nombre,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 8)
    };
    Usuario.update(usuarioNuevo,{
        where: {id: usuarioId}
    }).then(data=>{
        res.status(200).send(data);
    }).catch(error=>{
        res.status(500).send(error);
    })

}

exports.deleteUsuario = (req,res)=>{
    let usuarioId = req.params.id
    Usuario.destroy({
        where: {id: usuarioId}
    }).then(data=>{
        res.status(200).send(data);
    }).catch(error=>{
        res.status(500).send(error);
    })

}



