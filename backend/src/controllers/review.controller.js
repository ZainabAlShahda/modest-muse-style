const Review = require('../models/Review');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');

exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    sendResponse(res, { data: reviews });
  } catch (err) {
    next(err);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const { rating, title, body } = req.body;
    const review = await Review.create({
      product: req.params.productId,
      user: req.user._id,
      rating,
      title,
      body,
    });
    sendResponse(res, { statusCode: 201, message: 'Review submitted', data: review });
  } catch (err) {
    if (err.code === 11000) return next(new ApiError('You have already reviewed this product', 400));
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new ApiError('Review not found', 404));
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError('Access denied', 403));
    }
    await review.deleteOne();
    sendResponse(res, { message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};
