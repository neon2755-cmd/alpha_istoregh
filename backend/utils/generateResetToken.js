const crypto = require('crypto');

const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const expire = Date.now() + 30 * 60 * 1000; // 30 minutes
  return { token, hashed, expire };
};

module.exports = generateResetToken;
