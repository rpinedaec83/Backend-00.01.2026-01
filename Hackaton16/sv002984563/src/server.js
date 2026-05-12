require (`dotenv`).config();
console.log(`Inicio de aplicacion`);

const http = require(`http`);

const app = require(`./app`);
const db = require(`./config/db`);

const server = http.createServer(app);

const PORT = process.env.PORT;

server.listen(PORT, ()=>{
    console.log(`Escuchando el puerto ${PORT}`);
})



