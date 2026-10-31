import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, ShoppingBag, ClipboardList, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import BrandLogo from '../components/reusable/BrandLogo';
import { FloralOrnament } from '../components/reusable/FloralOrnament';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleDownloadInvoice = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Please allow popups to download or print your Invoice.');
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
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap');
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
              border-bottom: 2px solid #C86A27;
              padding-bottom: 20px;
              margin-bottom: 24px;
            }
            .brand-title {
              font-family: 'Playfair Display', serif;
              font-size: 26px;
              font-weight: 700;
              color: #120B09;
              margin: 0;
            }
            .brand-subtitle {
              font-size: 10px;
              letter-spacing: 2px;
              text-transform: uppercase;
              color: #C86A27;
              margin-top: 4px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background: #1E130F;
              color: #DFC18A;
              padding: 10px;
              text-transform: uppercase;
              font-size: 11px;
              letter-spacing: 1px;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div>
                <h1 class="brand-title">ISAITARANG</h1>
                <div class="brand-subtitle">DRAPED STORIES</div>
                <p style="font-size: 11px; color: #718096; margin-top: 8px;">
                  Pallikkunnu, Kannur, Kerala 670004<br>
                  Email: isaitarang9@gmail.com | Phone: +91 9048868444
                </p>
              </div>
              <div style="text-align: right;">
                <h2 style="font-size: 18px; color: #C86A27; margin: 0;">TAX INVOICE</h2>
                <p style="font-size: 12px; color: #718096; margin: 4px 0 0 0;"><strong>Order ID:</strong> ${orderId}</p>
                <p style="font-size: 12px; color: #718096; margin: 2px 0 0 0;"><strong>Date:</strong> ${orderDate}</p>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th style="text-align: left;">Saree Item</th>
                  <th>Qty</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRowsHTML}
              </tbody>
            </table>
            <div style="margin-top: 24px; text-align: right;">
              <p style="font-size: 16px; font-weight: 700; color: #120B09;">Grand Total: ₹${totalAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-[#120B09] flex flex-col items-center justify-center px-4 py-16 text-[#FDF8F4]">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-6 text-center"
      >
        {/* Brand Logo */}
        <div className="flex justify-center">
          <BrandLogo size="lg" />
        </div>

        {/* Checkmark icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#1E130F] border-2 border-[#DFC18A] flex items-center justify-center shadow-2xl">
            <CheckCircle2 className="w-10 h-10 text-[#C86A27]" />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[#DFC18A] text-xs font-semibold tracking-[0.28em] uppercase">
            Order Confirmed
          </p>
          <h1
            className="font-serif text-3xl sm:text-4xl text-[#FDF8F4]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            Thank You for Your Order
          </h1>
          <FloralOrnament className="mt-1" />
        </div>

        <p className="text-xs sm:text-sm text-[#C7B5A7] font-light max-w-sm mx-auto">
          Your order has been recorded in our weaving queue. Your official tax invoice has been generated below.
        </p>

        {/* Invoice Summary Card */}
        <div className="bg-[#1E130F] border border-[#35221B] rounded-2xl p-6 space-y-4 text-left shadow-2xl">
          <div className="pb-3 border-b border-[#2C1C16] flex items-center justify-between">
            <h3 className="font-serif text-sm font-semibold text-[#FDF8F4] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#DFC18A]" /> Invoice Summary
            </h3>
            <span className="text-[10px] text-[#DFC18A] uppercase font-bold bg-[#160E0B] px-2.5 py-0.5 rounded-full border border-[#35221B]">
              Tax Invoice
            </span>
          </div>

          <div className="space-y-2 text-xs text-[#C7B5A7]">
            <div className="flex justify-between">
              <span>Order Reference</span>
              <span className="font-mono text-[#DFC18A] font-semibold">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer</span>
              <span className="text-[#FDF8F4]">{shippingAddress.name || 'Valued Patron'}</span>
            </div>
            <div className="flex justify-between">
              <span>Date</span>
              <span>{orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode</span>
              <span className="text-[#FDF8F4]">{paymentMethod}</span>
            </div>
            <div className="flex justify-between border-t border-[#2C1C16] pt-2 font-bold text-sm text-[#FDF8F4]">
              <span>Total Paid</span>
              <span className="text-[#DFC18A] text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownloadInvoice}
            className="w-full py-3 rounded-full bg-[#C86A27] hover:bg-[#DB7B32] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg"
          >
            <Download size={14} /> Download Tax Invoice Bill
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 py-3 rounded-full border border-[#35221B] bg-[#1E130F] text-xs font-semibold uppercase tracking-wider text-[#C7B5A7] hover:text-[#FDF8F4] hover:border-[#DFC18A] transition-all flex items-center justify-center gap-2"
          >
            <ClipboardList size={14} /> View My Orders
          </button>
          <button
            onClick={() => navigate('/products')}
            className="flex-1 py-3 rounded-full bg-[#160E0B] border border-[#DFC18A]/40 text-xs font-semibold uppercase tracking-wider text-[#DFC18A] hover:bg-[#DFC18A]/10 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} /> Continue Shopping
          </button>
        </div>
      </motion.div>
    </div>
  );
}
