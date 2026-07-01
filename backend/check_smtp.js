require('dotenv').config();
const nodemailer = require('nodemailer');
const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
const smtpUser = process.env.SMTP_EMAIL || process.env.EMAIL_USER || process.env.BREVO_EMAIL || '';
const smtpPass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASS || process.env.BREVO_SMTP_KEY || '';

console.log('process.env SMTP_EMAIL:', process.env.SMTP_EMAIL);
console.log('process.env SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'SET' : 'MISSING');
console.log('SMTP', { smtpHost, smtpPort, smtpUser: smtpUser ? 'SET' : 'MISSING', smtpPass: smtpPass ? 'SET' : 'MISSING' });

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: { user: smtpUser, pass: smtpPass },
});

transporter.verify((err, success) => {
  if (err) {
    console.error('VERIFY ERROR', err && err.message);
    console.error(err);
    process.exit(1);
  }
  console.log('SMTP verified', success);
  process.exit(0);
});
