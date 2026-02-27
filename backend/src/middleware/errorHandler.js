const ApiError = require('../utils/ApiError');

const handleCastError = (err) => new ApiError(`Invalid ${err.path}: ${err.value}`, 400);
const handleDuplicateKey = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new ApiError(`Duplicate value for field: ${field}. Please use another value.`, 400);
};
const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new ApiError(`Validation failed: ${messages.join('. ')}`, 400);
};
const handleJWTError = () => new ApiError('Invalid token. Please log in again.', 401);
const handleJWTExpired = () => new ApiError('Your token has expired. Please log in again.', 401);

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR:', err);
  }

  // Mongoose errors
  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKey(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpired();

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Something went wrong. Please try again later.';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
