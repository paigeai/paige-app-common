const Redis = require('ioredis');
const logger = require('../logger');

const GLOBAL_CHANNEL = 'global';

module.exports = async ({ url, channels, sub, ...rest }) => {
  const redis = new Redis(url, {
    autoResendUnfulfilledCommands: true,
    autoResubscribe: true,
    ...rest,
  });

  redis.on('ready', () => {
    logger.info('Redis ready to receive commands');
  });

  redis.on('error', () => {
    logger.info('Error connecting to redis, retrying...');
  });

  if (channels) {
    channels.forEach(channel => redis.subscribe(channel));
  }

  if (sub) {
    redis.subscribe(GLOBAL_CHANNEL);
  }

  return redis;
};
