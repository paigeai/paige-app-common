const validator = require('validator');

/**
 * Normalize an email address.
 *
 * @param {String} email - Email to normalize
 */
const normalizeEmail = email =>
  validator.normalizeEmail(email, {
    all_lowercase: true,
  });

module.exports = {
  normalizeEmail,
};
