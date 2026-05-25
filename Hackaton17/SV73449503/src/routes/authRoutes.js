const { Router } = require("express");

function buildAuthRoutes(passport, oauthEnabled) {
  const router = Router();

  router.get("/me", (req, res) => {
    res.json({
      authenticated: req.isAuthenticated(),
      user: req.user || null,
      oauthEnabled,
    });
  });

  router.post("/logout", (req, res, next) => {
    req.logout((error) => {
      if (error) {
        return next(error);
      }

      req.session.destroy(() => {
        res.status(204).send();
      });
    });
  });

  router.get("/google", (req, res, next) => {
    if (!oauthEnabled) {
      return res.redirect("/");
    }

    return passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next,
    );
  });

  router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/",
      session: true,
    }),
    (_req, res) => {
      res.redirect("/");
    },
  );

  return router;
}

module.exports = { buildAuthRoutes };
