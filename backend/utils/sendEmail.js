const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_KEY;
  const fromEmail = process.env.BREVO_EMAIL || process.env.SMTP_EMAIL || 'neon2755@gmail.com';

  if (!apiKey) {
    throw new Error('BREVO_API_KEY not configured');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Alpha iStore', email: fromEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to send email via Brevo API');
  }

  console.log('Email sent via Brevo API:', data.messageId);
  return data;
};

module.exports = sendEmail;