const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  console.log('Sending email to:', to);
  const result = await transporter.sendMail({
    from: `"Alpha iStore" <${process.env.BREVO_EMAIL}>`,
    to,
    subject,
    html,
  });
  console.log('Email sent:', result.messageId);
  return result;
};

module.exports = sendEmail;