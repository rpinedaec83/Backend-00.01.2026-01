function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    res.status(401).json({ error: 'Debes iniciar sesión con OAuth para continuar' });
    return;
  }
  next();
}

module.exports = { ensureAuthenticated };
