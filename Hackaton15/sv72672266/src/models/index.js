const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    role: {
        type: DataTypes.ENUM("customer", "courier", "admin"),
        defaultValue: "customer",
    },
});

const Package = sequelize.define("Package", {
    trackingCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    receiverName: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    receiverAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    status: {
        type: DataTypes.ENUM(
        "registered",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "cancelled"
        ),
        defaultValue: "registered",
    },

    deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

const PackageLocation = sequelize.define("PackageLocation", {
    latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
    },

    longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
    },

    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    note: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

const PackageMessage = sequelize.define("PackageMessage", {
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

// Relaciones
User.hasMany(Package, {
    foreignKey: "senderId",
    as: "packages",
});

Package.belongsTo(User, {
    foreignKey: "senderId",
    as: "sender",
});

Package.hasMany(PackageLocation, {
    foreignKey: "packageId",
    as: "locations",
});

PackageLocation.belongsTo(Package, {
    foreignKey: "packageId",
});

Package.hasMany(PackageMessage, {
    foreignKey: "packageId",
    as: "messages",
});

PackageMessage.belongsTo(Package, {
    foreignKey: "packageId",
});

User.hasMany(PackageMessage, {
    foreignKey: "userId",
    as: "messages",
});

PackageMessage.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

module.exports = {
    sequelize,
    User,
    Package,
    PackageLocation,
    PackageMessage,
};
