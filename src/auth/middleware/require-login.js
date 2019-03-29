const {
  errors: { UnauthorizedError },
} = require('../../error');

const requireLogin = (req, res, next) => {
  req.app.passport.authenticate('local', (err, user) => {
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

module.exports = requireLogin;
