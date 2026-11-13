import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/fonts.css'
import App from './App.jsx'

// One-time cleanup of legacy demo caches & mock admin data so only live Supabase data is shown
try {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const CLEANUP_KEY = 'isai_db_only_cleaned_v3';
    if (!localStorage.getItem(CLEANUP_KEY)) {
      localStorage.removeItem('isai_store_coupons');
      localStorage.removeItem('isai_admin_logs');
      localStorage.removeItem('isai_tarang_products');
      localStorage.removeItem('isai_orders');
      localStorage.removeItem('isai_deleted_product_ids');
      localStorage.removeItem('isai_deleted_category_ids');
      localStorage.removeItem('isai_deleted_customer_emails');
      localStorage.removeItem('isai_deleted_customer_ids');
      localStorage.removeItem('isai_deleted_customer_names');

      const rawUsers = localStorage.getItem('isai_registered_users');
      if (rawUsers) {
        try {
          const parsed = JSON.parse(rawUsers);
          const filtered = (Array.isArray(parsed) ? parsed : []).filter(
            (u) => u && u.email !== 'admin@isaitarang.com' && u.id !== 'adm_isai_default'
          );
          localStorage.setItem('isai_registered_users', JSON.stringify(filtered));
        } catch {}
      }

      const rawCur = localStorage.getItem('isai_current_user');
      if (rawCur) {
        try {
          const cur = JSON.parse(rawCur);
          if (cur?.email === 'admin@isaitarang.com' || cur?.id === 'adm_isai_default') {
            localStorage.removeItem('isai_current_user');
          }
        } catch {}
      }

      localStorage.setItem(CLEANUP_KEY, 'true');
    }
  }
} catch {}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
