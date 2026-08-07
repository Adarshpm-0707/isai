import { supabase } from '../lib/supabaseClient';

export const adminLogService = {
  async logAction(action, targetTable, targetId, details = {}) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('admin_logs').insert({
      actor_id: user.id,
      action,
      target_table: targetTable,
      target_id: String(targetId),
      details,
    }).catch((err) => console.error('Failed to log admin action:', err));
  },

  async getAdminLogs() {
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*, actor:profiles(name, email)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  },

  async getAllAdmins() {
    let dbAdmins = [];
    try {
      // 1. Query Supabase PostgreSQL database profiles table directly
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });

      if (data) dbAdmins = data;
    } catch (err) {
      console.warn('Supabase DB admin query warning:', err);
    }

    // 2. Local fallback sync
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

    // Default System Admin if no admin records exist
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
        await supabase.from('profiles').upsert(defaultAdmin);
      } catch (e) {}
    }

    return Array.from(combinedMap.values());
  },

  async createAdminUser({ email, password, name, phone }) {
    let authData = null;
    let authUserId = 'admin_' + Date.now();

    try {
      const res = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone, role: 'admin' },
        },
      });
      authData = res.data;
      if (res.data?.user?.id) authUserId = res.data.user.id;
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

    // 1. Direct PostgreSQL upsert to profiles & users table
    try {
      await supabase.from('profiles').upsert({
        id: authUserId,
        email,
        name,
        phone,
        role: 'admin',
        is_active: true,
        updated_at: newAdminRecord.updated_at,
      });
      await supabase.from('users').upsert({
        id: authUserId,
        email,
        name,
        phone,
        role: 'admin',
      });
    } catch (e) {
      console.warn('DB upsert notice:', e.message);
    }

    // 2. Save into local storage users backup for instant login access
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

    await this.logAction('CREATE_ADMIN', 'profiles', authUserId, { email, name });
    return authData || { user: newAdminRecord };
  },

  async deleteAdminUser(userId, email) {
    try {
      if (userId) {
        await supabase.from('profiles').delete().eq('id', userId);
        await supabase.from('users').delete().eq('id', userId);
      }
      if (email) {
        await supabase.from('profiles').delete().eq('email', email);
        await supabase.from('users').delete().eq('email', email);
      }

      // Remove from local storage backup
      try {
        const localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
        const updated = localUsers.filter(u => u.id !== userId && u.email?.toLowerCase() !== email?.toLowerCase());
        localStorage.setItem('isai_registered_users', JSON.stringify(updated));
      } catch (e) {}

      await this.logAction('DELETE_ADMIN', 'profiles', userId, { email });
    } catch (e) {
      console.error('Delete Admin Error:', e);
      throw e;
    }
  },

  async toggleAdminStatus(userId, isActive) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) console.warn(error);

    // Update local storage backup
    try {
      const localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
      const found = localUsers.find(u => u.id === userId);
      if (found) {
        found.is_active = isActive;
        localStorage.setItem('isai_registered_users', JSON.stringify(localUsers));
      }
    } catch (e) {}

    await this.logAction('TOGGLE_ADMIN_STATUS', 'profiles', userId, { is_active: isActive });
    return data;
  },

  async getPaymentSettings() {
    const { data } = await supabase
      .from('payment_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    return data || { gateway: 'razorpay', api_key: '', api_secret: '', is_active: true };
  },

  async updatePaymentSettings({ gateway = 'razorpay', api_key, api_secret, is_active }) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: existing } = await supabase
      .from('payment_settings')
      .select('id')
      .limit(1)
      .maybeSingle();

    let result;
    if (existing) {
      const { data, error } = await supabase
        .from('payment_settings')
        .update({
          gateway,
          api_key,
          api_secret,
          is_active,
          updated_by: user?.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('payment_settings')
        .insert({
          gateway,
          api_key,
          api_secret,
          is_active,
          updated_by: user?.id,
        })
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    await this.logAction('UPDATE_PAYMENT_SETTINGS', 'payment_settings', result.id, { gateway, is_active });
    return result;
  },
};
