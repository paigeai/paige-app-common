class BaseError extends Error {
  constructor(message = 'Something went wrong') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  json() {
    return {
      type: this.type,
      code: this.code,
      message: this.message,
      errors: this.errors,
      fields: this.fields,
    };
  }
}

module.exports = BaseError;
