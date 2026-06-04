const express = require("express");
const passport = require("../config/passport");

const router = express.Router();

// GET /auth/login — Página de inicio de sesión
router.get("/login", (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/chat");
  res.render("login");
});

// GET /auth/google — Iniciar flujo OAuth con Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// GET /auth/google/callback — Google redirige aquí tras autenticar
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    successRedirect: "/chat",
  })
);

// GET /auth/logout — Cerrar sesión
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect("/auth/login");
    });
  });
});

module.exports = router;
