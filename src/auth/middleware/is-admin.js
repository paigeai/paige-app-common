const {
  errors: { UnauthorizedError },
} = require('../../error');
const {
  roleUtils: { hasAuthority, ROLES },
} = require('../utils');
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
