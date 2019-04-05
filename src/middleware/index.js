const validateQuery = require('./validate-query');
const errorHandler = require('./global-error-handler');
const requireLogin = require('./require-login');
const requireAuth = require('./require-auth');
const hasAuthority = require('./has-authority');
const isAdmin = require('./is-admin');
const optionalAuth = require('./optional-auth');

module.exports = {
  validateQuery,
  errorHandler,
  requireLogin,
  requireAuth,
  hasAuthority,
  isAdmin,
  optionalAuth,
};
