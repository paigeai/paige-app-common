const { UnauthorizedError } = require('../../error');

module.exports = (req, res, next) => {
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
