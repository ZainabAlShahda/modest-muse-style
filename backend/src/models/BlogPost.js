const mongoose = require('mongoose');
const slugify = require('slugify');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    slug: { type: String, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [String],
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
  },
  { timestamps: true }
);

blogPostSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
