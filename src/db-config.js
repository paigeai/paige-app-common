const pg = require('pg');

const { NODE_ENV, DATABASE_URL, DB_POOL_MIN = 2, DB_POOL_MAX = 10 } = process.env;

if (!DATABASE_URL) {
  throw new Error('environment variable DATABASE_URL must be set');
}

pg.defaults.ssl = NODE_ENV === 'production';

module.exports = {
  client: 'pg',
  connection: DATABASE_URL,
  pool: {
    min: DB_POOL_MIN,
    max: DB_POOL_MAX,
  },
};
