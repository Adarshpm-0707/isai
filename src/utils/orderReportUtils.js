/**
 * Utility functions for exporting Orders to Excel (CSV), generating printable PDF Audit Reports,
 * and generating branded Tax Invoices.
 */
import { BRAND_LOGO_BASE64 } from '../assets/brandLogoBase64';

export function exportOrdersToCSV(filteredOrders = [], activeTab = 'all') {
  if (!filteredOrders || filteredOrders.length === 0) {
    alert('No orders available to export.');
    return;
  }

  const headers = [
    'Order ID',
    'Customer Name',
    'Email',
    'Phone',
    'Address',
    'City',
    'State',
    'Pincode',
    'Date',
    'Items Purchased',
    'Total Amount (INR)',
    'Payment Method',
    'Status',
    'Tracking ID',
  ];

  const rows = filteredOrders.map((o) => {
    const cust = o.shipping_address || o.profiles || {};
    const itemsList = (Array.isArray(o.items) ? o.items : [])
      .map((i) => `${i.qty || i.quantity || 1}x ${i.name || i.product?.name || 'Saree'}`)
      .join('; ');

    const cleanStr = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

    return [
      cleanStr(o.id || o.order_id),
      cleanStr(cust.name || 'N/A'),
      cleanStr(cust.email || 'N/A'),
      cleanStr(cust.phone || 'N/A'),
      cleanStr(cust.addressLine1 || cust.street || ''),
      cleanStr(cust.city || ''),
      cleanStr(cust.state || ''),
      cleanStr(cust.pincode || ''),
      cleanStr(new Date(o.created_at || Date.now()).toLocaleDateString('en-IN')),
      cleanStr(itemsList),
      cleanStr(o.total || o.total_amount || 0),
      cleanStr(o.payment_method || 'COD'),
      cleanStr(o.status || 'pending'),
      cleanStr(o.shiprocket_order_id || 'N/A'),
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `isai_orders_report_${activeTab}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printOrdersPdfReport(filteredOrders = [], activeTab = 'all') {
  if (!filteredOrders || filteredOrders.length === 0) {
    alert('No orders available to export.');
    return;
  }

  const printWindow = window.open('', '_blank', 'width=900,height=900');
  if (!printWindow) {
    alert('Please allow popups to download PDF report.');
    return;
  }

  const rowsHTML = filteredOrders
    .map(
      (o, idx) => `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 10px; font-mono; font-size: 11px; color: #4A5568; text-align: center;">${idx + 1}</td>
        <td style="padding: 10px; font-weight: 700; color: #1A202C;">${o.id || o.order_id}</td>
        <td style="padding: 10px; color: #1A202C;">${o.shipping_address?.name || o.profiles?.name || 'Customer'}</td>
        <td style="padding: 10px; color: #4A5568;">${new Date(o.created_at || Date.now()).toLocaleDateString('en-IN')}</td>
        <td style="padding: 10px; font-weight: 700; color: #1A202C;">₹${Number(o.total || o.total_amount || 0).toLocaleString('en-IN')}</td>
        <td style="padding: 10px; text-transform: uppercase; font-size: 10px; font-weight: 700; color: #4A5568;">${o.payment_method || 'COD'}</td>
        <td style="padding: 10px;"><span style="background: #FEF3C7; color: #92400E; padding: 4px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase;">${o.status || 'pending'}</span></td>
      </tr>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Isai Orders PDF Summary - ${activeTab.toUpperCase()}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; padding: 30px; color: #1A202C; }
          .header { border-bottom: 2px solid #D4AF37; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
          .title { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 700; color: #0C2317; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
          th { background: #0C2317; color: #F3E5AB; padding: 10px; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">ISAI TARANG HERITAGE</div>
            <div style="font-size: 12px; color: #B8860B; font-weight: 700; text-transform: uppercase;">Orders & Fulfillments Audit Report (${activeTab.toUpperCase()})</div>
          </div>
          <div style="text-align: right; font-size: 11px; color: #718096;">
            Generated: ${new Date().toLocaleString('en-IN')}<br/>
            Total Record Count: <strong>${filteredOrders.length}</strong>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th style="text-align: left;">Order ID</th>
              <th style="text-align: left;">Customer</th>
              <th style="text-align: left;">Date</th>
              <th style="text-align: left;">Total Amount</th>
              <th style="text-align: left;">Payment</th>
              <th style="text-align: left;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

export function printOrderInvoice(order) {
  if (!order) return;
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    alert('Please allow popups to print/download invoice.');
    return;
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const cust = order.shipping_address || order.profiles || {};
  const total = Number(order.total || order.total_amount || 0);

  const itemsRowsHTML = (
    items.length > 0
      ? items
      : [{ name: 'Handcrafted Heritage Saree', qty: 1, price: total }]
  )
    .map(
      (it, idx) => `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 12px; text-align: center; color: #4A5568;">${idx + 1}</td>
        <td style="padding: 12px; color: #1A202C; font-weight: 600;">${it.name || it.product?.name || 'Handcrafted Saree'}</td>
        <td style="padding: 12px; text-align: center; color: #4A5568;">${it.qty || it.quantity || 1}</td>
        <td style="padding: 12px; text-align: right; color: #4A5568;">₹${Number(it.price || it.product?.price || total).toLocaleString('en-IN')}</td>
        <td style="padding: 12px; text-align: right; color: #1A202C; font-weight: 700;">₹${Number((it.price || it.product?.price || total) * (it.qty || it.quantity || 1)).toLocaleString('en-IN')}</td>
      </tr>
    `
    )
    .join('');

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice - ${order.id || order.order_id}</title>
        <base href="${typeof window !== 'undefined' ? window.location.origin : ''}/">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; color: #1A202C; background-color: #FFFFFF; margin: 0; padding: 40px; }
          .invoice-container { max-width: 800px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 8px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 24px; }
          .brand-logo-container { margin-bottom: 6px; }
          .brand-logo-img { height: 50px; width: auto; max-width: 220px; object-fit: contain; display: block; }
          .brand-sub { font-size: 11px; color: #B8860B; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px; font-weight: 700; }
          .brand-contact-info { font-size: 11px; color: #4A5568; line-height: 1.5; }
          .inv-badge { text-align: right; }
          .inv-title { font-size: 22px; font-weight: 700; color: #0C2317; text-transform: uppercase; letter-spacing: 1px; }
          .meta-table { width: 100%; margin-bottom: 24px; }
          .meta-col { width: 50%; vertical-align: top; }
          .meta-box { background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px; border-radius: 6px; }
          .meta-label { font-size: 10px; text-transform: uppercase; color: #718096; font-weight: 700; letter-spacing: 1px; margin-bottom: 6px; }
          .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 24px; }
          .items-table th { background-color: #0C2317; color: #F3E5AB; padding: 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
          .totals-container { display: flex; justify-content: flex-end; margin-top: 20px; }
          .totals-box { width: 280px; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px; }
          .totals-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; }
          .totals-row.grand { border-top: 2px solid #D4AF37; padding-top: 10px; font-size: 16px; font-weight: 700; color: #0C2317; }
          .footer { margin-top: 40px; border-top: 1px solid #E2E8F0; padding-top: 20px; text-align: center; font-size: 11px; color: #718096; }
          .stamp { display: inline-block; border: 2px dashed #D4AF37; color: #0C2317; padding: 6px 16px; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-top: 12px; }
          @media print { body { padding: 0; } .invoice-container { border: none; box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div>
              <div class="brand-logo-container">
                <img src="${BRAND_LOGO_BASE64}" alt="Isai Tarang" class="brand-logo-img" />
              </div>
              <div class="brand-sub">Handcrafted Heritage Sarees</div>
              <div class="brand-contact-info">
                Divyadeepam, P.O. Pallikkunnu, Kannur 670004, Kerala, India<br/>
                Phone: +91 90488 68444 | Email: isaitarang9@gmail.com
              </div>
            </div>
            <div class="inv-badge">
              <div class="inv-title">TAX INVOICE</div>
              <div style="font-size: 12px; font-weight: 600; color: #4A5568; margin-top: 4px;"># ${order.id || order.order_id}</div>
              <div style="font-size: 11px; color: #718096; margin-top: 2px;">Date: ${new Date(order.created_at || Date.now()).toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          <table class="meta-table">
            <tr>
              <td class="meta-col" style="padding-right: 10px;">
                <div class="meta-box">
                  <div class="meta-label">Billed & Shipped To</div>
                  <div style="font-weight: 700; font-size: 14px; color: #1A202C;">${cust.name || 'Valued Customer'}</div>
                  <div style="font-size: 12px; color: #4A5568; margin-top: 4px;">
                    ${cust.addressLine1 || cust.street || ''} ${cust.addressLine2 || ''}<br/>
                    ${cust.city || ''}, ${cust.state || ''}, ${cust.pincode || ''}<br/>
                    Phone: ${cust.phone || 'N/A'}<br/>
                    Email: ${cust.email || 'N/A'}
                  </div>
                </div>
              </td>
              <td class="meta-col" style="padding-left: 10px;">
                <div class="meta-box">
                  <div class="meta-label">Payment Information</div>
                  <div style="font-size: 13px; font-weight: 700; color: #0C2317;">${order.payment_method || 'COD'}</div>
                  <div style="font-size: 12px; color: #4A5568; margin-top: 4px;">
                    Fulfillment Status: <strong style="color: #2F855A;">${(order.status || 'pending').toUpperCase()}</strong><br/>
                    Invoice Currency: <strong>INR (₹)</strong>
                  </div>
                </div>
              </td>
            </tr>
          </table>

          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 8%;">S.No</th>
                <th style="text-align: left; width: 47%;">Product Description</th>
                <th style="width: 15%;">Qty</th>
                <th style="text-align: right; width: 15%;">Rate (₹)</th>
                <th style="text-align: right; width: 15%;">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRowsHTML}
            </tbody>
          </table>

          <div class="totals-container">
            <div class="totals-box">
              <div class="totals-row">
                <span>Subtotal:</span>
                <span>₹${total.toLocaleString('en-IN')}</span>
              </div>
              <div class="totals-row grand">
                <span>Grand Total:</span>
                <span>₹${total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0 0 6px 0; font-weight: 600; color: #1A202C;">Thank you for shopping with <strong>Isai Tarang Heritage Sarees</strong>.</p>
            <p style="margin: 0 0 12px 0; font-size: 11px; color: #718096; line-height: 1.5;">
              Design Studio & Atelier: Divyadeepam, P.O. Pallikkunnu, Kannur 670004, Kerala, India<br/>
              Phone: +91 90488 68444 &bull; Email: isaitarang9@gmail.com
            </p>
            <div class="stamp">OFFICIAL VERIFIED INVOICE</div>
          </div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(invoiceHTML);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

