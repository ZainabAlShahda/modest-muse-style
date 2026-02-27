const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError('You are not logged in. Please log in to access this resource.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('+passwordChangedAt');
    if (!user) {
      return next(new ApiError('The user belonging to this token no longer exists.', 401));
    }

    if (user.changedPasswordAfter(decoded.iat)) {
      return next(new ApiError('User recently changed password. Please log in again.', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ApiError('Invalid or expired token.', 401));
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};

module.exports = { protect, restrictTo };
