/**
 * Email Notification Service for Isai Tarang Sarees
 * Automatically dispatches simultaneous order notifications to:
 * 1. Customer: "Your order successfully placed" + order details
 * 2. Admin: "New order received" + order details + customer details
 */

import { adminLogService } from './adminLogService.js';

const ADMIN_EMAIL_DEFAULT = 'isaitarang9@gmail.com';

/**
 * Helper to format Indian Rupee currency
 */
function formatINR(amount) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN');
}

/**
 * Generate luxury HTML email for Customer order confirmation
 */
export function generateCustomerEmailHtml(order) {
  const orderId = order.order_id || order.id || 'N/A';
  const customerName = order.customer_name || order.shipping_address?.name || 'Valued Patron';
  const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const items = Array.isArray(order.items) ? order.items : [];
  const shipping = order.shipping_address || {};
  const paymentMethodLabel =
    order.payment_method === 'cod' || order.paymentMethod?.toLowerCase().includes('cod')
      ? 'Cash on Delivery (COD)'
      : 'Online Payment (Prepaid)';
  const paymentStatus = order.payment_method === 'cod' ? 'Payment Due upon Delivery' : 'Paid Online (Verified)';

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #332219; font-size: 13px; color: #FFFFFF; font-weight: 600;">
        ${item.name || 'Handcrafted Heritage Saree'}
        ${item.selected_size ? `<div style="font-size: 11px; color: #B39E91; font-weight: normal; margin-top: 3px;">Size: ${item.selected_size}</div>` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #332219; font-size: 13px; color: #DFC18A; text-align: center;">
        ${item.quantity || 1}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #332219; font-size: 13px; color: #FFFFFF; text-align: right; font-weight: bold;">
        ${formatINR(item.price || item.unitPrice || 0)}
      </td>
    </tr>
  `
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Placed Successfully</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #0A0604; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #FDF8F4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0604; padding: 24px 12px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #170F0C; border: 1px solid #3A251C; border-radius: 16px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.8);">
            
            <!-- Royal Header Banner -->
            <tr>
              <td style="background: linear-gradient(135deg, #1F130E 0%, #2A1A13 50%, #1A0F0A 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #DFC18A33;">
                <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 26px; letter-spacing: 3px; color: #DFC18A; text-transform: uppercase;">
                  ISAI TARANG
                </h1>
                <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 2px; color: #C5A265; text-transform: uppercase;">
                  Pure Handloom &bull; Heritage Sarees
                </p>
                <div style="margin-top: 18px; display: inline-block; background-color: #264423; border: 1px solid #488440; padding: 6px 16px; rounded-radius: 20px; border-radius: 20px;">
                  <span style="font-size: 11px; color: #8CE280; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                    ✓ Order Placed Successfully
                  </span>
                </div>
              </td>
            </tr>

            <!-- Greeting & Introduction -->
            <tr>
              <td style="padding: 28px 24px 12px 24px;">
                <h2 style="margin: 0; font-family: 'Georgia', serif; font-size: 19px; color: #FFFFFF;">
                  Namaste, ${customerName}
                </h2>
                <p style="margin: 8px 0 0 0; font-size: 13px; color: #C7B5A7; line-height: 1.6;">
                  Thank you for placing your order with <strong>Isai Tarang</strong>. Our master artisans are now preparing your handloom sarees for dispatch.
                </p>
              </td>
            </tr>

            <!-- Order Key Details Card -->
            <tr>
              <td style="padding: 8px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #110A07; border: 1px solid #2C1A12; border-radius: 12px; padding: 14px 16px;">
                  <tr>
                    <td style="font-size: 12px; color: #8E7B6F;">Order Number:</td>
                    <td style="font-size: 13px; color: #DFC18A; font-weight: bold; text-align: right; font-family: monospace;">
                      #${orderId}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #8E7B6F; padding-top: 6px;">Order Date:</td>
                    <td style="font-size: 12px; color: #FFFFFF; text-align: right; padding-top: 6px;">
                      ${orderDate}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #8E7B6F; padding-top: 6px;">Payment Method:</td>
                    <td style="font-size: 12px; color: #FFFFFF; text-align: right; font-weight: 600; padding-top: 6px;">
                      ${paymentMethodLabel}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #8E7B6F; padding-top: 6px;">Payment Status:</td>
                    <td style="font-size: 12px; color: #8CE280; text-align: right; font-weight: 600; padding-top: 6px;">
                      ${paymentStatus}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Items Purchased Table -->
            <tr>
              <td style="padding: 16px 24px 8px 24px;">
                <h3 style="margin: 0 0 10px 0; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: #DFC18A;">
                  Items In Your Order
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #110A07; border: 1px solid #2C1A12; border-radius: 12px; overflow: hidden;">
                  <thead>
                    <tr style="background-color: #1F130E; border-bottom: 1px solid #3A251C;">
                      <th align="left" style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #DFC18A; letter-spacing: 1px;">Item</th>
                      <th align="center" style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #DFC18A; letter-spacing: 1px;">Qty</th>
                      <th align="right" style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #DFC18A; letter-spacing: 1px;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml || '<tr><td colspan="3" style="padding: 12px; text-align: center; color: #8E7B6F;">Handcrafted Saree Order</td></tr>'}
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- Order Total Breakdown -->
            <tr>
              <td style="padding: 8px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="padding: 12px 14px; background-color: #110A07; border: 1px solid #2C1A12; border-radius: 12px;">
                  <tr>
                    <td style="font-size: 12px; color: #8E7B6F; padding: 4px 0;">Subtotal:</td>
                    <td style="font-size: 12px; color: #FFFFFF; text-align: right; padding: 4px 0;">
                      ${formatINR(order.subtotal || order.total || 0)}
                    </td>
                  </tr>
                  ${
                    Number(order.discount || order.discount_amount || 0) > 0
                      ? `
                  <tr>
                    <td style="font-size: 12px; color: #8CE280; padding: 4px 0;">Discount Applied:</td>
                    <td style="font-size: 12px; color: #8CE280; text-align: right; padding: 4px 0;">
                      -${formatINR(order.discount || order.discount_amount)}
                    </td>
                  </tr>
                  `
                      : ''
                  }
                  <tr>
                    <td style="font-size: 12px; color: #8E7B6F; padding: 4px 0;">Delivery / Shipping:</td>
                    <td style="font-size: 12px; color: #8CE280; text-align: right; padding: 4px 0; font-weight: 600;">
                      FREE Delivery
                    </td>
                  </tr>
                  <tr style="border-top: 1px solid #332219;">
                    <td style="font-size: 14px; color: #FFFFFF; font-weight: bold; padding-top: 8px;">Total Payable:</td>
                    <td style="font-size: 16px; color: #DFC18A; font-weight: bold; text-align: right; padding-top: 8px;">
                      ${formatINR(order.total || order.total_amount || 0)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Delivery Address Card -->
            <tr>
              <td style="padding: 12px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #110A07; border: 1px solid #2C1A12; border-radius: 12px; padding: 14px 16px;">
                  <tr>
                    <td style="font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: #DFC18A; font-weight: bold; padding-bottom: 6px;">
                      📦 Shipping & Delivery Address
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 13px; color: #FFFFFF; font-weight: 600;">
                      ${shipping.name || customerName}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #C7B5A7; line-height: 1.5; padding-top: 4px;">
                      ${shipping.addressLine1 || shipping.street || ''}
                      ${shipping.addressLine2 ? `<br>${shipping.addressLine2}` : ''}
                      ${shipping.city ? `<br>${shipping.city}, ` : ''}${shipping.state || ''} - <strong>${shipping.pincode || ''}</strong>
                    </td>
                  </tr>
                  ${
                    shipping.phone
                      ? `
                  <tr>
                    <td style="font-size: 12px; color: #C7B5A7; padding-top: 6px;">
                      Phone: <span style="color: #FFFFFF; font-weight: 600;">${shipping.phone}</span>
                    </td>
                  </tr>
                  `
                      : ''
                  }
                </table>
              </td>
            </tr>

            <!-- Footer & Contact Support -->
            <tr>
              <td style="padding: 24px; text-align: center; border-top: 1px solid #2C1A12; background-color: #110A07;">
                <p style="margin: 0; font-size: 12px; color: #8E7B6F;">
                  Questions about your order? Reach our studio anytime:
                </p>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: #DFC18A; font-weight: 600;">
                  <a href="mailto:isaitarang9@gmail.com" style="color: #DFC18A; text-decoration: none;">isaitarang9@gmail.com</a>
                </p>
                <p style="margin: 16px 0 0 0; font-size: 10px; color: #6E5F55; text-transform: uppercase; letter-spacing: 1px;">
                  &copy; ${new Date().getFullYear()} Isai Tarang Sarees. Handloom Authenticity Guaranteed.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * Generate luxury HTML email for Admin new order alert
 */
export function generateAdminEmailHtml(order) {
  const orderId = order.order_id || order.id || 'N/A';
  const customerName = order.customer_name || order.shipping_address?.name || 'Customer';
  const customerEmail = order.customer_email || order.shipping_address?.email || 'N/A';
  const customerPhone = order.customer_phone || order.shipping_address?.phone || 'N/A';
  const items = Array.isArray(order.items) ? order.items : [];
  const shipping = order.shipping_address || {};
  const totalAmount = formatINR(order.total || order.total_amount || 0);
  const paymentMethodLabel =
    order.payment_method === 'cod' || order.paymentMethod?.toLowerCase().includes('cod')
      ? 'Cash on Delivery (COD)'
      : 'Prepaid / Online Payment';

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #2A3342; font-size: 13px; color: #FFFFFF; font-weight: 600;">
        ${item.name || 'Saree Product'}
        ${item.selected_size ? `<div style="font-size: 11px; color: #A1A1AA; font-weight: normal;">Variant: ${item.selected_size}</div>` : ''}
      </td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #2A3342; font-size: 13px; color: #D4AF37; text-align: center; font-weight: bold;">
        ${item.quantity || 1}
      </td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #2A3342; font-size: 13px; color: #FFFFFF; text-align: right; font-weight: bold;">
        ${formatINR(item.price || item.unitPrice || 0)}
      </td>
    </tr>
  `
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Received</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #090B10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #F5E6BE;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #090B10; padding: 24px 12px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #0F131C; border: 1px solid #D4AF3755; border-radius: 16px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.9);">
            
            <!-- Admin Alert Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #161B26 0%, #1A2232 100%); padding: 28px 24px; border-bottom: 1px solid #D4AF3733;">
                <div style="font-size: 11px; letter-spacing: 2px; color: #D4AF37; text-transform: uppercase; font-weight: bold;">
                  ADMIN STORE ALERT &bull; ISAI TARANG
                </div>
                <h1 style="margin: 8px 0 0 0; font-size: 22px; color: #FFFFFF; font-weight: bold;">
                  🔔 New Order Received: #${orderId}
                </h1>
                <div style="margin-top: 12px; display: inline-block; background-color: #D4AF371A; border: 1px solid #D4AF3766; padding: 6px 14px; border-radius: 8px;">
                  <span style="font-size: 13px; color: #D4AF37; font-weight: bold;">
                    Order Value: ${totalAmount}
                  </span>
                  <span style="color: #A1A1AA; margin: 0 6px;">&bull;</span>
                  <span style="font-size: 12px; color: #FFFFFF;">
                    ${paymentMethodLabel}
                  </span>
                </div>
              </td>
            </tr>

            <!-- Customer Details Section -->
            <tr>
              <td style="padding: 24px 24px 12px 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: #D4AF37;">
                  👤 Customer Contact & Shipping Details
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0D14; border: 1px solid #222B3D; border-radius: 12px; padding: 14px 16px;">
                  <tr>
                    <td style="font-size: 12px; color: #8F9CAE; padding: 4px 0; width: 130px;">Customer Name:</td>
                    <td style="font-size: 13px; color: #FFFFFF; font-weight: bold; padding: 4px 0;">${customerName}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #8F9CAE; padding: 4px 0;">Customer Email:</td>
                    <td style="font-size: 13px; color: #DFC18A; font-family: monospace; padding: 4px 0;">
                      <a href="mailto:${customerEmail}" style="color: #DFC18A; text-decoration: none;">${customerEmail}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #8F9CAE; padding: 4px 0;">Customer Phone:</td>
                    <td style="font-size: 13px; color: #FFFFFF; font-weight: 600; padding: 4px 0;">
                      <a href="tel:${customerPhone}" style="color: #FFFFFF; text-decoration: none;">${customerPhone}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #8F9CAE; padding: 4px 0; vertical-align: top;">Delivery Address:</td>
                    <td style="font-size: 12px; color: #D1D5DB; line-height: 1.5; padding: 4px 0;">
                      ${shipping.addressLine1 || shipping.street || 'No address specified'}
                      ${shipping.addressLine2 ? `<br>${shipping.addressLine2}` : ''}
                      ${shipping.city ? `<br>${shipping.city}, ` : ''}${shipping.state || ''} - <strong>${shipping.pincode || ''}</strong>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Order Products Breakdown -->
            <tr>
              <td style="padding: 12px 24px;">
                <h3 style="margin: 0 0 10px 0; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: #D4AF37;">
                  📦 Ordered Products (${items.length} items)
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #0A0D14; border: 1px solid #222B3D; border-radius: 12px; overflow: hidden;">
                  <thead>
                    <tr style="background-color: #161B26; border-bottom: 1px solid #2A3342;">
                      <th align="left" style="padding: 8px 12px; font-size: 11px; text-transform: uppercase; color: #D4AF37;">Product</th>
                      <th align="center" style="padding: 8px 12px; font-size: 11px; text-transform: uppercase; color: #D4AF37;">Qty</th>
                      <th align="right" style="padding: 8px 12px; font-size: 11px; text-transform: uppercase; color: #D4AF37;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml || '<tr><td colspan="3" style="padding: 12px; text-align: center; color: #8F9CAE;">Order Item Details</td></tr>'}
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- Action Button -->
            <tr>
              <td style="padding: 18px 24px 28px 24px; text-align: center;">
                <p style="margin: 0 0 14px 0; font-size: 12px; color: #8F9CAE;">
                  Please verify stock and begin packaging for courier dispatch.
                </p>
                <div style="display: inline-block; background-color: #C86A27; color: #FFFFFF; padding: 12px 28px; border-radius: 10px; font-size: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
                  Open Admin Orders Dashboard
                </div>
              </td>
            </tr>

            <!-- Admin Footer -->
            <tr>
              <td style="padding: 16px 24px; text-align: center; border-top: 1px solid #222B3D; background-color: #0A0D14; font-size: 11px; color: #6B7280;">
                Isai Tarang Automated Order Fulfillment Alert System &bull; Received at ${new Date().toLocaleTimeString('en-IN')}
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * Dispatch emails via Resend API (https://resend.com)
 */
async function sendViaResend(apiKey, { to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Isai Tarang Sarees <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || 'Resend API dispatch failed');
  }
  return data;
}

/**
 * Dispatch emails via EmailJS REST API
 */
async function sendViaEmailJS(serviceId, templateId, publicKey, templateParams) {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: templateParams,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'EmailJS dispatch failed');
  }
  return { success: true };
}

/**
 * Dispatch emails via Web3Forms API
 */
async function sendViaWeb3Forms(accessKey, { to, subject, html, order }) {
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      subject: subject,
      to_email: to,
      from_name: 'Isai Tarang Sarees',
      order_id: order.order_id || order.id,
      customer_name: order.customer_name || order.shipping_address?.name,
      total_amount: order.total || order.total_amount,
      message_html: html,
    }),
  });
  return await res.json();
}

/**
 * Dispatch emails via Unified backend server endpoint (/api/send-order-email)
 */
async function sendViaBackendApi(payload) {
  const res = await fetch('/api/send-order-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Backend email returned status ${res.status}`);
  }
  return data;
}

/**
 * MAIN FUNCTION: Dispatches simultaneous emails to both Customer and Admin
 * 1. Customer Email: "Your order successfully placed" + order details
 * 2. Admin Email: "New order received" + order details + customer details
 *
 * @param {Object} order - Full placed order object
 * @returns {Promise<{ success: boolean, customerSent: boolean, adminSent: boolean, details: Object }>}
 */
export async function sendOrderConfirmationEmails(order) {
  if (!order) return { success: false, error: 'No order data provided' };

  const customerEmail =
    order.customer_email ||
    order.shipping_address?.email ||
    order.profiles?.email ||
    order.email;

  const adminEmail =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_EMAIL) ||
    ADMIN_EMAIL_DEFAULT;

  const orderId = order.order_id || order.id || 'N/A';
  const customerSubject = `Order Placed Successfully! Your Isai Tarang Order #${orderId}`;
  const adminSubject = `🔔 New Order Received: #${orderId} - ${formatINR(order.total || order.total_amount || 0)}`;

  const customerHtml = generateCustomerEmailHtml(order);
  const adminHtml = generateAdminEmailHtml(order);

  const resendApiKey =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RESEND_API_KEY) || '';
  const emailjsServiceId =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EMAILJS_SERVICE_ID) || '';
  const emailjsPublicKey =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EMAILJS_PUBLIC_KEY) || '';
  const emailjsCustTemplate =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EMAILJS_TEMPLATE_CUSTOMER_ID) || '';
  const emailjsAdminTemplate =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EMAILJS_TEMPLATE_ADMIN_ID) || '';
  const web3FormsKey =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WEB3FORMS_ACCESS_KEY) || '';

  const results = {
    customerSent: false,
    adminSent: false,
    customerEmail,
    adminEmail,
    orderId,
    timestamp: new Date().toISOString(),
  };

  // ── 1. SEND CUSTOMER EMAIL ──
  if (customerEmail && customerEmail.includes('@')) {
    try {
      if (resendApiKey) {
        await sendViaResend(resendApiKey, {
          to: customerEmail,
          subject: customerSubject,
          html: customerHtml,
        });
        results.customerSent = true;
      } else if (emailjsServiceId && emailjsPublicKey && emailjsCustTemplate) {
        await sendViaEmailJS(emailjsServiceId, emailjsCustTemplate, emailjsPublicKey, {
          to_email: customerEmail,
          customer_name: order.customer_name || order.shipping_address?.name,
          order_id: orderId,
          total_amount: formatINR(order.total || order.total_amount || 0),
          html_content: customerHtml,
        });
        results.customerSent = true;
      } else if (web3FormsKey) {
        await sendViaWeb3Forms(web3FormsKey, {
          to: customerEmail,
          subject: customerSubject,
          html: customerHtml,
          order,
        });
        results.customerSent = true;
      } else {
        // Try backend endpoint
        try {
          const backendRes = await sendViaBackendApi({
            type: 'customer_order_placed',
            to: customerEmail,
            subject: customerSubject,
            html: customerHtml,
            order,
          });
          if (backendRes && backendRes.success) {
            results.customerSent = true;
            results.customerProvider = backendRes.provider;
          } else {
            results.customerSent = false;
            results.customerSimulated = true;
            results.customerNotice = backendRes?.warning || 'Pending email service credentials in .env';
          }
        } catch (apiErr) {
          results.customerSent = false;
          results.customerError = apiErr.message;
        }
      }
    } catch (custErr) {
      console.warn('[EmailService] Customer email dispatch notice:', custErr.message);
    }
  }

  // ── 2. SEND ADMIN EMAIL ──
  if (adminEmail && adminEmail.includes('@')) {
    try {
      if (resendApiKey) {
        await sendViaResend(resendApiKey, {
          to: adminEmail,
          subject: adminSubject,
          html: adminHtml,
        });
        results.adminSent = true;
      } else if (emailjsServiceId && emailjsPublicKey && emailjsAdminTemplate) {
        await sendViaEmailJS(emailjsServiceId, emailjsAdminTemplate, emailjsPublicKey, {
          to_email: adminEmail,
          customer_name: order.customer_name || order.shipping_address?.name,
          customer_email: customerEmail,
          customer_phone: order.customer_phone || order.shipping_address?.phone,
          order_id: orderId,
          total_amount: formatINR(order.total || order.total_amount || 0),
          html_content: adminHtml,
        });
        results.adminSent = true;
      } else if (web3FormsKey) {
        await sendViaWeb3Forms(web3FormsKey, {
          to: adminEmail,
          subject: adminSubject,
          html: adminHtml,
          order,
        });
        results.adminSent = true;
      } else {
        // Try backend endpoint
        try {
          const backendRes = await sendViaBackendApi({
            type: 'admin_new_order_alert',
            to: adminEmail,
            subject: adminSubject,
            html: adminHtml,
            order,
          });
          if (backendRes && backendRes.success) {
            results.adminSent = true;
            results.adminProvider = backendRes.provider;
          } else {
            results.adminSent = false;
            results.adminSimulated = true;
            results.adminNotice = backendRes?.warning || 'Pending email service credentials in .env';
          }
        } catch (apiErr) {
          results.adminSent = false;
          results.adminError = apiErr.message;
        }
      }
    } catch (admErr) {
      console.warn('[EmailService] Admin email dispatch notice:', admErr.message);
    }
  }

  // Record dispatch log in localStorage and admin activity logs
  try {
    if (typeof localStorage !== 'undefined') {
      const logs = JSON.parse(localStorage.getItem('isai_email_dispatch_log') || '[]');
      logs.unshift(results);
      if (logs.length > 50) logs.pop();
      localStorage.setItem('isai_email_dispatch_log', JSON.stringify(logs));
    }
  } catch {}

  try {
    adminLogService
      .logAction('ORDER_NOTIFICATIONS_DISPATCHED', 'orders', orderId, {
        customer_email: customerEmail,
        admin_email: adminEmail,
        customer_sent: results.customerSent,
        admin_sent: results.adminSent,
      })
      .catch(() => {});
  } catch {}

  console.log(
    `%c[EmailNotificationService] Simultaneous Emails Dispatched:
  ✉️ Customer (${customerEmail}): ${results.customerSent ? 'SENT' : 'FAILED'}
  🔔 Admin (${adminEmail}): ${results.adminSent ? 'SENT' : 'FAILED'}
  Order: #${orderId}`,
    'color: #DFC18A; font-weight: bold;'
  );

  return results;
}
