import nodemailer from 'nodemailer';

/**
 * Serverless API handler: /api/send-order-email
 * Receives order notification requests and dispatches emails via Gmail SMTP (Nodemailer) or Resend
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { to, subject, html, type, order } = req.body || {};

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required email fields (to, subject, html)' });
    }

    const gmailUser = process.env.GMAIL_USER || 'isaitarang9@gmail.com';
    const gmailAppPassword =
      process.env.GMAIL_APP_PASSWORD ||
      process.env.VITE_GMAIL_APP_PASSWORD ||
      process.env.SMTP_PASS;
    const resendApiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;

    // 1. Gmail SMTP with Nodemailer
    if (gmailAppPassword) {
      const cleanPass = String(gmailAppPassword).replace(/\s+/g, '');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: cleanPass,
        },
      });

      const info = await transporter.sendMail({
        from: `"Isai Tarang Sarees" <${gmailUser}>`,
        to: to,
        subject: subject,
        html: html,
      });

      return res.status(200).json({ success: true, provider: 'gmail_smtp', messageId: info.messageId });
    }

    // 2. Resend API
    if (resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Isai Tarang Sarees <onboarding@resend.dev>',
          to: [to],
          subject,
          html,
        }),
      });

      const result = await response.json();
      return res.status(200).json({ success: true, provider: 'resend', result });
    }

    // Default warning when credentials are not configured
    console.warn(`[API send-order-email] Warning: No email credentials found in environment. Order #${order?.order_id || order?.id}`);
    return res.status(200).json({
      success: false,
      simulated: true,
      warning: 'No email delivery credentials configured (GMAIL_APP_PASSWORD or RESEND_API_KEY).',
      recipient: to,
    });
  } catch (error) {
    console.error('[API send-order-email] Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

