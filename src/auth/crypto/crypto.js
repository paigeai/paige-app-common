const bcrypt = require('bcryptjs');

const ROUNDS = 10;

/**
 * Hash and salt password using bcrypt (async)
 *
 * @param {String} password Plain text password
 */
const encrypt = password =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(ROUNDS, (error, salt) => {
      bcrypt.hash(password, salt, (err, hash) => (err ? reject(err) : resolve(hash)));
    });
  });

/**
 * Hash and salt password using bcrypt (sync)
 *
 * @param {String} password Plain text password
 */
const encryptSync = password => {
  const salt = bcrypt.genSaltSync(ROUNDS);
  return bcrypt.hashSync(password, salt);
};

/**
 * Compare plain text password to hashed password using bcrypt.
 *
 * @param {String} candidate Plain text password
 * @param {String} password Hashed password
 */
const compare = (candidate, password) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(candidate, password, (err, match) => (err ? reject(err) : resolve(match)));
  });

module.exports = {
  encrypt,
  encryptSync,
  compare,
};
