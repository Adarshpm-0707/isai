import { supabase } from '../lib/supabaseClient';

const withTimeout = (promise, ms = 800) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

const DEFAULT_LOGS_KEY = 'isai_admin_logs';
const PAYMENT_SETTINGS_KEY = 'isai_payment_settings';

export const adminLogService = {
  async logAction(action, targetTable, targetId, details = {}) {
    const logEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      action,
      target_table: targetTable,
      target_id: String(targetId),
      details,
      created_at: new Date().toISOString(),
      actor: { name: 'System Administrator', email: 'admin@isaitarang.com' },
    };

    // Save locally
    try {
      const localLogs = JSON.parse(localStorage.getItem(DEFAULT_LOGS_KEY) || '[]');
      localLogs.unshift(logEntry);
      if (localLogs.length > 100) localLogs.pop();
      localStorage.setItem(DEFAULT_LOGS_KEY, JSON.stringify(localLogs));
    } catch {}

    // Cloud fire-and-forget
    try {
      const fastAuth = withTimeout(supabase.auth.getUser(), 400).catch(() => ({ data: { user: null } }));
      const { data } = await fastAuth;
      const user = data?.user;

      withTimeout(
        supabase.from('admin_logs').insert({
          actor_id: user?.id || null,
          action,
          target_table: targetTable,
          target_id: String(targetId),
          details,
        }),
        600
      ).catch(() => {});
    } catch (err) {
      console.warn('adminLogService notice:', err.message);
    }
  },

  async getAdminLogs() {
    let dbLogs = [];
    try {
      const res = await withTimeout(
        supabase
          .from('admin_logs')
          .select('*, actor:profiles(name, email)')
          .order('created_at', { ascending: false })
          .limit(100),
        800
      );
      if (res?.data) dbLogs = res.data;
    } catch (e) {}

    let localLogs = [];
    try {
      localLogs = JSON.parse(localStorage.getItem(DEFAULT_LOGS_KEY) || '[]');
    } catch {}

    if (dbLogs.length > 0) return dbLogs;
    return localLogs;
  },

  async getAllAdmins() {
    let dbAdmins = [];
    try {
      const { data } = await withTimeout(
        supabase
          .from('profiles')
          .select('*')
          .eq('role', 'admin')
          .order('created_at', { ascending: false }),
        800
      );
      if (data) dbAdmins = data;
    } catch (err) {
      console.warn('Supabase DB admin query notice:', err.message);
    }

    let localUsers = [];
    try {
      localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
    } catch (e) {}

    const localAdmins = localUsers.filter(u => u.role === 'admin');
    const combinedMap = new Map();

    dbAdmins.forEach(adm => {
      if (adm.email) combinedMap.set(adm.email.toLowerCase(), adm);
    });

    localAdmins.forEach(adm => {
      if (adm.email && !combinedMap.has(adm.email.toLowerCase())) {
        combinedMap.set(adm.email.toLowerCase(), adm);
      }
    });

    if (combinedMap.size === 0) {
      const defaultAdmin = {
        id: 'sys_admin_1',
        name: 'System Administrator',
        email: 'admin@isaitarang.com',
        phone: '+91 90488 68444',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
      };
      combinedMap.set(defaultAdmin.email, defaultAdmin);

      try {
        withTimeout(supabase.from('profiles').upsert(defaultAdmin), 600).catch(() => {});
      } catch (e) {}
    }

    return Array.from(combinedMap.values());
  },

  async createAdminUser({ email, password, name, phone }) {
    let authData = null;
    let authUserId = 'admin_' + Date.now();

    try {
      const res = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, phone, role: 'admin' },
          },
        }),
        800
      );
      authData = res?.data;
      if (res?.data?.user?.id) authUserId = res.data.user.id;
    } catch (e) {
      console.warn('Supabase Auth Notice:', e.message);
    }

    const newAdminRecord = {
      id: authUserId,
      email,
      name,
      phone,
      password,
      role: 'admin',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      withTimeout(
        Promise.allSettled([
          supabase.from('profiles').upsert({
            id: authUserId,
            email,
            name,
            phone,
            role: 'admin',
            is_active: true,
            updated_at: newAdminRecord.updated_at,
          }),
          supabase.from('users').upsert({
            id: authUserId,
            email,
            name,
            phone,
            role: 'admin',
          }),
        ]),
        800
      ).catch(() => {});
    } catch (e) {
      console.warn('DB upsert notice:', e.message);
    }

    try {
      const localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
      const existingIdx = localUsers.findIndex(u => u.email?.toLowerCase() === email.toLowerCase());
      if (existingIdx >= 0) {
        localUsers[existingIdx] = { ...localUsers[existingIdx], ...newAdminRecord };
      } else {
        localUsers.unshift(newAdminRecord);
      }
      localStorage.setItem('isai_registered_users', JSON.stringify(localUsers));
    } catch (e) {}

    this.logAction('CREATE_ADMIN', 'profiles', authUserId, { email, name }).catch(() => {});
    return authData || { user: newAdminRecord };
  },

  async deleteAdminUser(userId, email) {
    try {
      if (userId) {
        withTimeout(supabase.from('profiles').delete().eq('id', userId), 800).catch(() => {});
        withTimeout(supabase.from('users').delete().eq('id', userId), 800).catch(() => {});
      }
      if (email) {
        withTimeout(supabase.from('profiles').delete().eq('email', email), 800).catch(() => {});
        withTimeout(supabase.from('users').delete().eq('email', email), 800).catch(() => {});
      }

      try {
        const localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
        const updated = localUsers.filter(u => u.id !== userId && u.email?.toLowerCase() !== email?.toLowerCase());
        localStorage.setItem('isai_registered_users', JSON.stringify(updated));
      } catch (e) {}

      this.logAction('DELETE_ADMIN', 'profiles', userId, { email }).catch(() => {});
    } catch (e) {
      console.error('Delete Admin Error:', e);
      throw e;
    }
  },

  async toggleAdminStatus(userId, isActive) {
    let data = null;
    try {
      const res = await withTimeout(
        supabase
          .from('profiles')
          .update({ is_active: isActive })
          .eq('id', userId)
          .select()
          .maybeSingle(),
        800
      );
      data = res?.data;
    } catch {}

    try {
      const localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
      const found = localUsers.find(u => u.id === userId);
      if (found) {
        found.is_active = isActive;
        localStorage.setItem('isai_registered_users', JSON.stringify(localUsers));
      }
    } catch (e) {}

    this.logAction('TOGGLE_ADMIN_STATUS', 'profiles', userId, { is_active: isActive }).catch(() => {});
    return data;
  },

  async getPaymentSettings() {
    try {
      const res = await withTimeout(
        supabase
          .from('payment_settings')
          .select('*')
          .limit(1)
          .maybeSingle(),
        800
      );
      if (res?.data) return res.data;
    } catch {}

    try {
      const local = JSON.parse(localStorage.getItem(PAYMENT_SETTINGS_KEY) || 'null');
      if (local) return local;
    } catch {}

    return { gateway: 'razorpay', api_key: '', api_secret: '', is_active: true };
  },

  async updatePaymentSettings({ gateway = 'razorpay', api_key, api_secret, is_active }) {
    const payload = {
      gateway,
      api_key,
      api_secret,
      is_active,
      updated_at: new Date().toISOString(),
    };

    try {
      localStorage.setItem(PAYMENT_SETTINGS_KEY, JSON.stringify(payload));
    } catch {}

    try {
      withTimeout(
        supabase.from('payment_settings').upsert({
          id: 'default_payment_gateway',
          ...payload,
        }),
        800
      ).catch(() => {});
    } catch {}

    this.logAction('UPDATE_PAYMENT_SETTINGS', 'payment_settings', 'default', { gateway, is_active }).catch(() => {});
    return payload;
  },
};
