import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-maroon"></div>
      </div>
    );
  }

  if (!user || (role !== 'admin' && role !== 'superadmin')) {
    console.warn('Access denied: Admin role required. Current role:', role);
    return <Navigate to="/" replace />;
  }

  return children;
}
