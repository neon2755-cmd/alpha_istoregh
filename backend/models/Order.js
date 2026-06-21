const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     String,
  image:    String,
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  variant: {
    color:   String,
    storage: String,
  },
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestInfo: {
    name:      String,
    firstName: String,
    lastName:  String,
    email:     String,
    phone:     String,
  },
  items:        [orderItemSchema],
  delivery: {
    region:  String,
    address: String,
    notes:   String,
    fee:     { type: Number, default: 0 },
    method:  { type: String, enum: ['delivery', 'pickup'], default: 'delivery' },
  },
  payment: {
    method:  { type: String, enum: ['mtn_momo', 'telecel', 'airteltigo', 'card', 'pay_on_delivery', 'whatsapp', 'cash', 'paystack'], default: 'cash' },
    status:  { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    reference: String,
    paidAt:  Date,
  },
  promoCode:   String,
  discount:    { type: Number, default: 0 },
  subtotal:    { type: Number, required: true },
  total:       { type: Number, required: true },
  status:      { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  statusHistory: [{
    status:    String,
    note:      String,
    updatedAt: { type: Date, default: Date.now },
  }],
  notes:       String,
}, { timestamps: true });

// Auto order number
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `AIS-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
