const {
  errors: { UnauthorizedError },
} = require('../../error');

const requireAuth = (req, res, next) => {
  req.app.passport.authenticate('jwt', (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      throw new UnauthorizedError();
    }

    req.user = user;
    next();
  })(req, res, next);
};

module.exports = requireAuth;
