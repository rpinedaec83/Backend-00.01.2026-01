const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require("../config/passport");
const authMiddleware = require("../middleware/auth.middleware");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );
}

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/google/failure",
  }),
  (req, res) => {
    const token = generateToken(req.user);

    return res.send(`
      <h2>Login con Google correcto</h2>
      <p>Copia este token para probar la API:</p>
      <textarea style="width: 90%; height: 120px;">${token}</textarea>
    `);
  }
);

router.get("/google/failure", (req, res) => {
  return res.status(401).json({
    message: "Error al iniciar sesión con Google",
  });
});

router.get("/me", authMiddleware, (req, res) => {
  return res.json({
    user: req.user,
  });
});

module.exports = router;
