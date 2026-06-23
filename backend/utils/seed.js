/**
 * Seed script — run: node utils/seed.js
 * Creates an admin user + sample products
 *
 * NOTE: Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file,
 * or pass them as environment variables when running this script.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User    = require('../models/User');
const Product = require('../models/Product');

const products = [
  {
    name: 'iPhone 15 Pro Max', brand: 'Apple', condition: 'Brand New',
    basePrice: 9499, comparePrice: 11000, isFeatured: true, isHotDeal: true,
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/w_400,q_60,f_webp/sample.jpg', public_id: 'sample' }],
    variants: [
      { color: { name: 'Black Titanium', hex: '#1e293b' }, storage: '128GB', price: 9499, stock: 20 },
      { color: { name: 'Black Titanium', hex: '#1e293b' }, storage: '256GB', price: 10499, stock: 15 },
      { color: { name: 'White Titanium', hex: '#f1f5f9' }, storage: '128GB', price: 9499, stock: 10 },
    ],
    specifications: new Map([
      ['Display', '6.7" Super Retina XDR OLED'],
      ['Processor', 'Apple A17 Pro'],
      ['Battery', '4422 mAh'],
      ['5G', 'Yes'],
    ]),
    tags: ['iphone', 'apple', '5g', 'flagship'],
    flashSale: { active: true, endsAt: new Date(Date.now() + 3 * 60 * 60 * 1000), discount: 13 },
  },
  {
    name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', condition: 'Brand New',
    basePrice: 8299, comparePrice: 9500, isFeatured: true, isHotDeal: true,
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/w_400,q_60,f_webp/sample.jpg', public_id: 'sample2' }],
    variants: [
      { color: { name: 'Phantom Black', hex: '#1e293b' }, storage: '256GB', price: 8299, stock: 18 },
      { color: { name: 'Titanium Gray', hex: '#94a3b8' },  storage: '512GB', price: 9499, stock: 8 },
    ],
    specifications: new Map([['Display', '6.8" QHD+ Dynamic AMOLED'], ['Processor', 'Snapdragon 8 Gen 3'], ['Battery', '5000 mAh']]),
    tags: ['samsung', 's-pen', '5g', 'flagship'],
  },
  {
    name: 'Tecno Spark 20 Pro', brand: 'Tecno', condition: 'Brand New',
    basePrice: 1199, comparePrice: 1400, isHotDeal: true,
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/w_400,q_60,f_webp/sample.jpg', public_id: 'sample3' }],
    variants: [
      { color: { name: 'Cyber White', hex: '#f8fafc' }, storage: '128GB', price: 1199, stock: 50 },
      { color: { name: 'Magic Skin', hex: '#fde68a' },  storage: '128GB', price: 1199, stock: 30 },
    ],
    specifications: new Map([['Display', '6.78" FHD+'], ['Battery', '5000 mAh'], ['Camera', '108MP']]),
    tags: ['tecno', 'budget', 'africa'],
  },
  {
    name: 'iPhone 14', brand: 'Apple', condition: 'UK Used',
    basePrice: 5499, comparePrice: 6500, isFeatured: true,
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/w_400,q_60,f_webp/sample.jpg', public_id: 'sample4' }],
    variants: [
      { color: { name: 'Midnight', hex: '#1e293b' }, storage: '128GB', price: 5499, stock: 12 },
      { color: { name: 'Starlight', hex: '#fef3c7' }, storage: '256GB', price: 6299, stock: 6 },
    ],
    specifications: new Map([['Display', '6.1" Super Retina XDR'], ['Processor', 'Apple A15 Bionic'], ['Battery', '3279 mAh']]),
    tags: ['iphone', 'apple', 'uk-used'],
  },
  {
    name: 'Infinix Note 40 Pro', brand: 'Infinix', condition: 'Brand New',
    basePrice: 1899, comparePrice: 2200,
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/w_400,q_60,f_webp/sample.jpg', public_id: 'sample5' }],
    variants: [
      { color: { name: 'Volcanic Black', hex: '#1e293b' }, storage: '256GB', price: 1899, stock: 35 },
    ],
    specifications: new Map([['Display', '6.78" AMOLED'], ['Battery', '5000 mAh + 45W MagCharge']]),
    tags: ['infinix', 'budget', 'magsafe'],
  },
  {
    name: 'Google Pixel 8 Pro', brand: 'Google', condition: 'Brand New',
    basePrice: 6199, isFeatured: true,
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/w_400,q_60,f_webp/sample.jpg', public_id: 'sample6' }],
    variants: [
      { color: { name: 'Obsidian', hex: '#1e293b' }, storage: '128GB', price: 6199, stock: 10 },
      { color: { name: 'Bay', hex: '#60a5fa' }, storage: '256GB', price: 7199, stock: 5 },
    ],
    specifications: new Map([['Display', '6.7" LTPO OLED'], ['Processor', 'Google Tensor G3'], ['AI', 'Gemini Nano on-device']]),
    tags: ['google', 'pixel', 'ai'],
  },
];

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI is not set in .env');
    process.exit(1);
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('ERROR: Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file before seeding.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([User.deleteMany({}), Product.deleteMany({})]);
  console.log('Cleared existing data');

  await User.create({
    firstName: 'Alpha',
    lastName: 'Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
  });
  console.log('✅ Admin created:', adminEmail);

  await Product.insertMany(products);
  console.log(`✅ ${products.length} products seeded`);

  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
