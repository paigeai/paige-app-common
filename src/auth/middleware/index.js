const requireLogin = require('./require-login');
const requireAuth = require('./require-auth');
const hasAuthority = require('./has-authority');
const optionalAuth = require('./optional-auth');

module.exports = {
  requireLogin,
  requireAuth,
  hasAuthority,
  optionalAuth,
};
