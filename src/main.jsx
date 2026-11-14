import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/fonts.css'
import './styles/splitText.css'
import App from './App.jsx'

class RootErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Root error boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#120B09] text-[#FDF8F4] flex flex-col items-center justify-center p-6 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#DFC18A] mb-3">
            ISAI TARANG
          </h1>
          <p className="text-sm text-[#C7B5A7] max-w-md mb-6 leading-relaxed">
            We encountered a temporary display issue. Please reload the page to refresh the boutique gallery.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-full bg-[#C86A27] hover:bg-[#DB7B32] text-white font-medium text-xs tracking-wider uppercase transition-colors shadow-lg cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
)
