import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Music, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await register(formData.name, formData.email, formData.password, formData.password_confirmation);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 422) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-indigo-500 rounded-2xl mb-4 shadow-lg shadow-indigo-500/50">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Join Chord Vault</h1>
          <p className="text-indigo-200/50 text-sm mt-1">Start your personal song collection</p>
        </div>

        {errors.general && (
          <div className="mb-6 p-3 bg-rose-500/20 border border-rose-500/30 rounded-lg text-rose-300 text-sm text-center">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-indigo-200 ml-1 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                required
                className="glass-input w-full pl-10 py-2.5"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            {errors.name && <p className="text-rose-400 text-[10px] mt-1 ml-1">{errors.name[0]}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-indigo-200 ml-1 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="email"
                required
                className="glass-input w-full pl-10 py-2.5"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {errors.email && <p className="text-rose-400 text-[10px] mt-1 ml-1">{errors.email[0]}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-indigo-200 ml-1 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="password"
                required
                className="glass-input w-full pl-10 py-2.5"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            {errors.password && <p className="text-rose-400 text-[10px] mt-1 ml-1">{errors.password[0]}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-indigo-200 ml-1 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="password"
                required
                className="glass-input w-full pl-10 py-2.5"
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-button w-full flex items-center justify-center space-x-2 py-3 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Create Account</span>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-indigo-200/50">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-300 hover:text-white font-semibold transition-colors">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
