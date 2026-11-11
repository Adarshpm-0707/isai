import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { authService } from '../services/authService';

export const AuthContext = createContext();

const getInitialCachedUser = () => {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('isai_current_user') : null;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getInitialCachedUser());
  const [profile, setProfile] = useState(() => getInitialCachedUser());
  const [loading, setLoading] = useState(() => !getInitialCachedUser());

  const fetchProfile = async (uid) => {
    try {
      const prof = await authService.getCurrentProfile();
      if (prof) {
        setProfile(prof);
        setUser(prof);
      }
      return prof;
    } catch (err) {
      console.warn('Notice in fetchProfile:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    try {
      const prof = await authService.getCurrentProfile();
      if (prof) {
        setProfile(prof);
        setUser(prof);
      }
    } catch {}
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const prof = await authService.getCurrentProfile();
        if (prof && isMounted) {
          setUser(prof);
          setProfile(prof);
          if (isMounted) setLoading(false);
          return;
        }

        let session = null;
        try {
          const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Auth session timeout')), 600)
          );
          const res = await Promise.race([
            supabase.auth.getSession(),
            timeout,
          ]);
          session = res?.data?.session || null;
        } catch {
          session = null;
        }

        if (session?.user && isMounted) {
          setUser(session.user);
          const p = await authService.getCurrentProfile();
          if (isMounted && p) setProfile(p);
        }
      } catch (err) {
        console.warn('Auth initialization notice:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    let subscription = null;
    try {
      const authSub = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user && isMounted) {
            setUser(session.user);
            const prof = await authService.getCurrentProfile();
            if (isMounted && prof) setProfile(prof);
          }
          if (isMounted) setLoading(false);
        }
      );
      subscription = authSub?.data?.subscription;
    } catch (e) {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  const login = async (email, password, roleHint = null) => {
    setLoading(true);
    try {
      const data = await authService.signIn({ email, password, roleHint });
      const userObj = data.user || data.profile;
      if (roleHint && userObj) {
        userObj.role = roleHint;
      }
      setUser(userObj);
      setProfile(userObj);
      return { user: userObj, profile: userObj };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, password, name, phone, role = 'user' }) => {
    setLoading(true);
    try {
      const data = await authService.signUp({ email, password, name, phone, role });
      const userObj = data.user || data.profile;
      if (userObj) {
        setUser(userObj);
        setProfile(userObj);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      return await authService.signInWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    setProfile,
    role: profile?.role || user?.role || (user?.email?.toLowerCase().includes('admin') ? 'admin' : 'user'),
    loading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
