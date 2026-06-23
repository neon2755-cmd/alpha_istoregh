const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) return done(new Error('No email from Google'));

        let user = await User.findOne({ email });
        if (!user) {
          const [firstName, ...rest] = (profile.displayName || '').split(' ');
          user = await User.create({
            email,
            firstName: firstName || profile.name?.givenName || '',
            lastName: rest.join(' ') || profile.name?.familyName || '',
            password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 12),
            avatar: profile.photos?.[0]?.value || '',
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

module.exports = passport;
