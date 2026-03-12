import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 w-full z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-3 shadow-lg">
                <Link to="/" className="text-2xl font-bold text-white drop-shadow-md">
                    🎸 Chord<span className="text-indigo-300">Vault</span>
                </Link>
                
                <div className="flex gap-6 items-center">
                    {user ? (
                        <>
                            <Link to="/" className="text-white hover:text-indigo-200 transition">Dashboard</Link>
                            <Link to="/chords/create" className="bg-indigo-500/80 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition backdrop-blur-sm">
                                + New Chord
                            </Link>
                            <button onClick={handleLogout} className="text-red-300 hover:text-red-400 transition">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-white hover:text-indigo-200 transition">Login</Link>
                            <Link to="/register" className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-xl transition border border-white/30">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
