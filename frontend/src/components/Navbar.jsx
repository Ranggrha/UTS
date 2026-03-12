import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Music, LogOut, Plus, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/10 border-b border-white/20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="p-2 bg-indigo-500 rounded-lg group-hover:bg-indigo-400 transition-colors">
            <Music className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            Chord Vault
          </span>
        </Link>

        {user ? (
          <div className="flex items-center space-x-6">
            <Link to="/chords/create" className="flex items-center space-x-1 hover:text-indigo-300 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Chord</span>
            </Link>
            <div className="flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <UserIcon className="w-4 h-4 text-indigo-300" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-full text-rose-400 transition-all hover:scale-110"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-4 py-2 hover:bg-white/10 rounded-lg transition-all">Login</Link>
            <Link to="/register" className="glass-button">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
