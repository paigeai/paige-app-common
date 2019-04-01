/* eslint-disable no-process-exit */
const http = require('http');
const os = require('os');
const cluster = require('cluster');
const logger = require('../logger');

const { PORT } = process.env;

const start = async options => {
  const { port } = process.env;
  const { app, beforeStart, afterStart } = options;

  const server = http.createServer(app);

  if (beforeStart) {
    await Promise.resolve(beforeStart(server));
  }

  server.listen(port, async () => {
    process.on('SIGINT', () => {
      stop(options);
    });

    process.on('SIGTERM', () => {
      stop(options);
    });

    logger.info(`Server listening on ${port}`);

    if (afterStart) {
      await Promise.resolve(afterStart(server));
    }
  });
};

const stop = async options => {
  const { beforeStop } = options;

  try {
    logger.info('Stopping server gracefully');

    if (beforeStop) {
      await Promise.resolve(beforeStop());
    }

    process.exit(0);
  } catch (e) {
    logger.error(`Error stopping server: ${e.message}`);

    process.exit(1);
  }
};

const init = options => {
  const pidToPort = {};

  if (cluster.isMaster) {
    logger.info('Creating workers');

    cluster.on('exit', worker => {
      if (!worker.exitedAfterDisconnect) {
        logger.error(`Worker has died: ${worker.process.pid}`);
        logger.info('Spawning new worker');

        // Get the port that is now missing and create new worker
        // with that port. Also, delete old pidToPort mapping and
        // add the new one.
        const port = pidToPort[worker.process.pid];
        delete pidToPort[worker.process.pid];

        const newWorker = cluster.fork({ port });
        pidToPort[newWorker.process.pid] = port;
      }
    });

    cluster.on('fork', worker => {
      logger.info(`Forked new worker with pid ${worker.process.pid}`);
    });

    for (let i = 0; i < os.cpus().length; ++i) {
      const port = Number.parseInt(PORT, 10) + i;
      const worker = cluster.fork({ port });
      pidToPort[worker.process.pid] = port;
    }
  } else {
    start(options);
  }
};

module.exports = init;
