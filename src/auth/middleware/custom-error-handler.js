const errorHandlers = {};

// Map errors thrown by ORM into custom errors

module.exports = err => {
  const handler = errorHandlers[err.name];

  if (handler) {
    handler(err);
  }
};
