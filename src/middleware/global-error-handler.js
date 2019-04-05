const customErrorHandler = require('./custom-error-handler');

module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return;
  }

  try {
    customErrorHandler(err);
  } catch (e) {
    err = e;
  }

  const response = err.json ? err.json() : { message: err.message };
  const responseCode = err.code || 500;

  res.status(responseCode).send(response);
};
