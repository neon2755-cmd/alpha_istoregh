const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  color:    { name: String, hex: String },
  storage:  String,
  price:    { type: Number, required: true },
  stock:    { type: Number, default: 0 },
  sku:      String,
});

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    String,
  rating:  { type: Number, min: 1, max: 5, required: true },
  comment: String,
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, unique: true },
  brand:       { type: String, required: true },
  category:    { type: String, default: 'Smartphone' },
  condition:   { type: String, enum: ['Brand New', 'UK Used', 'Ghana Used'], default: 'Brand New' },
  description: String,
  images:      [{ url: String, public_id: String }],
  variants:    [variantSchema],
  basePrice:   { type: Number, required: true },
  comparePrice: Number,
  specifications: { type: Map, of: String },
  tags:        [String],
  isActive:    { type: Boolean, default: true },
  isFeatured:  { type: Boolean, default: false },
  isHotDeal:   { type: Boolean, default: false },
  flashSale: {
    active:    { type: Boolean, default: false },
    endsAt:    Date,
    discount:  Number, // percentage
  },
  reviews:     [reviewSchema],
  rating:      { type: Number, default: 0 },
  numReviews:  { type: Number, default: 0 },
  totalSold:   { type: Number, default: 0 },
}, { timestamps: true });

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

// Recalculate rating
productSchema.methods.recalcRating = function () {
  if (!this.reviews.length) { this.rating = 0; this.numReviews = 0; return; }
  this.numReviews = this.reviews.length;
  this.rating = this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.numReviews;
};

module.exports = mongoose.model('Product', productSchema);
