import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { validateEmail, validateRequired } from '../utils/validators';
import { AlertCircle, Lock, Mail, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import BrandLogo, { LotusEmblem } from '../components/reusable/BrandLogo';
import { FloralOrnament } from '../components/reusable/FloralOrnament';

const inputClass =
  'w-full rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#160E0B] border border-[#35221B] text-[#FDF8F4] placeholder-[#8E7B6F] focus:border-[#DFC18A] focus:outline-none transition-all';

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loginWithGoogle, user } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const from = location.state?.from?.pathname || '/';
  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!validateRequired(name)) {
      setError('Name is required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!validateRequired(password) || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register({ email, password, name, phone, role: 'user' });
      setSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Registration failed. Try another email.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || 'Failed to authenticate with Google.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-[#120B09] text-[#FDF8F4] relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        <div className="text-center space-y-1">
          <BrandLogo size="lg" className="mx-auto mb-2" />
          <FloralOrnament className="mt-1" />
          <p className="text-xs text-[#C7B5A7] font-light">
            Register to start browsing and collecting authentic handcrafted sarees.
          </p>
        </div>

        <div className="bg-[#1E130F] border border-[#35221B] rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
          {error && (
            <div className="p-3 rounded-xl flex items-center gap-2 text-xs text-red-300 border border-red-500/40 bg-red-950/40">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl text-xs text-green-300 border border-green-500/40 bg-green-950/40">
              Account created! You can now{' '}
              <Link to="/login" className="underline font-bold text-green-200">
                Sign In
              </Link>
              .
            </div>
          )}

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full py-3 px-4 rounded-full font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-3 bg-white text-gray-900 shadow-md hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-[#2C1C16]" />
            <span className="text-[10px] uppercase font-bold text-[#8E7B6F]">OR REGISTER WITH EMAIL</span>
            <div className="flex-1 h-px bg-[#2C1C16]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {[
              { label: 'Full Name *', icon: <User className="absolute left-3.5 top-3 w-4 h-4 text-[#8E7B6F]" />, type: 'text', value: name, onChange: setName, placeholder: 'Radhika Menon' },
              { label: 'Phone Number', icon: <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#8E7B6F]" />, type: 'tel', value: phone, onChange: setPhone, placeholder: '+91 98765 43210' },
              { label: 'Email Address *', icon: <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8E7B6F]" />, type: 'email', value: email, onChange: setEmail, placeholder: 'name@example.com' },
              { label: 'Password *', icon: <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8E7B6F]" />, type: 'password', value: password, onChange: setPassword, placeholder: '••••••••' },
              { label: 'Confirm Password *', icon: <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8E7B6F]" />, type: 'password', value: confirmPassword, onChange: setConfirmPassword, placeholder: '••••••••' },
            ].map((field, i) => (
              <div key={i} className="space-y-1">
                <label className="block text-[11px] uppercase font-semibold text-[#DFC18A] tracking-wider">
                  {field.label}
                </label>
                <div className="relative">
                  {field.icon}
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={inputClass}
                    placeholder={field.placeholder}
                  />
                </div>
              </div>
            ))}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3 rounded-full font-semibold text-xs tracking-wider uppercase transition-all bg-[#C86A27] hover:bg-[#DB7B32] text-white shadow-lg cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Sign Up'}
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-[#8E7B6F] pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-[#DFC18A] font-semibold hover:underline ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
