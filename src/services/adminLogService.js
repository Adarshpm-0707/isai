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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createAdminUser({ email, password, name, phone }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, role: 'admin' },
      },
    });

    if (error) throw error;
    if (data?.user) {
      await this.logAction('CREATE_ADMIN', 'profiles', data.user.id, { email, name });
    }
    return data;
  },

  async toggleAdminStatus(userId, isActive) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
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
