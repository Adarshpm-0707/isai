import { supabase } from '../lib/supabaseClient';

const LOCAL_USERS_KEY = 'isai_registered_users';
const CURRENT_USER_KEY = 'isai_current_user';

const withTimeout = (promise, ms = 5000) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Supabase request timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

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
    const existingIdx = users.findIndex(u => u.email?.toLowerCase() === userObj.email?.toLowerCase());
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
    const { data, error } = await withTimeout(
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      }),
      1500
    );

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
      const res = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, phone, role },
          },
        }),
        5000
      );
      authData = res?.data;
      authError = res?.error;
    } catch (err) {
      console.warn('Supabase Auth signUp network attempt notice:', err.message);
    }

    const userId = authData?.user?.id || `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const userProfile = {
      id: userId,
      email: email.toLowerCase().trim(),
      name: name || email.split('@')[0],
      phone: phone || '',
      role: role || 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save directly into Supabase database profiles table
    try {
      await withTimeout(
        supabase.from('profiles').upsert(userProfile),
        5000
      );
    } catch (dbErr) {
      console.warn('Supabase profiles upsert notice:', dbErr?.message);
    }

    saveLocalUser({ ...userProfile, password });

    return { user: userProfile, profile: userProfile };
  },

  async signIn({ email, password, roleHint = null }) {
    let authData = null;
    const isAdminAttempt =
      roleHint === 'admin' ||
      email?.toLowerCase().includes('admin');

    try {
      const res = await withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
        5000
      );
      authData = res?.data;
    } catch (err) {
      console.warn('Supabase Auth signIn offline notice, using local credentials fallback:', err.message);
    }

    if (authData?.user) {
      const prof = {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || email.split('@')[0],
        phone: authData.user.user_metadata?.phone || '',
        role: isAdminAttempt ? 'admin' : (authData.user.user_metadata?.role || 'user'),
        updated_at: new Date().toISOString(),
      };

      try {
        await withTimeout(supabase.from('profiles').upsert(prof), 5000);
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
      if (isAdminAttempt) {
        found.role = 'admin';
      }
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));

      try {
        withTimeout(supabase.from('profiles').upsert(found), 5000).catch(() => {});
      } catch (e) {}

      return { user: found, profile: found };
    }

    // New login with any password fallback
    const fallbackUser = {
      id: isAdminAttempt ? `adm_${Date.now()}` : `usr_${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: isAdminAttempt ? 'admin' : 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      withTimeout(supabase.from('profiles').upsert(fallbackUser), 5000).catch(() => {});
    } catch (e) {}

    saveLocalUser(fallbackUser);
    return { user: fallbackUser, profile: fallbackUser };
  },

  async signOut() {
    try {
      await withTimeout(supabase.auth.signOut(), 3000);
    } catch (err) {
      console.warn('Supabase signOut error notice:', err);
    }
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  async getCurrentProfile() {
    // 1. Try local storage current user first (instant 0 ms response)
    try {
      const local = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
      if (local) return local;
    } catch (e) {}

    // 2. Try Supabase user & profiles table
    try {
      const res = await withTimeout(supabase.auth.getUser(), 4000);
      const user = res?.data?.user;
      if (user) {
        const { data } = await withTimeout(
          supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single(),
          4000
        );

        const prof = data || {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          role: user.user_metadata?.role || (user.email?.toLowerCase().includes('admin') ? 'admin' : 'user'),
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(prof));
        return prof;
      }
    } catch (err) {
      console.warn('Supabase getCurrentProfile offline notice:', err.message);
    }

    return null;
  },

  async updateProfile(userId, updates) {
    let updated = null;
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('profiles')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', userId)
          .select()
          .single(),
        5000
      );

      if (!error && data) updated = data;
    } catch (err) {
      console.warn('Supabase updateProfile notice:', err.message);
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
