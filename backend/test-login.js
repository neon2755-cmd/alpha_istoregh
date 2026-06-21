require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: 'admin@alphaistore.gh' }).select('+password');
  console.log('User found:', user ? 'Yes' : 'No');
  if (user) {
    const isMatch = await user.comparePassword('Admin@1234');
    console.log('Password match:', isMatch);
  }
  process.exit(0);
}
test();
