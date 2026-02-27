const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    sendResponse(res, { data: user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, addresses } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar, addresses },
      { new: true, runValidators: true }
    );
    sendResponse(res, { message: 'Profile updated', data: user });
  } catch (err) {
    next(err);
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: req.params.productId } },
      { new: true }
    ).populate('wishlist', 'name slug images price');
    sendResponse(res, { message: 'Added to wishlist', data: user.wishlist });
  } catch (err) {
    next(err);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: req.params.productId } },
      { new: true }
    ).populate('wishlist', 'name slug images price');
    sendResponse(res, { message: 'Removed from wishlist', data: user.wishlist });
  } catch (err) {
    next(err);
  }
};
