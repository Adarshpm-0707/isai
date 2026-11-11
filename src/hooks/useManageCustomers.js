import { useState, useEffect, useMemo, useCallback } from 'react';
import { customerService } from '../services/customerService';
import { orderService } from '../services/orderService';

export default function useManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const showNotification = useCallback((msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  }, []);

  const fetchCustomersAndOrders = useCallback(async () => {
    try {
      const [custList, orderRes] = await Promise.all([
        customerService.getAllCustomers(),
        orderService.getAllOrders({ limit: 500 }).catch(() => ({ orders: orderService.getLocalOrders() })),
      ]);
      setCustomers(custList);
      setOrders(orderRes?.orders || orderService.getLocalOrders());
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomersAndOrders();

    const handleUpdate = () => {
      fetchCustomersAndOrders();
    };

    window.addEventListener('isai:orders_updated', handleUpdate);
    window.addEventListener('isai:customers_updated', handleUpdate);
    return () => {
      window.removeEventListener('isai:orders_updated', handleUpdate);
      window.removeEventListener('isai:customers_updated', handleUpdate);
    };
  }, [fetchCustomersAndOrders]);

  const handleDeleteCustomer = useCallback(
    async (customer) => {
      if (!customer) return;
      const identifier = customer.name || customer.email || 'this customer';
      if (!window.confirm(`Are you sure you want to permanently delete customer "${identifier}"?`)) {
        return;
      }

      try {
        await customerService.deleteCustomer(customer);

        setCustomers((prev) =>
          prev.filter((c) => {
            if (customer.id && (c.id === customer.id || String(c.id) === String(customer.id))) return false;
            if (customer.email && c.email?.toLowerCase().trim() === customer.email.toLowerCase().trim()) return false;
            if (customer.name && c.name?.toLowerCase().trim() === customer.name.toLowerCase().trim()) return false;
            return true;
          })
        );

        if (
          selectedCustomer &&
          (selectedCustomer.id === customer.id ||
            selectedCustomer.email?.toLowerCase() === customer.email?.toLowerCase())
        ) {
          setModalOpen(false);
          setSelectedCustomer(null);
        }

        showNotification(`Customer "${identifier}" deleted successfully`);
      } catch (err) {
        console.error('Failed to delete customer:', err);
        showNotification(err.message || 'Failed to delete customer', 'error');
      }
    },
    [selectedCustomer, showNotification]
  );

  const handleViewCustomer = useCallback((customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  }, []);

  // Filter customers by search keyword
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase().trim();
    return customers.filter((c) => {
      const nameMatch = c.name?.toLowerCase().includes(q);
      const emailMatch = c.email?.toLowerCase().includes(q);
      const phoneMatch = c.phone?.toLowerCase().includes(q);
      return nameMatch || emailMatch || phoneMatch;
    });
  }, [customers, searchQuery]);

  // Calculate order stats per customer
  const getCustomerOrderStats = useCallback(
    (email, customerId) => {
      const custOrders = orders.filter((o) => {
        const ordEmail = o.shipping_address?.email || o.profiles?.email || o.email;
        const ordUserId = o.user_id || o.id;
        return (
          (ordEmail && ordEmail.toLowerCase() === email?.toLowerCase()) ||
          (customerId && ordUserId === customerId)
        );
      });

      const totalSpent = custOrders.reduce(
        (acc, curr) => acc + (parseFloat(curr.total || curr.total_amount) || 0),
        0
      );

      return {
        count: custOrders.length,
        totalSpent,
        history: custOrders,
      };
    },
    [orders]
  );

  return {
    customers,
    orders,
    loading,
    searchQuery,
    setSearchQuery,
    modalOpen,
    setModalOpen,
    selectedCustomer,
    setSelectedCustomer,
    feedback,
    showNotification,
    handleDeleteCustomer,
    handleViewCustomer,
    filteredCustomers,
    getCustomerOrderStats,
  };
}
