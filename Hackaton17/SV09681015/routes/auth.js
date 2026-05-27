
const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const { isNotAuthenticated } = require("../middleware/auth");

// GET /auth/login - Página de login
router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("login", { title: "Iniciar Sesión" });
});

// GET /auth/google - Inicia el flujo OAuth con Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// GET /auth/google/callback - Callback con logs de diagnóstico
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    successRedirect: "/chat",
  })
);

// GET /auth/logout - Cerrar sesión
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy();
    res.redirect("/auth/login");
  });
});

module.exports = router;