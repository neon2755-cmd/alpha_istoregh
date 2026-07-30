require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function updateAdmin() {
  const emailArg = process.argv[2];
  const passwordArg = process.argv[3];

  if (!emailArg || !passwordArg) {
    console.error('Usage: node utils/update-admin.js NEW_EMAIL NEW_PASSWORD');
    process.exit(1);
  }

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('ERROR: MONGO_URI or MONGODB_URI is not set in your environment.');
    process.exit(1);
  }

  const normalizedEmail = emailArg.trim().toLowerCase();
  const rounds = Number(process.env.BCRYPT_ROUNDS || 12);
  const hashedPassword = await bcrypt.hash(passwordArg, rounds);

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  const admin = await User.findOneAndUpdate(
    { role: 'admin' },
    {
      $set: {
        email: normalizedEmail,
        password: hashedPassword,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`✅ Admin updated: ${admin.email}`);
  process.exit(0);
}

updateAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
