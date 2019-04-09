const { BadRequestError, UnauthorizedError } = require('./errors');

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

const validateRequest = config => (req, res, next) => {
  try {
    const errors = [];
    const params = Object.keys(config);

    for (let i = 0; i < params.length; ++i) {
      const paramName = params[i];
      const paramConfig = config[paramName];
      let paramValue = req.query[paramName];

      if (paramValue === undefined) {
        if (paramConfig.required === true && paramConfig.defaultValue === undefined) {
          errors.push(`query parameter '${paramName}' is required`);
          continue;
        } else {
          paramValue = paramConfig.defaultValue;
        }
      }

      // run validation function if provided
      if (paramConfig.validate && paramConfig.validate(paramValue) === false) {
        errors.push(`invalid value '${paramValue}' for query parameter '${paramName}'`);
      }
    }

    if (errors.length > 0) {
      throw new BadRequestError('Invalid query parameters', errors);
    }

    next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  optionalAuth,
  requireAuth,
  requireLogin,
  validateRequest,
};
