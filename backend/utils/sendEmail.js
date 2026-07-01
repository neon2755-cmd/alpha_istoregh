const nodemailer = require('nodemailer');

const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
const smtpUser = process.env.SMTP_EMAIL || process.env.EMAIL_USER || process.env.BREVO_EMAIL || '';
const smtpPass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASS || process.env.BREVO_SMTP_KEY || '';

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  if (!smtpUser || !smtpPass) {
    throw new Error('Email transport is not configured. Set SMTP_EMAIL/SMTP_PASSWORD or EMAIL_USER/EMAIL_PASS in .env.');
  }
  const result = await transporter.sendMail({
    from: `"Alpha iStore" <${smtpUser}>`,
    to,
    subject,
    html,
  });
  console.log('Email sent:', result.messageId);
  return result;
};

module.exports = sendEmail;