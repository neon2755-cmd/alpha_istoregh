const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  label: { type: String, required: true },
  number: { type: String, required: true },
});

const deliverySchema = new mongoose.Schema({
  location: { type: String, required: true },
  price: { type: Number, required: true },
});

const configSchema = new mongoose.Schema(
  {
    branding: {
      logoUrl: { type: String, default: '' },
      faviconUrl: { type: String, default: '' },
    },
    hero: {
      image: { type: String, default: '' },
      heading: { type: String, default: '' },
      subtitle: { type: String, default: '' },
    },
    promo: {
      image: { type: String, default: '' },
      text: { type: String, default: '' },
    },
    contact: {
      whatsapp: [contactSchema],
      googleMapIframe: { type: String, default: '' },
      address: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    delivery: [deliverySchema],
  },
  { timestamps: true }
);

const Config = mongoose.model('Config', configSchema);
module.exports = Config;
