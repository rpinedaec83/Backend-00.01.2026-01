require (`dotenv`).config();
console.log(`Inicio de la aplicacion`);

const http = require(`http`);
const { Server } = require(`socket.io`);

const app = require(`./app.js`);
const sequelize = require(`./src/config/db.js`);

const db = require(`./src/config/modeldb.js`);
const { Ubicacion, Paquete } = db;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on(`connection`, (socket) => {
    console.log(`Cliente conectado:`, socket.id);

    socket.on(`actualizar-ubicacion`, async (data)=> {
        try{
            const nuevaUbicacion = await Ubicacion.create({
                ubicacion_actual: data.ubicacion,
                PaqueteId: data.PaqueteId
            });

            console.log(`Ubicacion guardada:`, nuevaUbicacion.toJSON());
            
            io.emit(`ubicacion-actualizada`, data);
        } catch (error) {
            console.error(`Error guardando ubicacion:`, error.message);
        }
    });
    
    socket.on(`cambiar-estado`, async (data) => {
        try{
            await Paquete.update(
                { estado: data.estado },
                { where: { id: data.PaqueteId} }
            ); 
            
            io.emit(`estado-actualizado`, data);
        } catch (error) {
            console.error(`error actualizando estado`, error.message);
        }
    });

    socket.on(`disconnect`, () => {
        console.log(`Cliente desconectado`);
    });

});

const start = async ()=>{
    try{
        await sequelize.authenticate();
        console.log(`Conectado a DB`);

        await sequelize.sync({alter:true});
        console.log(`Tablas Sincronizadas`);

        const http = require(`http`);
        const server = http.createServer(app);

        const PORT = process.env.PORT;

        server.listen (PORT, ()=>{
            console.log(`Servidor iniciado en el puerto ${PORT}`);
        });

    } catch (error) {
        console.error(`Error de conexion a DB`, error.message);
        process.exit(1);
    }
}

start(); 
