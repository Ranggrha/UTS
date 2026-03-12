import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Search, Plus, Edit2, Trash2, User, Calendar, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [chords, setChords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchChords();
  }, []);

  const fetchChords = async () => {
    try {
      const res = await api.get('/chords');
      setChords(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this chord?')) {
      try {
        await api.delete(`/chords/${id}`);
        setChords(chords.filter((c) => c.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredChords = chords.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.artist.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Your Song Vault</h1>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300/50" />
            <input
              type="text"
              placeholder="Search by title or artist..."
              className="glass-input w-full pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link to="/chords/create" className="glass-button flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card h-48 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : filteredChords.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredChords.map((chord) => (
              <motion.div
                key={chord.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
                className="glass-card group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold group-hover:text-indigo-300 transition-colors">
                        {chord.title}
                      </h2>
                      <div className="flex items-center text-sm text-indigo-200/70 mt-1">
                        <User className="w-3 h-3 mr-1" />
                        <span>{chord.artist}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/chords/edit/${chord.id}`}
                        className="p-2 hover:bg-white/10 rounded-lg text-indigo-300 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(chord.id)}
                        className="p-2 hover:bg-white/10 rounded-lg text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <pre className="text-xs text-indigo-100/60 font-mono bg-black/20 p-3 rounded-lg overflow-hidden line-clamp-4 leading-relaxed">
                    {chord.chords_lyrics}
                  </pre>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-wider text-white/30">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>Added {chord.created_at}</span>
                  </div>
                  <Link to={`/chords/edit/${chord.id}`} className="hover:text-white transition-colors">
                    View Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="glass-card text-center py-20 flex flex-col items-center">
          <div className="p-4 bg-white/5 rounded-full mb-4">
            <Music className="w-12 h-12 text-white/20" />
          </div>
          <p className="text-xl text-white/40 font-medium">No chords found</p>
          <Link to="/chords/create" className="text-indigo-400 hover:text-indigo-300 mt-2 transition-colors">
            Start by adding your first song chord!
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
