const os = require('os');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const parser = require('body-parser');
const logger = require('morgan');
const compression = require('compression');
const passport = require('passport');
const auth = require('../auth');
const error = require('../error');
const smtpTransport = require('../email');
const { errorHandler } = require('../middleware');

/**
 * Create and return express app instance.
 *
 * @param {Object} options Configuration options
 * @param {Object} options.extensions Optional modules to add to app instance
 * @param {express.Router} router Additional routes to inject into app
 * @param {Boolean} email Add email capabilities to app
 * @param {Boolean} auth Add authentication capabilities to app
 */
module.exports = options => {
  options = Object.assign(
    {
      extensions: null,
      router: null,
      email: false,
      auth: false,
    },
    options,
  );

  //
  // Initialize app.
  //
  const app = express();

  //
  // @TODO: Restrict in production.
  //
  app.use(cors());

  //
  // Set security headers.
  //
  app.use(helmet());

  //
  // Compress responses.
  //
  app.use(compression());

  //
  // Log requests.
  //
  app.use(logger('dev'));

  //
  // Parse incoming requests.
  //
  app.use(parser.json());

  app.use(
    parser.urlencoded({
      extended: false,
    }),
  );

  //
  // Optionally initialize passport and protected routes.
  //
  if (options.auth) {
    app.use(passport.initialize());
    auth.passport(passport);
    app.passport = passport;

    const {
      auth: {
        role: { ROLES },
      },
    } = auth;
    const {
      middleware: { hasAuthority },
    } = auth;

    //
    // Setup heartbeat route.
    //
    app.get('/healthz', hasAuthority(ROLES.admin), (req, res) => {
      res.sendStatus(200);
    });

    //
    // Setup server status route.
    //
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
  }

  //
  // Optionally inject routes.
  //
  if (options.router) {
    app.use(options.router);
  }

  //
  // Optionally initialize email.
  //
  if (options.email) {
    app.smtpTransport = smtpTransport();
  }

  //
  // Optionally add extensions to app.
  //
  if (options.extensions) {
    Object.keys(options.extensions).forEach(key => {
      app[key] = options.extensions[key];
    });
  }

  //
  // Use global error handler.
  //
  app.use(errorHandler);

  return app;
};
