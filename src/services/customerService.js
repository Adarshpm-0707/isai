import { supabase } from '../lib/supabaseClient';

const DELETED_CUSTOMER_EMAILS_KEY = 'isai_deleted_customer_emails';
const DELETED_CUSTOMER_IDS_KEY = 'isai_deleted_customer_ids';
const DELETED_CUSTOMER_NAMES_KEY = 'isai_deleted_customer_names';

const DEMO_CUSTOMER_EMAILS = new Set([
  'priya.sharma@example.com',
  'ananya.ramesh@example.com',
  'demo@isaitarang.com',
]);

const withTimeout = (promise, ms = 800) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

export const customerService = {
  getDeletedEmails() {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DELETED_CUSTOMER_EMAILS_KEY) : null;
      return new Set(raw ? JSON.parse(raw).map(e => String(e).toLowerCase().trim()) : []);
    } catch {
      return new Set();
    }
  },

  getDeletedIds() {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DELETED_CUSTOMER_IDS_KEY) : null;
      return new Set(raw ? JSON.parse(raw).map(id => String(id)) : []);
    } catch {
      return new Set();
    }
  },

  getDeletedNames() {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DELETED_CUSTOMER_NAMES_KEY) : null;
      return new Set(raw ? JSON.parse(raw).map(n => String(n).toLowerCase().trim()) : []);
    } catch {
      return new Set();
    }
  },

  isCustomerDeleted(cust) {
    if (!cust) return true;
    const deletedEmails = this.getDeletedEmails();
    const deletedIds = this.getDeletedIds();
    const deletedNames = this.getDeletedNames();

    const email = cust.email ? String(cust.email).toLowerCase().trim() : '';
    const id = cust.id ? String(cust.id) : '';
    const name = cust.name ? String(cust.name).toLowerCase().trim() : '';

    if (email && (deletedEmails.has(email) || DEMO_CUSTOMER_EMAILS.has(email))) return true;
    if (id && deletedIds.has(id)) return true;
    if (name && deletedNames.has(name)) return true;

    return false;
  },

  async getAllCustomers() {
    const deletedEmails = this.getDeletedEmails();
    const deletedIds = this.getDeletedIds();
    const deletedNames = this.getDeletedNames();

    // 1. Fetch Cloud profiles with 800ms timeout
    let dbProfiles = [];
    try {
      const res = await withTimeout(
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        800
      );
      if (res?.data) dbProfiles = res.data;
    } catch (e) {}

    // 2. Fetch local storage users
    let localUsers = [];
    try {
      localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
    } catch (e) {}

    // 3. Fetch local & cloud orders for customer contact info
    let localOrders = [];
    try {
      localOrders = JSON.parse(localStorage.getItem('isai_orders') || '[]');
    } catch (e) {}

    let currentUser = null;
    try {
      currentUser = JSON.parse(localStorage.getItem('isai_current_user') || 'null');
    } catch (e) {}

    const customerMap = new Map();

    const addCustomer = (u) => {
      if (!u || (!u.email && !u.name)) return;
      if (u.role === 'admin' || String(u.email || '').toLowerCase().includes('admin')) return;

      const rawEmail = u.email ? String(u.email).toLowerCase().trim() : '';
      const rawId = u.id ? String(u.id) : '';
      const rawName = u.name ? String(u.name).toLowerCase().trim() : '';

      if (rawEmail && (deletedEmails.has(rawEmail) || DEMO_CUSTOMER_EMAILS.has(rawEmail))) return;
      if (rawId && deletedIds.has(rawId)) return;
      if (rawName && deletedNames.has(rawName)) return;

      const key = rawEmail || `name_${rawName}`;
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: rawId || `usr_${Math.random().toString(36).slice(2, 8)}`,
          name: u.name || (rawEmail.includes('@') ? rawEmail.split('@')[0] : 'Customer User'),
          email: rawEmail || `${rawName.replace(/\s+/g, '')}@customer.isai`,
          phone: u.phone || u.shipping_address?.phone || '+91 98401 23456',
          role: 'user',
          address: u.address || u.shipping_address?.addressLine1 || u.shipping_address?.street || 'Tamil Nadu, India',
          city: u.city || u.shipping_address?.city || 'Chennai',
          pincode: u.pincode || u.shipping_address?.pincode || '600001',
          created_at: u.created_at || new Date().toISOString(),
        });
      }
    };

    if (Array.isArray(dbProfiles)) dbProfiles.forEach(addCustomer);
    if (currentUser) addCustomer(currentUser);
    if (Array.isArray(localUsers)) localUsers.forEach(addCustomer);

    if (Array.isArray(localOrders)) {
      localOrders.forEach((ord) => {
        const addr = ord.shipping_address || ord.profiles || {};
        if (addr.email || addr.name) {
          addCustomer({
            id: ord.user_id || ord.id,
            name: addr.name,
            email: addr.email,
            phone: addr.phone,
            address: addr.addressLine1 || addr.street,
            city: addr.city,
            pincode: addr.pincode,
            role: 'user',
            created_at: ord.created_at,
          });
        }
      });
    }

    return Array.from(customerMap.values());
  },

  async deleteCustomer(customer) {
    if (!customer) return false;

    const email = customer.email ? String(customer.email).toLowerCase().trim() : '';
    const id = customer.id ? String(customer.id) : '';
    const name = customer.name ? String(customer.name).toLowerCase().trim() : '';

    // 1. Mark in deleted customer persistent keys
    try {
      if (email) {
        const raw = localStorage.getItem(DELETED_CUSTOMER_EMAILS_KEY) || '[]';
        const list = JSON.parse(raw);
        if (!list.includes(email)) {
          list.push(email);
          localStorage.setItem(DELETED_CUSTOMER_EMAILS_KEY, JSON.stringify(list));
        }
      }
      if (id) {
        const raw = localStorage.getItem(DELETED_CUSTOMER_IDS_KEY) || '[]';
        const list = JSON.parse(raw);
        if (!list.includes(id)) {
          list.push(id);
          localStorage.setItem(DELETED_CUSTOMER_IDS_KEY, JSON.stringify(list));
        }
      }
      if (name) {
        const raw = localStorage.getItem(DELETED_CUSTOMER_NAMES_KEY) || '[]';
        const list = JSON.parse(raw);
        if (!list.includes(name)) {
          list.push(name);
          localStorage.setItem(DELETED_CUSTOMER_NAMES_KEY, JSON.stringify(list));
        }
      }
    } catch (e) {}

    // 2. Remove from local storage users
    try {
      const localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
      const updated = localUsers.filter((u) => {
        const uEmail = u.email ? String(u.email).toLowerCase().trim() : '';
        const uId = u.id ? String(u.id) : '';
        const uName = u.name ? String(u.name).toLowerCase().trim() : '';

        if (email && uEmail === email) return false;
        if (id && uId === id) return false;
        if (name && uName === name) return false;
        return true;
      });
      localStorage.setItem('isai_registered_users', JSON.stringify(updated));
    } catch (e) {}

    // 3. Clear current user if it is this customer
    try {
      const cur = JSON.parse(localStorage.getItem('isai_current_user') || 'null');
      if (cur) {
        const curEmail = cur.email ? String(cur.email).toLowerCase().trim() : '';
        const curId = cur.id ? String(cur.id) : '';
        if ((email && curEmail === email) || (id && curId === id)) {
          localStorage.removeItem('isai_current_user');
        }
      }
    } catch (e) {}

    // 4. Cloud delete with strict 800ms timeout (never blocks or throws to UI)
    try {
      const promises = [];
      if (id) {
        promises.push(supabase.from('profiles').delete().eq('id', id));
        promises.push(supabase.from('customers').delete().eq('id', id));
        promises.push(supabase.from('users').delete().eq('id', id));
      }
      if (email) {
        promises.push(supabase.from('profiles').delete().eq('email', email));
        promises.push(supabase.from('customers').delete().eq('email', email));
        promises.push(supabase.from('users').delete().eq('email', email));
      }
      withTimeout(Promise.allSettled(promises), 800).catch(() => {});
    } catch (e) {}

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('isai:customers_updated'));
    }

    return true;
  },
};
