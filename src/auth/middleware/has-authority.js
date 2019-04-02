const {
  errors: { UnauthorizedError },
} = require('../../error');
const {
  roleUtils: { hasAuthority },
} = require('../utils');
const requireAuth = require('./require-auth');

module.exports = role => [
  requireAuth,
  (req, res, next) => {
    try {
      if (!hasAuthority(req.user, role)) {
        throw new UnauthorizedError();
      }

      next();
    } catch (e) {
      next(e);
    }
  },
];
