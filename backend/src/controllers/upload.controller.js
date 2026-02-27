const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return next(new ApiError('No file uploaded', 400));

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'modest-muse-style', quality: 'auto', fetch_format: 'auto' },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    sendResponse(res, {
      statusCode: 201,
      message: 'Image uploaded',
      data: { url: result.secure_url, publicId: result.public_id },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return next(new ApiError('Public ID is required', 400));
    await cloudinary.uploader.destroy(publicId);
    sendResponse(res, { message: 'Image deleted' });
  } catch (err) {
    next(err);
  }
};
