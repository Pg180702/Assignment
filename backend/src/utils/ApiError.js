class ApiError extends Error {
  //want to make our own constructor
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    //overwrite karenge ab constructor ko to obviously super hoga hi call
    super(message);
    this.statusCode = statusCode;
    this.data = null; //read about this
    this.message = message;
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
