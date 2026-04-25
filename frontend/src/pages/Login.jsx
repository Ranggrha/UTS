import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-24 px-4 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
            <div className="w-full max-w-md p-6 md:p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
                
                {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-xl mb-4 text-sm">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-white/70 text-sm ml-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full mt-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-white/70 text-sm ml-2">Password</label>
                        <input
                            type="password"
                            className="w-full mt-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg transition transform hover:-translate-y-1">
                        Sign In
                    </button>
                </form>
                
                <p className="text-white/60 mt-6 text-center text-sm">
                    Don't have an account? <Link to="/register" className="text-indigo-300 hover:underline">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
