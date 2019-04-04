const requireLogin = require('./require-login');
const requireAuth = require('./require-auth');
const hasAuthority = require('./has-authority');
const isAdmin = require('./is-admin');
const optionalAuth = require('./optional-auth');
const errorHandler = require('./global-error-handler');

module.exports = {
  requireLogin,
  requireAuth,
  hasAuthority,
  isAdmin,
  optionalAuth,
  errorHandler,
};
