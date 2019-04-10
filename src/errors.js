class BaseError extends Error {
  constructor(message = 'Something went wrong') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  json() {
    return {
      type: this.type,
      message: this.message,
      errors: this.errors,
      fields: this.fields,
    };
  }
}

class UniqueViolationError extends BaseError {
  constructor(message = 'Unique constraint violation', fields) {
    super(message);
    this.type = 'UniqueConstraintViolation';
    this.responseCode = 409;
    this.fields = fields;
  }
}

class NotFoundError extends BaseError {
  constructor(message = 'Not found') {
    super(message);
    this.type = 'NotFound';
    this.responseCode = 404;
  }
}

class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized') {
    super(message);
    this.type = 'Unauthorized';
    this.responseCode = 401;
  }
}

class BadRequestError extends BaseError {
  constructor(message = 'Bad request', errors) {
    super(message, 400);
    this.type = 'BadRequest';
    this.responseCode = 400;
    this.errors = errors;
  }
}

module.exports = {
  UniqueViolationError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
};
