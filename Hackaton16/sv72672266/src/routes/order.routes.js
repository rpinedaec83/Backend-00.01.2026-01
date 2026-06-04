const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const stripe = require("../config/stripe");

const {
  sequelize,
  Product,
  Order,
  OrderItem,
  Payment,
  Refund,
} = require("../models");

// Crear sesión de pago en Stripe
router.post("/checkout", authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Debes enviar productos para comprar",
      });
    }

    let totalAmountInCents = 0;
    const orderItemsData = [];
    const stripeLineItems = [];

    for (const item of items) {
      const product = await Product.findOne({
        where: {
          id: item.productId,
          active: true,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!product) {
        await transaction.rollback();

        return res.status(404).json({
          message: `Producto ${item.productId} no encontrado`,
        });
      }

      if (product.stock < item.quantity) {
        await transaction.rollback();

        return res.status(400).json({
          message: `Stock insuficiente para el producto ${product.name}`,
        });
      }

      const subtotal = product.priceInCents * item.quantity;
      totalAmountInCents += subtotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitAmountInCents: product.priceInCents,
        subtotalInCents: subtotal,
      });

      stripeLineItems.push({
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description || undefined,
          },
          unit_amount: product.priceInCents,
        },
        quantity: item.quantity,
      });
    }

    const order = await Order.create(
      {
        userId: req.user.id,
        status: "pending",
        totalAmountInCents,
        currency: "usd",
      },
      { transaction }
    );

    for (const orderItem of orderItemsData) {
      await OrderItem.create(
        {
          ...orderItem,
          orderId: order.id,
        },
        { transaction }
      );
    }

    const payment = await Payment.create(
      {
        userId: req.user.id,
        orderId: order.id,
        status: "pending",
        amountInCents: totalAmountInCents,
        currency: "usd",
      },
      { transaction }
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: stripeLineItems,
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        orderId: order.id,
        paymentId: payment.id,
        userId: req.user.id,
      },
    });

    payment.stripeSessionId = session.id;
    await payment.save({ transaction });

    await transaction.commit();

    return res.status(201).json({
      message: "Sesión de pago creada correctamente",
      data: {
        orderId: order.id,
        paymentId: payment.id,
        checkoutUrl: session.url,
      },
    });
  } catch (error) {
    await transaction.rollback();

    return res.status(500).json({
      message: "Error al crear sesión de pago",
      error: error.message,
    });
  }
});

// Ver mis compras
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
        {
          model: Payment,
          as: "payment",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener compras",
      error: error.message,
    });
  }
});

// Solicitar devolución
router.post("/payments/:paymentId/refund", authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { reason } = req.body;

    const payment = await Payment.findOne({
      where: {
        id: req.params.paymentId,
        userId: req.user.id,
      },
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
      transaction,
    });

    if (!payment) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Pago no encontrado",
      });
    }

    if (payment.status !== "paid") {
      await transaction.rollback();

      return res.status(400).json({
        message: "Solo se pueden devolver pagos confirmados",
      });
    }

    if (!payment.stripePaymentIntentId) {
      await transaction.rollback();

      return res.status(400).json({
        message: "El pago no tiene PaymentIntent de Stripe",
      });
    }

    const refund = await Refund.create(
      {
        paymentId: payment.id,
        orderId: payment.orderId,
        userId: req.user.id,
        amountInCents: payment.amountInCents,
        reason: reason || "requested_by_customer",
        status: "pending",
      },
      { transaction }
    );

    const stripeRefund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      reason: "requested_by_customer",
      metadata: {
        refundId: refund.id,
        paymentId: payment.id,
        orderId: payment.orderId,
        userId: req.user.id,
      },
    });

    refund.stripeRefundId = stripeRefund.id;
    refund.status = stripeRefund.status === "succeeded" ? "succeeded" : "pending";

    if (refund.status === "succeeded") {
      payment.status = "refunded";
      payment.order.status = "refunded";

      await payment.save({ transaction });
      await payment.order.save({ transaction });
    }

    await refund.save({ transaction });

    await transaction.commit();

    const io = req.app.get("io");

    io.to(`user:${req.user.id}`).emit("refund:created", {
      refundId: refund.id,
      paymentId: payment.id,
      status: refund.status,
    });

    return res.status(201).json({
      message: "Devolución solicitada correctamente",
      data: refund,
    });
  } catch (error) {
    await transaction.rollback();

    return res.status(500).json({
      message: "Error al solicitar devolución",
      error: error.message,
    });
  }
});

module.exports = router;