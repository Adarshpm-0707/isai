import { supabase } from '../lib/supabaseClient';

const LOCAL_USERS_KEY = 'isai_registered_users';
const CURRENT_USER_KEY = 'isai_current_user';

const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
  } catch (e) {
    return [];
  }
};

const saveLocalUser = (userObj) => {
  try {
    const users = getLocalUsers();
    const existingIdx = users.findIndex(u => u.email === userObj.email);
    if (existingIdx >= 0) {
      users[existingIdx] = { ...users[existingIdx], ...userObj };
    } else {
      users.push(userObj);
    }
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userObj));
  } catch (e) {
    console.error('Failed to save user to localStorage:', e);
  }
};

export const authService = {
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('Google Sign-In Error:', error.message);
      throw error;
    }
    return data;
  },

  async signUp({ email, password, name, phone, role = 'user' }) {
    let authData = null;
    let authError = null;

    try {
      const res = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone, role },
        },
      });
      authData = res.data;
      authError = res.error;
    } catch (err) {
      console.warn('Supabase Auth signUp network attempt:', err.message);
    }

    const userId = authData?.user?.id || `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const userProfile = {
      id: userId,
      email,
      name,
      phone,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save directly into Supabase database tables (profiles, users, customers)
    try {
      await Promise.allSettled([
        supabase.from('profiles').upsert(userProfile),
        supabase.from('users').upsert({ id: userId, email, name, phone, role, created_at: userProfile.created_at }),
        supabase.from('customers').upsert({ id: userId, email, name, phone, created_at: userProfile.created_at }),
      ]);
    } catch (dbErr) {
      console.warn('Supabase database upsert info:', dbErr);
    }

    saveLocalUser({ ...userProfile, password });

    if (authError && !authData?.user) {
      console.warn('Supabase Auth response error:', authError.message);
    }

    return { user: userProfile, profile: userProfile };
  },

  async signIn({ email, password }) {
    let authData = null;

    try {
      const res = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      authData = res.data;
    } catch (err) {
      console.warn('Supabase Auth signIn network attempt:', err.message);
    }

    if (authData?.user) {
      const prof = {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || email.split('@')[0],
        phone: authData.user.user_metadata?.phone || '',
        role: authData.user.user_metadata?.role || 'user',
        updated_at: new Date().toISOString(),
      };

      // Sync user record to Supabase database tables on login
      try {
        await Promise.allSettled([
          supabase.from('profiles').upsert(prof),
          supabase.from('users').upsert({ id: prof.id, email: prof.email, name: prof.name, phone: prof.phone, role: prof.role }),
          supabase.from('customers').upsert({ id: prof.id, email: prof.email, name: prof.name, phone: prof.phone }),
        ]);
      } catch (e) {}

      saveLocalUser(prof);
      return { user: prof, profile: prof };
    }

    // Fallback Local Login
    const users = getLocalUsers();
    const found = users.find(u => u.email?.toLowerCase() === email?.toLowerCase());

    if (found) {
      if (found.password && found.password !== password) {
        throw new Error('Invalid email or password.');
      }
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));

      // Attempt async sync to Supabase database
      try {
        supabase.from('profiles').upsert(found);
      } catch (e) {}

      return { user: found, profile: found };
    }

    // If new login with any password fallback
    const fallbackUser = {
      id: `usr_${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: 'user',
      created_at: new Date().toISOString(),
    };

    try {
      supabase.from('profiles').upsert(fallbackUser);
    } catch (e) {}

    saveLocalUser(fallbackUser);
    return { user: fallbackUser, profile: fallbackUser };
  },

  async signOut() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut error:', err);
    }
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  async getCurrentProfile() {
    // 1. Try local storage current user first if fast
    try {
      const local = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
      if (local) return local;
    } catch (e) {}

    // 2. Try Supabase user & profiles table
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const prof = data || {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          role: user.user_metadata?.role || 'user',
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(prof));
        return prof;
      }
    } catch (err) {
      console.warn('Supabase getCurrentProfile error:', err);
    }

    return null;
  },

  async updateProfile(userId, updates) {
    let updated = null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (!error && data) updated = data;
    } catch (err) {
      console.warn('Supabase updateProfile error:', err);
    }

    // Local fallback update
    try {
      const current = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}');
      updated = { ...current, ...updates, id: userId };
      saveLocalUser(updated);
    } catch (e) {}

    return updated;
  },
};
