import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/reusable/ProtectedRoute';
import AdminRoute from '../components/reusable/AdminRoute';

// Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Payment from '../pages/Payment';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import CustomerProfile from '../pages/CustomerProfile';
import OrderSuccess from '../pages/OrderSuccess';
import OrderHistory from '../pages/OrderHistory';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsConditions from '../pages/TermsConditions';
import NotFound from '../pages/NotFound';

import AdminLayout from '../components/layout/AdminLayout';

// Admin Pages
import AdminLogin from '../pages/admin/AdminLogin';
import AdminSignup from '../pages/admin/AdminSignup';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProfile from '../pages/admin/AdminProfile';
import ManageProducts from '../pages/admin/ManageProducts';
import AddEditProduct from '../pages/admin/AddEditProduct';
import ManageOrders from '../pages/admin/ManageOrders';
import ManageCategories from '../pages/admin/ManageCategories';
import ManageCoupons from '../pages/admin/ManageCoupons';
import ManageAdmins from '../pages/admin/ManageAdmins';
import ManageCustomers from '../pages/admin/ManageCustomers';
import PaymentSettings from '../pages/admin/PaymentSettings';
import ActivityLogs from '../pages/admin/ActivityLogs';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Admin Login & Signup outside Layout */}
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin/signup" element={<AdminSignup />} />

      {/* Admin Protected Sidebar Layout */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/profile" element={<AdminProfile />} />
        <Route path="admin/customers" element={<ManageCustomers />} />
        <Route path="admin/products" element={<ManageProducts />} />
        <Route path="admin/products/new" element={<AddEditProduct />} />
        <Route path="admin/products/edit/:id" element={<AddEditProduct />} />
        <Route path="admin/orders" element={<ManageOrders />} />
        <Route path="admin/categories" element={<ManageCategories />} />
        <Route path="admin/coupons" element={<ManageCoupons />} />
        <Route path="admin/admins" element={<ManageAdmins />} />
        <Route path="admin/payment-settings" element={<PaymentSettings />} />
        <Route path="admin/activity-logs" element={<ActivityLogs />} />
      </Route>

      {/* Public & Customer Layout */}
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-conditions" element={<TermsConditions />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        
        {/* Auth Routes */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* Protected Customer Routes */}
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <CustomerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="account"
          element={
            <ProtectedRoute>
              <CustomerProfile />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
