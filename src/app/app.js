const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const parser = require('body-parser');
const logger = require('morgan');
const compression = require('compression');
const passport = require('passport');
const os = require('os');
const auth = require('../auth');
const error = require('../error');
const smtpTransport = require('../email');

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

  const {
    roleUtils: { ROLES },
  } = auth;
  const {
    middleware: { hasAuthority },
  } = auth;

  app.get('/healthz', hasAuthority(ROLES.admin), (req, res) => {
    res.sendStatus(200);
  });

  app.get('/status', hasAuthority(ROLES.admin), (req, res) => {
    if (req.query.info) {
      res.send({
        status: 'up',
        node: {
          version: process.version,
          memoryUsage: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'M',
          uptime: process.uptime(),
        },
        system: {
          loadavg: os.loadavg(),
          freeMemory: Math.round(os.freemem() / 1024 / 1024) + 'M',
        },
        env: process.env.NODE_ENV,
        hostname: os.hostname(),
      });
    } else {
      res.send({ status: 'up' });
    }
  });

  if (options.router) {
    app.use(options.router);
  }

  // Initialize passport
  if (options.auth) {
    app.use(passport.initialize());
    auth.passport(passport);
    app.passport = passport;
  }

  // Initialize email
  if (options.email) {
    app.smtpTransport = smtpTransport();
  }

  // Error handler
  error.middleware(app);

  return app;
};
