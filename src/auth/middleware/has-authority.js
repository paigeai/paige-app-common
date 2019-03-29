const {
  errors: { UnauthorizedError },
} = require('../../error');
const {
  roleUtils: { hasAuthority },
} = require('../utils');

module.exports = role => (req, res, next) => {
  try {
    if (!hasAuthority(req.user, role)) {
      throw new UnauthorizedError();
    }

    next();
  } catch (e) {
    next(e);
  }
};
