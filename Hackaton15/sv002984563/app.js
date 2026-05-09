const express = require(`express`);

const app = express();

app.use(express.json());

const usuarioRouter = require(`./src/routes/route.usuario`);
const paqueteRouter = require(`./src/routes/paquete.route`);
const ubiRouter = require(`./src/routes/ubicacion.route`);
const mensajeRouter = require(`./src/routes/mensaje.route`);


app.use(`/api/usuarios`, usuarioRouter);
app.use(`/api/paquete`, paqueteRouter);
app.use(`/api/ubicaion`, ubiRouter);
app.use(`/api/mensajes`, mensajeRouter);


module.exports = app;