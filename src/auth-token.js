const jwt = require('jsonwebtoken');

const { APP_SECRET } = process.env;

if (!APP_SECRET) {
  throw new Error('environment variable APP_SECRET must be set');
}

/**
 * Generate auth token.
 *
 * @param {Object} user - User object
 */
module.exports = user => {
  const token = jwt.sign(
    {
      id: user.id,
    },
    APP_SECRET,
  );

  return `JWT ${token}`;
};
