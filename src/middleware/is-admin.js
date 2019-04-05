const {
  role: { hasAuthority, ROLES },
} = require('../auth');
const { UnauthorizedError } = require('../error');
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
