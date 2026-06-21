const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:     { type: String, trim: true },
  password:  { type: String, select: false },
  role:      { type: String, enum: ['customer', 'admin'], default: 'customer' },
  googleId:  { type: String },
  avatar:    { type: String },
  wishlist:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  addresses: [{
    label:   String,
    region:  String,
    address: String,
    isDefault: { type: Boolean, default: false },
  }],
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
