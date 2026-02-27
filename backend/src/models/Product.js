const mongoose = require('mongoose');
const slugify = require('slugify');

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  colorHex: String,
  stock: { type: Number, required: true, min: 0, default: 0 },
  sku: { type: String, required: true, unique: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: [true, 'Description is required'] },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [
      {
        url: { type: String, required: true },
        publicId: String,
        alt: String,
      },
    ],
    variants: [variantSchema],
    fabric: String,
    careInstructions: [String],
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    ratingsAverage: { type: Number, default: 0, min: 0, max: 5, set: (val) => Math.round(val * 10) / 10 },
    ratingsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for search and filtering
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isPublished: 1 });
productSchema.index({ price: 1 });
// Note: slug index is already created by unique:true in the field definition above

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Computed: total stock across all variants
productSchema.virtual('totalStock').get(function () {
  return this.variants.reduce((sum, v) => sum + v.stock, 0);
});

module.exports = mongoose.model('Product', productSchema);
