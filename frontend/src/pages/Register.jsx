import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
        <div className="min-h-screen flex items-center justify-center pt-24 px-4 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
            <div className="w-full max-w-md p-6 md:p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Join the Vault</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-white/70 text-sm ml-2">Full Name</label>
                        <input
                            type="text"
                            className="w-full mt-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name[0]}</p>}
                    </div>
                    <div>
                        <label className="text-white/70 text-sm ml-2">Email</label>
                        <input
                            type="email"
                            className="w-full mt-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email[0]}</p>}
                    </div>
                    <div>
                        <label className="text-white/70 text-sm ml-2">Password</label>
                        <input
                            type="password"
                            className="w-full mt-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password[0]}</p>}
                    </div>
                    <div>
                        <label className="text-white/70 text-sm ml-2">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full mt-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none"
                            placeholder="••••••••"
                            value={formData.password_confirmation}
                            onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl shadow-lg transition transform hover:-translate-y-1 mt-4">
                        Create Account
                    </button>
                </form>
                
                <p className="text-white/60 mt-6 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-indigo-300 hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
