const { UnauthorizedError } = require('../../error');
const { hasAuthority, ROLES } = require('../role');
const requireAuth = require('./require-auth');

module.exports = [
  requireAuth,
  (req, res, next) => {
    try {
      if (!hasAuthority(req.user, ROLES.admin)) {
        throw new UnauthorizedError();
      }

      next();
    } catch (e) {
      next(e);
    }
  },
];
