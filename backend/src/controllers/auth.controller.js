const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const createSendToken = (user, statusCode, res, message = 'Success') => {
  const token = signToken(user._id);
  user.password = undefined;
  sendResponse(res, { statusCode, message, data: { token, user } });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return next(new ApiError('Email already registered. Please log in.', 400));

    const user = await User.create({ name, email, password });
    createSendToken(user, 201, res, 'Account created successfully');
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(new ApiError('Please provide email and password', 400));

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new ApiError('Incorrect email or password', 401));
    }

    if (!user.isActive) return next(new ApiError('Your account has been deactivated. Contact support.', 403));

    createSendToken(user, 200, res, 'Logged in successfully');
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name slug images price');
    sendResponse(res, { data: user });
  } catch (err) {
    next(err);
  }
};
