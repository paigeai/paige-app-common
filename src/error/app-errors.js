const BaseError = require('./base-error');

class UniqueViolationError extends BaseError {
  constructor(message = 'Unique constraint violation', fields) {
    super(message);
    this.type = 'UniqueViolationError';
    this.code = 409;
    this.fields = fields;
  }
}

class NotFoundError extends BaseError {
  constructor(message = 'Not found') {
    super(message);
    this.type = 'NotFoundError';
    this.code = 404;
  }
}

class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized') {
    super(message);
    this.type = 'UnauthorizedError';
    this.code = 401;
  }
}

class BadRequestError extends BaseError {
  constructor(message = 'Bad request', errors) {
    super(message, 400);
    this.type = 'BadRequestError';
    this.code = 400;
    this.errors = errors;
  }
}

module.exports = {
  UniqueViolationError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
};
