const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  console.log('Sending email to:', to, '| API Key set:', !!process.env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: 'Alpha iStore <onboarding@resend.dev>',
    to,
    subject,
    html,
  });
  console.log('Resend result:', JSON.stringify(result));
  return result;
};

module.exports = sendEmail;