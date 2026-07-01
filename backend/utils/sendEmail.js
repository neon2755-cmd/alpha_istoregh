const nodemailer = require('nodemailer');

const smtpHost = process.env.BREVO_EMAIL ? 'smtp-relay.brevo.com' : (process.env.SMTP_HOST || 'smtp.gmail.com');
const smtpPort = process.env.BREVO_EMAIL ? 587 : parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.BREVO_EMAIL || process.env.SMTP_EMAIL || '';
const smtpPass = process.env.BREVO_SMTP_KEY || process.env.SMTP_PASSWORD || '';

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: false,
  family: 4,
  auth: { user: smtpUser, pass: smtpPass },
});

const sendEmail = async ({ to, subject, html }) => {
  if (!smtpUser || !smtpPass) {
    throw new Error('Email not configured.');
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