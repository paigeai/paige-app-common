const optionalAuth = (req, res, next) => {
  req.app.passport.authenticate('jwt', (err, user) => {
    if (err) {
      return next(err);
    }

    req.authenticated = !!user;
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = optionalAuth;
