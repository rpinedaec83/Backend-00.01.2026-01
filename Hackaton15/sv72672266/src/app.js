const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const packageRoutes = require("./routes/package.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);

module.exports = app;
