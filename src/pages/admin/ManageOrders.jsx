import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { adminLogService } from '../../services/adminLogService';
import SectionHeading from '../../components/reusable/SectionHeading';
import Badge from '../../components/reusable/Badge';
import Button from '../../components/reusable/Button';
import Modal from '../../components/reusable/Modal';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('pending');
  const [trackingId, setTrackingId] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders({ status: activeTab, limit: 50 });
      setOrders(res.orders || []);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingId(order.shiprocket_order_id || '');
    setModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      await orderService.updateOrderStatus(selectedOrder.id, newStatus, trackingId);
      await adminLogService.logAction('UPDATE_ORDER_STATUS', 'orders', selectedOrder.id, {
        status: newStatus,
        tracking_id: trackingId,
      });

      setModalOpen(false);
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const tabs = [
    'all',
    'pending',
    'paid',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#D8A55A]">
      <SectionHeading
        title="Fulfillments Board"
        subtitle="Manage customer purchases, dispatch statuses, and shipments"
        align="left"
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#D8A55A]/20 pb-2 overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all ${
              activeTab === t
                ? 'bg-[#F6D18A] text-[#2B1409]'
                : 'text-[#D8A55A] hover:bg-[#5C2F14]/50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-[#2B1409] border border-[#D8A55A]/30 rounded-sm shadow-xl overflow-hidden text-[#D8A55A]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#D8A55A]/20 text-[#D8A55A]/70 font-bold uppercase tracking-wider bg-[#2B1409]">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Items</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Method</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8A55A]/10">
              {orders.length === 0 && !loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#D8A55A]/60 italic">
                    No orders matching filter: <strong>{activeTab}</strong>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  let badgeVariant = 'warning';
                  if (order.status === 'shipped') badgeVariant = 'gold';
                  if (order.status === 'delivered' || order.status === 'paid')
                    badgeVariant = 'success';
                  if (order.status === 'cancelled' || order.status === 'failed')
                    badgeVariant = 'danger';

                  const items = Array.isArray(order.items) ? order.items : [];
                  const custName =
                    order.profiles?.name || order.shipping_address?.name || 'Customer';

                  return (
                    <tr key={order.id} className="hover:bg-[#5C2F14]/30">
                      <td className="py-4 px-6 font-mono font-medium text-[#F6D18A]">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="py-4 px-6 font-medium text-[#D8A55A]">{custName}</td>
                      <td className="py-4 px-6 text-[#D8A55A]/80">
                        {new Date(order.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          {items.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[#D8A55A]">
                              <span className="font-bold text-[#F6D18A]">{it.qty} &times;</span>
                              <span className="truncate max-w-[150px]">{it.name}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-[#F6D18A]">
                        ₹{Number(order.total || order.total_amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6 uppercase text-[10px] font-bold">
                        {order.payment_method}
                      </td>
                      <td className="py-4 px-6">
                        <Badge text={order.status} variant={badgeVariant} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenModal(order)}
                        >
                          Update Status
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Update Order #${selectedOrder?.id?.slice(0, 8)}`}
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase font-bold text-[#F6D18A]">Fulfillment Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-[#4A0000] border border-[#F6D18A]/30 rounded p-2.5 text-[#F6D18A] mt-1 uppercase"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block uppercase font-bold text-[#F6D18A]">
              Courier Tracking ID / Shiprocket ID
            </label>
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g. SR_10293847"
              className="w-full bg-[#4A0000] border border-[#F6D18A]/30 rounded p-2.5 text-[#F6D18A] mt-1 font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Order Status
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
