/**
 * Email Delivery Diagnostic & Test Tool for Isai Tarang
 * Run this command from terminal: node test-email.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
const envPath = path.resolve(__dirname, '.env');
const env = {};
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq > 0) {
      const k = trimmed.slice(0, eq).trim();
      const v = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      env[k] = v;
    }
  }
}

const adminEmail = env.VITE_ADMIN_EMAIL || env.GMAIL_USER || 'isaitarang9@gmail.com';
const gmailUser = env.GMAIL_USER || adminEmail;
const gmailPass = (env.GMAIL_APP_PASSWORD || env.VITE_GMAIL_APP_PASSWORD || env.SMTP_PASS || '').replace(/\s+/g, '');
const resendKey = env.RESEND_API_KEY || env.VITE_RESEND_API_KEY || '';
const web3FormsKey = env.VITE_WEB3FORMS_ACCESS_KEY || '';

console.log('\n======================================================');
console.log('       ISAI TARANG EMAIL SYSTEM DIAGNOSTIC');
console.log('======================================================\n');
console.log(`Admin / Sender Email: ${adminEmail}`);
console.log(`Gmail App Password:   ${gmailPass ? 'Configured (****' + gmailPass.slice(-4) + ')' : 'MISSING (Not set in .env)'}`);
console.log(`Resend API Key:       ${resendKey ? 'Configured (re_****)' : 'MISSING (Not set in .env)'}`);
console.log(`Web3Forms Access Key: ${web3FormsKey ? 'Configured' : 'MISSING (Not set in .env)'}`);
console.log('------------------------------------------------------\n');

async function testGmailSmtp() {
  if (!gmailPass) {
    console.log('ℹ️  Gmail App Password is not set yet in .env.');
    return false;
  }

  console.log(`🚀 Attempting test email via Gmail SMTP to ${adminEmail}...`);
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Isai Tarang Sarees" <${gmailUser}>`,
      to: adminEmail,
      subject: '✨ Test Order Notification - Isai Tarang Sarees',
      html: `
        <div style="font-family: sans-serif; background: #120B09; color: #FDF8F4; padding: 24px; border-radius: 12px;">
          <h2 style="color: #DFC18A; margin: 0 0 12px 0;">Isai Tarang Email Delivery Verified!</h2>
          <p>This is a live test email confirming that your email delivery system is working successfully.</p>
          <div style="background: #1E130F; border: 1px solid #35221B; padding: 16px; border-radius: 8px; margin-top: 16px;">
            <p style="margin: 0; color: #4ADE80; font-weight: bold;">Status: Live & Connected</p>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #C7B5A7;">Both customer and admin order emails will now be delivered automatically upon checkout.</p>
          </div>
        </div>
      `,
    });

    console.log(`\n✅ SUCCESS! Email delivered to ${adminEmail}!`);
    console.log(`   Message ID: ${info.messageId}\n`);
    return true;
  } catch (err) {
    console.error(`\n❌ Gmail SMTP Error:`, err.message);
    if (err.message.includes('Invalid login') || err.message.includes('535-5.7.8')) {
      console.log('\n💡 Tip: Google requires a 16-character "App Password", not your normal Gmail login password.');
      console.log('   Go to: https://myaccount.google.com/apppasswords');
      console.log('   Generate an App Password for "Isai Tarang" and put it in .env as GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx\n');
    }
    return false;
  }
}

async function testResend() {
  if (!resendKey) return false;

  console.log(`🚀 Attempting test email via Resend to ${adminEmail}...`);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Isai Tarang Sarees <onboarding@resend.dev>',
        to: [adminEmail],
        subject: '✨ Test Order Notification (Resend) - Isai Tarang Sarees',
        html: '<h2>Isai Tarang Email Delivery Verified!</h2><p>Resend delivery is working.</p>',
      }),
    });
    const data = await res.json();
    if (data.id) {
      console.log(`\n✅ SUCCESS! Resend email dispatched (ID: ${data.id})\n`);
      return true;
    } else {
      console.error(`\n❌ Resend Error:`, data);
      return false;
    }
  } catch (err) {
    console.error(`\n❌ Resend Network Error:`, err.message);
    return false;
  }
}

async function main() {
  if (gmailPass) {
    const ok = await testGmailSmtp();
    if (ok) return;
  }

  if (resendKey) {
    const ok = await testResend();
    if (ok) return;
  }

  if (!gmailPass && !resendKey && !web3FormsKey) {
    console.log('⚠️  NO EMAIL CREDENTIALS ARE CURRENTLY SET IN .env');
    console.log('   Because no credentials are set, real emails cannot be transmitted over the internet.\n');
    console.log('👉 HOW TO FIX IN 60 SECONDS (FREE, RECOMMENDED):');
    console.log('   1. Open Google Account: https://myaccount.google.com/security');
    console.log('   2. Ensure 2-Step Verification is ON');
    console.log('   3. Go to: https://myaccount.google.com/apppasswords');
    console.log('   4. Create an App password (name: "Isai Tarang") -> copy the 16 letters');
    console.log('   5. In your .env file, add:');
    console.log('      GMAIL_USER=isaitarang9@gmail.com');
    console.log('      GMAIL_APP_PASSWORD=your_16_letter_password');
    console.log('\n   Then run: node test-email.js\n');
  }
}

main().catch(console.error);

