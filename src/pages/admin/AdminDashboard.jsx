import React from 'react';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import DashboardHeader from '../../components/admin/dashboard/DashboardHeader';
import StockAlertBanner from '../../components/admin/dashboard/StockAlertBanner';
import DashboardKpiCards from '../../components/admin/dashboard/DashboardKpiCards';
import RevenueVelocityChart from '../../components/admin/dashboard/RevenueVelocityChart';
import OrderFulfillmentChart from '../../components/admin/dashboard/OrderFulfillmentChart';
import FeatureHubCards from '../../components/admin/dashboard/FeatureHubCards';
import RecentOrdersSection from '../../components/admin/dashboard/RecentOrdersSection';
import CustomerAccountsSection from '../../components/admin/dashboard/CustomerAccountsSection';

export default function AdminDashboard() {
  const {
    stats,
    loading,
    orderSearchQuery,
    setOrderSearchQuery,
    orderStatusFilter,
    setOrderStatusFilter,
    fetchStats,
    handleUpdateOrderStatus,
    handleDeleteOrder,
    handleDeleteCustomer,
    filteredRecentOrders,
    revenueChartData,
    donutChartData,
  } = useAdminDashboard();

  return (
    <div className="text-[#F5E6BE] font-sans pb-12">
      {/* Embedded CSS Container Animations */}
      <style>{`
        @keyframes containerEntrance {
          0% {
            opacity: 0;
            transform: translateY(16px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes barGrow {
          0% {
            transform: scaleY(0);
            transform-origin: bottom;
          }
          100% {
            transform: scaleY(1);
            transform-origin: bottom;
          }
        }
        .animate-container-in {
          animation: containerEntrance 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-bar-grow {
          animation: barGrow 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Header */}
        <DashboardHeader onRefresh={fetchStats} loading={loading} />

        {/* Urgent Stock Alert */}
        <StockAlertBanner
          lowStockCount={stats.lowStockCount}
          outOfStockCount={stats.outOfStockCount}
        />

        {/* 5 KPI Metric Cards */}
        <DashboardKpiCards stats={stats} />

        {/* Charts: 7-Day Velocity & Order Fulfillment */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <RevenueVelocityChart revenueChartData={revenueChartData} />
          <OrderFulfillmentChart donutChartData={donutChartData} />
        </div>

        {/* Feature Hub Navigation */}
        <FeatureHubCards stats={stats} />

        {/* Recent Orders Section */}
        <RecentOrdersSection
          filteredRecentOrders={filteredRecentOrders}
          orderSearchQuery={orderSearchQuery}
          setOrderSearchQuery={setOrderSearchQuery}
          orderStatusFilter={orderStatusFilter}
          setOrderStatusFilter={setOrderStatusFilter}
          handleUpdateOrderStatus={handleUpdateOrderStatus}
          handleDeleteOrder={handleDeleteOrder}
          recentOrdersCount={stats.recentOrders.length}
        />

        {/* Customer Accounts Directory */}
        <CustomerAccountsSection
          customers={stats.customers}
          handleDeleteCustomer={handleDeleteCustomer}
        />
      </div>
    </div>
  );
}
