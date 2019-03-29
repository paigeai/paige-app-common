const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const parser = require('body-parser');
const logger = require('morgan');
const compression = require('compression');
const passport = require('passport');
const auth = require('../auth');
const error = require('../error');

module.exports = (options = {}) => {
  const app = express();

  // @TODO: restrict in production
  app.use(cors());

  // Set security headers
  app.use(helmet());

  // Gzip response
  app.use(compression());

  // Log requests
  app.use(logger('dev'));

  // Parse incoming requests
  app.use(parser.json());

  app.use(
    parser.urlencoded({
      extended: false,
    }),
  );

  // Inject routes
  app.get('/healthz', (req, res) => res.send('ok'));

  if (options.router) {
    app.use(options.router);
  }

  // Initialize passport
  if (options.auth) {
    app.use(passport.initialize());
    auth.passport(passport);
    app.passport = passport;
  }

  // Error handler
  error.middleware(app);

  return app;
};
