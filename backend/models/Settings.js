const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  storeName:    { type: String, default: 'AlphaiStore' },
  logo:         { url: String, public_id: String },
  favicon:      { url: String, public_id: String },
  hero: {
    title:    { type: String, default: "The Best Phones, Delivered to You." },
    subtitle: { type: String, default: "Shop the latest iPhones, Samsung, Tecno and more." },
    image:    { url: String, public_id: String },
  },
  contact: {
    whatsapp: { type: [String], default: ['+233000000000'] },
    phones:   [String],
    email:    String,
    address:  String,
    googleMapEmbedUrl: String,
  },
  social: {
    facebook:  String,
    instagram: String,
    twitter:   String,
    tiktok:    String,
  },
  delivery: {
    locations: [{
      region: String,
      fee:    Number,
    }],
  },
  payment: {
    mtnMomo:     { type: Boolean, default: true },
    telecel:     { type: Boolean, default: true },
    airteltigo:  { type: Boolean, default: false },
    card:        { type: Boolean, default: false },
    payOnDelivery: { type: Boolean, default: true },
  },
  promoBanners: [{
    title:    String,
    subtitle: String,
    cta:      String,
    color:    String,
    pattern:  { type: String, enum: ['none', 'dots', 'waves', 'grid', 'lines', 'zigzag', 'cross', 'diamonds'], default: 'none' },
    image:    { url: String, public_id: String },
    link:     String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
