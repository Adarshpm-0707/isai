import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // Instant local check fallback
  const getIsAdmin = () => {
    if (role === 'admin' || role === 'superadmin') return true;
    if (user && (user.role === 'admin' || user.email?.toLowerCase().includes('admin'))) return true;
    try {
      const local = JSON.parse(localStorage.getItem('isai_current_user') || 'null');
      if (local && (local.role === 'admin' || local.email?.toLowerCase().includes('admin'))) {
        return true;
      }
    } catch {}
    return false;
  };

  const isAdmin = getIsAdmin();

  if (loading && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#120B09] text-[#FDF8F4] space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#D4AF37]"></div>
        <p className="text-xs uppercase tracking-widest text-[#DFC18A] font-medium">Verifying Admin Access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
