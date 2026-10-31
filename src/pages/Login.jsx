import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { AlertCircle, ShieldCheck, Lock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import BrandLogo, { LotusEmblem } from '../components/reusable/BrandLogo';
import { FloralOrnament } from '../components/reusable/FloralOrnament';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle, user, role } = useAuth();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (user) {
      if (from) navigate(from, { replace: true });
      else if (role === 'admin') navigate('/admin', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [user, role, navigate, from]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || 'Failed to authenticate with Google account.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-16 bg-[#120B09] text-[#FDF8F4] overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#C86A27]/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#1E130F] border border-[#35221B] rounded-3xl p-8 sm:p-10 space-y-6 text-center shadow-2xl relative overflow-hidden">
          {/* Top amber accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DFC18A] via-[#C86A27] to-[#DFC18A]" />

          {/* Official Brand Logo */}
          <div className="pt-2 flex flex-col items-center">
            <BrandLogo size="lg" className="mb-2" />
            <FloralOrnament className="mt-1" />
          </div>

          <p className="text-xs text-[#C7B5A7] font-light leading-relaxed max-w-xs mx-auto">
            Sign in with your Google account for quick 1-click checkout, wishlist sync, and order updates.
          </p>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl flex items-center justify-center gap-2 text-xs text-red-300 border border-red-500/40 bg-red-950/40">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3.5 px-6 rounded-full font-semibold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-3 bg-white text-gray-900 shadow-xl hover:bg-gray-100 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
          </button>

          {/* Feature Badges */}
          <div className="pt-4 border-t border-[#2C1C16] grid grid-cols-2 gap-2 text-left text-[11px] text-[#C7B5A7]">
            <div className="flex items-center gap-1.5 bg-[#160E0B] p-2 rounded-lg border border-[#35221B]">
              <CheckCircle className="w-3.5 h-3.5 text-[#DFC18A] shrink-0" />
              <span>Instant Sign In</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#160E0B] p-2 rounded-lg border border-[#35221B]">
              <Lock className="w-3.5 h-3.5 text-[#DFC18A] shrink-0" />
              <span>Passwordless</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-[#8E7B6F] uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DFC18A]" />
            <span>256-Bit SSL Encrypted Access</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
