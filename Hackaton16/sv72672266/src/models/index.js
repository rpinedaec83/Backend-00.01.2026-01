const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  googleId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  priceInCents: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "usd",
  },

  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },

  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

const Order = sequelize.define("Order", {
  status: {
    type: DataTypes.ENUM(
      "pending",
      "paid",
      "failed",
      "refunded",
      "partially_refunded",
    ),
    defaultValue: "pending",
  },

  totalAmountInCents: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "usd",
  },
});

const OrderItem = sequelize.define("OrderItem", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  unitAmountInCents: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  subtotalInCents: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Payment = sequelize.define("Payment", {
  provider: {
    type: DataTypes.STRING,
    defaultValue: "stripe",
  },

  status: {
    type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
    defaultValue: "pending",
  },

  stripeSessionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },

  stripePaymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  amountInCents: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  currency: {
    type: DataTypes.STRING,
    defaultValue: "usd",
  },
});

const Refund = sequelize.define("Refund", {
  stripeRefundId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },

  amountInCents: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  status: {
    type: DataTypes.ENUM("pending", "succeeded", "failed"),
    defaultValue: "pending",
  },
});

// Relaciones

User.hasMany(Order, {
  foreignKey: "userId",
  as: "orders",
});

Order.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
});

Product.hasMany(OrderItem, {
  foreignKey: "productId",
});

OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

User.hasMany(Payment, {
  foreignKey: "userId",
  as: "payments",
});

Payment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Order.hasOne(Payment, {
  foreignKey: "orderId",
  as: "payment",
});

Payment.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});

Payment.hasMany(Refund, {
  foreignKey: "paymentId",
  as: "refunds",
});

Refund.belongsTo(Payment, {
  foreignKey: "paymentId",
  as: "payment",
});

Order.hasMany(Refund, {
  foreignKey: "orderId",
  as: "refunds",
});

Refund.belongsTo(Order, {
  foreignKey: "orderId",
});

User.hasMany(Refund, {
  foreignKey: "userId",
  as: "refunds",
});

Refund.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
  Payment,
  Refund,
};
