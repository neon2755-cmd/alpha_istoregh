const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// ── Security & Middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.CLIENT_URL,
      'https://alpha-istoregh.vercel.app',
    ].filter(Boolean);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));// Rate limiting — 1000 req / 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/upload',   require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, message: 'AlphaiStore API is running 🚀' }));

app.get('/api/test-users', async (req, res) => {
  const User = require('./models/User');
  try {
    const users = await User.find({}).select('+password');
    res.json({ count: users.length, users });
  } catch(e) {
    res.json({ error: e.message });
  }
});

app.get('/api/seed', async (req, res) => {
  try {
    const User = require('./models/User');
    const Product = require('./models/Product');
    const productsData = [
      {
        name: 'iPhone 15 Pro Max', brand: 'Apple', condition: 'Brand New',
        basePrice: 9499, comparePrice: 11000, isFeatured: true, isHotDeal: true,
        images: [{ url: 'https://res.cloudinary.com/demo/image/upload/w_400,q_60,f_webp/sample.jpg', public_id: 'sample' }],
        variants: [
          { color: { name: 'Black Titanium', hex: '#1e293b' }, storage: '128GB', price: 9499, stock: 20 },
        ],
        specifications: new Map([['Display', '6.7" Super Retina XDR OLED']]),
        tags: ['iphone', 'apple', '5g', 'flagship'],
      }
    ];

    await Promise.all([User.deleteMany({}), Product.deleteMany({})]);
    
    const admin = await User.create({
      firstName: 'Alpha', lastName: 'Admin',
      email: 'admin@alphaistore.gh',
      password: 'Admin@1234',
      role: 'admin',
    });
    
    await Product.insertMany(productsData);

    res.json({ success: true, message: 'Database seeded successfully via API!', admin_email: admin.email });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});
app.post('/api/test-order', (req, res) => {
  res.json({ success: true, body: req.body });
});
app.post('/api/debug-order', async (req, res) => {
  try {
    const Order = require('./models/Order');
    const order = await Order.create({
      items: [{ product: '6a37b439958901efbd3e0a70', name: 'Test', image: '', price: 9499, quantity: 1 }],
      delivery: { method: 'pickup', address: 'Kumasi Adum', fee: 0 },
      payment: { method: 'cash' },
      guestInfo: { name: 'Test User', email: 'test@test.com', phone: '055' },
      subtotal: 9499,
      total: 9499,
      statusHistory: [{ status: 'pending', note: 'Order placed' }],
    });
    res.json({ success: true, order });
  } catch (err) {
    res.json({ success: false, error: err.message, stack: err.stack });
  }
});
// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ── Database & Start ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
