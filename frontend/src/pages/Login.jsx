import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-24 px-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-6 md:p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl"
            >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
                
                {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-xl mb-4 text-sm">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-white/70 text-sm ml-2">Email Address</label>
                        <motion.input
                            whileFocus={{ scale: 1.01, boxShadow: "0 0 20px rgba(99, 102, 241, 0.2)" }}
                            type="email"
                            className="w-full mt-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-white/70 text-sm ml-2">Password</label>
                        <motion.input
                            whileFocus={{ scale: 1.01, boxShadow: "0 0 20px rgba(99, 102, 241, 0.2)" }}
                            type="password"
                            className="w-full mt-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <motion.button 
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg transition-colors mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Signing In...
                            </>
                        ) : 'Sign In'}
                    </motion.button>
                </form>
                
                <p className="text-white/60 mt-6 text-center text-sm">
                    Don't have an account? <Link to="/register" className="text-indigo-300 hover:underline">Register here</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
