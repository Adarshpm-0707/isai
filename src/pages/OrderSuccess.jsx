import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, Printer, ShoppingBag, ClipboardList, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoldLine } from '../components/layout/OnamEffects';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const autoTriggeredRef = useRef(false);

  const orderState = location.state || {};
  const orderId = orderState.orderId;
  const totalAmount = orderState.totalAmount || 0;
  const items = orderState.items || [];
  const shippingAddress = orderState.shippingAddress || {};
  const paymentMethod = orderState.paymentMethod || 'Cash on Delivery / Direct Order';
  const orderDate = orderState.date || new Date().toLocaleDateString('en-IN');

  useEffect(() => {
    if (!orderId) {
      navigate('/', { replace: true });
    }
  }, [orderId, navigate]);

  // Function to generate and print/download the Tax Invoice PDF
  const handleDownloadInvoice = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Please allow popups to download/print your Invoice.');
      return;
    }

    const itemsRowsHTML = (items.length > 0 ? items : [{ name: 'Handcrafted Heritage Saree', qty: 1, price: totalAmount }])
      .map(
        (it, idx) => `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 12px; text-align: center; color: #4A5568;">${idx + 1}</td>
          <td style="padding: 12px; color: #1A202C; font-weight: 600;">${it.name || it.product?.name || 'Handcrafted Saree'}</td>
          <td style="padding: 12px; text-align: center; color: #4A5568;">${it.qty || it.quantity || 1}</td>
          <td style="padding: 12px; text-align: right; color: #4A5568;">₹${Number(it.price || it.product?.price || totalAmount).toLocaleString('en-IN')}</td>
          <td style="padding: 12px; text-align: right; color: #1A202C; font-weight: 700;">₹${Number((it.price || it.product?.price || totalAmount) * (it.qty || it.quantity || 1)).toLocaleString('en-IN')}</td>
        </tr>
      `
      )
      .join('');

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${orderId}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #1A202C;
              background-color: #FFFFFF;
              margin: 0;
              padding: 40px;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #E2E8F0;
              border-radius: 8px;
              padding: 32px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #D4AF37;
              padding-bottom: 20px;
              margin-bottom: 24px;
            }
            .brand-title {
              font-family: 'Cinzel', serif;
              font-size: 26px;
              font-weight: 700;
              color: #0C2317;
              margin: 0;
              letter-spacing: 1px;
            }
            .brand-sub {
              font-size: 11px;
              color: #B8860B;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin-top: 4px;
              font-weight: 700;
            }
            .inv-badge {
              text-align: right;
            }
            .inv-title {
              font-size: 22px;
              font-weight: 700;
              color: #0C2317;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .meta-table {
              width: 100%;
              margin-bottom: 24px;
            }
            .meta-col {
              width: 50%;
              vertical-align: top;
            }
            .meta-box {
              background-color: #F8FAFC;
              border: 1px solid #E2E8F0;
              padding: 16px;
              border-radius: 6px;
            }
            .meta-label {
              font-size: 10px;
              text-transform: uppercase;
              color: #718096;
              font-weight: 700;
              letter-spacing: 1px;
              margin-bottom: 6px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              margin-bottom: 24px;
            }
            .items-table th {
              background-color: #0C2317;
              color: #F3E5AB;
              padding: 12px;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .totals-container {
              display: flex;
              justify-content: flex-end;
              margin-top: 20px;
            }
            .totals-box {
              width: 280px;
              background-color: #F8FAFC;
              border: 1px solid #E2E8F0;
              border-radius: 6px;
              padding: 16px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              font-size: 12px;
            }
            .totals-row.grand {
              border-top: 2px solid #D4AF37;
              padding-top: 10px;
              font-size: 16px;
              font-weight: 700;
              color: #0C2317;
            }
            .footer {
              margin-top: 40px;
              border-top: 1px solid #E2E8F0;
              padding-top: 20px;
              text-align: center;
              font-size: 11px;
              color: #718096;
            }
            .stamp {
              display: inline-block;
              border: 2px dashed #D4AF37;
              color: #0C2317;
              padding: 6px 16px;
              font-weight: 700;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-top: 12px;
            }
            @media print {
              body { padding: 0; }
              .invoice-container { border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div>
                <h1 class="brand-title">ISAI TARANG</h1>
                <div class="brand-sub">Handcrafted Heritage Sarees</div>
                <div style="font-size: 11px; color: #4A5568; margin-top: 8px;">
                  GSTIN: 33AAAAA0000A1Z5 | Reg: Kanchipuram, TN<br/>
                  Phone: +91 90488 68444 | Email: support@isaitarang.com
                </div>
              </div>
              <div class="inv-badge">
                <div class="inv-title">TAX INVOICE</div>
                <div style="font-size: 12px; font-weight: 600; color: #4A5568; margin-top: 4px;"># ${orderId}</div>
                <div style="font-size: 11px; color: #718096; margin-top: 2px;">Date: ${orderDate}</div>
              </div>
            </div>

            <table class="meta-table">
              <tr>
                <td class="meta-col" style="padding-right: 10px;">
                  <div class="meta-box">
                    <div class="meta-label">Billed & Shipped To</div>
                    <div style="font-weight: 700; font-size: 14px; color: #1A202C;">${shippingAddress.name || 'Valued Customer'}</div>
                    <div style="font-size: 12px; color: #4A5568; margin-top: 4px;">
                      ${shippingAddress.addressLine1 || ''} ${shippingAddress.addressLine2 || ''}<br/>
                      ${shippingAddress.city || ''}, ${shippingAddress.state || ''} - ${shippingAddress.pincode || ''}<br/>
                      Phone: ${shippingAddress.phone || 'N/A'}<br/>
                      Email: ${shippingAddress.email || 'N/A'}
                    </div>
                  </div>
                </td>
                <td class="meta-col" style="padding-left: 10px;">
                  <div class="meta-box">
                    <div class="meta-label">Payment Information</div>
                    <div style="font-size: 13px; font-weight: 700; color: #0C2317;">${paymentMethod}</div>
                    <div style="font-size: 12px; color: #4A5568; margin-top: 4px;">
                      Fulfillment Status: <strong style="color: #2F855A;">CONFIRMED / PENDING SHIPMENT</strong><br/>
                      Invoice Currency: <strong>INR (₹)</strong><br/>
                      Place of Supply: <strong>India</strong>
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
                  <span>₹${Number(totalAmount).toLocaleString('en-IN')}</span>
                </div>
                <div class="totals-row">
                  <span>Shipping & Delivery:</span>
                  <span style="color: #2F855A; font-weight: 600;">FREE</span>
                </div>
                <div class="totals-row grand">
                  <span>Grand Total:</span>
                  <span>₹${Number(totalAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for shopping with <strong>Isai Tarang Heritage Sarees</strong>. This is a computer-generated tax invoice.</p>
              <div class="stamp">OFFICIAL VERIFIED BILL</div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();

    // Trigger Print / PDF Save
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Automatically trigger invoice generation on page load once
  useEffect(() => {
    if (orderId && !autoTriggeredRef.current) {
      autoTriggeredRef.current = true;
      const timer = setTimeout(() => {
        handleDownloadInvoice();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [orderId]);

  if (!orderId) return null;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative"
      style={{ background: 'linear-gradient(180deg,#0C2317 0%,#1A3C2B 50%,#0C2317 100%)' }}
    >
      <div className="absolute top-0 left-0 right-0">
        <GoldLine />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md space-y-6 relative z-10 text-center"
      >
        {/* Check icon */}
        <div className="flex justify-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl relative"
            style={{ background: 'linear-gradient(135deg,#1A3C2B,#0C2317)', border: '2px solid #D4AF37' }}
          >
            <CheckCircle2 className="w-10 h-10 relative z-10" style={{ color: '#D4AF37' }} />
          </motion.div>
        </div>

        <div className="space-y-1">
          <span className="text-[#B8860B] text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase block">
            TRANSACTION SUCCESSFUL
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-wide uppercase text-[#F3E5AB]">
            ORDER CONFIRMED
          </h1>
        </div>

        <p className="text-sm text-[#EADFC9]/85 max-w-sm mx-auto">
          Your order has been placed. Your official invoice bill has been generated automatically below.
        </p>

        {/* Automatic Invoice Bill Card */}
        <div
          className="rounded-2xl p-6 space-y-4 shadow-2xl text-left"
          style={{
            background: 'linear-gradient(135deg,rgba(26,60,43,0.95),rgba(12,35,23,0.98))',
            border: '1.5px solid rgba(212,175,55,0.4)',
          }}
        >
          <div className="pb-3 border-b flex items-center justify-between" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#F3E5AB] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D4AF37]" /> Official Invoice Summary
            </h3>
            <span className="text-[10px] text-[#D4AF37] font-bold uppercase bg-[#D4AF37]/15 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
              Tax Invoice
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#EADFC9]/70">Invoice / Order Code</span>
              <span className="font-mono text-[#D4AF37] font-bold">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#EADFC9]/70">Customer Name</span>
              <span className="text-[#F3E5AB] font-bold">{shippingAddress.name || 'Valued Customer'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#EADFC9]/70">Date &amp; Time</span>
              <span className="text-[#EADFC9] font-medium">{orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#EADFC9]/70">Payment Mode</span>
              <span className="text-[#EADFC9] font-bold">{paymentMethod}</span>
            </div>
            <div className="flex justify-between border-t pt-2" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
              <span className="text-[#F3E5AB] font-bold text-sm">Grand Total</span>
              <span className="text-[#D4AF37] font-bold text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Download / Print Invoice Button */}
          <button
            onClick={handleDownloadInvoice}
            className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8860B)', color: '#0C2317' }}
          >
            <Download size={15} /> Download / Print Official Invoice Bill
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 py-3 border rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-[#F3E5AB] flex items-center justify-center gap-2 cursor-pointer"
            style={{ borderColor: 'rgba(212,175,55,0.4)', background: 'rgba(12,35,23,0.8)' }}
          >
            <ClipboardList size={14} /> My Orders
          </button>
          <button
            onClick={() => navigate('/products')}
            className="flex-1 py-3 border rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-[#F3E5AB] hover:bg-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer"
            style={{ borderColor: 'rgba(212,175,55,0.4)', background: 'rgba(26,60,43,0.6)' }}
          >
            <ShoppingBag size={14} /> Continue Shopping
          </button>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0">
        <GoldLine />
      </div>
    </div>
  );
}
