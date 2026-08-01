import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import SectionHeading from '../components/reusable/SectionHeading';
import Button from '../components/reusable/Button';
import { validateEmail, validateRequired } from '../utils/validators';
import { AlertCircle, Lock, Mail } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirection coordinates
  const from = location.state?.from?.pathname || '/';

  // If user is already authenticated, redirect immediately
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Inputs check
    if (!validateEmail(email)) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!validateRequired(password)) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8 min-h-[70vh] flex flex-col justify-center">
      <SectionHeading
        title="Sign In"
        subtitle="Access your customized profile and cart details"
      />

      {error && (
        <div className="bg-[#2B1409] border border-[#B67A2F] text-[#F6D18A] p-4 rounded-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-sans font-medium">{error}</p>
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
            Password
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

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </div>

        <p className="text-center font-sans text-xs text-[#D8A55A]/80 pt-2">
          Don't have an account?{' '}
          <Link
            to="/signup"
            state={{ from: location.state?.from }}
            className="text-[#F6D18A] font-bold hover:underline ml-1"
          >
            Sign Up
          </Link>
        </p>

      </form>
    </div>
  );
}
