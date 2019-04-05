const {
  role: { hasAuthority },
} = require('../auth');
const { UnauthorizedError } = require('../error');
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