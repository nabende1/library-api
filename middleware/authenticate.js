const ensureAuthEnabled = (req, res, next) => {
  if (req.app.locals.authEnabled) {
    return next();
  }

  return res.status(503).json({ error: 'OAuth is not configured on this server' });
};

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ error: 'Authentication required' });
};

module.exports = {
  ensureAuthEnabled,
  ensureAuthenticated
};
