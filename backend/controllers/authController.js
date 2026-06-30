const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendWelcomeEmail } = require('../utils/mailer');
const sendEmail = require('../utils/sendEmail');
const generateResetToken = require('../utils/generateResetToken');
const { generateToken, setTokenCookie } = require('../middleware/auth');

const sendAuth = (res, user, statusCode = 200) => {
  const token = generateToken(user._id);
  setTokenCookie(res, token);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ firstName, lastName, email, phone, password });
    sendAuth(res, user, 201);
    
    // Send welcome email to customer
    try {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to Alpha iStore!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
            <h2 style="color: #006989; margin-bottom: 4px;">Alpha iStore</h2>
            <h3 style="color: #0f172a;">Welcome, ${user.firstName}!</h3>
            <p style="color: #475569; line-height: 1.6;">Thank you for creating an account with Alpha iStore. You can now shop the latest phones, track your orders, and enjoy a faster checkout experience.</p>
            <a href="${process.env.CLIENT_URL || 'https://alphaistore.com'}/shop" style="display: inline-block; margin: 20px 0; padding: 12px 28px; background: #006989; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold;">Start Shopping</a>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">Alpha iStore · Adum P.Z, Kumasi, Ghana</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Welcome email failed:', emailErr.message);
    }
    
    // Send admin notification
    try {
      if (process.env.ADMIN_EMAIL) {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: 'New Customer Registered',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
              <h2 style="color: #006989; margin-bottom: 4px;">Alpha iStore</h2>
              <h3 style="color: #0f172a;">New Customer Signed Up</h3>
              <p style="color: #475569;"><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
              <p style="color: #475569;"><strong>Email:</strong> ${user.email}</p>
              <p style="color: #475569;"><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">Registered on ${new Date().toLocaleString()}</p>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error('Admin notification email failed:', emailErr.message);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const start = Date.now();
    // DB lookup
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    const afterFind = Date.now();
    console.info(`[auth] login lookup for ${email} took ${afterFind - start}ms`);

    // Password compare
    let passwordMatch = false;
    if (user && user.comparePassword) {
      const cmpStart = Date.now();
      passwordMatch = await user.comparePassword(password);
      const cmpEnd = Date.now();
      console.info(`[auth] password compare for ${email} took ${cmpEnd - cmpStart}ms`);
    }

    if (!user || !passwordMatch) {
      console.info(`[auth] login failed for ${email} (userFound=${!!user}, match=${passwordMatch})`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Send login alert email
    try {
      await sendEmail({
        to: user.email,
        subject: 'New Sign-In to Your Alpha iStore Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
            <h2 style="color: #006989; margin-bottom: 4px;">Alpha iStore</h2>
            <h3 style="color: #0f172a;">New Sign-In Detected</h3>
            <p style="color: #475569; line-height: 1.6;">Hi ${user.firstName || ''}, your Alpha iStore account was just signed into.</p>
            <p style="color: #64748b; font-size: 13px;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p style="color: #64748b; font-size: 13px;">If this wasn't you, please reset your password immediately.</p>
            <a href="${process.env.CLIENT_URL || 'https://alphaistore.com'}/auth/forgot-password" style="display: inline-block; margin: 16px 0; padding: 10px 24px; background: #ef4444; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">Reset Password</a>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">Alpha iStore · Adum P.Z, Kumasi, Ghana</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Login alert email failed:', emailErr.message);
    }

    sendAuth(res, user);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// PUT /api/auth/me
exports.updateMe = async (req, res) => {
  try {
    const { firstName, lastName, phone, email } = req.body;
    const updateData = { firstName, lastName, phone };
    if (email) updateData.email = email.toLowerCase();
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword)))
      return res.status(400).json({ success: false, message: 'Current password incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/auth/wishlist/:productId
exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pid = req.params.productId;
    const idx = user.wishlist.indexOf(pid);
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
    } else {
      user.wishlist.push(pid);
    }
    await user.save();
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'No account with that email' });

    const { token, hashed, expire } = generateResetToken();
    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = expire;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}&email=${email}`;

    await sendEmail({
      to: email,
      subject: 'Reset your Alpha iStore password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
          <h2 style="color: #006989; margin-bottom: 8px;">Alpha iStore</h2>
          <h3 style="color: #0f172a;">Password Reset Request</h3>
          <p style="color: #475569;">Click the button below to reset your password. This link expires in 30 minutes.</p>
          <a href="${resetUrl}" style="display: inline-block; margin: 24px 0; padding: 12px 28px; background: #006989; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold;">Reset Password</a>
          <p style="color: #94a3b8; font-size: 12px;">If you did not request this, ignore this email.</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (err) {
    console.error('FORGOT PASSWORD ERROR:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body;
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};