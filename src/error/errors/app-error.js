const BaseError = require('./base-error');

class UniqueViolationError extends BaseError {
  constructor({ message = 'Unique constraint violation', fields }) {
    super(message, 409);
    this.type = 'UniqueViolationError';
    this.fields = fields;
  }
}

class NotFoundError extends BaseError {
  constructor({ message = 'Not found' }) {
    super(message, 404);
    this.type = 'NotFoundError';
  }
}

class UnauthorizedError extends BaseError {
  constructor({ message = 'Unauthorized' }) {
    super(message, 401);
    this.type = 'UnauthorizedError';
  }
}

class BadRequestError extends BaseError {
  constructor({ message = 'Bad request', errors }) {
    super(message, 400);
    this.type = 'BadRequestError';
    this.errors = errors;
  }
}

module.exports = {
  UniqueViolationError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
};
