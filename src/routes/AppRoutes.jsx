import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/reusable/ProtectedRoute';
import AdminRoute from '../components/reusable/AdminRoute';
import AdminLayout from '../components/layout/AdminLayout';
import Loader from '../components/reusable/Loader';

// Direct core public pages for fast initial load
import Home from '../pages/Home';
import Products from '../pages/Products';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';

// Lazy loaded detailed and secondary pages
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const FAQ = lazy(() => import('../pages/FAQ'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('../pages/TermsConditions'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Payment = lazy(() => import('../pages/Payment'));
const OrderSuccess = lazy(() => import('../pages/OrderSuccess'));
const OrderHistory = lazy(() => import('../pages/OrderHistory'));
const CustomerProfile = lazy(() => import('../pages/CustomerProfile'));
const Wishlist = lazy(() => import('../pages/Wishlist'));
const BoutiqueRailPage = lazy(() => import('../pages/BoutiqueRailPage'));

// Lazy loaded admin portal pages
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const AdminSignup = lazy(() => import('../pages/admin/AdminSignup'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile'));
const ManageProducts = lazy(() => import('../pages/admin/ManageProducts'));
const AddEditProduct = lazy(() => import('../pages/admin/AddEditProduct'));
const ManageOrders = lazy(() => import('../pages/admin/ManageOrders'));
const ManageCategories = lazy(() => import('../pages/admin/ManageCategories'));
const ManageCustomers = lazy(() => import('../pages/admin/ManageCustomers'));
const ManageInventory = lazy(() => import('../pages/admin/ManageInventory'));
const ProfitLoss = lazy(() => import('../pages/admin/ProfitLoss'));
const PaymentSettings = lazy(() => import('../pages/admin/PaymentSettings'));
const ActivityLogs = lazy(() => import('../pages/admin/ActivityLogs'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader fullPage />}>
      <Routes>
        {/* Admin Login & Signup outside Layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        {/* Admin Protected Sidebar Layout */}
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/customers" element={<ManageCustomers />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/products/new" element={<AddEditProduct />} />
          <Route path="/admin/products/edit/:id" element={<AddEditProduct />} />
          <Route path="/admin/orders" element={<ManageOrders />} />
          <Route path="/admin/inventory" element={<ManageInventory />} />
          <Route path="/admin/profit-loss" element={<ProfitLoss />} />
          <Route path="/admin/categories" element={<ManageCategories />} />
          <Route path="/admin/payment-settings" element={<PaymentSettings />} />
          <Route path="/admin/activity-logs" element={<ActivityLogs />} />
        </Route>

        {/* Public & Customer Layout */}
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-conditions" element={<TermsConditions />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="rail" element={<BoutiqueRailPage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />

          {/* Auth Routes */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          {/* Customer Routes */}
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment" element={<Payment />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="orders" element={<OrderHistory />} />

          {/* Protected Customer Routes */}
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
    </Suspense>
  );
}
