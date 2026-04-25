import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
        navigate('/login');
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const NavLinks = () => (
        <>
            {user ? (
                <>
                    <Link to="/" onClick={() => setIsOpen(false)} className="text-white hover:text-indigo-200 transition">Dashboard</Link>
                    <Link to="/chords/create" onClick={() => setIsOpen(false)} className="bg-indigo-500/80 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition backdrop-blur-sm text-center">
                        + New Chord
                    </Link>
                    <button onClick={handleLogout} className="text-red-300 hover:text-red-400 transition text-left">Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-white hover:text-indigo-200 transition">Login</Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-xl transition border border-white/30 text-center">
                        Register
                    </Link>
                </>
            )}
        </>
    );

    return (
        <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4">
            <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center px-6 md:px-8 py-3">
                    <Link to="/" className="text-xl md:text-2xl font-bold text-white drop-shadow-md">
                        🎸 Chord<span className="text-indigo-300">Vault</span>
                    </Link>
                    
                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-6 items-center">
                        <NavLinks />
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={toggleMenu} className="md:hidden text-white p-2">
                        {isOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-4 bg-slate-900/50 rounded-b-2xl">
                        <NavLinks />
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
