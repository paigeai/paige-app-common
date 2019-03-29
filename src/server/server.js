/* eslint-disable no-process-exit */
const http = require('http');
const os = require('os');
const cluster = require('cluster');
const logger = require('../logger');

const { PORT } = process.env;

cluster.on('fork', worker => {
  logger.info(`Forked new worker with id ${worker.id}`);
});

const fork = () => {
  for (let i = 0; i < os.cpus().length; ++i) {
    cluster.fork();
  }

  cluster.on('exit', worker => {
    if (!worker.exitedAfterDisconnect) {
      logger.error(`Worker has died: ${worker.process.pid}`);

      cluster.fork();
    }
  });
};

const start = async ({ app }) => {
  const server = http.createServer(app);

  server.listen(PORT, () => {
    process.on('SIGINT', () => {
      stop();
    });

    process.on('SIGTERM', () => {
      stop();
    });

    logger.info(`Server listening on ${PORT}`);
  });
};

const stop = async () => {
  try {
    logger.info('Stopping server gracefully');

    process.exit(0);
  } catch (e) {
    logger.error(`Error stopping server: ${e.message}`);

    process.exit(1);
  }
};

const init = options => {
  if (cluster.isMaster) {
    logger.info('Creating workers');
    fork();
  } else {
    start(options);
  }
};

module.exports = init;
