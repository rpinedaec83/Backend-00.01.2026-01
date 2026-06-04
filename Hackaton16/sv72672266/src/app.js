const express = require("express");
const cors = require("cors");
const passport = require("./config/passport");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const stripeRoutes = require("./routes/stripe.routes");

const app = express();

app.use(cors());

app.use(passport.initialize());

// Importante: el webhook de Stripe debe recibir el body en raw.
// Por eso va antes de express.json().
app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeRoutes
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json({
    message: "API Sistema de Pagos Online",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;