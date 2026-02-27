const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
    title: { type: String, trim: true },
    body: { type: String, required: [true, 'Review body is required'], trim: true },
    isVerifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Update product ratings after review save/delete
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', nRating: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      ratingsAverage: stats[0].avgRating,
      ratingsCount: stats[0].nRating,
    });
  } else {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsCount: 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.product);
});

reviewSchema.post('remove', function () {
  this.constructor.calcAverageRatings(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
