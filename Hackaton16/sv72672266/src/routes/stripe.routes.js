const router = require("express").Router();
const stripe = require("../config/stripe");

const {
  sequelize,
  Order,
  Payment,
  Product,
  OrderItem,
} = require("../models");

router.post("/", async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  const transaction = await sequelize.transaction();

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const payment = await Payment.findOne({
        where: {
          stripeSessionId: session.id,
        },
        include: [
          {
            model: Order,
            as: "order",
            include: [
              {
                model: OrderItem,
                as: "items",
              },
            ],
          },
        ],
        transaction,
      });

      if (payment && payment.status !== "paid") {
        payment.status = "paid";
        payment.stripePaymentIntentId = session.payment_intent;

        payment.order.status = "paid";

        await payment.save({ transaction });
        await payment.order.save({ transaction });

        for (const item of payment.order.items) {
          const product = await Product.findByPk(item.productId, {
            transaction,
            lock: transaction.LOCK.UPDATE,
          });

          if (product) {
            product.stock = product.stock - item.quantity;
            await product.save({ transaction });
          }
        }

        const io = req.app.get("io");

        io.to(`user:${payment.userId}`).emit("payment:paid", {
          orderId: payment.orderId,
          paymentId: payment.id,
          status: "paid",
        });
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;

      const payment = await Payment.findOne({
        where: {
          stripeSessionId: session.id,
        },
        include: [
          {
            model: Order,
            as: "order",
          },
        ],
        transaction,
      });

      if (payment && payment.status === "pending") {
        payment.status = "failed";
        payment.order.status = "failed";

        await payment.save({ transaction });
        await payment.order.save({ transaction });

        const io = req.app.get("io");

        io.to(`user:${payment.userId}`).emit("payment:failed", {
          orderId: payment.orderId,
          paymentId: payment.id,
          status: "failed",
        });
      }
    }

    await transaction.commit();

    return res.json({
      received: true,
    });
  } catch (error) {
    await transaction.rollback();

    return res.status(500).json({
      message: "Error procesando webhook",
      error: error.message,
    });
  }
});

module.exports = router;