import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [errors, setErrors] = useState({});
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.password_confirmation);
            navigate('/');
        } catch (err) {
            setErrors(err.response?.data || { message: 'Registration failed' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-24 px-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-6 md:p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl"
            >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Join the Vault</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-white/70 text-sm ml-2">Full Name</label>
                        <motion.input
                            whileFocus={{ scale: 1.01, boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)" }}
                            type="text"
                            className="w-full mt-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name[0]}</p>}
                    </div>
                    <div>
                        <label className="text-white/70 text-sm ml-2">Email</label>
                        <motion.input
                            whileFocus={{ scale: 1.01, boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)" }}
                            type="email"
                            className="w-full mt-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email[0]}</p>}
                    </div>
                    <div>
                        <label className="text-white/70 text-sm ml-2">Password</label>
                        <motion.input
                            whileFocus={{ scale: 1.01, boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)" }}
                            type="password"
                            className="w-full mt-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password[0]}</p>}
                    </div>
                    <div>
                        <label className="text-white/70 text-sm ml-2">Confirm Password</label>
                        <motion.input
                            whileFocus={{ scale: 1.01, boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)" }}
                            type="password"
                            className="w-full mt-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            placeholder="••••••••"
                            value={formData.password_confirmation}
                            onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                        />
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl shadow-lg transition-colors mt-4"
                    >
                        Create Account
                    </motion.button>
                </form>
                
                <p className="text-white/60 mt-6 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-indigo-300 hover:underline">Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
