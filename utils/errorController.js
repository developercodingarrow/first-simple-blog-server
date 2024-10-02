const AppError = require("./appError");

const handelValidationErrorDB = (err) => {
  // Extract all validation error messages from the nested `errors` object
  const errors = Object.values(err.errors).map((el) => `${el.message}`);
  const message = `${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  console.log("sendErrorDev -- errorController");
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // stack: err.stack,
    error: err,
  });
};

const sendErrorProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message, // Ensure this is sent correctly
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went very wrong...!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  if (process.env.NODE_ENV == "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    if (err.name === "ValidationError") {
      error = handelValidationErrorDB(err);
    }
    sendErrorProduction(error, res);
  }
};
