import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
    const [chords, setChords] = useState([]);
    const [loading, setLoading] = useState(true);

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
                setChords(chords.filter(c => c.id !== id));
            } catch (err) {
                alert('Failed to delete chord');
            }
        }
    };

    if (loading) return <div className="text-white text-center pt-32">Loading Vault...</div>;

    return (
        <div className="min-h-screen pt-32 px-6 pb-12 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold text-white drop-shadow-lg">My Saved Chords</h1>
                    <p className="text-white/60">{chords.length} items found</p>
                </div>

                {chords.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-sm">
                        <p className="text-white/40 text-lg mb-6">No chords saved yet. Start by adding your first masterpiece!</p>
                        <Link to="/chords/create" className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl transition">
                            Create First Chord
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {chords.map(chord => (
                            <div key={chord.id} className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-2">
                                <h3 className="text-xl font-bold text-white mb-1">{chord.title}</h3>
                                <p className="text-indigo-300 font-medium mb-4">{chord.artist}</p>
                                
                                <div className="bg-black/20 rounded-2xl p-4 mb-6 h-32 overflow-hidden relative">
                                    <pre className="text-white/70 text-xs font-mono whitespace-pre-wrap">
                                        {chord.chords_lyrics}
                                    </pre>
                                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                </div>

                                <div className="flex flex-wrap justify-between items-center gap-3">
                                    <Link to={`/chords/${chord.id}`} className="flex-1 text-center bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl transition">
                                        View
                                    </Link>
                                    <Link to={`/chords/edit/${chord.id}`} className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl border border-white/10 transition">
                                        Edit
                                    </Link>
                                    <button onClick={() => handleDelete(chord.id)} className="px-4 bg-red-500/20 hover:bg-red-500/40 text-red-300 py-2 rounded-xl border border-red-500/30 transition">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
