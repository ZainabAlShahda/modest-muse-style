const BlogPost = require('../models/BlogPost');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');
const { paginate, paginateMeta } = require('../utils/pagination');

exports.getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 9, tag } = req.query;
    const filter = { isPublished: true };
    if (tag) filter.tags = tag;

    const { skip, limit: lim, page: pageNum } = paginate(null, page, limit);
    const [posts, total] = await Promise.all([
      BlogPost.find(filter).populate('author', 'name avatar').sort({ publishedAt: -1 }).skip(skip).limit(lim).lean(),
      BlogPost.countDocuments(filter),
    ]);
    sendResponse(res, { data: posts, meta: paginateMeta(total, pageNum, lim) });
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true }).populate('author', 'name avatar');
    if (!post) return next(new ApiError('Blog post not found', 404));
    sendResponse(res, { data: post });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const post = await BlogPost.create({ ...req.body, author: req.user._id });
    sendResponse(res, { statusCode: 201, message: 'Blog post created', data: post });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true, runValidators: true });
    if (!post) return next(new ApiError('Blog post not found', 404));
    sendResponse(res, { message: 'Blog post updated', data: post });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findOneAndDelete({ slug: req.params.slug });
    if (!post) return next(new ApiError('Blog post not found', 404));
    sendResponse(res, { message: 'Blog post deleted' });
  } catch (err) {
    next(err);
  }
};
