class BaseError extends Error {
  constructor(message = 'Something went wrong', code = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }

  json() {
    return {
      message: this.message,
      code: this.code,
      errors: this.errors,
      type: this.type,
      fields: this.fields,
    };
  }
}

module.exports = BaseError;
