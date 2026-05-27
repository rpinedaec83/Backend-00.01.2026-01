// Middleware: protege rutas que requieren autenticación
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // Si no está autenticado, redirigir al login
  res.redirect("/auth/login");
}

// Middleware: si ya está logueado, redirigir al chat
function isNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/chat");
}

module.exports = { isAuthenticated, isNotAuthenticated };
