import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import SectionHeading from '../components/reusable/SectionHeading';
import Button from '../components/reusable/Button';
import { validateEmail, validateRequired } from '../utils/validators';
import { AlertCircle, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Form inputs validation
    if (!validateEmail(email)) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!validateRequired(password) || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password);
      setSuccess(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Registration failed. Try another email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8 min-h-[70vh] flex flex-col justify-center">
      <SectionHeading
        title="Sign Up"
        subtitle="Create a custom account to save your favorites"
      />

      {error && (
        <div className="bg-[#2B1409] border border-[#B67A2F] text-[#F6D18A] p-4 rounded-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-sans font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-[#5C2F14]/60 border border-[#F6D18A]/50 text-[#F6D18A] p-4 rounded-sm flex items-start gap-3 shadow-lg">
          <ShieldCheck className="w-6 h-6 flex-shrink-0 text-[#F6D18A] mt-0.5" />
          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider">Registration Success!</h4>
            <p className="text-[11px] font-sans mt-0.5 leading-normal text-[#D8A55A]">
              An activation mail has been dispatched. Please verify your email, then navigate to the login window to sign in.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gradient-to-b from-[#2B1409] to-[#3E1B0E] border border-[#D8A55A]/30 p-6 sm:p-8 rounded-sm space-y-6 shadow-xl text-[#D8A55A]">
        
        {/* Email Address */}
        <div className="space-y-1">
          <label className="block text-xs uppercase font-semibold text-[#D8A55A] tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#D8A55A]/60" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#2B1409] border border-[#D8A55A]/30 rounded-sm pl-10 pr-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A] font-sans"
              placeholder="name@example.com"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="block text-xs uppercase font-semibold text-[#D8A55A] tracking-wider">
            Password (min 6 chars)
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#D8A55A]/60" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#2B1409] border border-[#D8A55A]/30 rounded-sm pl-10 pr-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A] font-sans"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="block text-xs uppercase font-semibold text-[#D8A55A] tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#D8A55A]/60" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#2B1409] border border-[#D8A55A]/30 rounded-sm pl-10 pr-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A] font-sans"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </Button>
        </div>

        <p className="text-center font-sans text-xs text-[#D8A55A]/80 pt-2">
          Already have an account?{' '}
          <Link
            to="/login"
            state={{ from: location.state?.from }}
            className="text-[#F6D18A] font-bold hover:underline ml-1"
          >
            Sign In
          </Link>
        </p>

      </form>
    </div>
  );
}
