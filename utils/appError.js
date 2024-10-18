class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "Fails" : "Error";
    this.isOperational = true;
    // capture stack trase
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
