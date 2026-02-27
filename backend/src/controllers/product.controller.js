const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');
const { paginate, paginateMeta } = require('../utils/pagination');

exports.getProducts = async (req, res, next) => {
  try {
    const { category, size, color, minPrice, maxPrice, search, sort, page = 1, limit = 12, featured } = req.query;

    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };
    if (size) filter['variants.size'] = size;
    if (color) filter['variants.color'] = { $regex: color, $options: 'i' };

    const sortMap = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'newest': { createdAt: -1 },
      'rating': { ratingsAverage: -1 },
      'name-asc': { name: 1 },
    };
    const sortObj = sortMap[sort] || { createdAt: -1 };

    const { skip, limit: lim, page: pageNum } = paginate(null, page, limit);
    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug').sort(sortObj).skip(skip).limit(lim).lean(),
      Product.countDocuments(filter),
    ]);

    sendResponse(res, {
      data: products,
      meta: paginateMeta(total, pageNum, lim),
    });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isPublished: true })
      .populate('category', 'name slug')
      .populate({ path: 'reviews', populate: { path: 'user', select: 'name avatar' } });
    if (!product) return next(new ApiError('Product not found', 404));
    sendResponse(res, { data: product });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    sendResponse(res, { statusCode: 201, message: 'Product created', data: product });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return next(new ApiError('Product not found', 404));
    sendResponse(res, { message: 'Product updated', data: product });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ slug: req.params.slug });
    if (!product) return next(new ApiError('Product not found', 404));
    sendResponse(res, { message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};
