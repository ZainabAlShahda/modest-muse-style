const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('subcategories', 'name slug image')
      .sort({ order: 1, name: 1 })
      .lean();
    sendResponse(res, { data: categories });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    sendResponse(res, { statusCode: 201, message: 'Category created', data: category });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return next(new ApiError('Category not found', 404));
    sendResponse(res, { message: 'Category updated', data: category });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return next(new ApiError('Category not found', 404));
    sendResponse(res, { message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
