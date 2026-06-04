const jwt = require("jsonwebtoken");
const { Package } = require("../models");

function initSocket(io) {
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Token no enviado"));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (error) {
            next(new Error("Token inválido"));
        }
    });

    io.on("connection", (socket) => {
        console.log("Cliente conectado:", socket.user.email);

        socket.on("package:join", async ({ packageId }, callback) => {
            try {
                const where = {
                    id: packageId,
                };

                if (socket.user.role === "customer") {
                    where.senderId = socket.user.id;
                }

                const packageFound = await Package.findOne({
                    where,
                });

                if (!packageFound) {
                    return callback?.({
                        ok: false,
                        message: "No autorizado para seguir este paquete",
                    });
                }

                socket.join(`package:${packageId}`);

                return callback?.({
                    ok: true,
                    message: `Unido a la sala del paquete ${packageId}`,
                });
            } catch (error) {
                return callback?.({
                    ok: false,
                    message: error.message,
                });
            }
        });

        socket.on("package:leave", ({ packageId }) => {
            socket.leave(`package:${packageId}`);
        });

        socket.on("disconnect", () => {
            console.log("Cliente desconectado:", socket.user.email);
        });
    });
}

module.exports = initSocket;
