const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");

const {
    Package,
    PackageLocation,
    PackageMessage,
    User,
} = require("../models");

function generateTrackingCode() {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `CUR-${Date.now()}-${random}`;
}

async function findPackageOrFail(packageId, user) {
    const where = {
        id: packageId,
    };

    if (user.role === "customer") {
        where.senderId = user.id;
    }

    return Package.findOne({
        where,
        include: [
            {
                model: User,
                as: "sender",
                attributes: ["id", "name", "email"],
            },
        ],
    });
}

// Crear paquete
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { description, receiverName, receiverAddress } = req.body;

        if (!description || !receiverName || !receiverAddress) {
            return res.status(400).json({
                message: "Faltan datos del paquete",
            });
        }

        const newPackage = await Package.create({
            trackingCode: generateTrackingCode(),
            description,
            receiverName,
            receiverAddress,
            senderId: req.user.id,
        });

        return res.status(201).json({
            message: "Paquete registrado correctamente",
            data: newPackage,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear paquete",
            error: error.message,
        });
    }
});

// Listar paquetes
router.get("/", authMiddleware, async (req, res) => {
    try {
        const where = {};

        if (req.user.role === "customer") {
            where.senderId = req.user.id;
        }

        const packages = await Package.findAll({
            where,
            order: [["createdAt", "DESC"]],
        });

        return res.json({
            data: packages,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al listar paquetes",
            error: error.message,
        });
    }
});

// Obtener detalle de paquete
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const packageFound = await findPackageOrFail(req.params.id, req.user);

        if (!packageFound) {
            return res.status(404).json({
                message: "Paquete no encontrado o no autorizado",
            });
        }

        return res.json({
            data: packageFound,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener paquete",
            error: error.message,
        });
    }
});

// Cambiar estado del paquete
router.put("/:id/status", authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "registered",
            "in_transit",
            "out_for_delivery",
            "delivered",
            "cancelled",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Estado no válido",
            });
        }

        const packageFound = await findPackageOrFail(req.params.id, req.user);

        if (!packageFound) {
            return res.status(404).json({
                message: "Paquete no encontrado o no autorizado",
            });
        }

        packageFound.status = status;

        if (status === "delivered") {
            packageFound.deliveredAt = new Date();
        }

        await packageFound.save();

        const io = req.app.get("io");

        io.to(`package:${packageFound.id}`).emit("package:statusUpdated", {
            packageId: packageFound.id,
            status: packageFound.status,
            deliveredAt: packageFound.deliveredAt,
        });

        return res.json({
            message: "Estado actualizado correctamente",
            data: packageFound,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar estado",
            error: error.message,
        });
    }
});

// Registrar ubicación del paquete
router.post("/:id/locations", authMiddleware, async (req, res) => {
    try {
        const { latitude, longitude, address, note } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({
                message: "La latitud y longitud son obligatorias",
            });
        }

        const packageFound = await findPackageOrFail(req.params.id, req.user);

        if (!packageFound) {
            return res.status(404).json({
                message: "Paquete no encontrado o no autorizado",
            });
        }

        const location = await PackageLocation.create({
            packageId: packageFound.id,
            latitude,
            longitude,
            address,
            note,
        });

        if (packageFound.status === "registered") {
            packageFound.status = "in_transit";
            await packageFound.save();
        }

        const io = req.app.get("io");

        io.to(`package:${packageFound.id}`).emit("package:locationUpdated", {
            packageId: packageFound.id,
            location,
        });

        return res.status(201).json({
            message: "Ubicación registrada correctamente",
            data: location,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al registrar ubicación",
            error: error.message,
        });
    }
});

// Ver historial de ubicaciones
router.get("/:id/locations", authMiddleware, async (req, res) => {
    try {
        const packageFound = await findPackageOrFail(req.params.id, req.user);

        if (!packageFound) {
            return res.status(404).json({
                message: "Paquete no encontrado o no autorizado",
            });
        }

        const locations = await PackageLocation.findAll({
            where: {
                packageId: packageFound.id,
            },
            order: [["createdAt", "DESC"]],
        });

        return res.json({
            data: locations,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener ubicaciones",
            error: error.message,
        });
    }
});

// Enviar mensaje sobre el paquete
router.post("/:id/messages", authMiddleware, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                message: "El mensaje es obligatorio",
            });
        }

        const packageFound = await findPackageOrFail(req.params.id, req.user);

        if (!packageFound) {
            return res.status(404).json({
                message: "Paquete no encontrado o no autorizado",
            });
        }

        const newMessage = await PackageMessage.create({
            packageId: packageFound.id,
            userId: req.user.id,
            message,
        });

        const io = req.app.get("io");

        io.to(`package:${packageFound.id}`).emit("package:messageCreated", {
            packageId: packageFound.id,
            message: newMessage,
            user: {
                id: req.user.id,
                name: req.user.name,
                role: req.user.role,
            },
        });

        return res.status(201).json({
            message: "Mensaje enviado correctamente",
            data: newMessage,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al enviar mensaje",
            error: error.message,
        });
    }
});

// Ver mensajes del paquete
router.get("/:id/messages", authMiddleware, async (req, res) => {
    try {
        const packageFound = await findPackageOrFail(req.params.id, req.user);

        if (!packageFound) {
            return res.status(404).json({
                message: "Paquete no encontrado o no autorizado",
            });
        }

        const messages = await PackageMessage.findAll({
            where: {
                packageId: packageFound.id,
            },
            include: [
                {
                model: User,
                as: "user",
                attributes: ["id", "name", "email", "role"],
                },
            ],
            order: [["createdAt", "ASC"]],
        });

        return res.json({
            data: messages,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener mensajes",
            error: error.message,
        });
    }
});

// Marcar como recibido
router.put("/:id/deliver", authMiddleware, async (req, res) => {
    try {
        const packageFound = await findPackageOrFail(req.params.id, req.user);

        if (!packageFound) {
            return res.status(404).json({
                message: "Paquete no encontrado o no autorizado",
            });
        }

        packageFound.status = "delivered";
        packageFound.deliveredAt = new Date();

        await packageFound.save();

        const io = req.app.get("io");

        io.to(`package:${packageFound.id}`).emit("package:delivered", {
            packageId: packageFound.id,
            status: packageFound.status,
            deliveredAt: packageFound.deliveredAt,
        });

        return res.json({
            message: "Paquete marcado como recibido",
            data: packageFound,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al marcar como recibido",
            error: error.message,
        });
    }
});

module.exports = router;
